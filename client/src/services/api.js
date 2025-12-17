import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (credentials) => {
    const response = await api.post('/api/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post('/api/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  verifyToken: async () => {
    const response = await api.post('/api/auth/verify');
    return response.data;
  },
  googleLogin: async (idToken, role) => {
    const response = await api.post('/api/auth/google-login', { idToken, role });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  }
};

export const dashboardAPI = {
  getStats: async () => {
    const response = await api.get('/api/dashboard/stats');
    return response.data;
  },
  getActivities: async () => {
    const response = await api.get('/api/dashboard/activities');
    return response.data;
  },
  getLeaderboard: async () => {
    const response = await api.get('/api/dashboard/leaderboard');
    return response.data;
  }
};

export const studentsAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/api/students', { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/api/students/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/api/students', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/api/students/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/api/students/${id}`);
    return response.data;
  }
};

export const drillsAPI = {
  getAll: async () => {
    const response = await api.get('/api/drills');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/api/drills/${id}`);
    return response.data;
  },
  getStats: async () => {
    const response = await api.get('/api/drills/stats');
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/api/drills', data);
    return response.data;
  },
  start: async (id) => {
    const response = await api.post(`/api/drills/start/${id}`);
    return response.data;
  },
  end: async (id) => {
    const response = await api.post(`/api/drills/end/${id}`);
    return response.data;
  },
  markAttendance: async (drillId, studentId, status) => {
    const response = await api.post(`/api/drills/attendance/${drillId}`, { studentId, status });
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/api/drills/${id}`);
    return response.data;
  }
};

export const modulesAPI = {
  getAll: async () => {
    const response = await api.get('/api/modules');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/api/modules/${id}`);
    return response.data;
  },
  updateProgress: async (moduleId, data) => {
    const response = await api.post(`/api/modules/progress/${moduleId}`, data);
    return response.data;
  }
};

export const alertsAPI = {
  getAll: async () => {
    const response = await api.get('/api/alerts');
    return response.data;
  },
  getActive: async () => {
    const response = await api.get('/api/alerts/active');
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/api/alerts', data);
    return response.data;
  },
  acknowledge: async (id, userId, userName) => {
    const response = await api.post(`/api/alerts/acknowledge/${id}`, { userId, userName });
    return response.data;
  },
  deactivate: async (id) => {
    const response = await api.put(`/api/alerts/deactivate/${id}`);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/api/alerts/${id}`);
    return response.data;
  }
};

export const aiAPI = {
  chat: async (message, conversationHistory = []) => {
    const response = await api.post('/api/ai/chat', { message, conversationHistory });
    return response.data;
  },
  generateQuiz: async (topic, difficulty = 'medium', count = 5) => {
    const response = await api.post('/api/ai/quiz', { topic, difficulty, count });
    return response.data;
  },
  getSafetyTips: async (disasterType) => {
    const response = await api.post('/api/ai/safety-tips', { disasterType });
    return response.data;
  },
  generateDrillScenario: async (drillType, duration, participantCount) => {
    const response = await api.post('/api/ai/drill-scenario', { drillType, duration, participantCount });
    return response.data;
  },
  analyzePreparedness: async (data) => {
    const response = await api.post('/api/ai/analyze-preparedness', data);
    return response.data;
  },
  getEmergencyGuide: async (emergencyType, location = 'school') => {
    const response = await api.post('/api/ai/emergency-guide', { emergencyType, location });
    return response.data;
  }
};

export default api;
