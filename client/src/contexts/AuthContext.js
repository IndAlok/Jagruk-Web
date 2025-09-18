import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as firebaseSignOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { auth } from '../config/firebase';
import axios from 'axios';
import { toast } from 'react-toastify';

const AuthContext = createContext();

// Configure axios defaults
axios.defaults.baseURL = 'http://localhost:5000';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Set up axios interceptors for authentication
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 && !isInitialLoad && currentUser) {
          // Only show session expired if we had a user and it's not initial load
          localStorage.removeItem('token');
          setToken(null);
          setCurrentUser(null);
          toast.error('Session expired. Please login again.');
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [isInitialLoad, currentUser]);

  // Verify token function
  const verifyToken = async (tokenToVerify) => {
    if (!tokenToVerify) return false;
    
    try {
      const response = await axios.post('/api/auth/verify-token', {}, {
        headers: {
          'Authorization': `Bearer ${tokenToVerify}`
        }
      });
      
      if (response.data.valid) {
        setCurrentUser(response.data.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Token verification failed:', error);
      return false;
    }
  };

  // Initial token verification on app start
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      
      if (storedToken) {
        const isValid = await verifyToken(storedToken);
        if (!isValid) {
          localStorage.removeItem('token');
          setToken(null);
          setCurrentUser(null);
        }
      }
      
      setLoading(false);
      setIsInitialLoad(false);
    };

    initializeAuth();
  }, []);

  // Monitor Firebase auth state (mainly for Google login)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // We only care about Firebase auth for Google login
      // Regular login is handled by our token system
      if (!isInitialLoad) {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [isInitialLoad]);

  // Regular login with email/password - always make admin
  const login = async (email, password, role = null) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/auth/login', {
        email,
        password,
        role: 'admin' // Force admin role
      });

      const { token: newToken, user, success, message } = response.data;
      
      // Check for updated demo profile in localStorage
      if (user?.id?.startsWith('demo_')) {
        const demoProfileKey = `demoProfile_${user.id}`;
        const savedDemoProfile = localStorage.getItem(demoProfileKey);
        if (savedDemoProfile) {
          const parsedProfile = JSON.parse(savedDemoProfile);
          user.name = parsedProfile.name || user.name;
          user.phone = parsedProfile.phone || user.phone;
          user.address = parsedProfile.address || user.address;
          user.isProfileComplete = parsedProfile.isProfileComplete || false;
          // Add any other profile fields that might have been updated
          Object.assign(user, parsedProfile);
        }
      }
      
      // Store token
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setCurrentUser(user);

      // Show success message only if provided by server
      if (message && success) {
        toast.success(message);
      }
      
      return { success: true, user };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      // Don't show toast here, let the component handle it
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Register new user
  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/auth/register', userData);

      const { token: newToken, user, message, success } = response.data;
      
      // Store token
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setCurrentUser(user);

      // Show success message only if provided by server
      if (message && success) {
        toast.success(message);
      }
      
      return { success: true, user };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      // Don't show toast here, let the component handle it
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Google Sign In
  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');

      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      // Send token to backend for verification and user creation/login - force admin
      const response = await axios.post('/api/auth/google-login', {
        idToken,
        email: result.user.email,
        name: result.user.displayName,
        photoURL: result.user.photoURL,
        role: 'admin' // Force admin role
      });

      const { token: newToken, user, message } = response.data;
      
      // Store token
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setCurrentUser(user);

      // Only show toast if server didn't provide a message
      if (!message) {
        toast.success(`Welcome, ${user.name}!`);
      } else {
        toast.success(message);
      }
      return { success: true, user };
    } catch (error) {
      const message = error.response?.data?.message || 'Google login failed';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      // Sign out from Firebase
      await firebaseSignOut(auth);
      
      // Clear local storage
      localStorage.removeItem('token');
      setToken(null);
      setCurrentUser(null);
      
      toast.success('Logged out successfully');
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if Firebase fails
      localStorage.removeItem('token');
      setToken(null);
      setCurrentUser(null);
      return { success: true };
    }
  };

  // Check if user has specific role
  const hasRole = (role) => {
    if (!currentUser) return false;
    return currentUser.role === role;
  };

  // Check if user has specific permission
  const hasPermission = (permission) => {
    if (!currentUser) return false;
    
    // Admin has all permissions
    if (currentUser.role === 'admin') return true;
    
    // Check specific permissions based on role
    const rolePermissions = {
      staff: [
        'view_drills',
        'create_drills',
        'edit_drills',
        'view_students',
        'send_notifications',
        'view_reports',
        'manage_emergency'
      ],
      student: [
        'view_drills',
        'participate_drills',
        'view_profile',
        'receive_notifications'
      ]
    };

    const userPermissions = rolePermissions[currentUser.role] || [];
    return userPermissions.includes(permission);
  };

  // Get user profile
  const getUserProfile = async () => {
    try {
      if (!currentUser) return null;
      
      const response = await axios.get(`/api/auth/profile/${currentUser.id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      return null;
    }
  };

  // Update user profile
  const updateUserProfile = async (updates) => {
    try {
      if (!currentUser) throw new Error('No user logged in');
      
      // Handle demo users by storing in localStorage
      if (currentUser.id?.startsWith('demo_')) {
        const demoProfileKey = `demoProfile_${currentUser.id}`;
        const updatedUser = { ...currentUser, ...updates, isProfileComplete: true };
        
        // Store updated demo profile in localStorage
        localStorage.setItem(demoProfileKey, JSON.stringify(updatedUser));
        
        // Update current user state
        setCurrentUser(updatedUser);
        return { success: true, user: updatedUser };
      }
      
      const response = await axios.put(`/api/auth/profile/${currentUser.id}`, updates);
      const updatedUser = response.data.user;
      
      setCurrentUser(updatedUser);
      return { success: true, user: updatedUser };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update profile';
      return { success: false, error: message };
    }
  };

  // Complete Google user profile (for first-time Google users)
  const completeGoogleProfile = async (additionalData) => {
    try {
      if (!currentUser) throw new Error('No user logged in');
      
      const response = await axios.post(`/api/auth/complete-google-profile`, {
        userId: currentUser.id,
        ...additionalData
      });
      
      const updatedUser = response.data.user;
      setCurrentUser(updatedUser);
      
      return { success: true, user: updatedUser };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to complete profile';
      return { success: false, error: message };
    }
  };

  // Upload profile photo
  const uploadProfilePhoto = async (photoFile) => {
    try {
      if (!currentUser) throw new Error('No user logged in');
      
      const formData = new FormData();
      formData.append('profilePhoto', photoFile);
      formData.append('userId', currentUser.id);
      
      const response = await axios.post('/api/auth/upload-photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      const updatedUser = { 
        ...currentUser, 
        profilePhoto: response.data.photoURL,
        photoURL: response.data.photoURL  // Ensure both properties are available
      };
      setCurrentUser(updatedUser);
      
      return { success: true, photoURL: response.data.photoURL };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to upload photo';
      return { success: false, error: message };
    }
  };

  const value = {
    currentUser,
    loading,
    token,
    login,
    register,
    loginWithGoogle,
    logout,
    hasRole,
    hasPermission,
    getUserProfile,
    updateUserProfile,
    completeGoogleProfile,
    uploadProfilePhoto
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
