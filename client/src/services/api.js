import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
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

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (credentials) => {
    try {
      const response = await api.post('/api/auth/login', credentials);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    try {
      await api.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  register: async (userData) => {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await api.post('/api/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (token, password) => {
    const response = await api.post('/api/auth/reset-password', { token, password });
    return response.data;
  },

  verifyToken: async () => {
    const response = await api.get('/api/auth/verify');
    return response.data;
  }
};

// Dashboard API
export const dashboardAPI = {
  getAdminStats: async () => {
    const response = await api.get('/api/dashboard/admin/stats');
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/api/dashboard/demo/stats');
    return response.data;
  },

  getActivities: async () => {
    const response = await api.get('/api/dashboard/admin/activities');
    return response.data;
  },

  getNotifications: async () => {
    const response = await api.get('/api/dashboard/notifications');
    return response.data;
  },

  markNotificationRead: async (notificationId) => {
    const response = await api.patch(`/api/dashboard/notifications/${notificationId}/read`);
    return response.data;
  }
};

// User Management API
export const userAPI = {
  getUsers: async (filters = {}) => {
    const response = await api.get('/api/users', { params: filters });
    return response.data;
  },

  createUser: async (userData) => {
    const response = await api.post('/api/users', userData);
    return response.data;
  },

  updateUser: async (userId, userData) => {
    const response = await api.put(`/api/users/${userId}`, userData);
    return response.data;
  },

  deleteUser: async (userId) => {
    const response = await api.delete(`/api/users/${userId}`);
    return response.data;
  },

  getUserProfile: async () => {
    const response = await api.get('/api/users/profile');
    return response.data;
  },

  updateUserProfile: async (profileData) => {
    const response = await api.put('/api/users/profile', profileData);
    return response.data;
  }
};

// Security API
export const securityAPI = {
  getDrills: async () => {
    const response = await api.get('/api/security/drills');
    return response.data;
  },

  createDrill: async (drillData) => {
    const response = await api.post('/api/security/drills', drillData);
    return response.data;
  },

  updateDrill: async (drillId, drillData) => {
    const response = await api.put(`/api/security/drills/${drillId}`, drillData);
    return response.data;
  },

  deleteDrill: async (drillId) => {
    const response = await api.delete(`/api/security/drills/${drillId}`);
    return response.data;
  },

  triggerDrill: async (drillId) => {
    const response = await api.post(`/api/security/drills/${drillId}/trigger`);
    return response.data;
  },

  getIncidents: async () => {
    const response = await api.get('/api/security/incidents');
    return response.data;
  },

  reportIncident: async (incidentData) => {
    const response = await api.post('/api/security/incidents', incidentData);
    return response.data;
  }
};

// Settings API
export const settingsAPI = {
  getSettings: async () => {
    const response = await api.get('/api/settings');
    return response.data;
  },

  updateSettings: async (settings) => {
    const response = await api.put('/api/settings', settings);
    return response.data;
  },

  resetSettings: async () => {
    const response = await api.post('/api/settings/reset');
    return response.data;
  },

  updateNotificationSettings: async (notificationSettings) => {
    const response = await api.put('/api/settings/notifications', notificationSettings);
    return response.data;
  },

  updateSecuritySettings: async (securitySettings) => {
    const response = await api.put('/api/settings/security', securitySettings);
    return response.data;
  }
};

// Emergency API
export const emergencyAPI = {
  triggerAlert: async (alertType, data = {}) => {
    const response = await api.post('/api/emergency/alert', { type: alertType, ...data });
    return response.data;
  },

  getEmergencyContacts: async () => {
    const response = await api.get('/api/emergency/contacts');
    return response.data;
  },

  updateEmergencyContacts: async (contacts) => {
    const response = await api.put('/api/emergency/contacts', { contacts });
    return response.data;
  },

  getAlertHistory: async () => {
    const response = await api.get('/api/emergency/alerts/history');
    return response.data;
  }
};

// Modules API
export const modulesAPI = {
  getAllModules: async () => {
    const response = await api.get('/api/modules');
    return response.data;
  },

  getModuleProgress: async (studentId) => {
    const response = await api.get(`/api/modules/progress/${studentId}`);
    return response.data;
  },

  getStudentProgress: async (studentId) => {
    const response = await api.get(`/api/modules/student/${studentId}/progress`);
    return response.data;
  },

  getAllStudentsProgress: async () => {
    const response = await api.get('/api/modules/students/progress');
    return response.data;
  }
};

// Drills & Attendance API
export const drillsAPI = {
  getAllDrills: async () => {
    const response = await api.get('/api/drills');
    return response.data;
  },

  getStudentAttendance: async (studentId) => {
    const response = await api.get(`/api/attendance?studentId=${studentId}`);
    return response.data;
  },

  getAllStudentsAttendance: async () => {
    const response = await api.get('/api/attendance/students');
    return response.data;
  },

  getAttendanceStats: async () => {
    const response = await api.get('/api/attendance/stats');
    return response.data;
  }
};

// Analytics API
export const analyticsAPI = {
  getDashboardMetrics: async (timeRange = '7d') => {
    const response = await api.get(`/api/analytics/dashboard?range=${timeRange}`);
    return response.data;
  },

  getUserMetrics: async (timeRange = '7d') => {
    const response = await api.get(`/api/analytics/users?range=${timeRange}`);
    return response.data;
  },

  getSecurityMetrics: async (timeRange = '7d') => {
    const response = await api.get(`/api/analytics/security?range=${timeRange}`);
    return response.data;
  },

  exportData: async (type, filters = {}) => {
    const response = await api.post('/api/analytics/export', { type, filters }, {
      responseType: 'blob'
    });
    return response.data;
  }
};

// Utility functions
export const utils = {
  handleAPIError: (error) => {
    const message = error.response?.data?.message || 'An error occurred';
    toast.error(message, {
      position: "top-right",
      autoClose: 5000,
    });
    console.error('API Error:', error);
  },

  handleAPISuccess: (message) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 3000,
    });
  },

  formatError: (error) => {
    if (error.response?.data?.errors) {
      return error.response.data.errors.map(err => err.message).join(', ');
    }
    return error.response?.data?.message || error.message || 'An error occurred';
  },

  isNetworkError: (error) => {
    return !error.response && error.request;
  }
};

export default api;
