import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box, Typography, Button } from '@mui/material';
import { Warning as Emergency } from '@mui/icons-material';

// Simple theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f44336',
    },
  },
});

// Simple Home component for testing
const Home = () => (
  <Box 
    sx={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      textAlign: 'center',
      padding: 4
    }}
  >
    <Emergency sx={{ fontSize: 80, mb: 2 }} />
    <Typography variant="h2" fontWeight="bold" gutterBottom>
      JAGRUK
    </Typography>
    <Typography variant="h5" gutterBottom sx={{ opacity: 0.9 }}>
      Disaster Management Education System
    </Typography>
    <Typography variant="body1" sx={{ opacity: 0.8, mb: 4, maxWidth: 600 }}>
      A comprehensive disaster preparedness and response education platform designed 
      for Smart India Hackathon. Empowering schools and colleges with real-time 
      emergency management capabilities.
    </Typography>
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
      <Button 
        variant="contained" 
        size="large" 
        sx={{ 
          bgcolor: 'rgba(255,255,255,0.2)', 
          backdropFilter: 'blur(10px)',
          '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
        }}
      >
        Student Login
      </Button>
      <Button 
        variant="outlined" 
        size="large"
        sx={{ 
          borderColor: 'rgba(255,255,255,0.5)', 
          color: 'white',
          '&:hover': { 
            borderColor: 'white', 
            bgcolor: 'rgba(255,255,255,0.1)' 
          }
        }}
      >
        Staff Login
      </Button>
    </Box>
    
    <Box sx={{ mt: 4, opacity: 0.7 }}>
      <Typography variant="body2">
        🚀 Server Status: {navigator.onLine ? '✅ Online' : '❌ Offline'}
      </Typography>
      <Typography variant="body2">
        📱 Client Port: 3000 | 🖥️ Server Port: 5000
      </Typography>
    </Box>
  </Box>
);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
