import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Divider,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Google,
  Security,
  Warning,
  Email,
  Lock,
  ArrowForward,
  Brightness4,
  Brightness7,
  KeyOutlined
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    role: 'admin'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);

  const { login, loginWithGoogle, forgotPassword } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

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

    try {
      const result = await login(loginData.email, loginData.password, loginData.role);
      
      if (result.success) {
        // Don't show additional toast, let AuthContext handle it
        navigate('/dashboard');
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await loginWithGoogle();
      
      if (result.success) {
        // Don't show additional toast, let AuthContext handle it
        navigate('/dashboard');
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Google login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotPasswordEmail) {
      setError('Please enter your email address');
      return;
    }

    setForgotPasswordLoading(true);
    
    try {
      const result = await forgotPassword(forgotPasswordEmail);
      if (result.success) {
        toast.success('Password reset link sent to your email!');
        setForgotPasswordOpen(false);
        setForgotPasswordEmail('');
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setForgotPasswordLoading(false);
    }
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
    // Always use admin credentials
    setLoginData({
      email: demoCredentials.admin.email,
      password: demoCredentials.admin.password,
      role: 'admin'
    });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: darkMode 
          ? 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)'
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)'
      }}
    >
      {/* Dark Mode Toggle */}
      <Box
        sx={{
          position: 'absolute',
          top: 20,
          right: 20,
          zIndex: 1000
        }}
      >
        <Tooltip title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
          <IconButton
            onClick={toggleTheme}
            sx={{
              bgcolor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
              '&:hover': {
                bgcolor: darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.3)',
                transform: 'scale(1.1)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            {darkMode ? <Brightness7 sx={{ color: 'white' }} /> : <Brightness4 sx={{ color: 'white' }} />}
          </IconButton>
        </Tooltip>
      </Box>
      {/* Animated Background */}
      <motion.div
        animate={{
          background: darkMode ? [
            "linear-gradient(45deg, #0f0f23 30%, #1a1a2e 90%)",
            "linear-gradient(45deg, #1a1a2e 30%, #16213e 90%)",
            "linear-gradient(45deg, #16213e 30%, #0f0f23 90%)"
          ] : [
            "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
            "linear-gradient(45deg, #f093fb 30%, #f5576c 90%)",
            "linear-gradient(45deg, #4facfe 30%, #00f2fe 90%)",
            "linear-gradient(45deg, #667eea 30%, #764ba2 90%)"
          ]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        }}
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
            background: darkMode 
              ? 'rgba(26, 26, 46, 0.95)' 
              : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: darkMode 
              ? '1px solid rgba(255, 255, 255, 0.1)' 
              : '1px solid rgba(255, 255, 255, 0.2)',
            position: 'relative',
            overflow: 'hidden',
            color: darkMode ? 'white' : 'inherit'
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
                  background: darkMode 
                    ? 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)'
                    : 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  mb: 1
                }}
              >
                JAGRUK
              </Typography>
              <Typography variant="subtitle1" sx={{ color: darkMode ? 'rgba(255,255,255,0.7)' : 'text.secondary' }}>
                Disaster Management & Safety System
              </Typography>
            </Box>
          </motion.div>

          {/* Admin Portal Header */}
          <motion.div variants={itemVariants}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center',
              mb: 3,
              p: 2,
              bgcolor: 'rgba(102, 126, 234, 0.1)',
              borderRadius: 2
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Security sx={{ color: '#667eea' }} />
                <Typography variant="h6" sx={{ color: '#667eea', fontWeight: 600 }}>
                  Administrator Portal
                </Typography>
              </Box>
            </Box>
          </motion.div>

          {/* Demo Login Button */}
          <motion.div variants={itemVariants}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                Quick Demo Login:
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => handleDemoLogin('admin')}
                  startIcon={<Security />}
                  sx={{
                    borderColor: '#667eea',
                    color: '#667eea',
                    '&:hover': {
                      backgroundColor: 'rgba(102, 126, 234, 0.2)',
                      borderColor: '#667eea',
                      transform: 'scale(1.05)'
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  Demo Admin Login
                </Button>
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
                sx={{ 
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.23)',
                    },
                    '&:hover fieldset': {
                      borderColor: darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.87)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#667eea',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
                  },
                  '& .MuiOutlinedInput-input': {
                    color: darkMode ? 'white' : 'inherit',
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: darkMode ? 'rgba(255,255,255,0.7)' : 'action.active' }} />
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
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.23)',
                    },
                    '&:hover fieldset': {
                      borderColor: darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.87)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#667eea',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
                  },
                  '& .MuiOutlinedInput-input': {
                    color: darkMode ? 'white' : 'inherit',
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: darkMode ? 'rgba(255,255,255,0.7)' : 'action.active' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: darkMode ? 'rgba(255,255,255,0.7)' : 'inherit' }}
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
              <Typography variant="body2" sx={{ color: darkMode ? 'rgba(255,255,255,0.7)' : 'text.secondary' }}>
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
              <Typography variant="body2" sx={{ color: darkMode ? 'rgba(255,255,255,0.7)' : 'text.secondary', mt: 1 }}>
                <Link 
                  onClick={() => setForgotPasswordOpen(true)}
                  sx={{ 
                    color: darkMode ? 'rgba(255,255,255,0.7)' : 'text.secondary',
                    textDecoration: 'none',
                    cursor: 'pointer',
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

          {/* Forgot Password Dialog */}
          <Dialog 
            open={forgotPasswordOpen} 
            onClose={() => setForgotPasswordOpen(false)}
            maxWidth="sm"
            fullWidth
            PaperProps={{
              sx: {
                bgcolor: darkMode ? '#1a1a2e' : 'white',
                color: darkMode ? 'white' : 'inherit'
              }
            }}
          >
            <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
              <KeyOutlined sx={{ fontSize: 40, color: '#667eea', mb: 1 }} />
              <Typography variant="h5" component="div">
                Reset Password
              </Typography>
              <Typography variant="body2" sx={{ color: darkMode ? 'rgba(255,255,255,0.7)' : 'text.secondary', mt: 1 }}>
                Enter your email address and we'll send you a link to reset your password.
              </Typography>
            </DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Email Address"
                type="email"
                fullWidth
                variant="outlined"
                value={forgotPasswordEmail}
                onChange={(e) => setForgotPasswordEmail(e.target.value)}
                sx={{
                  mt: 2,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.23)',
                    },
                    '&:hover fieldset': {
                      borderColor: darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.87)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#667eea',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
                  },
                  '& .MuiOutlinedInput-input': {
                    color: darkMode ? 'white' : 'inherit',
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: darkMode ? 'rgba(255,255,255,0.7)' : 'action.active' }} />
                    </InputAdornment>
                  )
                }}
              />
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3 }}>
              <Button 
                onClick={() => setForgotPasswordOpen(false)}
                sx={{ color: darkMode ? 'rgba(255,255,255,0.7)' : 'text.secondary' }}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleForgotPassword}
                variant="contained"
                disabled={forgotPasswordLoading || !forgotPasswordEmail}
                sx={{
                  background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)',
                  }
                }}
              >
                {forgotPasswordLoading ? <CircularProgress size={20} color="inherit" /> : 'Send Reset Link'}
              </Button>
            </DialogActions>
          </Dialog>

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
