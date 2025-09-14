const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { auth, db } = require('../config/firebase');
const logger = require('../config/logger');
const { authLimiter, passwordResetLimiter } = require('../middleware/rateLimiter');
const { 
  validateStudentRegistration, 
  validateStaffRegistration, 
  validateLogin 
} = require('../middleware/validation');

const router = express.Router();

// Student Registration
router.post('/register/student', authLimiter, validateStudentRegistration, async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      admissionNumber,
      class: studentClass,
      age,
      schoolId,
      parentContact,
      address
    } = req.body;

    // Check if student already exists
    const existingStudent = await db.collection('students')
      .where('email', '==', email)
      .get();
    
    if (!existingStudent.empty) {
      return res.status(400).json({ message: 'Student with this email already exists' });
    }

    // Check admission number uniqueness within school
    const existingAdmission = await db.collection('students')
      .where('admissionNumber', '==', admissionNumber)
      .where('schoolId', '==', schoolId)
      .get();
    
    if (!existingAdmission.empty) {
      return res.status(400).json({ message: 'Admission number already exists in this school' });
    }

    // Create Firebase user
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name,
      emailVerified: false
    });

    // Hash password for backup storage
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create student document
    const studentData = {
      uid: userRecord.uid,
      name,
      email,
      admissionNumber,
      class: studentClass,
      age,
      schoolId,
      parentContact,
      address,
      role: 'student',
      hashedPassword,
      isActive: true,
      moduleProgress: {},
      drillsAttended: 0,
      totalDrills: 0,
      lastLogin: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await db.collection('students').doc(userRecord.uid).set(studentData);

    // Update school statistics
    const schoolRef = db.collection('schools').doc(schoolId);
    const schoolDoc = await schoolRef.get();
    
    if (schoolDoc.exists) {
      await schoolRef.update({
        totalStudents: (schoolDoc.data().totalStudents || 0) + 1,
        updatedAt: new Date().toISOString()
      });
    }

    logger.info(`Student registered: ${email}`);
    res.status(201).json({ 
      message: 'Student registered successfully',
      uid: userRecord.uid 
    });

  } catch (error) {
    logger.error('Student registration error:', error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

// Staff Registration
router.post('/register/staff', authLimiter, validateStaffRegistration, async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      employeeId,
      department,
      schoolId,
      role,
      phoneNumber
    } = req.body;

    // Check if staff already exists
    const existingStaff = await db.collection('staff')
      .where('email', '==', email)
      .get();
    
    if (!existingStaff.empty) {
      return res.status(400).json({ message: 'Staff with this email already exists' });
    }

    // Check employee ID uniqueness within school
    const existingEmployee = await db.collection('staff')
      .where('employeeId', '==', employeeId)
      .where('schoolId', '==', schoolId)
      .get();
    
    if (!existingEmployee.empty) {
      return res.status(400).json({ message: 'Employee ID already exists in this school' });
    }

    // Create Firebase user
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name,
      emailVerified: false
    });

    // Hash password for backup storage
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create staff document
    const staffData = {
      uid: userRecord.uid,
      name,
      email,
      employeeId,
      department,
      schoolId,
      role,
      phoneNumber,
      hashedPassword,
      isActive: true,
      permissions: role === 'admin' ? 
        ['create_drills', 'manage_students', 'view_analytics', 'send_alerts', 'manage_staff'] :
        ['create_drills', 'view_students', 'send_alerts'],
      lastLogin: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await db.collection('staff').doc(userRecord.uid).set(staffData);

    // Update school statistics
    const schoolRef = db.collection('schools').doc(schoolId);
    const schoolDoc = await schoolRef.get();
    
    if (schoolDoc.exists) {
      await schoolRef.update({
        totalStaff: (schoolDoc.data().totalStaff || 0) + 1,
        updatedAt: new Date().toISOString()
      });
    }

    logger.info(`Staff registered: ${email} as ${role}`);
    res.status(201).json({ 
      message: 'Staff registered successfully',
      uid: userRecord.uid 
    });

  } catch (error) {
    logger.error('Staff registration error:', error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

// Login
router.post('/login', authLimiter, validateLogin, async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Verify Firebase user
    const userRecord = await auth.getUserByEmail(email);
    
    // Get user data based on role
    const collection = role === 'student' ? 'students' : 'staff';
    const userDoc = await db.collection(collection).doc(userRecord.uid).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userData = userDoc.data();
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, userData.hashedPassword);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if user is active
    if (!userData.isActive) {
      return res.status(403).json({ message: 'Account is deactivated' });
    }

    // Update last login
    await db.collection(collection).doc(userRecord.uid).update({
      lastLogin: new Date().toISOString()
    });

    // Generate JWT token
    const token = jwt.sign({
      uid: userRecord.uid,
      email: userRecord.email,
      role: userData.role,
      schoolId: userData.schoolId,
      ...(role === 'student' && { admissionNumber: userData.admissionNumber }),
      ...(role !== 'student' && { employeeId: userData.employeeId })
    }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '30d' });

    // Prepare user data for response (remove sensitive info)
    const responseUser = {
      uid: userRecord.uid,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      schoolId: userData.schoolId,
      ...(role === 'student' && {
        admissionNumber: userData.admissionNumber,
        class: userData.class,
        age: userData.age,
        moduleProgress: userData.moduleProgress,
        drillsAttended: userData.drillsAttended
      }),
      ...(role !== 'student' && {
        employeeId: userData.employeeId,
        department: userData.department,
        permissions: userData.permissions
      })
    };

    logger.info(`User logged in: ${email} as ${role}`);
    res.json({ token, user: responseUser });

  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

// Google Login
router.post('/google-login', authLimiter, async (req, res) => {
  try {
    const { idToken, role } = req.body;

    // Verify Google ID token
    const decodedToken = await auth.verifyIdToken(idToken);
    const { uid, email, name } = decodedToken;

    // Check if user exists
    const collection = role === 'student' ? 'students' : 'staff';
    const userDoc = await db.collection(collection).doc(uid).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ 
        message: 'User not found. Please register first or contact your administrator.' 
      });
    }

    const userData = userDoc.data();
    
    // Check if user is active
    if (!userData.isActive) {
      return res.status(403).json({ message: 'Account is deactivated' });
    }

    // Update last login
    await db.collection(collection).doc(uid).update({
      lastLogin: new Date().toISOString()
    });

    // Generate JWT token
    const token = jwt.sign({
      uid,
      email,
      role: userData.role,
      schoolId: userData.schoolId,
      ...(role === 'student' && { admissionNumber: userData.admissionNumber }),
      ...(role !== 'student' && { employeeId: userData.employeeId })
    }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '30d' });

    // Prepare user data for response
    const responseUser = {
      uid,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      schoolId: userData.schoolId,
      ...(role === 'student' && {
        admissionNumber: userData.admissionNumber,
        class: userData.class,
        age: userData.age,
        moduleProgress: userData.moduleProgress,
        drillsAttended: userData.drillsAttended
      }),
      ...(role !== 'student' && {
        employeeId: userData.employeeId,
        department: userData.department,
        permissions: userData.permissions
      })
    };

    logger.info(`Google login: ${email} as ${role}`);
    res.json({ token, user: responseUser });

  } catch (error) {
    logger.error('Google login error:', error);
    res.status(500).json({ message: 'Google login failed', error: error.message });
  }
});

// Forgot Password
router.post('/forgot-password', passwordResetLimiter, async (req, res) => {
  try {
    const { email } = req.body;

    // Generate password reset link
    const link = await auth.generatePasswordResetLink(email);
    
    // Here you would typically send an email
    // For now, we'll just log it and return success
    logger.info(`Password reset requested for: ${email}`);
    logger.info(`Reset link: ${link}`);
    
    res.json({ 
      message: 'Password reset link sent to your email',
      // In development, return the link
      ...(process.env.NODE_ENV === 'development' && { resetLink: link })
    });

  } catch (error) {
    logger.error('Password reset error:', error);
    res.status(500).json({ message: 'Password reset failed' });
  }
});

// Verify Token
router.post('/verify-token', async (req, res) => {
  try {
    const { token } = req.body;
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userRecord = await auth.getUser(decoded.uid);
    
    res.json({ 
      valid: true, 
      user: {
        uid: decoded.uid,
        email: userRecord.email,
        role: decoded.role,
        schoolId: decoded.schoolId
      }
    });
    
  } catch (error) {
    res.status(401).json({ valid: false, message: 'Invalid token' });
  }
});

module.exports = router;
