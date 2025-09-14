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

// Unified Login - Automatically determines user role and privileges
router.post('/login', authLimiter, validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;
    
    logger.info('Login attempt', { email });

    // Demo credentials for testing (check first)
    const demoCredentials = {
      'admin@jagruk.edu': { password: 'admin123', role: 'admin', name: 'Admin User' },
      'staff@jagruk.edu': { password: 'staff123', role: 'staff', name: 'Staff Member' },
      'student@jagruk.edu': { password: 'student123', role: 'student', name: 'Demo Student' }
    };

    // Check demo credentials first
    if (demoCredentials[email] && demoCredentials[email].password === password) {
      const user = demoCredentials[email];
      
      const token = jwt.sign(
        { 
          userId: `demo_${user.role}`, 
          email, 
          role: user.role 
        },
        process.env.JWT_SECRET || 'demo_secret',
        { expiresIn: '24h' }
      );

      return res.status(200).json({
        success: true,
        message: 'Demo login successful',
        token,
        user: {
          id: `demo_${user.role}`,
          email,
          name: user.name,
          role: user.role,
          isDemo: true
        }
      });
    }

    // Search for user across all collections
    let userData = null;
    let userRole = null;
    let userRef = null;

    // Check in students collection
    const studentQuery = await db.collection('students').where('email', '==', email).get();
    if (!studentQuery.empty) {
      const studentDoc = studentQuery.docs[0];
      userData = { id: studentDoc.id, ...studentDoc.data() };
      userRole = 'student';
      userRef = studentDoc.ref;
    }

    // Check in staff collection if not found in students
    if (!userData) {
      const staffQuery = await db.collection('staff').where('email', '==', email).get();
      if (!staffQuery.empty) {
        const staffDoc = staffQuery.docs[0];
        userData = { id: staffDoc.id, ...staffDoc.data() };
        userRole = 'staff';
        userRef = staffDoc.ref;
      }
    }

    // Check in admins collection if not found in staff
    if (!userData) {
      const adminQuery = await db.collection('admins').where('email', '==', email).get();
      if (!adminQuery.empty) {
        const adminDoc = adminQuery.docs[0];
        userData = { id: adminDoc.id, ...adminDoc.data() };
        userRole = 'admin';
        userRef = adminDoc.ref;
      }
    }

    if (!userData) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if user is active
    if (userData.status !== 'active') {
      return res.status(401).json({ message: 'Account is inactive. Please contact administrator.' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, userData.hashedPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token with role and permissions
    const permissions = getPermissionsByRole(userRole);
    const token = jwt.sign(
      { 
        userId: userData.id, 
        email: userData.email, 
        role: userRole,
        permissions: permissions
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Update last login timestamp
    await userRef.update({
      lastLogin: new Date(),
      loginCount: (userData.loginCount || 0) + 1
    });

    // Remove sensitive data from response
    const { hashedPassword, ...userWithoutPassword } = userData;

    logger.info('Login successful', { email, role: userRole, userId: userData.id });

    res.json({
      message: 'Login successful',
      token,
      user: {
        ...userWithoutPassword,
        role: userRole,
        permissions: permissions
      }
    });

  } catch (error) {
    logger.error('Login error', { error: error.message, email: req.body.email });
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Define permissions for each role
function getPermissionsByRole(role) {
  const permissions = {
    student: [
      'view_profile',
      'update_profile', 
      'participate_drills',
      'view_attendance',
      'view_notifications',
      'view_progress'
    ],
    staff: [
      'view_profile',
      'update_profile',
      'manage_students',
      'conduct_drills', 
      'view_student_attendance',
      'send_notifications',
      'view_reports',
      'assign_tasks',
      'view_staff_dashboard'
    ],
    admin: [
      'view_profile',
      'update_profile',
      'manage_students',
      'manage_staff',
      'conduct_drills',
      'view_all_attendance', 
      'send_notifications',
      'view_all_reports',
      'system_settings',
      'emergency_alerts',
      'manage_schools',
      'view_analytics',
      'backup_data',
      'view_admin_dashboard'
    ]
  };
  
  return permissions[role] || [];
}

// Google OAuth Login - Unified role determination
router.post('/google-login', authLimiter, async (req, res) => {
  try {
    const { idToken } = req.body;
    
    // Verify Google ID token
    const decodedToken = await auth.verifyIdToken(idToken);
    const { email, name, picture, uid } = decodedToken;
    
    logger.info('Google login attempt', { email });

    // Search for existing user across all collections
    let userData = null;
    let userRole = null;
    let userRef = null;

    // Check in students collection
    const studentQuery = await db.collection('students').where('email', '==', email).get();
    if (!studentQuery.empty) {
      const studentDoc = studentQuery.docs[0];
      userData = { id: studentDoc.id, ...studentDoc.data() };
      userRole = 'student';
      userRef = studentDoc.ref;
    }

    // Check in staff collection if not found
    if (!userData) {
      const staffQuery = await db.collection('staff').where('email', '==', email).get();
      if (!staffQuery.empty) {
        const staffDoc = staffQuery.docs[0];
        userData = { id: staffDoc.id, ...staffDoc.data() };
        userRole = 'staff';
        userRef = staffDoc.ref;
      }
    }

    // Check in admins collection if not found
    if (!userData) {
      const adminQuery = await db.collection('admins').where('email', '==', email).get();
      if (!adminQuery.empty) {
        const adminDoc = adminQuery.docs[0];
        userData = { id: adminDoc.id, ...adminDoc.data() };
        userRole = 'admin';
        userRef = adminDoc.ref;
      }
    }

    // If user doesn't exist, create as student (default for Google login)
    if (!userData) {
      const newStudentRef = await db.collection('students').add({
        name,
        email,
        profilePicture: picture,
        googleId: uid,
        role: 'student',
        status: 'active',
        createdAt: new Date(),
        lastLogin: new Date(),
        loginCount: 1,
        admissionNumber: `GOOGLE_${Date.now()}`,
        class: 'Unassigned',
        schoolId: 'default_school'
      });

      userData = {
        id: newStudentRef.id,
        name,
        email,
        profilePicture: picture,
        googleId: uid,
        role: 'student',
        status: 'active'
      };
      userRole = 'student';
      userRef = newStudentRef;
    } else {
      // Update Google info for existing user
      await userRef.update({
        googleId: uid,
        profilePicture: picture,
        lastLogin: new Date(),
        loginCount: (userData.loginCount || 0) + 1
      });
    }

    // Check if user is active
    if (userData.status !== 'active') {
      return res.status(401).json({ message: 'Account is inactive. Please contact administrator.' });
    }

    // Generate JWT token
    const permissions = getPermissionsByRole(userRole);
    const token = jwt.sign(
      { 
        userId: userData.id, 
        email: userData.email, 
        role: userRole,
        permissions: permissions
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    logger.info('Google login successful', { email, role: userRole, userId: userData.id });

    res.json({
      message: 'Google login successful',
      token,
      user: {
        ...userData,
        role: userRole,
        permissions: permissions
      }
    });

  } catch (error) {
    logger.error('Google login error', { error: error.message });
    res.status(500).json({ message: 'Google login failed' });
  }
});

// Unified Registration - Automatically handles all user types
router.post('/register', authLimiter, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, password, and role are required'
      });
    }

    if (!['student', 'staff', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be student, staff, or admin'
      });
    }

    logger.info('Registration attempt', { email, role });

    // Check if user already exists in any collection
    const collections = ['students', 'staff', 'admins'];
    for (const collection of collections) {
      const existingUserQuery = await db.collection(collection).where('email', '==', email).get();
      if (!existingUserQuery.empty) {
        return res.status(400).json({
          success: false,
          message: 'User with this email already exists'
        });
      }
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user object
    const userData = {
      name,
      email,
      password: hashedPassword,
      role,
      createdAt: new Date().toISOString(),
      isActive: true,
      profile: {
        avatar: null,
        phone: '',
        address: '',
        emergencyContact: {
          name: '',
          phone: '',
          relationship: ''
        }
      }
    };

    // Add role-specific fields
    if (role === 'student') {
      userData.studentId = `STU-${Date.now()}`;
      userData.classInfo = {
        grade: '',
        section: '',
        rollNumber: ''
      };
      userData.drillParticipation = {
        totalDrills: 0,
        completedDrills: 0,
        averageResponseTime: 0
      };
    } else if (role === 'staff') {
      userData.staffId = `STF-${Date.now()}`;
      userData.department = '';
      userData.designation = '';
      userData.permissions = [
        'manage_students',
        'conduct_drills',
        'view_reports'
      ];
    } else if (role === 'admin') {
      userData.adminId = `ADM-${Date.now()}`;
      userData.permissions = [
        'manage_users',
        'manage_drills',
        'view_reports',
        'system_config',
        'emergency_alerts'
      ];
    }

    // Store in appropriate collection
    const collection = role === 'student' ? 'students' : role === 'staff' ? 'staff' : 'admins';
    const userRef = await db.collection(collection).add(userData);

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: userRef.id, 
        email, 
        role,
        permissions: userData.permissions || []
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return success response
    const userResponse = {
      id: userRef.id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      permissions: userData.permissions || []
    };

    logger.info(`User registered successfully: ${email} as ${role}`);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: userResponse
    });

  } catch (error) {
    logger.error('Registration error', { error: error.message, stack: error.stack });
    res.status(500).json({
      success: false,
      message: 'Registration failed. Please try again.'
    });
  }
});

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

// Demo login for testing - add this before other routes
router.post('/login', authLimiter, validateLogin, async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Demo credentials for testing
    const demoCredentials = {
      'admin@jagruk.edu': { password: 'admin123', role: 'admin', name: 'Admin User' },
      'staff@jagruk.edu': { password: 'staff123', role: 'staff', name: 'Staff Member' },
      'student@jagruk.edu': { password: 'student123', role: 'student', name: 'Demo Student' }
    };

    // Check demo credentials first
    if (demoCredentials[email] && demoCredentials[email].password === password) {
      const user = demoCredentials[email];
      
      const token = jwt.sign(
        { 
          uid: `demo_${user.role}`, 
          email, 
          role: user.role 
        },
        process.env.JWT_SECRET || 'demo_secret',
        { expiresIn: '24h' }
      );

      return res.status(200).json({
        success: true,
        message: 'Demo login successful',
        token,
        user: {
          uid: `demo_${user.role}`,
          email,
          name: user.name,
          role: user.role,
          isDemo: true
        }
      });
    }

    // For production, implement actual authentication here
    // This is a placeholder for actual Firebase authentication
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid credentials. Use demo credentials: admin@jagruk.edu / admin123' 
    });

  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Login failed. Please try again.' 
    });
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
    // Get token from Authorization header or request body
    let token = req.headers.authorization?.replace('Bearer ', '') || req.body.token;
    
    if (!token) {
      return res.status(401).json({ valid: false, message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'demo_secret');
    
    // Handle demo users
    if (decoded.userId && decoded.userId.startsWith('demo_')) {
      return res.json({ 
        valid: true, 
        user: {
          id: decoded.userId,
          email: decoded.email,
          role: decoded.role,
          name: decoded.userId === 'demo_admin' ? 'Admin User' : 
                decoded.userId === 'demo_staff' ? 'Staff Member' : 'Demo Student',
          isDemo: true
        }
      });
    }

    // For regular Firebase users
    try {
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
    } catch (firebaseError) {
      // If Firebase user doesn't exist but token is valid, handle gracefully
      res.json({ 
        valid: true, 
        user: {
          id: decoded.userId || decoded.uid,
          email: decoded.email,
          role: decoded.role,
          schoolId: decoded.schoolId
        }
      });
    }
    
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ valid: false, message: 'Invalid token' });
  }
});

