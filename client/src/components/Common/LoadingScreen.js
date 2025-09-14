import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { Warning as Emergency } from '@mui/icons-material';

const LoadingScreen = ({ message = 'Loading...' }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
      >
        <Emergency sx={{ fontSize: 60, mb: 2 }} />
      </motion.div>
      
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        JAGRUK
      </Typography>
      
      <Typography variant="subtitle1" gutterBottom sx={{ opacity: 0.8 }}>
        Disaster Management Education System
      </Typography>
      
      <Box sx={{ mt: 3 }}>
        <CircularProgress color="inherit" size={40} />
      </Box>
      
      <Typography variant="body2" sx={{ mt: 2, opacity: 0.7 }}>
        {message}
      </Typography>
    </Box>
  );
};

export default LoadingScreen;
