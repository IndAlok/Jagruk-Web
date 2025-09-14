import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion, AnimatePresence } from 'framer-motion';

// Context and Authentication
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import Register from './components/Register';

// Role-specific Dashboard Components
import AdminDashboard from './components/AdminDashboard';
import StaffDashboard from './components/StaffDashboard';
import StudentDashboard from './components/StudentDashboard';

// Sophisticated theme with modern design and animations
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#667eea',
      light: '#8a9ff5',
      dark: '#4f5bd5',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#FF6B35',
      light: '#ff8960',
      dark: '#e55a2b',
      contrastText: '#ffffff',
    },
    error: {
      main: '#FF5252',
      light: '#ff7a7a',
      dark: '#e04848',
    },
    warning: {
      main: '#FFA726',
      light: '#ffb851',
      dark: '#e0931e',
    },
    info: {
      main: '#4ECDC4',
      light: '#73d7d0',
      dark: '#41b0a8',
    },
    success: {
      main: '#66BB6A',
      light: '#85c788',
      dark: '#56a05a',
    },
    background: {
      default: '#f5f7fa',
      paper: 'rgba(255, 255, 255, 0.9)',
    },
    text: {
      primary: '#2c3e50',
      secondary: '#7f8c8d',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(10px)',
          background: 'rgba(255, 255, 255, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: 20,
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '12px 24px',
          fontWeight: 500,
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 14px 0 rgba(0,0,0,0.1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 20px 0 rgba(0,0,0,0.15)',
          },
        },
        contained: {
          background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
          '&:hover': {
            background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            },
            '&.Mui-focused': {
              boxShadow: '0 4px 20px rgba(102,126,234,0.3)',
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(10px)',
          background: 'rgba(255, 255, 255, 0.9)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        },
      },
    },
  },
});

// Dashboard Router Component with Role-based Access
const DashboardRouter = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontSize: '1.2rem',
          color: '#667eea'
        }}
      >
        Loading...
      </motion.div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Automatic role-based dashboard routing
  const getDashboardComponent = () => {
    switch (currentUser.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'staff':
        return <StaffDashboard />;
      case 'student':
        return <StudentDashboard />;
      default:
        return <Navigate to="/login" replace />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      {getDashboardComponent()}
    </motion.div>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <AnimatePresence mode="wait">
            <Routes>
              {/* Authentication Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Unified Dashboard Route - Role determined automatically */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <DashboardRouter />
                  </ProtectedRoute>
                } 
              />
              
              {/* Legacy role-specific routes (redirect to unified dashboard) */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <Navigate to="/dashboard" replace />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/staff" 
                element={
                  <ProtectedRoute requiredRole="staff">
                    <Navigate to="/dashboard" replace />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/student" 
                element={
                  <ProtectedRoute requiredRole="student">
                    <Navigate to="/dashboard" replace />
                  </ProtectedRoute>
                } 
              />

              {/* Default route - redirect to dashboard */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              {/* Catch-all route */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </AnimatePresence>
        </Router>

        {/* Toast Notifications with sophisticated styling */}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          toastStyle={{
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            backdropFilter: 'blur(10px)',
          }}
        />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