// Initialize Demo Users for Testing
router.post('/init-demo-users', async (req, res) => {
  try {
    // Create demo admin
    const adminExists = await db.collection('admins').where('email', '==', 'admin@test.com').get();
    if (adminExists.empty) {
      const hashedPassword = await bcrypt.hash('admin123', 12);
      await db.collection('admins').add({
        name: 'Admin User',
        email: 'admin@test.com',
        hashedPassword,
        employeeId: 'ADM001',
        department: 'Administration',
        schoolId: 'demo_school',
        role: 'admin',
        status: 'active',
        createdAt: new Date(),
        permissions: ['manage_all']
      });
    }

    // Create demo staff
    const staffExists = await db.collection('staff').where('email', '==', 'staff@test.com').get();
    if (staffExists.empty) {
      const hashedPassword = await bcrypt.hash('staff123', 12);
      await db.collection('staff').add({
        name: 'Staff User',
        email: 'staff@test.com',
        hashedPassword,
        employeeId: 'STF001',
        department: 'Safety',
        schoolId: 'demo_school',
        role: 'staff',
        status: 'active',
        createdAt: new Date(),
        permissions: ['manage_students', 'conduct_drills']
      });
    }

    // Create demo student
    const studentExists = await db.collection('students').where('email', '==', 'student@test.com').get();
    if (studentExists.empty) {
      const hashedPassword = await bcrypt.hash('student123', 12);
      await db.collection('students').add({
        name: 'Student User',
        email: 'student@test.com',
        hashedPassword,
        admissionNumber: 'STU001',
        class: '10',
        age: 16,
        schoolId: 'demo_school',
        role: 'student',
        status: 'active',
        createdAt: new Date(),
        parentContact: '9876543210',
        address: 'Demo Address'
      });
    }

    res.json({ 
      message: 'Demo users initialized successfully',
      accounts: [
        { email: 'admin@test.com', password: 'admin123', role: 'admin' },
        { email: 'staff@test.com', password: 'staff123', role: 'staff' },
        { email: 'student@test.com', password: 'student123', role: 'student' }
      ]
    });

  } catch (error) {
    logger.error('Demo users initialization error', { error: error.message });
    res.status(500).json({ message: 'Failed to initialize demo users' });
  }
});

module.exports = router;
