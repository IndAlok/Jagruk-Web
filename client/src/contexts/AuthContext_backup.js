import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider } from '../config/firebase';
import { signInWithPopup, signOut } from 'firebase/auth';
import axios from 'axios';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState([]);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setCurrentUser(parsedUser);
        setPermissions(parsedUser.permissions || []);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        logout();
      }
    }
    
    setLoading(false);
  }, []);

  // Check if user has specific permission
  const hasPermission = (permission) => {
    return permissions.includes(permission);
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return currentUser?.role === role;
  };

  // Check if user can access admin functions
  const isAdmin = () => {
    return hasRole('admin');
  };

  // Check if user can access staff functions
  const isStaffOrAdmin = () => {
    return hasRole('staff') || hasRole('admin');
  };

  // Unified login - role determined automatically from backend
  const login = async (email, password) => {
    try {
      setLoading(true);
      
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email,
        password
      });
      
      const { token, user: userData } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setCurrentUser(userData);
      setPermissions(userData.permissions || []);
      
      toast.success(`Welcome back, ${userData.name}! Logged in as ${userData.role.toUpperCase()}`);
      
      return userData;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Google login with unified role determination
  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      
      const response = await axios.post(`${API_BASE_URL}/api/auth/google-login`, {
        idToken
      });
      
      const { token, user: userData } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setCurrentUser(userData);
      setPermissions(userData.permissions || []);
      
      toast.success(`Welcome, ${userData.name}! Logged in as ${userData.role.toUpperCase()} via Google`);
      
      return userData;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Google login failed. Please try again.';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Sign out from Firebase if using Google auth
      if (auth.currentUser) {
        await signOut(auth);
      }
      
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
      
      // Reset state
      setCurrentUser(null);
      setPermissions([]);
      
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Error logging out');
      console.error('Logout error:', error);
    }
  };

  // Register function - can be called for any role
  const register = async (userData) => {
    try {
      setLoading(true);
      
      const endpoint = userData.role === 'student' ? 'register/student' : 'register/staff';
      const response = await axios.post(`${API_BASE_URL}/api/auth/${endpoint}`, userData);
      
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentUser,
    login,
    loginWithGoogle,
    logout,
    register,
    loading,
    permissions,
    hasPermission,
    hasRole,
    isAdmin,
    isStaffOrAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}