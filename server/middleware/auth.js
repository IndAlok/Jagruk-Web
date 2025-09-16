const jwt = require('jsonwebtoken');
const { auth } = require('../config/firebase');
const logger = require('../config/logger');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Handle demo users (userId starts with 'demo_')
    if (decoded.userId && decoded.userId.startsWith('demo_')) {
      logger.info('Demo user authentication', { userId: decoded.userId, role: decoded.role });
      
      req.user = {
        uid: decoded.userId, // Use demo userId as uid
        email: decoded.email,
        role: decoded.role,
        isDemo: true,
        schoolId: decoded.schoolId,
        admissionNumber: decoded.admissionNumber
      };
      
      return next();
    }

    // Handle Firebase users (verify with Firebase Auth)
    if (decoded.uid) {
      try {
        const userRecord = await auth.getUser(decoded.uid);
        
        req.user = {
          uid: userRecord.uid,
          email: userRecord.email,
          role: decoded.role,
          isDemo: false,
          schoolId: decoded.schoolId,
          admissionNumber: decoded.admissionNumber
        };
        
        return next();
      } catch (firebaseError) {
        logger.error('Firebase user verification failed:', firebaseError);
        return res.status(403).json({ message: 'Invalid Firebase user' });
      }
    }

    // Handle legacy users (userId field)
    if (decoded.userId) {
      logger.info('Legacy user authentication', { userId: decoded.userId, role: decoded.role });
      
      req.user = {
        uid: decoded.userId, // Use legacy userId as uid
        email: decoded.email,
        role: decoded.role,
        isDemo: false,
        schoolId: decoded.schoolId,
        admissionNumber: decoded.admissionNumber
      };
      
      return next();
    }

    // No valid user identifier found
    logger.error('No valid user identifier in token:', { decoded });
    return res.status(403).json({ message: 'Invalid token format' });
    
  } catch (error) {
    logger.error('Authentication error:', error);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    
    next();
  };
};

const authorizeAdmin = authorizeRole(['admin', 'staff']);
const authorizeStudent = authorizeRole(['student']);
const authorizeAll = authorizeRole(['admin', 'staff', 'student']);

module.exports = {
  authenticateToken,
  authorizeRole,
  authorizeAdmin,
  authorizeStudent,
  authorizeAll
};
