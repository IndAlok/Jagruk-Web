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

// Import routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const studentRoutes = require('./routes/student');
const studentsRoutes = require('./routes/students'); // Add this
const drillRoutes = require('./routes/drills');
const alertRoutes = require('./routes/alerts');
const moduleRoutes = require('./routes/modules');
const attendanceRoutes = require('./routes/attendance');
const dashboardRoutes = require('./routes/dashboard');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Security middleware
app.use(helmet());
app.use(cors());
app.use(generalLimiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path} - ${req.ip}`);
  next();
});

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'JAGRUK - Disaster Management Education System API',
    status: 'Active',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      admin: '/api/admin',
      student: '/api/student',
      students: '/api/students',
      dashboard: '/api/dashboard',
      drills: '/api/drills',
      alerts: '/api/alerts',
      modules: '/api/modules',
      attendance: '/api/attendance'
    },
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/students', studentsRoutes); // Add demo students route
app.use('/api/drills', drillRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/modules', moduleRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Socket.io connection handling
io.on('connection', (socket) => {
  logger.info('New client connected:', socket.id);
  
  // Join room based on school ID
  socket.on('join-school', (schoolId) => {
    socket.join(schoolId);
    logger.info(`Socket ${socket.id} joined school room ${schoolId}`);
  });
  
  // Join class room for class-specific communications
  socket.on('join-class', (classRoom) => {
    socket.join(classRoom);
    logger.info(`Socket ${socket.id} joined class room ${classRoom}`);
  });
  
  // Handle drill alerts
  socket.on('drill-alert', (data) => {
    io.to(data.schoolId).emit('drill-notification', {
      ...data,
      timestamp: new Date().toISOString()
    });
    logger.info(`Drill alert sent to school ${data.schoolId}`);
  });
  
  // Handle emergency alerts
  socket.on('emergency-alert', (data) => {
    io.emit('emergency-broadcast', {
      ...data,
      timestamp: new Date().toISOString()
    });
    logger.warn(`Emergency alert broadcast: ${data.message}`);
  });
  
  // Handle drill attendance updates
  socket.on('drill-attendance', (data) => {
    io.to(data.schoolId).emit('attendance-update', data);
  });
  
  // Handle real-time module progress updates
  socket.on('module-progress', (data) => {
    io.to(data.schoolId).emit('progress-update', data);
  });
  
  socket.on('disconnect', () => {
    logger.info('Client disconnected:', socket.id);
  });
});

// Make io accessible to routes
app.set('socketio', io);

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { error: err.message })
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  console.log(`🚀 Server running on port ${PORT}`);
});