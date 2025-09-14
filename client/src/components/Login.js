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
  Fade,
  Slide,
  Zoom,
  useTheme
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  School,
  PersonAdd,
  Google,
  Security,
  Warning,
  LoginOutlined,
  PersonOutline,
  Email,
  Lock,
  ArrowForward,
  Waves
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

const Login = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    role: 'student'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setLoginData(prev => ({
      ...prev,
      role: newValue === 0 ? 'student' : newValue === 1 ? 'staff' : 'admin'
    }));
  };

  const handleInputChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(loginData.email, loginData.password, loginData.role);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');

    const result = await loginWithGoogle();
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const containerVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.8,
      y: 50
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  const backgroundVariants = {
    animate: {
      background: [
        "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
        "linear-gradient(45deg, #f093fb 30%, #f5576c 90%)",
        "linear-gradient(45deg, #4facfe 30%, #00f2fe 90%)",
        "linear-gradient(45deg, #667eea 30%, #764ba2 90%)"
      ],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'student': return <School sx={{ color: '#4CAF50' }} />;
      case 'staff': return <PersonOutline sx={{ color: '#FF9800' }} />;
      case 'admin': return <Security sx={{ color: '#F44336' }} />;
      default: return <PersonOutline />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'student': return '#4CAF50';
      case 'staff': return '#FF9800';
      case 'admin': return '#F44336';
      default: return '#2196F3';
    }
  };

  // Demo credentials for easy testing
  const demoCredentials = {
    student: { email: 'student@jagruk.edu', password: 'student123' },
    staff: { email: 'staff@jagruk.edu', password: 'staff123' },
    admin: { email: 'admin@jagruk.edu', password: 'admin123' }
  };

  const handleDemoLogin = (role) => {
    setLoginData({
      email: demoCredentials[role].email,
      password: demoCredentials[role].password,
      role
    });
    setTabValue(role === 'student' ? 0 : role === 'staff' ? 1 : 2);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Animated Background */}
      <motion.div
        variants={backgroundVariants}
        animate="animate"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -2
        }}
      />

      {/* Floating Elements */}
      <motion.div
        animate={{
          y: [-20, 20, -20],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          zIndex: -1
        }}
      />

      <motion.div
        animate={{
          y: [20, -20, 20],
          rotate: [0, -5, 5, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        style={{
          position: 'absolute',
          bottom: '15%',
          right: '15%',
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          zIndex: -1
        }}
      />

      {/* Main Login Container */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Paper
          elevation={24}
          sx={{
            width: { xs: '90vw', sm: 450, md: 500 },
            p: 4,
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Header with Logo */}
          <motion.div variants={itemVariants}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
              >
                <Warning sx={{ fontSize: 60, color: '#667eea', mb: 1 }} />
              </motion.div>
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  mb: 1
                }}
              >
                JAGRUK
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Disaster Management & Safety System
              </Typography>
            </Box>
          </motion.div>

          {/* Role Selection Tabs */}
          <motion.div variants={itemVariants}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{
                mb: 3,
                '& .MuiTab-root': {
                  minHeight: 60,
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)'
                  }
                },
                '& .Mui-selected': {
                  background: 'rgba(102, 126, 234, 0.1)',
                  borderRadius: 2
                }
              }}
            >
              <Tab 
                icon={<School />} 
                label="Student" 
                iconPosition="start"
              />
              <Tab 
                icon={<PersonOutline />} 
                label="Staff" 
                iconPosition="start"
              />
              <Tab 
                icon={<Security />} 
                label="Admin" 
                iconPosition="start"
              />
            </Tabs>
          </motion.div>

          {/* Demo Login Buttons */}
          <motion.div variants={itemVariants}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                Quick Demo Login:
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {['student', 'staff', 'admin'].map((role) => (
                  <Button
                    key={role}
                    size="small"
                    variant="outlined"
                    onClick={() => handleDemoLogin(role)}
                    sx={{
                      borderColor: getRoleColor(role),
                      color: getRoleColor(role),
                      '&:hover': {
                        backgroundColor: `${getRoleColor(role)}20`,
                        borderColor: getRoleColor(role),
                        transform: 'scale(1.05)'
                      },
                      transition: 'all 0.2s ease'
                    }}
                    startIcon={getRoleIcon(role)}
                  >
                    {role}
                  </Button>
                ))}
              </Box>
            </Box>
          </motion.div>

          {/* Error Alert */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                variants={itemVariants}
              >
                <Alert 
                  severity="error" 
                  sx={{ mb: 2, borderRadius: 2 }}
                  onClose={() => setError('')}
                >
                  {error}
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Login Form */}
          <motion.form onSubmit={handleSubmit} variants={itemVariants}>
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={loginData.email}
                onChange={handleInputChange}
                variant="outlined"
                required
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="action" />
                    </InputAdornment>
                  )
                }}
              />

              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={loginData.password}
                onChange={handleInputChange}
                variant="outlined"
                required
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
            </Box>

            {/* Login Button */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  mb: 2,
                  py: 1.5,
                  borderRadius: 3,
                  background: `linear-gradient(45deg, ${getRoleColor(loginData.role)} 30%, ${getRoleColor(loginData.role)}AA 90%)`,
                  boxShadow: `0 8px 32px ${getRoleColor(loginData.role)}40`,
                  '&:hover': {
                    boxShadow: `0 12px 40px ${getRoleColor(loginData.role)}50`,
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.3s ease'
                }}
                endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <ArrowForward />}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </motion.div>
          </motion.form>

          {/* Divider */}
          <motion.div variants={itemVariants}>
            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                OR
              </Typography>
            </Divider>
          </motion.div>

          {/* Google Login Button */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              fullWidth
              variant="outlined"
              size="large"
              onClick={handleGoogleLogin}
              disabled={loading}
              sx={{
                mb: 3,
                py: 1.5,
                borderRadius: 3,
                borderColor: '#4285F4',
                color: '#4285F4',
                '&:hover': {
                  borderColor: '#4285F4',
                  backgroundColor: '#4285F420',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 32px #4285F430'
                },
                transition: 'all 0.3s ease'
              }}
              startIcon={<Google />}
            >
              Continue with Google
            </Button>
          </motion.div>

          {/* Footer Links */}
          <motion.div variants={itemVariants}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <Link 
                  component={RouterLink}
                  to="/register"
                  sx={{ 
                    color: getRoleColor(loginData.role),
                    textDecoration: 'none',
                    fontWeight: 600,
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  Sign Up
                </Link>
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                <Link 
                  href="#"
                  sx={{ 
                    color: 'text.secondary',
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  Forgot Password?
                </Link>
              </Typography>
            </Box>
          </motion.div>

          {/* Decorative Elements */}
          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              position: 'absolute',
              top: -20,
              right: -20,
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'rgba(102, 126, 234, 0.1)',
              zIndex: -1
            }}
          />

          <motion.div
            animate={{
              rotate: -360,
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              position: 'absolute',
              bottom: -15,
              left: -15,
              width: 30,
              height: 30,
              borderRadius: '50%',
              background: 'rgba(118, 75, 162, 0.1)',
              zIndex: -1
            }}
          />
        </Paper>
      </motion.div>
    </Box>
  );
};

export default Login;
