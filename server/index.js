const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const logger = require('./config/logger');
const { generalLimiter } = require('./middleware/rateLimiter');

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const studentsRoutes = require('./routes/students');
const drillRoutes = require('./routes/drills');
const alertRoutes = require('./routes/alerts');
const moduleRoutes = require('./routes/modules');
const attendanceRoutes = require('./routes/attendance');
const dashboardRoutes = require('./routes/dashboard');
const settingsRoutes = require('./routes/settings');
const aiRoutes = require('./routes/ai');

const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:3000',
  'https://*.vercel.app',
  'http://localhost:3000'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    const isAllowed = allowedOrigins.some(allowed => {
      if (allowed.includes('*')) {
        const pattern = new RegExp('^' + allowed.replace('*', '.*') + '$');
        return pattern.test(origin);
      }
      return allowed === origin;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors(corsOptions));
app.use(generalLimiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'JAGRUK - Disaster Management Education System API',
    status: 'Active',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      admin: '/api/admin',
      students: '/api/students',
      dashboard: '/api/dashboard',
      drills: '/api/drills',
      alerts: '/api/alerts',
      modules: '/api/modules',
      attendance: '/api/attendance',
      ai: '/api/ai'
    },
    timestamp: new Date().toISOString()
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/students', studentsRoutes);
app.use('/api/drills', drillRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/modules', moduleRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/ai', aiRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

if (process.env.NODE_ENV !== 'production') {
  const logsDir = path.join(__dirname, 'logs');
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
  
  const server = http.createServer(app);
  const io = socketIo(server, {
    cors: corsOptions
  });

  io.on('connection', (socket) => {
    socket.on('join-school', (schoolId) => {
      socket.join(schoolId);
    });
    
    socket.on('join-class', (classRoom) => {
      socket.join(classRoom);
    });
    
    socket.on('drill-alert', (data) => {
      io.to(data.schoolId).emit('drill-notification', {
        ...data,
        timestamp: new Date().toISOString()
      });
    });
    
    socket.on('emergency-alert', (data) => {
      io.emit('emergency-broadcast', {
        ...data,
        timestamp: new Date().toISOString()
      });
    });
    
    socket.on('drill-attendance', (data) => {
      io.to(data.schoolId).emit('attendance-update', data);
    });
    
    socket.on('module-progress', (data) => {
      io.to(data.schoolId).emit('progress-update', data);
    });
  });

  app.set('socketio', io);

  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
}

module.exports = app;