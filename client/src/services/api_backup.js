import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
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

// Dashboard APIs
export const dashboardAPI = {
  // Get dashboard statistics
  getStats: async () => {
    const response = await api.get('/api/dashboard/stats');
    return response.data;
  },

  // Get recent activities
  getRecentActivities: async () => {
    const response = await api.get('/api/dashboard/activities');
    return response.data;
  },

  // Get system status
  getSystemStatus: async () => {
    const response = await api.get('/api/dashboard/status');
    return response.data;
  }
};

// Student APIs
export const studentAPI = {
  // Get all students with pagination and filters
  getStudents: async (params = {}) => {
    const response = await api.get('/api/students', { params });
    return response.data;
  },

  // Get student by ID
  getStudentById: async (id) => {
    const response = await api.get(`/api/students/${id}`);
    return response.data;
  },

  // Create new student
  createStudent: async (studentData) => {
    const response = await api.post('/api/students', studentData);
    return response.data;
  },

  // Update student
  updateStudent: async (id, studentData) => {
    const response = await api.put(`/api/students/${id}`, studentData);
    return response.data;
  },

  // Delete student
  deleteStudent: async (id) => {
    const response = await api.delete(`/api/students/${id}`);
    return response.data;
  },

  // Bulk import students
  importStudents: async (studentsData) => {
    const response = await api.post('/api/students/import', { students: studentsData });
    return response.data;
  },

  // Export students data
  exportStudents: async (format = 'csv') => {
    const response = await api.get(`/api/students/export?format=${format}`, {
      responseType: 'blob'
    });
    return response.data;
  }
};

// Module APIs
export const moduleAPI = {
  // Get all modules
  getModules: async () => {
    const response = await api.get('/api/modules');
    return response.data;
  },

  // Get module by ID
  getModuleById: async (id) => {
    const response = await api.get(`/api/modules/${id}`);
    return response.data;
  },

  // Create new module
  createModule: async (moduleData) => {
    const response = await api.post('/api/modules', moduleData);
    return response.data;
  },

  // Update module
  updateModule: async (id, moduleData) => {
    const response = await api.put(`/api/modules/${id}`, moduleData);
    return response.data;
  },

  // Delete module
  deleteModule: async (id) => {
    const response = await api.delete(`/api/modules/${id}`);
    return response.data;
  },

  // Get student module progress
  getStudentProgress: async (studentId) => {
    const response = await api.get(`/api/modules/progress/${studentId}`);
    return response.data;
  },

  // Update student module progress
  updateStudentProgress: async (studentId, moduleId, progressData) => {
    const response = await api.put(`/api/modules/progress/${studentId}/${moduleId}`, progressData);
    return response.data;
  }
};

// Drill APIs
export const drillAPI = {
  // Get all drills
  getDrills: async (params = {}) => {
    const response = await api.get('/api/drills', { params });
    return response.data;
  },

  // Get drill by ID
  getDrillById: async (id) => {
    const response = await api.get(`/api/drills/${id}`);
    return response.data;
  },

  // Create new drill
  createDrill: async (drillData) => {
    const response = await api.post('/api/drills', drillData);
    return response.data;
  },

  // Update drill
  updateDrill: async (id, drillData) => {
    const response = await api.put(`/api/drills/${id}`, drillData);
    return response.data;
  },

  // Delete drill
  deleteDrill: async (id) => {
    const response = await api.delete(`/api/drills/${id}`);
    return response.data;
  },

  // Start drill
  startDrill: async (id) => {
    const response = await api.post(`/api/drills/${id}/start`);
    return response.data;
  },

  // End drill
  endDrill: async (id, results) => {
    const response = await api.post(`/api/drills/${id}/end`, results);
    return response.data;
  },

  // Get drill statistics
  getDrillStats: async (id) => {
    const response = await api.get(`/api/drills/${id}/stats`);
    return response.data;
  }
};

// Alert APIs
export const alertAPI = {
  // Get all alerts
  getAlerts: async (params = {}) => {
    const response = await api.get('/api/alerts', { params });
    return response.data;
  },

  // Create new alert
  createAlert: async (alertData) => {
    const response = await api.post('/api/alerts', alertData);
    return response.data;
  },

  // Update alert
  updateAlert: async (id, alertData) => {
    const response = await api.put(`/api/alerts/${id}`, alertData);
    return response.data;
  },

  // Delete alert
  deleteAlert: async (id) => {
    const response = await api.delete(`/api/alerts/${id}`);
    return response.data;
  },

  // Mark alert as read
  markAsRead: async (id) => {
    const response = await api.patch(`/api/alerts/${id}/read`);
    return response.data;
  },

  // Broadcast emergency alert
  broadcastEmergency: async (alertData) => {
    const response = await api.post('/api/alerts/emergency', alertData);
    return response.data;
  }
};

// Attendance APIs
export const attendanceAPI = {
  // Get attendance records
  getAttendance: async (params = {}) => {
    const response = await api.get('/api/attendance', { params });
    return response.data;
  },

  // Mark attendance
  markAttendance: async (attendanceData) => {
    const response = await api.post('/api/attendance', attendanceData);
    return response.data;
  },

  // Get attendance statistics
  getAttendanceStats: async (params = {}) => {
    const response = await api.get('/api/attendance/stats', { params });
    return response.data;
  },

  // Generate attendance report
  generateReport: async (params = {}) => {
    const response = await api.get('/api/attendance/report', { 
      params,
      responseType: 'blob'
    });
    return response.data;
  }
};

// Utility functions
export const utils = {
  // Check server connection
  checkConnection: async () => {
    try {
      const response = await api.get('/');
      return { connected: true, data: response.data };
    } catch (error) {
      return { connected: false, error: error.message };
    }
  },

  // Get server health status
  getHealthStatus: async () => {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  },

  // Upload file
  uploadFile: async (file, type = 'general') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    
    const response = await api.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }
};

export default api;
