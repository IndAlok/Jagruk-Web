import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requiredRole = null, requiredPermissions = [] }) => {
  const { currentUser, loading, hasRole, hasPermission } = useAuth();
  const location = useLocation();

  // Show loading spinner while authentication is being verified
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <CircularProgress size={60} sx={{ color: 'white', mb: 3 }} />
        </motion.div>
        <Typography variant="h6" sx={{ color: 'white', opacity: 0.9 }}>
          Verifying access...
        </Typography>
      </Box>
    );
  }

  // Redirect to login if not authenticated
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role requirements
  if (requiredRole && !hasRole(requiredRole)) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
          color: 'white',
          textAlign: 'center',
          p: 3,
        }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Access Denied
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, mb: 3 }}>
            You don't have permission to access this page.
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.8 }}>
            Required role: {requiredRole}
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.8 }}>
            Your role: {currentUser.role}
          </Typography>
        </motion.div>
      </Box>
    );
  }

  // Check permission requirements
  if (requiredPermissions.length > 0) {
    const hasAllPermissions = requiredPermissions.every(permission => 
      hasPermission(permission)
    );

    if (!hasAllPermissions) {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
            color: 'white',
            textAlign: 'center',
            p: 3,
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Insufficient Permissions
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, mb: 3 }}>
              You don't have the required permissions to access this page.
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.8 }}>
              Required permissions: {requiredPermissions.join(', ')}
            </Typography>
          </motion.div>
        </Box>
      );
    }
  }

  // User is authenticated and authorized, render the protected component
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

export default ProtectedRoute;
