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
  Link
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  School,
  PersonAdd,
  Google,
  Security,
  Warning as Emergency
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
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

  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setLoginData(prev => ({
      ...prev,
      role: newValue === 0 ? 'student' : 'staff'
    }));
    setError('');
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

    try {
      await login(loginData.email, loginData.password, loginData.role);
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      await googleLogin(loginData.role);
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Google login failed');
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
            maxWidth: 450,
            width: '100%',
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)'
          }}
        >
          {/* Header */}
          <Box textAlign="center" mb={3}>
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Emergency
                sx={{
                  fontSize: 60,
                  color: 'primary.main',
                  mb: 1,
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
                }}
              />
              <Typography
                variant="h3"
                fontWeight="bold"
                color="primary.main"
                gutterBottom
              >
                JAGRUK
              </Typography>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                sx={{ mb: 2 }}
              >
                Disaster Preparedness & Response Education System
              </Typography>
            </motion.div>
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
              label="Student"
              iconPosition="start"
              sx={{ minHeight: 48 }}
            />
            <Tab
              icon={<Security />}
              label="Staff/Admin"
              iconPosition="start"
              sx={{ minHeight: 48 }}
            />
          </Tabs>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
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
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={loginData.email}
                  onChange={handleInputChange}
                  margin="normal"
                  required
                  disabled={loading}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2
                    }
                  }}
                />

                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={loginData.password}
                  onChange={handleInputChange}
                  margin="normal"
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
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2
                    }
                  }}
                />

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
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #1976D2 30%, #1CB5E0 90%)',
                    }
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Sign In'
                  )}
                </Button>

                <Divider sx={{ my: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    OR
                  </Typography>
                </Divider>

                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Google />}
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    borderColor: '#4285f4',
                    color: '#4285f4',
                    '&:hover': {
                      borderColor: '#3367d6',
                      backgroundColor: 'rgba(66, 133, 244, 0.04)'
                    }
                  }}
                >
                  Sign in with Google
                </Button>

                <Box textAlign="center" mt={3}>
                  <Link
                    component={RouterLink}
                    to="/register"
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
                    Don't have an account? Register here
                  </Link>
                </Box>

                <Box textAlign="center" mt={1}>
                  <Link
                    component={RouterLink}
                    to="/forgot-password"
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    Forgot your password?
                  </Link>
                </Box>
              </form>
            </motion.div>
          </AnimatePresence>

          {/* Demo Credentials */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <Box
              sx={{
                mt: 3,
                p: 2,
                bgcolor: 'grey.50',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'grey.200'
              }}
            >
              <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                Demo Credentials:
              </Typography>
              <Typography variant="caption" display="block">
                Student: student@demo.com / demo123
              </Typography>
              <Typography variant="caption" display="block">
                Admin: admin@demo.com / demo123
              </Typography>
            </Box>
          </motion.div>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default Login;
