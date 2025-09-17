import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion, AnimatePresence } from 'framer-motion';

// Context and Authentication
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CustomThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import Register from './components/Register';

// Role-specific Dashboard Components
import AdminDashboard from './components/AdminDashboard';
import StaffDashboard from './components/StaffDashboard';
import StudentDashboard from './components/StudentDashboard';
import ProfileCompletionDialog from './components/Common/ProfileCompletionDialog';

// Dashboard Router Component with Role-based Access
const DashboardRouter = () => {
  const { currentUser, loading } = useAuth();
  const [showProfileCompletion, setShowProfileCompletion] = React.useState(false);

  // Check if Google user needs to complete profile
  React.useEffect(() => {
    if (currentUser && currentUser.provider === 'google.com' && !currentUser.profileCompleted) {
      setShowProfileCompletion(true);
    }
  }, [currentUser]);

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
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
          }}
          style={{
            width: 60,
            height: 60,
            border: '4px solid rgba(255,255,255,0.3)',
            borderTop: '4px solid white',
            borderRadius: '50%',
          }}
        />
      </motion.div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Render dashboard content
  const renderDashboard = () => {
    // Route to appropriate dashboard based on user role
    switch (currentUser.role) {
      case 'admin':
        return (
          <motion.div
            key="admin-dashboard"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <AdminDashboard />
          </motion.div>
        );
      case 'staff':
        return (
          <motion.div
            key="staff-dashboard"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <StaffDashboard />
          </motion.div>
        );
      case 'student':
        return (
          <motion.div
            key="student-dashboard"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <StudentDashboard />
          </motion.div>
        );
      default:
        return <Navigate to="/login" replace />;
    }
  };

  return (
    <>
      {renderDashboard()}
      
      {/* Profile Completion Dialog for Google Users */}
      <ProfileCompletionDialog
        open={showProfileCompletion}
        user={currentUser}
        onComplete={() => {
          setShowProfileCompletion(false);
          // Optionally refresh user data
          window.location.reload();
        }}
        onSkip={() => setShowProfileCompletion(false)}
      />
    </>
  );
};

function App() {
  return (
    <CustomThemeProvider>
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
              
              {/* Default redirect */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </AnimatePresence>
        </Router>

        {/* Global Toast Notifications */}
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
    </CustomThemeProvider>
  );
}

export default App;
