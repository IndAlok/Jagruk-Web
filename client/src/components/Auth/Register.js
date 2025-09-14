import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Divider,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
  Link,
  Grid
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  School,
  PersonAdd,
  Google,
  Security,
  Emergency,
  ArrowBack
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

const Register = () => {
  const [tabValue, setTabValue] = useState(0);
  const [studentData, setStudentData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    admissionNumber: '',
    class: '',
    age: '',
    schoolId: '',
    parentContact: '',
    address: ''
  });

  const [staffData, setStaffData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    employeeId: '',
    department: '',
    schoolId: '',
    role: 'staff',
    phoneNumber: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setError('');
    setSuccess('');
  };

  const handleStudentChange = (e) => {
    setStudentData({
      ...studentData,
      [e.target.name]: e.target.value
    });
  };

  const handleStaffChange = (e) => {
    setStaffData({
      ...staffData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = (data, isStudent) => {
    if (data.password !== data.confirmPassword) {
      throw new Error('Passwords do not match');
    }

    if (data.password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    if (isStudent) {
      if (data.class < 1 || data.class > 12) {
        throw new Error('Class must be between 1 and 12');
      }
      if (data.age < 5 || data.age > 25) {
        throw new Error('Age must be between 5 and 25');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const isStudent = tabValue === 0;
      const data = isStudent ? studentData : staffData;
      
      validateForm(data, isStudent);

      const userData = {
        ...data,
        role: isStudent ? 'student' : data.role
      };

      delete userData.confirmPassword;

      await registerUser(userData);
      setSuccess('Registration successful! Please login to continue.');
      
      // Clear form
      if (isStudent) {
        setStudentData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          admissionNumber: '',
          class: '',
          age: '',
          schoolId: '',
          parentContact: '',
          address: ''
        });
      } else {
        setStaffData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          employeeId: '',
          department: '',
          schoolId: '',
          role: 'staff',
          phoneNumber: ''
        });
      }

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error) {
      setError(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const tabVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2
      }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Paper
          elevation={24}
          sx={{
            p: 4,
            maxWidth: 600,
            width: '100%',
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)'
          }}
        >
          {/* Header */}
          <Box display="flex" alignItems="center" mb={3}>
            <IconButton
              onClick={() => navigate('/login')}
              sx={{ mr: 2 }}
            >
              <ArrowBack />
            </IconButton>
            <Box flex={1} textAlign="center">
              <Emergency
                sx={{
                  fontSize: 40,
                  color: 'primary.main',
                  mb: 1
                }}
              />
              <Typography
                variant="h4"
                fontWeight="bold"
                color="primary.main"
                gutterBottom
              >
                Join JAGRUK
              </Typography>
              <Typography
                variant="subtitle2"
                color="text.secondary"
              >
                Create your account to get started
              </Typography>
            </Box>
          </Box>

          {/* Role Selection Tabs */}
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{ mb: 3 }}
          >
            <Tab
              icon={<School />}
              label="Student Registration"
              iconPosition="start"
            />
            <Tab
              icon={<Security />}
              label="Staff Registration"
              iconPosition="start"
            />
          </Tabs>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={tabValue}
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <form onSubmit={handleSubmit}>
                {tabValue === 0 ? (
                  // Student Registration Form
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Full Name"
                        name="name"
                        value={studentData.name}
                        onChange={handleStudentChange}
                        required
                        disabled={loading}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        name="email"
                        type="email"
                        value={studentData.email}
                        onChange={handleStudentChange}
                        required
                        disabled={loading}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Admission Number"
                        name="admissionNumber"
                        value={studentData.admissionNumber}
                        onChange={handleStudentChange}
                        required
                        disabled={loading}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth required>
                        <InputLabel>Class</InputLabel>
                        <Select
                          name="class"
                          value={studentData.class}
                          onChange={handleStudentChange}
                          disabled={loading}
                        >
                          {[...Array(12)].map((_, i) => (
                            <MenuItem key={i + 1} value={i + 1}>
                              Class {i + 1}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Age"
                        name="age"
                        type="number"
                        value={studentData.age}
                        onChange={handleStudentChange}
                        required
                        disabled={loading}
                        inputProps={{ min: 5, max: 25 }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="School ID"
                        name="schoolId"
                        value={studentData.schoolId}
                        onChange={handleStudentChange}
                        required
                        disabled={loading}
                        helperText="Ask your administrator for your school ID"
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Parent Contact"
                        name="parentContact"
                        value={studentData.parentContact}
                        onChange={handleStudentChange}
                        required
                        disabled={loading}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Address"
                        name="address"
                        value={studentData.address}
                        onChange={handleStudentChange}
                        disabled={loading}
                        multiline
                        rows={2}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={studentData.password}
                        onChange={handleStudentChange}
                        required
                        disabled={loading}
                        InputProps={{
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
                        value={studentData.confirmPassword}
                        onChange={handleStudentChange}
                        required
                        disabled={loading}
                        InputProps={{
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
                ) : (
                  // Staff Registration Form
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Full Name"
                        name="name"
                        value={staffData.name}
                        onChange={handleStaffChange}
                        required
                        disabled={loading}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        name="email"
                        type="email"
                        value={staffData.email}
                        onChange={handleStaffChange}
                        required
                        disabled={loading}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Employee ID"
                        name="employeeId"
                        value={staffData.employeeId}
                        onChange={handleStaffChange}
                        required
                        disabled={loading}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Department"
                        name="department"
                        value={staffData.department}
                        onChange={handleStaffChange}
                        required
                        disabled={loading}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth required>
                        <InputLabel>Role</InputLabel>
                        <Select
                          name="role"
                          value={staffData.role}
                          onChange={handleStaffChange}
                          disabled={loading}
                        >
                          <MenuItem value="staff">Staff</MenuItem>
                          <MenuItem value="admin">Admin</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="School ID"
                        name="schoolId"
                        value={staffData.schoolId}
                        onChange={handleStaffChange}
                        required
                        disabled={loading}
                        helperText="Contact your administrator for your school ID"
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Phone Number"
                        name="phoneNumber"
                        value={staffData.phoneNumber}
                        onChange={handleStaffChange}
                        disabled={loading}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={staffData.password}
                        onChange={handleStaffChange}
                        required
                        disabled={loading}
                        InputProps={{
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
                        value={staffData.confirmPassword}
                        onChange={handleStaffChange}
                        required
                        disabled={loading}
                        InputProps={{
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
                )}

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  sx={{
                    mt: 3,
                    mb: 2,
                    py: 1.5,
                    borderRadius: 2,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    background: 'linear-gradient(45deg, #4CAF50 30%, #8BC34A 90%)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #45a049 30%, #7cb342 90%)',
                    }
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Create Account'
                  )}
                </Button>

                <Box textAlign="center" mt={2}>
                  <Link
                    component={RouterLink}
                    to="/login"
                    variant="body2"
                    sx={{
                      color: 'primary.main',
                      textDecoration: 'none',
                      fontWeight: 'medium',
                      '&:hover': {
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    Already have an account? Sign in here
                  </Link>
                </Box>
              </form>
            </motion.div>
          </AnimatePresence>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default Register;
