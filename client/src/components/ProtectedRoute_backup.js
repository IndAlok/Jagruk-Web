import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CircularProgress, Box, Typography, Alert } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock as LockIcon, Warning as WarningIcon } from '@mui/icons-material';

const ProtectedRoute = ({ children, requiredRole = null, requiredPermissions = [] }) => {
  const { currentUser, loading, hasRole, hasPermission } = useAuth();
  const location = useLocation();

  // Show sophisticated loading animation while auth state is being determined
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
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Animated background particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: Math.random() * 0.6,
              scale: Math.random() * 1.5 + 0.5,
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            transition={{
              duration: Math.random() * 4 + 2,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
            style={{
              position: 'absolute',
              width: '6px',
              height: '6px',
              background: 'rgba(255,255,255,0.4)',
              borderRadius: '50%',
            }}
          />
        ))}

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <CircularProgress 
              size={80} 
              thickness={3}
              sx={{ 
                color: '#fff',
                filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.3))',
              }} 
            />
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <Typography 
              variant="h5" 
              sx={{ 
                color: 'white', 
                mt: 3, 
                fontWeight: 'bold',
                textAlign: 'center',
                textShadow: '0 2px 10px rgba(0,0,0,0.3)',
              }}
            >
              Securing Your Session
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: 'rgba(255,255,255,0.8)', 
                mt: 1,
                textAlign: 'center',
              }}
            >
              Please wait while we verify your credentials...
            </Typography>
          </motion.div>
        </motion.div>
      </Box>
    );
  }

  // User not authenticated - redirect to login
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access
  if (requiredRole && !hasRole(requiredRole)) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          p: 4,
        }}
      >
        <motion.div
          initial={{ scale: 0, rotate: 180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <LockIcon sx={{ fontSize: '6rem', color: 'rgba(255,255,255,0.8)', mb: 3 }} />
        </motion.div>
        
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          style={{ textAlign: 'center' }}
        >
          <Typography variant="h3" sx={{ color: 'white', fontWeight: 'bold', mb: 2 }}>
            Access Denied
          </Typography>
          <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)', mb: 3 }}>
            You don't have permission to access this area
          </Typography>
          <Alert 
            severity="warning" 
            sx={{ 
              maxWidth: 400, 
              borderRadius: 2,
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
              '& .MuiAlert-icon': { color: '#fff' },
              '& .MuiAlert-message': { color: '#fff' },
            }}
          >
            Required role: <strong>{requiredRole.toUpperCase()}</strong><br/>
            Your role: <strong>{currentUser.role.toUpperCase()}</strong>
          </Alert>
        </motion.div>
      </Box>
    );
  }

  // Check permission-based access
  if (requiredPermissions.length > 0) {
    const missingPermissions = requiredPermissions.filter(permission => !hasPermission(permission));
    if (missingPermissions.length > 0) {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            p: 4,
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <WarningIcon sx={{ fontSize: '6rem', color: '#FFD700', mb: 3 }} />
          </motion.div>
          
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            style={{ textAlign: 'center' }}
          >
            <Typography variant="h3" sx={{ color: 'white', fontWeight: 'bold', mb: 2 }}>
              Insufficient Permissions
            </Typography>
            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)', mb: 3 }}>
              You need additional permissions to access this feature
            </Typography>
            <Alert 
              severity="info" 
              sx={{ 
                maxWidth: 500, 
                borderRadius: 2,
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                '& .MuiAlert-icon': { color: '#fff' },
                '& .MuiAlert-message': { color: '#fff' },
              }}
            >
              Missing permissions: <strong>{missingPermissions.join(', ')}</strong>
            </Alert>
          </motion.div>
        </Box>
      );
    }
  }

  // User is authenticated and authorized - render protected content with animation
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default ProtectedRoute;
