const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { auth, db } = require('../config/firebase');
const logger = require('../config/logger');
const { authLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

function generateToken(user) {
  return jwt.sign(
    { 
      userId: user.id, 
      email: user.email, 
      role: user.role,
      name: user.name
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );
}

router.post('/register', authLimiter, async (req, res) => {
  try {
    const { name, email, password, role = 'student', phone, address } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name, email, and password are required' 
      });
    }

    if (!['student', 'staff', 'admin'].includes(role)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid role' 
      });
    }

    let firebaseUser;
    try {
      firebaseUser = await auth.createUser({
        email,
        password,
        displayName: name,
        emailVerified: false
      });
    } catch (firebaseError) {
      if (firebaseError.code === 'auth/email-already-exists') {
        return res.status(400).json({ 
          success: false, 
          message: 'Email already registered' 
        });
      }
      throw firebaseError;
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    
    const userData = {
      uid: firebaseUser.uid,
      name,
      email,
      phone: phone || '',
      address: address || '',
      role,
      status: 'active',
      hashedPassword,
      profilePhoto: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLogin: null
    };

    if (role === 'student') {
      userData.class = '';
      userData.section = '';
      userData.rollNumber = '';
      userData.admissionNumber = `STU-${Date.now()}`;
      userData.parentContact = '';
      userData.moduleProgress = {};
      userData.drillsAttended = 0;
      userData.totalPoints = 0;
    } else if (role === 'staff') {
      userData.staffId = `STF-${Date.now()}`;
      userData.department = '';
      userData.designation = '';
      userData.assignedClasses = [];
    } else if (role === 'admin') {
      userData.adminId = `ADM-${Date.now()}`;
    }

    const collection = role === 'student' ? 'students' : role === 'staff' ? 'staff' : 'admins';
    await db.collection(collection).doc(firebaseUser.uid).set(userData);

    const token = generateToken({ id: firebaseUser.uid, email, role, name });

    logger.info(`User registered: ${email} as ${role}`);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        id: firebaseUser.uid,
        name,
        email,
        role,
        status: 'active'
      }
    });

  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Registration failed' 
    });
  }
});

router.post('/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password are required' 
      });
    }

    let userData = null;
    let userRole = null;
    let userRef = null;
    let userId = null;

    const collections = ['admins', 'staff', 'students'];
    
    for (const collection of collections) {
      const query = await db.collection(collection).where('email', '==', email).get();
      if (!query.empty) {
        const doc = query.docs[0];
        userData = doc.data();
        userId = doc.id;
        userRole = userData.role;
        userRef = doc.ref;
        break;
      }
    }

    if (!userData) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    if (userData.status !== 'active') {
      return res.status(401).json({ 
        success: false, 
        message: 'Account is inactive. Contact administrator.' 
      });
    }

    const isPasswordValid = await bcrypt.compare(password, userData.hashedPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    await userRef.update({
      lastLogin: new Date().toISOString()
    });

    const token = generateToken({ 
      id: userId, 
      email: userData.email, 
      role: userRole, 
      name: userData.name 
    });

    const { hashedPassword: _, ...userWithoutPassword } = userData;

    logger.info(`Login successful: ${email}`);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: userId,
        ...userWithoutPassword
      }
    });

  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Login failed' 
    });
  }
});

