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
    
    // Verify Firebase user exists
    const userRecord = await auth.getUser(decoded.uid);
    
    req.user = {
      uid: userRecord.uid,
      email: userRecord.email,
      role: decoded.role,
      schoolId: decoded.schoolId,
      admissionNumber: decoded.admissionNumber
    };
    
    next();
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
