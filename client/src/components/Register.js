import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Tabs,
  Tab,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
  Grid,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  School,
  PersonAdd,
  Security,
  Warning,
  ArrowBack,
  ArrowForward,
  CheckCircle,
  Person,
  Email,
  Lock,
  Phone,
  Home,
  Class,
  Badge,
  DarkMode,
  LightMode
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Register = () => {
  const tabValue = 0; // Always admin role (first and only tab)
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [adminData, setAdminData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    adminId: '',
    schoolName: '',
    schoolId: '',
    district: '',
    state: '',
    phone: '',
    address: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const steps = ['Basic Info', 'Additional Details', 'Verification'];

  const getCurrentData = () => {
    // Since we only have admin role now, always return adminData
    return adminData;
  };

  const setCurrentData = (data) => {
    // Since we only have admin role now, always set adminData
    setAdminData(data);
  };

  const handleInputChange = (e) => {
    const currentData = getCurrentData();
    setCurrentData({
      ...currentData,
      [e.target.name]: e.target.value
    });
  };

  const handleNext = () => {
    const currentData = getCurrentData();
    
    // Validation for each step
    if (activeStep === 0) {
      if (!currentData.name || !currentData.email || !currentData.password || !currentData.confirmPassword) {
        setError('Please fill in all required fields');
        return;
      }
      if (currentData.password !== currentData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (currentData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
    }
    
    setError('');
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    setError('');
  };

  const handleSubmit = async () => {
    const currentData = getCurrentData();
    const role = 'admin';
    
    setLoading(true);
    setError('');

    const result = await register({
      ...currentData,
      role
    });

    if (result.success) {
      setSuccess('Registration successful! Redirecting to dashboard...');
      toast.success(`Welcome to JAGRUK, ${result.user.name}!`);
      setTimeout(() => navigate('/dashboard'), 2000);
    } else {
      setError(result.error);
      toast.error(result.error);
      setActiveStep(0); // Go back to first step on error
    }
    setLoading(false);
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 30 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3 }
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  };

  const getRoleColor = (role) => {
    // Since we only have admin role now, always return admin color
    return '#F44336'; // Admin - Red
  };

  const getTextFieldStyles = () => ({
    '& .MuiOutlinedInput-root': {
      backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)',
      '& fieldset': {
        borderColor: darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.23)',
      },
      '&:hover fieldset': {
        borderColor: darkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.87)',
      },
      '&.Mui-focused fieldset': {
        borderColor: getRoleColor(tabValue),
      },
    },
    '& .MuiInputLabel-root': {
      color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: getRoleColor(tabValue),
    },
  });

  const getRoleIcon = (role) => {
    // Since we only have admin role now, always return admin icon
    return <Security sx={{ color: getRoleColor() }} />;
  };

  const renderStepContent = () => {
    const currentData = getCurrentData();
    const role = 'admin';

    switch (activeStep) {
      case 0:
        return (
          <motion.div
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={currentData.name}
                  onChange={handleInputChange}
                  variant="outlined"
                  required
                  sx={getTextFieldStyles()}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="action" />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={currentData.email}
                  onChange={handleInputChange}
                  variant="outlined"
                  required
                  sx={getTextFieldStyles()}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="action" />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={currentData.password}
                  onChange={handleInputChange}
                  variant="outlined"
                  required
                  sx={getTextFieldStyles()}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Confirm Password"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={currentData.confirmPassword}
                  onChange={handleInputChange}
                  variant="outlined"
                  required
                  sx={getTextFieldStyles()}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
            </Grid>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Grid container spacing={2}>
              {role === 'student' && (
                <>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Admission Number"
                      name="admissionNumber"
                      value={currentData.admissionNumber}
                      onChange={handleInputChange}
                      variant="outlined"
                      sx={getTextFieldStyles()}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Badge color="action" />
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Class"
                      name="class"
                      value={currentData.class}
                      onChange={handleInputChange}
                      variant="outlined"
                      sx={getTextFieldStyles()}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Class color="action" />
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Age"
                      name="age"
                      type="number"
                      value={currentData.age}
                      onChange={handleInputChange}
                      variant="outlined"
                      sx={getTextFieldStyles()}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Parent Contact"
                      name="parentContact"
                      value={currentData.parentContact}
                      onChange={handleInputChange}
                      variant="outlined"
                      sx={getTextFieldStyles()}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Phone color="action" />
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                </>
              )}

              {role === 'staff' && (
                <>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Employee ID"
                      name="employeeId"
                      value={currentData.employeeId}
                      onChange={handleInputChange}
                      variant="outlined"
                      sx={getTextFieldStyles()}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Badge color="action" />
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Department"
                      name="department"
                      value={currentData.department}
                      onChange={handleInputChange}
                      variant="outlined"
                      sx={getTextFieldStyles()}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Designation"
                      name="designation"
                      value={currentData.designation}
                      onChange={handleInputChange}
                      variant="outlined"
                      sx={getTextFieldStyles()}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone"
                      name="phone"
                      value={currentData.phone}
                      onChange={handleInputChange}
                      variant="outlined"
                      sx={getTextFieldStyles()}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Phone color="action" />
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Emergency Contact"
                      name="emergencyContact"
                      value={currentData.emergencyContact}
                      onChange={handleInputChange}
                      variant="outlined"
                      sx={getTextFieldStyles()}
                    />
                  </Grid>
                </>
              )}

              {role === 'admin' && (
                <>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Admin ID"
                      name="adminId"
                      value={currentData.adminId}
                      onChange={handleInputChange}
                      variant="outlined"
                      sx={getTextFieldStyles()}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Badge color="action" />
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="School Name"
                      name="schoolName"
                      value={currentData.schoolName}
                      onChange={handleInputChange}
                      variant="outlined"
                      sx={getTextFieldStyles()}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <School color="action" />
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="District"
                      name="district"
                      value={currentData.district}
                      onChange={handleInputChange}
                      variant="outlined"
                      sx={getTextFieldStyles()}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="State"
                      name="state"
                      value={currentData.state}
                      onChange={handleInputChange}
                      variant="outlined"
                      sx={getTextFieldStyles()}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Phone"
                      name="phone"
                      value={currentData.phone}
                      onChange={handleInputChange}
                      variant="outlined"
                      sx={getTextFieldStyles()}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Phone color="action" />
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                </>
              )}

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="School ID"
                  name="schoolId"
                  value={currentData.schoolId}
                  onChange={handleInputChange}
                  variant="outlined"
                  sx={getTextFieldStyles()}
                  helperText="Unique identifier for your educational institution"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  value={currentData.address}
                  onChange={handleInputChange}
                  variant="outlined"
                  multiline
                  rows={3}
                  sx={getTextFieldStyles()}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Home color="action" />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
            </Grid>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ textAlign: 'center' }}
          >
            <Box sx={{ py: 4 }}>
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 360]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 2
                }}
              >
                <CheckCircle sx={{ fontSize: 80, color: getRoleColor(tabValue), mb: 2 }} />
              </motion.div>
              <Typography variant="h5" gutterBottom>
                Ready to Create Account
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Please review your information and click "Create Account" to complete registration.
              </Typography>
              
              <Paper sx={{ 
                p: 2, 
                textAlign: 'left', 
                backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'grey.50',
                color: darkMode ? 'white' : 'inherit',
                border: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'
              }}>
                <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                  Registration Summary:
                </Typography>
                <Typography variant="body2">Name: {currentData.name}</Typography>
                <Typography variant="body2">Email: {currentData.email}</Typography>
                <Typography variant="body2">Role: {role.charAt(0).toUpperCase() + role.slice(1)}</Typography>
                {role === 'student' && currentData.class && (
                  <Typography variant="body2">Class: {currentData.class}</Typography>
                )}
                {role === 'admin' && currentData.schoolName && (
                  <Typography variant="body2">School: {currentData.schoolName}</Typography>
                )}
              </Paper>
            </Box>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: darkMode 
          ? `linear-gradient(135deg, ${getRoleColor(tabValue)}40 0%, ${getRoleColor(tabValue)}20 100%)` 
          : `linear-gradient(135deg, ${getRoleColor(tabValue)}20 0%, ${getRoleColor(tabValue)}10 100%)`,
        position: 'relative',
        bgcolor: darkMode ? 'grey.900' : 'grey.50'
      }}
    >
      {/* Dark Mode Toggle */}
      <IconButton
        onClick={toggleTheme}
        sx={{
          position: 'absolute',
          top: 20,
          right: 20,
          zIndex: 1000,
          bgcolor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
          backdropFilter: 'blur(10px)',
          border: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
          '&:hover': {
            bgcolor: darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
            transform: 'scale(1.1)',
          },
          transition: 'all 0.3s ease',
        }}
      >
        {darkMode ? <LightMode /> : <DarkMode />}
      </IconButton>
      {/* Animated background elements */}
      <motion.div
        animate={{
          y: [-20, 20, -20],
          rotate: [0, 10, -10, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          position: 'absolute',
          top: '20%',
          left: '15%',
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: `${getRoleColor(tabValue)}20`,
          zIndex: -1
        }}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Paper
          elevation={24}
          sx={{
            width: { xs: '90vw', sm: 600, md: 700 },
            p: 4,
            borderRadius: 4,
            background: darkMode 
              ? 'rgba(18, 18, 18, 0.95)' 
              : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: darkMode 
              ? '1px solid rgba(255, 255, 255, 0.1)' 
              : '1px solid rgba(255, 255, 255, 0.2)',
            color: darkMode ? 'white' : 'inherit'
          }}
        >
          {/* Header */}
          <motion.div variants={itemVariants}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <motion.div
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity
                }}
              >
                <Warning sx={{ fontSize: 50, color: getRoleColor(tabValue), mb: 1 }} />
              </motion.div>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700,
                  color: getRoleColor(tabValue),
                  mb: 1
                }}
              >
                Join JAGRUK
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Create your account for disaster preparedness
              </Typography>
            </Box>
          </motion.div>

          {/* Role Selection Tabs */}
          <motion.div variants={itemVariants}>
            <Tabs
              value={tabValue}
              variant="fullWidth"
              sx={{
                mb: 3,
                '& .MuiTab-root': {
                  minHeight: 60,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)'
                  }
                }
              }}
            >
              <Tab icon={getRoleIcon(0)} label="Admin" iconPosition="start" />
            </Tabs>
          </motion.div>

          {/* Stepper */}
          <motion.div variants={itemVariants}>
            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel
                    sx={{
                      '& .MuiStepLabel-label': {
                        color: getRoleColor(tabValue)
                      }
                    }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </motion.div>

          {/* Error Alert */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                  {error}
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success Alert */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <Alert severity="success" sx={{ mb: 2 }}>
                  {success}
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Step Content */}
          <AnimatePresence mode="wait">
            {renderStepContent()}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <motion.div variants={itemVariants}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                onClick={activeStep === 0 ? () => navigate('/login') : handleBack}
                startIcon={<ArrowBack />}
                sx={{ color: getRoleColor(tabValue) }}
              >
                {activeStep === 0 ? 'Back to Login' : 'Back'}
              </Button>

              <Box>
                {activeStep < steps.length - 1 ? (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      endIcon={<ArrowForward />}
                      sx={{
                        backgroundColor: getRoleColor(tabValue),
                        '&:hover': {
                          backgroundColor: `${getRoleColor(tabValue)}CC`,
                          transform: 'translateY(-2px)',
                          boxShadow: `0 8px 25px ${getRoleColor(tabValue)}50`
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Next
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="contained"
                      onClick={handleSubmit}
                      disabled={loading}
                      endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <PersonAdd />}
                      sx={{
                        backgroundColor: getRoleColor(tabValue),
                        px: 4,
                        '&:hover': {
                          backgroundColor: `${getRoleColor(tabValue)}CC`,
                          transform: 'translateY(-2px)',
                          boxShadow: `0 8px 25px ${getRoleColor(tabValue)}50`
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {loading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                  </motion.div>
                )}
              </Box>
            </Box>
          </motion.div>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default Register;