router.post('/google-login', authLimiter, async (req, res) => {
  try {
    const { idToken, role = 'student' } = req.body;

    const decodedToken = await auth.verifyIdToken(idToken);
    const { uid, email, name, picture } = decodedToken;

    let userData = null;
    let existingRole = null;
    let userRef = null;

    const collections = ['admins', 'staff', 'students'];
    for (const collection of collections) {
      const doc = await db.collection(collection).doc(uid).get();
      if (doc.exists) {
        userData = doc.data();
        existingRole = userData.role;
        userRef = doc.ref;
        break;
      }
    }

    if (!userData) {
      const newUserData = {
        uid,
        name: name || email.split('@')[0],
        email,
        phone: '',
        address: '',
        role,
        status: 'active',
        profilePhoto: picture || null,
        provider: 'google',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };

      if (role === 'student') {
        newUserData.class = '';
        newUserData.section = '';
        newUserData.rollNumber = '';
        newUserData.admissionNumber = `STU-${Date.now()}`;
        newUserData.parentContact = '';
        newUserData.moduleProgress = {};
        newUserData.drillsAttended = 0;
        newUserData.totalPoints = 0;
      } else if (role === 'staff') {
        newUserData.staffId = `STF-${Date.now()}`;
        newUserData.department = '';
        newUserData.designation = '';
        newUserData.assignedClasses = [];
      } else if (role === 'admin') {
        newUserData.adminId = `ADM-${Date.now()}`;
      }

      const collection = role === 'student' ? 'students' : role === 'staff' ? 'staff' : 'admins';
      await db.collection(collection).doc(uid).set(newUserData);

      userData = newUserData;
      existingRole = role;
    } else {
      await userRef.update({
        lastLogin: new Date().toISOString(),
        profilePhoto: picture || userData.profilePhoto
      });
    }

    const token = generateToken({ 
      id: uid, 
      email: userData.email, 
      role: existingRole, 
      name: userData.name 
    });

    logger.info(`Google login: ${email}`);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: uid,
        ...userData,
        role: existingRole
      }
    });

  } catch (error) {
    logger.error('Google login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Google login failed' 
    });
  }
});

router.post('/verify-token', async (req, res) => {
  try {
    let token = req.headers.authorization?.replace('Bearer ', '') || req.body.token;
    
    if (!token) {
      return res.status(401).json({ valid: false, message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    let userData = null;
    const collections = ['admins', 'staff', 'students'];
    
    for (const collection of collections) {
      const doc = await db.collection(collection).doc(decoded.userId).get();
      if (doc.exists) {
        userData = { id: doc.id, ...doc.data() };
        break;
      }
    }

    if (!userData) {
      return res.status(401).json({ valid: false, message: 'User not found' });
    }

    const { hashedPassword: _, ...userWithoutPassword } = userData;

    res.json({ 
      valid: true, 
      user: userWithoutPassword 
    });

  } catch (error) {
    logger.error('Token verification error:', error);
    res.status(401).json({ valid: false, message: 'Invalid token' });
  }
});

router.get('/profile/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    let userData = null;
    const collections = ['admins', 'staff', 'students'];
    
    for (const collection of collections) {
      const doc = await db.collection(collection).doc(id).get();
      if (doc.exists) {
        userData = { id: doc.id, ...doc.data() };
        break;
      }
    }

    if (!userData) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    const { hashedPassword: _, ...userWithoutPassword } = userData;

    res.json({
      success: true,
      user: userWithoutPassword
    });

  } catch (error) {
    logger.error('Get profile error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get profile' 
    });
  }
});

router.put('/profile/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    delete updates.hashedPassword;
    delete updates.password;
    delete updates.uid;
    delete updates.email;
    
    updates.updatedAt = new Date().toISOString();

    let userRef = null;
    let collection = null;
    const collections = ['admins', 'staff', 'students'];
    
    for (const coll of collections) {
      const doc = await db.collection(coll).doc(id).get();
      if (doc.exists) {
        userRef = doc.ref;
        collection = coll;
        break;
      }
    }

    if (!userRef) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    await userRef.update(updates);

    const updatedDoc = await userRef.get();
    const userData = { id: updatedDoc.id, ...updatedDoc.data() };
    const { hashedPassword: _, ...userWithoutPassword } = userData;

    res.json({
      success: true,
      message: 'Profile updated',
      user: userWithoutPassword
    });

  } catch (error) {
    logger.error('Update profile error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update profile' 
    });
  }
});

router.post('/forgot-password', authLimiter, async (req, res) => {
  try {
    const { email } = req.body;

    const link = await auth.generatePasswordResetLink(email);
    
    logger.info(`Password reset requested for: ${email}`);
    
    res.json({ 
      success: true,
      message: 'Password reset link generated',
      ...(process.env.NODE_ENV === 'development' && { resetLink: link })
    });

  } catch (error) {
    logger.error('Password reset error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Password reset failed' 
    });
  }
});

module.exports = router;
