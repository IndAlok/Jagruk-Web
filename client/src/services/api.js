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

// Request interceptor to add auth token
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

// Response interceptor to handle errors
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

// Authentication API
export const authAPI = {
  login: async (credentials) => {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
  },

  googleLogin: async (idToken) => {
    const response = await api.post('/api/auth/google-login', { idToken });
    return response.data;
  },

  register: async (userData) => {
    const endpoint = userData.role === 'student' ? 'register/student' : 'register/staff';
    const response = await api.post(`/api/auth/${endpoint}`, userData);
    return response.data;
  },

  initDemoUsers: async () => {
    const response = await api.post('/api/auth/init-demo-users');
    return response.data;
  },

  verifyToken: async (token) => {
    const response = await api.post('/api/auth/verify-token', { token });
    return response.data;
  }
};

// Student API
export const studentAPI = {
  getAll: async () => {
    const response = await api.get('/api/students');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/api/students/${id}`);
    return response.data;
  },

  create: async (studentData) => {
    const response = await api.post('/api/students', studentData);
    return response.data;
  },

  update: async (id, studentData) => {
    const response = await api.put(`/api/students/${id}`, studentData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/api/students/${id}`);
    return response.data;
  },

  getAttendance: async (id) => {
    const response = await api.get(`/api/students/${id}/attendance`);
    return response.data;
  },

  markAttendance: async (id, attendanceData) => {
    const response = await api.post(`/api/students/${id}/attendance`, attendanceData);
    return response.data;
  },

  getProgress: async (id) => {
    const response = await api.get(`/api/students/${id}/progress`);
    return response.data;
  }
};

// Staff API
export const staffAPI = {
  getAll: async () => {
    const response = await api.get('/api/staff');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/api/staff/${id}`);
    return response.data;
  },

  create: async (staffData) => {
    const response = await api.post('/api/staff', staffData);
    return response.data;
  },

  update: async (id, staffData) => {
    const response = await api.put(`/api/staff/${id}`, staffData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/api/staff/${id}`);
    return response.data;
  }
};

// Drill API
export const drillAPI = {
  getAll: async () => {
    const response = await api.get('/api/drills');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/api/drills/${id}`);
    return response.data;
  },

  create: async (drillData) => {
    const response = await api.post('/api/drills', drillData);
    return response.data;
  },

  update: async (id, drillData) => {
    const response = await api.put(`/api/drills/${id}`, drillData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/api/drills/${id}`);
    return response.data;
  },

  start: async (id) => {
    const response = await api.post(`/api/drills/${id}/start`);
    return response.data;
  },

  end: async (id) => {
    const response = await api.post(`/api/drills/${id}/end`);
    return response.data;
  },

  getResults: async (id) => {
    const response = await api.get(`/api/drills/${id}/results`);
    return response.data;
  },

  markParticipation: async (drillId, studentId, participationData) => {
    const response = await api.post(`/api/drills/${drillId}/participation/${studentId}`, participationData);
    return response.data;
  }
};

// Notification API
export const notificationAPI = {
  getAll: async () => {
    const response = await api.get('/api/notifications');
    return response.data;
  },

  create: async (notificationData) => {
    const response = await api.post('/api/notifications', notificationData);
    return response.data;
  },

  markAsRead: async (id) => {
    const response = await api.put(`/api/notifications/${id}/read`);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/api/notifications/${id}`);
    return response.data;
  },

  sendBroadcast: async (message, targetRole = 'all') => {
    const response = await api.post('/api/notifications/broadcast', { message, targetRole });
    return response.data;
  }
};

// Alert API (Emergency Alerts)
export const alertAPI = {
  getAll: async () => {
    const response = await api.get('/api/alerts');
    return response.data;
  },

  create: async (alertData) => {
    const response = await api.post('/api/alerts', alertData);
    return response.data;
  },

  update: async (id, alertData) => {
    const response = await api.put(`/api/alerts/${id}`, alertData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/api/alerts/${id}`);
    return response.data;
  },

  broadcast: async (alertData) => {
    const response = await api.post('/api/alerts/broadcast', alertData);
    return response.data;
  }
};

// Dashboard API
export const dashboardAPI = {
  getAdminStats: async () => {
    const response = await api.get('/api/dashboard/admin/stats');
    return response.data;
  },

  getStaffStats: async () => {
    const response = await api.get('/api/dashboard/staff/stats');
    return response.data;
  },

  getStudentStats: async (studentId) => {
    const response = await api.get(`/api/dashboard/student/${studentId}/stats`);
    return response.data;
  },

  getSystemHealth: async () => {
    const response = await api.get('/api/dashboard/system-health');
    return response.data;
  },

  getAnalytics: async (timeRange = '7d') => {
    const response = await api.get(`/api/dashboard/analytics?range=${timeRange}`);
    return response.data;
  }
};

// Attendance API
export const attendanceAPI = {
  getAll: async (filters = {}) => {
    const queryString = new URLSearchParams(filters).toString();
    const response = await api.get(`/api/attendance?${queryString}`);
    return response.data;
  },

  markAttendance: async (attendanceData) => {
    const response = await api.post('/api/attendance', attendanceData);
    return response.data;
  },

  bulkMarkAttendance: async (attendanceArray) => {
    const response = await api.post('/api/attendance/bulk', { attendance: attendanceArray });
    return response.data;
  },

  getStudentAttendance: async (studentId, dateRange = {}) => {
    const queryString = new URLSearchParams(dateRange).toString();
    const response = await api.get(`/api/attendance/student/${studentId}?${queryString}`);
    return response.data;
  },

  getClassAttendance: async (classId, date) => {
    const response = await api.get(`/api/attendance/class/${classId}?date=${date}`);
    return response.data;
  }
};

// Utility functions
export const utils = {
  handleAPIError: (error) => {
    const message = error.response?.data?.message || error.message || 'An error occurred';
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
  }
};

export default api;
