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

    // Demo credentials for testing (all become admin)
    const demoCredentials = {
      'admin@jagruk.edu': { password: 'admin123', role: 'admin', name: 'Admin User' },
      'staff@jagruk.edu': { password: 'staff123', role: 'admin', name: 'Staff Member (Admin)' },
      'student@jagruk.edu': { password: 'student123', role: 'admin', name: 'Demo Student (Admin)' }
    };

    logger.info('Checking demo credentials for email', { email, isDemo: !!demoCredentials[email] });

    // Check demo credentials first
    if (demoCredentials[email] && demoCredentials[email].password === password) {
      const user = demoCredentials[email];
      
      logger.info('Demo login successful', { email, role: user.role });
      
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

    // Check in students collection - but force admin role
    const studentQuery = await db.collection('students').where('email', '==', email).get();
    if (!studentQuery.empty) {
      const studentDoc = studentQuery.docs[0];
      userData = { id: studentDoc.id, ...studentDoc.data() };
      userRole = 'admin'; // Force admin role
      userRef = studentDoc.ref;
      logger.info('Found user in students collection - forcing admin role', { email, status: userData.status, isActive: userData.isActive });
    }

    // Check in staff collection if not found in students - but force admin role
    if (!userData) {
      const staffQuery = await db.collection('staff').where('email', '==', email).get();
      if (!staffQuery.empty) {
        const staffDoc = staffQuery.docs[0];
        userData = { id: staffDoc.id, ...staffDoc.data() };
        userRole = 'admin'; // Force admin role
        userRef = staffDoc.ref;
        logger.info('Found user in staff collection - forcing admin role', { email, status: userData.status, isActive: userData.isActive });
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
        logger.info('Found user in admins collection', { email, status: userData.status, isActive: userData.isActive });
      }
    }

    if (!userData) {
      logger.warn('User not found', { email });
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if user is active - handle both field names for compatibility
    const isUserActive = userData.status === 'active' || userData.isActive === true;
    
    if (!isUserActive) {
      logger.warn('User account inactive', { email, status: userData.status, isActive: userData.isActive });
      
      // Auto-activate user for development/demo purposes
      if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
        logger.info('Auto-activating user for development', { email });
        await userRef.update({
          status: 'active',
          isActive: true,
          updatedAt: new Date()
        });
        userData.status = 'active';
        userData.isActive = true;
      } else {
        return res.status(401).json({ message: 'Account is inactive. Please contact administrator.' });
      }
    }

    // Verify password - handle both field names
    const storedPassword = userData.hashedPassword || userData.password;
    if (!storedPassword) {
      logger.error('No password found for user', { email });
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, storedPassword);
    if (!isPasswordValid) {
      logger.warn('Invalid password', { email });
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
      process.env.JWT_SECRET || 'demo_secret',
      { expiresIn: '7d' }
    );

    // Update last login timestamp
    await userRef.update({
      lastLogin: new Date(),
      loginCount: (userData.loginCount || 0) + 1
    });

    // Remove sensitive data from response
    const { hashedPassword, password: pwd, ...userWithoutPassword } = userData;

    logger.info('Login successful', { email, role: userRole, userId: userData.id });

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        ...userWithoutPassword,
        role: userRole,
        permissions: permissions
      }
    });

  } catch (error) {
    logger.error('Login error', { error: error.message, email: req.body.email, stack: error.stack });
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

    // Check in students collection - force admin role
    const studentQuery = await db.collection('students').where('email', '==', email).get();
    if (!studentQuery.empty) {
      const studentDoc = studentQuery.docs[0];
      userData = { id: studentDoc.id, ...studentDoc.data() };
      userRole = 'admin'; // Force admin role
      userRef = studentDoc.ref;
    }

    // Check in staff collection if not found - force admin role
    if (!userData) {
      const staffQuery = await db.collection('staff').where('email', '==', email).get();
      if (!staffQuery.empty) {
        const staffDoc = staffQuery.docs[0];
        userData = { id: staffDoc.id, ...staffDoc.data() };
        userRole = 'admin'; // Force admin role
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

    // If user doesn't exist, create as admin (default for Google login)
    if (!userData) {
      const newAdminRef = await db.collection('admins').add({
        name,
        email,
        profilePicture: picture,
        googleId: uid,
        role: 'admin',
        status: 'active',
        createdAt: new Date(),
        lastLogin: new Date(),
        loginCount: 1,
        adminId: `GOOGLE_ADMIN_${Date.now()}`,
        permissions: ['all'],
        schoolId: 'default_school'
      });

      userData = {
        id: newAdminRef.id,
        name,
        email,
        profilePicture: picture,
        googleId: uid,
        role: 'admin',
        status: 'active'
      };
      userRole = 'admin';
      userRef = newAdminRef;
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
      hashedPassword,
      role,
      status: 'active',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
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
        isActive: true,
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
        isActive: true,
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
        isActive: true,
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

// Fix inactive accounts - activate all users for development
router.post('/fix-inactive-accounts', async (req, res) => {
  try {
    const collections = ['students', 'staff', 'admins'];
    let updatedCount = 0;

    for (const collectionName of collections) {
      const snapshot = await db.collection(collectionName).get();
      
      const batch = db.batch();
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        if (data.status !== 'active' || data.isActive !== true) {
          batch.update(doc.ref, {
            status: 'active',
            isActive: true,
            updatedAt: new Date()
          });
          updatedCount++;
        }
      });

      if (batch._ops && batch._ops.length > 0) {
        await batch.commit();
      }
    }

    logger.info(`Fixed ${updatedCount} inactive accounts`);
    
    res.json({ 
      message: `Successfully activated ${updatedCount} accounts`,
      updatedCount
    });

  } catch (error) {
    logger.error('Fix inactive accounts error', { error: error.message });
    res.status(500).json({ message: 'Failed to fix inactive accounts' });
  }
});

// Helper function to check profile completion
const checkProfileCompletion = (userData) => {
  const requiredFields = getRequiredFieldsByRole(userData.role);
  return requiredFields.every(field => {
    const value = userData[field];
    return value && value.toString().trim() !== '';
  });
};

// Helper function to get required fields by role
const getRequiredFieldsByRole = (role) => {
  const baseFields = ['name', 'phone', 'address'];
  
  switch (role) {
    case 'student':
      return [...baseFields, 'class', 'admissionNumber', 'parentContact', 'dateOfBirth'];
    case 'staff':
      return [...baseFields, 'employeeId', 'department', 'designation', 'emergencyContact'];
    case 'admin':
      return [...baseFields, 'adminId', 'schoolName', 'district', 'state'];
    default:
      return baseFields;
  }
};

// Helper function to calculate completion percentage
const calculateCompletionPercentage = (userData) => {
  const requiredFields = getRequiredFieldsByRole(userData.role);
  const completedFields = requiredFields.filter(field => {
    const value = userData[field];
    return value && value.toString().trim() !== '';
  });
  return Math.round((completedFields.length / requiredFields.length) * 100);
};

// Get user profile
router.get('/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Handle demo users - Return demo data for testing
    if (userId.startsWith('demo_')) {
      const role = userId.replace('demo_', '');
      const demoProfile = {
        id: userId,
        name: `Demo ${role.charAt(0).toUpperCase() + role.slice(1)}`,
        email: `${role}@jagruk.edu`,
        role: role,
        isDemo: true,
        status: 'active',
        phone: '',
        address: '',
        profilePhoto: '',
        notifications: {
          email: true,
          sms: true,
          push: true,
          emergencyAlerts: true,
          drillReminders: true,
          moduleUpdates: true
        },
        twoFactorEnabled: false,
        lastLogin: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        isProfileComplete: false,
        isGoogleUser: false
      };

      // Add role-specific demo data
      if (role === 'student') {
        Object.assign(demoProfile, {
          admissionNumber: '',
          class: '',
          rollNumber: '',
          parentContact: '',
          subjects: [],
          schoolId: 'DEMO_SCHOOL_001',
          dateOfBirth: ''
        });
      } else if (role === 'staff') {
        Object.assign(demoProfile, {
          employeeId: '',
          department: '',
          designation: '',
          qualification: '',
          experience: '',
          emergencyContact: '',
          schoolId: 'DEMO_SCHOOL_001'
        });
      } else if (role === 'admin') {
        Object.assign(demoProfile, {
          adminId: '',
          schoolName: '',
          district: '',
          state: '',
          schoolId: 'DEMO_SCHOOL_001'
        });
      }

      // Calculate completion
      demoProfile.isProfileComplete = checkProfileCompletion(demoProfile);
      demoProfile.completionPercentage = calculateCompletionPercentage(demoProfile);

      return res.json({
        success: true,
        data: demoProfile
      });
    }

    // Handle real users - Find user in appropriate collection
    let userData = null;
    let collectionName = '';

    // Try students first
    const studentDoc = await db.collection('students').doc(userId).get();
    if (studentDoc.exists) {
      userData = { id: studentDoc.id, ...studentDoc.data() };
      collectionName = 'students';
    } else {
      // Try staff
      const staffDoc = await db.collection('staff').doc(userId).get();
      if (staffDoc.exists) {
        userData = { id: staffDoc.id, ...staffDoc.data() };
        collectionName = 'staff';
      } else {
        // Try admins
        const adminDoc = await db.collection('admins').doc(userId).get();
        if (adminDoc.exists) {
          userData = { id: adminDoc.id, ...adminDoc.data() };
          collectionName = 'admins';
        } else {
          logger.warn('User not found in any collection', { userId });
          return res.status(404).json({ 
            success: false,
            message: 'User not found' 
          });
        }
      }
    }

    // Check if this is a Google user with incomplete profile
    const isGoogleUser = userData.provider === 'google' || userData.email?.includes('gmail') || userData.photoURL;
    const isProfileComplete = checkProfileCompletion(userData);

    // Add metadata
    userData.isGoogleUser = isGoogleUser;
    userData.isProfileComplete = isProfileComplete;
    userData.completionPercentage = calculateCompletionPercentage(userData);

    // Remove sensitive data
    const { hashedPassword, password, ...safeUserData } = userData;

    logger.info('Profile fetched successfully', { userId, collection: collectionName, isComplete: isProfileComplete });

    res.json({
      success: true,
      data: safeUserData
    });

  } catch (error) {
    logger.error('Get profile error', { error: error.message, userId: req.params.userId });
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
});

// Update user profile
router.put('/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const updateData = req.body;

    // Handle demo users (return success but don't actually update)
    if (userId.startsWith('demo_')) {
      logger.info('Demo profile update attempted', { userId });
      return res.json({
        success: true,
        message: 'Demo profile updated (simulated)',
        user: {
          id: userId,
          ...updateData,
          isDemo: true
        }
      });
    }

    // Remove sensitive fields that shouldn't be updated via this endpoint
    const { password, hashedPassword, email, role, createdAt, id, ...safeUpdateData } = updateData;

    // Add update timestamp
    safeUpdateData.updatedAt = new Date();

    // Find user in appropriate collection
    let userRef = null;
    let collectionName = '';
    let currentUserData = null;

    // Try students first
    const studentDoc = await db.collection('students').doc(userId).get();
    if (studentDoc.exists) {
      userRef = studentDoc.ref;
      collectionName = 'students';
      currentUserData = studentDoc.data();
    } else {
      // Try staff
      const staffDoc = await db.collection('staff').doc(userId).get();
      if (staffDoc.exists) {
        userRef = staffDoc.ref;
        collectionName = 'staff';
        currentUserData = staffDoc.data();
      } else {
        // Try admins
        const adminDoc = await db.collection('admins').doc(userId).get();
        if (adminDoc.exists) {
          userRef = adminDoc.ref;
          collectionName = 'admins';
          currentUserData = adminDoc.data();
        }
      }
    }

    if (!userRef) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Handle password change if provided
    if (updateData.newPassword && updateData.currentPassword) {
      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(updateData.currentPassword, currentUserData.hashedPassword);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }

      // Hash new password
      const saltRounds = 12;
      const hashedNewPassword = await bcrypt.hash(updateData.newPassword, saltRounds);
      safeUpdateData.hashedPassword = hashedNewPassword;
    }

    // Update user document
    await userRef.update(safeUpdateData);

    // Fetch updated user data
    const updatedDoc = await userRef.get();
    const updatedUserData = { id: updatedDoc.id, ...updatedDoc.data() };

    // Remove sensitive data from response
    const { hashedPassword: pwd, ...safeUserData } = updatedUserData;

    logger.info('Profile updated successfully', { userId, collection: collectionName, fields: Object.keys(safeUpdateData) });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: safeUserData
    });

  } catch (error) {
    logger.error('Update profile error', { error: error.message, userId: req.params.userId });
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

// Complete Google user profile (for first-time Google signin)
router.post('/complete-google-profile', async (req, res) => {
  try {
    const { userId, role, ...profileData } = req.body;

    if (!userId || !role) {
      return res.status(400).json({ message: 'User ID and role are required' });
    }

    // Determine collection based on role
    const collectionName = role === 'student' ? 'students' : role === 'staff' ? 'staff' : 'admins';

    // Get current user data
    const userDoc = await db.collection(collectionName).doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User not found' });
    }

    const currentData = userDoc.data();

    // Merge with new profile data
    const updateData = {
      ...profileData,
      profileCompleted: true,
      profileCompletedAt: new Date(),
      updatedAt: new Date()
    };

    // Update user document
    await userDoc.ref.update(updateData);

    // Fetch updated data
    const updatedDoc = await userDoc.ref.get();
    const updatedUserData = { id: updatedDoc.id, ...updatedDoc.data() };

    // Remove sensitive data
    const { hashedPassword, ...safeUserData } = updatedUserData;

    logger.info('Google profile completed', { userId, role });

    res.json({
      success: true,
      message: 'Profile completed successfully',
      user: safeUserData
    });

  } catch (error) {
    logger.error('Complete Google profile error', { error: error.message });
    res.status(500).json({ message: 'Failed to complete profile' });
  }
});

// Upload profile photo endpoint (placeholder - would integrate with Firebase Storage)
router.post('/upload-photo', async (req, res) => {
  try {
    // In a real implementation, this would:
    // 1. Upload file to Firebase Storage
    // 2. Get download URL
    // 3. Update user profile with new photo URL
    
    // For now, return a placeholder success response
    const photoURL = 'https://via.placeholder.com/150/4CAF50/FFFFFF?text=Photo';
    
    res.json({
      success: true,
      message: 'Photo uploaded successfully',
      photoURL: photoURL
    });

  } catch (error) {
    logger.error('Upload photo error', { error: error.message });
    res.status(500).json({ message: 'Failed to upload photo' });
  }
});

module.exports = router;
