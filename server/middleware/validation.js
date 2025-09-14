const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

const validateStudentRegistration = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2-100 characters'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('admissionNumber').trim().isLength({ min: 1, max: 50 }).withMessage('Admission number is required'),
  body('class').isInt({ min: 1, max: 12 }).withMessage('Class must be between 1-12'),
  body('age').isInt({ min: 5, max: 25 }).withMessage('Age must be between 5-25'),
  body('schoolId').trim().isLength({ min: 1 }).withMessage('School ID is required'),
  body('parentContact').trim().isLength({ min: 10, max: 15 }).withMessage('Parent contact must be valid'),
  handleValidationErrors
];

const validateStaffRegistration = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2-100 characters'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('employeeId').trim().isLength({ min: 1, max: 50 }).withMessage('Employee ID is required'),
  body('department').trim().isLength({ min: 1, max: 100 }).withMessage('Department is required'),
  body('schoolId').trim().isLength({ min: 1 }).withMessage('School ID is required'),
  body('role').isIn(['admin', 'staff']).withMessage('Role must be admin or staff'),
  handleValidationErrors
];

const validateLogin = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 1 }).withMessage('Password is required'),
  handleValidationErrors
];

const validateDrillSchedule = [
  body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Title is required'),
  body('description').trim().isLength({ min: 1, max: 1000 }).withMessage('Description is required'),
  body('type').isIn(['physical', 'virtual']).withMessage('Type must be physical or virtual'),
  body('scheduledDate').isISO8601().withMessage('Valid date is required'),
  body('classes').isArray({ min: 1 }).withMessage('At least one class must be selected'),
  handleValidationErrors
];

const validateAlert = [
  body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Title is required'),
  body('message').trim().isLength({ min: 1, max: 1000 }).withMessage('Message is required'),
  body('type').isIn(['emergency', 'drill', 'info', 'weather']).withMessage('Invalid alert type'),
  body('priority').isIn(['low', 'medium', 'high', 'critical']).withMessage('Invalid priority level'),
  handleValidationErrors
];

const validateModule = [
  body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Title is required'),
  body('description').trim().isLength({ min: 1, max: 1000 }).withMessage('Description is required'),
  body('category').isIn(['earthquake', 'flood', 'fire', 'cyclone', 'general']).withMessage('Invalid category'),
  body('difficulty').isIn(['beginner', 'intermediate', 'advanced']).withMessage('Invalid difficulty level'),
  body('estimatedDuration').isInt({ min: 1 }).withMessage('Estimated duration must be a positive number'),
  handleValidationErrors
];

module.exports = {
  validateStudentRegistration,
  validateStaffRegistration,
  validateLogin,
  validateDrillSchedule,
  validateAlert,
  validateModule,
  handleValidationErrors
};
