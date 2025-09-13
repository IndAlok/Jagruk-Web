const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db, auth } = require('../config/firebase');
const router = express.Router();

// Register Student
router.post('/register/student', async (req, res) => {
  try {
    const { 
      admissionNumber, 
      name, 
      email, 
      password, 
      class: studentClass, 
      age, 
      schoolId,
      parentContact 
    } = req.body;

    // Check if student already exists
    const existingStudent = await db.collection('students')
      .where('admissionNumber', '==', admissionNumber)
      .where('schoolId', '==', schoolId)
      .get();

    if (!existingStudent.empty) {
      return res.status(400).json({ message: 'Student already exists' });
    }

    // Create Firebase Auth user
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name
    });

    // Hash password for database
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create student document
    const studentData = {
      uid: userRecord.uid,
      admissionNumber,
      name,
      email,
      password: hashedPassword,
      class: parseInt(studentClass),
      age: parseInt(age),
      schoolId,
      parentContact,
      role: 'student',
      modulesCompleted: [],
      drillsAttended: [],
      createdAt: new Date(),
      isActive: true
    };

    await db.collection('students').doc(userRecord.uid).set(studentData);

    res.status(201).json({ 
      message: 'Student registered successfully',
      uid: userRecord.uid
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

// Register Staff
router.post('/register/staff', async (req, res) => {
  try {
    const { 
      name, 
      email, 
      password, 
      employeeId, 
      designation,
      schoolId,
      contact 
    } = req.body;

    // Check if staff already exists
    const existingStaff = await db.collection('staff')
      .where('employeeId', '==', employeeId)
      .where('schoolId', '==', schoolId)
      .get();

    if (!existingStaff.empty) {
      return res.status(400).json({ message: 'Staff already exists' });
    }

    // Create Firebase Auth user
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name
    });

    // Hash password for database
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create staff document
    const staffData = {
      uid: userRecord.uid,
      employeeId,
      name,
      email,
      password: hashedPassword,
      designation,
      schoolId,
      contact,
      role: 'staff',
      permissions: ['view_students', 'schedule_drills', 'view_reports'],
      createdAt: new Date(),
      isActive: true
    };

    await db.collection('staff').doc(userRecord.uid).set(staffData);

    res.status(201).json({ 
      message: 'Staff registered successfully',
      uid: userRecord.uid
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    
    let userData = null;
    let collection = role === 'student' ? 'students' : 'staff';
    
    // Get user from Firestore
    const userQuery = await db.collection(collection).where('email', '==', email).get();
    
    if (userQuery.empty) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    userData = userQuery.docs[0].data();
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, userData.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { uid: userData.uid, role: userData.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      token,
      user: {
        uid: userData.uid,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        schoolId: userData.schoolId
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

// Google Login
router.post('/google-login', async (req, res) => {
  try {
    const { idToken, role } = req.body;
    
    // Verify the ID token
    const decodedToken = await auth.verifyIdToken(idToken);
    const { uid, email, name } = decodedToken;
    
    let collection = role === 'student' ? 'students' : 'staff';
    
    // Check if user exists in our database
    const userDoc = await db.collection(collection).doc(uid).get();
    
    if (!userDoc.exists) {
      return res.status(400).json({ 
        message: 'User not found. Please complete registration first.' 
      });
    }
    
    const userData = userDoc.data();
    
    // Generate JWT token
    const token = jwt.sign(
      { uid: userData.uid, role: userData.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      token,
      user: {
        uid: userData.uid,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        schoolId: userData.schoolId
      }
    });
    
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({ message: 'Google login failed', error: error.message });
  }
});

module.exports = router;