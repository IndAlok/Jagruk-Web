const express = require('express');
const router = express.Router();
const { db, admin } = require('../config/firebase');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');
const { validateDrillSchedule, validateAlert } = require('../middleware/validation');
const logger = require('../config/logger');

// Get admin dashboard stats
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    // For demo admin, return mock stats
    if (req.user.userId && req.user.userId.startsWith('demo_')) {
      const mockStats = {
        totalStudents: 1250,
        totalStaff: 85,
        activeUsers: 342,
        completedDrills: 15,
        pendingDrills: 3,
        totalAlerts: 8,
        unreadAlerts: 2,
        moduleCompletion: 78.5,
        emergencyPreparedness: 85.2,
        recentActivities: [
          {
            id: 1,
            type: 'drill',
            title: 'Fire Drill Completed',
            description: 'Building A fire drill completed successfully',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            status: 'completed'
          },
          {
            id: 2,
            type: 'alert',
            title: 'Weather Alert',
            description: 'Severe weather warning issued',
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
            status: 'active'
          },
          {
            id: 3,
            type: 'user',
            title: 'New Staff Registration',
            description: '3 new staff members joined',
            timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
            status: 'completed'
          }
        ]
      };

      return res.json({
        success: true,
        data: mockStats
      });
    }

    // Real implementation for actual admins
    const [studentsSnapshot, staffSnapshot, drillsSnapshot, alertsSnapshot] = await Promise.all([
      db.collection('students').get(),
      db.collection('staff').get(),
      db.collection('drills').get(),
      db.collection('alerts').get()
    ]);

    const stats = {
      totalStudents: studentsSnapshot.size,
      totalStaff: staffSnapshot.size,
      activeUsers: studentsSnapshot.docs.filter(doc => doc.data().status === 'active').length,
      completedDrills: drillsSnapshot.docs.filter(doc => doc.data().status === 'completed').length,
      pendingDrills: drillsSnapshot.docs.filter(doc => doc.data().status === 'scheduled').length,
      totalAlerts: alertsSnapshot.size,
      unreadAlerts: alertsSnapshot.docs.filter(doc => !doc.data().read).length,
      recentActivities: []
    };

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    logger.error('Get admin stats error', { error: error.message });
    res.status(500).json({ message: 'Failed to fetch dashboard stats' });
  }
});

// Demo students endpoint for testing - add before authentication middleware
router.get('/demo/students', async (req, res) => {
  try {
    const demoStudents = [
      { 
        id: 1, 
        admissionNumber: 'ADM001', 
        class: 10, 
        name: 'Rahul Sharma', 
        modulesCompleted: 8, 
        age: 16,
        email: 'rahul@demo.edu',
        isActive: true,
        drillsAttended: 5
      },
      { 
        id: 2, 
        admissionNumber: 'ADM002', 
        class: 9, 
        name: 'Priya Patel', 
        modulesCompleted: 6, 
        age: 15,
        email: 'priya@demo.edu',
        isActive: true,
        drillsAttended: 4
      },
      { 
        id: 3, 
        admissionNumber: 'ADM003', 
        class: 11, 
        name: 'Amit Kumar', 
        modulesCompleted: 12, 
        age: 17,
        email: 'amit@demo.edu',
        isActive: true,
        drillsAttended: 8
      },
      { 
        id: 4, 
        admissionNumber: 'ADM004', 
        class: 10, 
        name: 'Sneha Reddy', 
        modulesCompleted: 9, 
        age: 16,
        email: 'sneha@demo.edu',
        isActive: true,
        drillsAttended: 6
      },
      { 
        id: 5, 
        admissionNumber: 'ADM005', 
        class: 12, 
        name: 'Vikram Singh', 
        modulesCompleted: 15, 
        age: 18,
        email: 'vikram@demo.edu',
        isActive: true,
        drillsAttended: 10
      }
    ];

    res.status(200).json({
      success: true,
      data: {
        students: demoStudents,
        total: demoStudents.length,
        currentPage: 1,
        totalPages: 1
      }
    });
  } catch (error) {
    logger.error('Demo students error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch demo students' });
  }
});

// Apply authentication to all admin routes
router.use(authenticateToken);
router.use(authorizeAdmin);

// Get all students in the school
router.get('/students', async (req, res) => {
  try {
    const { schoolId } = req.user;
    const { class: filterClass, page = 1, limit = 10, search = '' } = req.query;
    
    let query = db.collection('students').where('schoolId', '==', schoolId);
    
    if (filterClass) {
      query = query.where('class', '==', parseInt(filterClass));
    }
    
    const studentsSnapshot = await query.get();
    let students = studentsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        admissionNumber: data.admissionNumber,
        name: data.name,
        class: data.class,
        age: data.age,
        email: data.email,
        parentContact: data.parentContact,
        moduleProgress: data.moduleProgress || {},
        drillsAttended: data.drillsAttended || 0,
        isActive: data.isActive,
        lastLogin: data.lastLogin,
        createdAt: data.createdAt
      };
    });

    // Apply search filter
    if (search) {
      students = students.filter(student => 
        student.name.toLowerCase().includes(search.toLowerCase()) ||
        student.admissionNumber.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedStudents = students.slice(startIndex, endIndex);

    res.json({
      students: paginatedStudents,
      total: students.length,
      page: parseInt(page),
      totalPages: Math.ceil(students.length / limit)
    });

  } catch (error) {
    logger.error('Get students error:', error);
    res.status(500).json({ message: 'Failed to fetch students' });
  }
});

// Get student details by ID
router.get('/students/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    const { schoolId } = req.user;

    const studentDoc = await db.collection('students').doc(studentId).get();
    
    if (!studentDoc.exists) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const studentData = studentDoc.data();
    
    // Verify student belongs to same school
    if (studentData.schoolId !== schoolId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Get detailed drill attendance
    const drillsSnapshot = await db.collection('drills')
      .where('schoolId', '==', schoolId)
      .where('participants', 'array-contains', studentId)
      .get();

    const drillsAttended = drillsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        type: data.type,
        date: data.scheduledDate,
        attended: data.attendance && data.attendance[studentId]
      };
    });

    // Get module progress details
    const modulesSnapshot = await db.collection('modules').get();
    const allModules = modulesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    const detailedProgress = allModules.map(module => ({
      id: module.id,
      title: module.title,
      category: module.category,
      difficulty: module.difficulty,
      completed: studentData.moduleProgress && studentData.moduleProgress[module.id] ? 
        studentData.moduleProgress[module.id].completed : false,
      completedAt: studentData.moduleProgress && studentData.moduleProgress[module.id] ? 
        studentData.moduleProgress[module.id].completedAt : null,
      score: studentData.moduleProgress && studentData.moduleProgress[module.id] ? 
        studentData.moduleProgress[module.id].score : null
    }));

    res.json({
      ...studentData,
      id: studentId,
      drillsAttended,
      moduleProgress: detailedProgress
    });

  } catch (error) {
    logger.error('Get student details error:', error);
    res.status(500).json({ message: 'Failed to fetch student details' });
  }
});

// Update student status
router.patch('/students/:studentId/status', async (req, res) => {
  try {
    const { studentId } = req.params;
    const { isActive } = req.body;
    const { schoolId } = req.user;

    const studentDoc = await db.collection('students').doc(studentId).get();
    
    if (!studentDoc.exists) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const studentData = studentDoc.data();
    
    if (studentData.schoolId !== schoolId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await db.collection('students').doc(studentId).update({
      isActive,
      updatedAt: new Date().toISOString()
    });

    logger.info(`Student ${studentId} status updated to ${isActive ? 'active' : 'inactive'}`);
    res.json({ message: 'Student status updated successfully' });

  } catch (error) {
    logger.error('Update student status error:', error);
    res.status(500).json({ message: 'Failed to update student status' });
  }
});

// Schedule a drill
router.post('/drills', validateDrillSchedule, async (req, res) => {
  try {
    const {
      title,
      description,
      type,
      scheduledDate,
      classes,
      duration,
      instructions
    } = req.body;
    
    const { schoolId, uid: createdBy } = req.user;

    // Get all students from specified classes
    const studentsSnapshot = await db.collection('students')
      .where('schoolId', '==', schoolId)
      .where('class', 'in', classes)
      .where('isActive', '==', true)
      .get();

    const participants = studentsSnapshot.docs.map(doc => doc.id);

    const drillData = {
      title,
      description,
      type,
      scheduledDate,
      classes,
      duration: duration || 30,
      instructions: instructions || [],
      schoolId,
      createdBy,
      participants,
      status: 'scheduled',
      attendance: {},
      completionRate: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const drillRef = await db.collection('drills').add(drillData);

    // Send real-time notification
    const io = req.app.get('socketio');
    io.to(schoolId).emit('drill-scheduled', {
      drillId: drillRef.id,
      title,
      type,
      scheduledDate,
      classes
    });

    logger.info(`Drill scheduled: ${title} for school ${schoolId}`);
    res.status(201).json({
      message: 'Drill scheduled successfully',
      drillId: drillRef.id
    });

  } catch (error) {
    logger.error('Schedule drill error:', error);
    res.status(500).json({ message: 'Failed to schedule drill' });
  }
});

// Get all drills for the school
router.get('/drills', async (req, res) => {
  try {
    const { schoolId } = req.user;
    const { status, type, page = 1, limit = 10 } = req.query;

    let query = db.collection('drills').where('schoolId', '==', schoolId);
    
    if (status) {
      query = query.where('status', '==', status);
    }
    
    if (type) {
      query = query.where('type', '==', type);
    }

    const drillsSnapshot = await query.orderBy('scheduledDate', 'desc').get();
    
    const drills = drillsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedDrills = drills.slice(startIndex, endIndex);

    res.json({
      drills: paginatedDrills,
      total: drills.length,
      page: parseInt(page),
      totalPages: Math.ceil(drills.length / limit)
    });

  } catch (error) {
    logger.error('Get drills error:', error);
    res.status(500).json({ message: 'Failed to fetch drills' });
  }
});

// Start a drill
router.patch('/drills/:drillId/start', async (req, res) => {
  try {
    const { drillId } = req.params;
    const { schoolId } = req.user;

    const drillDoc = await db.collection('drills').doc(drillId).get();
    
    if (!drillDoc.exists) {
      return res.status(404).json({ message: 'Drill not found' });
    }

    const drillData = drillDoc.data();
    
    if (drillData.schoolId !== schoolId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await db.collection('drills').doc(drillId).update({
      status: 'active',
      startedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    // Send real-time notification
    const io = req.app.get('socketio');
    io.to(schoolId).emit('drill-started', {
      drillId,
      title: drillData.title,
      type: drillData.type
    });

    logger.info(`Drill started: ${drillId} for school ${schoolId}`);
    res.json({ message: 'Drill started successfully' });

  } catch (error) {
    logger.error('Start drill error:', error);
    res.status(500).json({ message: 'Failed to start drill' });
  }
});

// End a drill
router.patch('/drills/:drillId/end', async (req, res) => {
  try {
    const { drillId } = req.params;
    const { schoolId } = req.user;

    const drillDoc = await db.collection('drills').doc(drillId).get();
    
    if (!drillDoc.exists) {
      return res.status(404).json({ message: 'Drill not found' });
    }

    const drillData = drillDoc.data();
    
    if (drillData.schoolId !== schoolId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Calculate completion rate
    const totalParticipants = drillData.participants.length;
    const attendedCount = Object.values(drillData.attendance || {}).filter(Boolean).length;
    const completionRate = totalParticipants > 0 ? (attendedCount / totalParticipants) * 100 : 0;

    await db.collection('drills').doc(drillId).update({
      status: 'completed',
      completedAt: new Date().toISOString(),
      completionRate,
      updatedAt: new Date().toISOString()
    });

    // Update student drill counts
    const attendedStudents = Object.entries(drillData.attendance || {})
      .filter(([_, attended]) => attended)
      .map(([studentId, _]) => studentId);

    const batch = db.batch();
    attendedStudents.forEach(studentId => {
      const studentRef = db.collection('students').doc(studentId);
      batch.update(studentRef, {
        drillsAttended: (db.FieldValue || require('firebase-admin').firestore.FieldValue).increment(1)
      });
    });
    await batch.commit();

    logger.info(`Drill completed: ${drillId} with ${completionRate.toFixed(1)}% completion rate`);
    res.json({ 
      message: 'Drill completed successfully',
      completionRate: completionRate.toFixed(1)
    });

  } catch (error) {
    logger.error('End drill error:', error);
    res.status(500).json({ message: 'Failed to end drill' });
  }
});

// Send alert
router.post('/alerts', validateAlert, async (req, res) => {
  try {
    const {
      title,
      message,
      type,
      priority,
      targetClasses,
      expiresAt
    } = req.body;
    
    const { schoolId, uid: createdBy } = req.user;

    const alertData = {
      title,
      message,
      type,
      priority,
      targetClasses: targetClasses || [],
      schoolId,
      createdBy,
      isActive: true,
      expiresAt: expiresAt || null,
      createdAt: new Date().toISOString()
    };

    const alertRef = await db.collection('alerts').add(alertData);

    // Send real-time notification
    const io = req.app.get('socketio');
    if (priority === 'critical') {
      io.emit('emergency-alert', alertData);
    } else {
      io.to(schoolId).emit('school-alert', {
        ...alertData,
        id: alertRef.id
      });
    }

    logger.info(`Alert sent: ${type} - ${priority} for school ${schoolId}`);
    res.status(201).json({
      message: 'Alert sent successfully',
      alertId: alertRef.id
    });

  } catch (error) {
    logger.error('Send alert error:', error);
    res.status(500).json({ message: 'Failed to send alert' });
  }
});

// Get school dashboard statistics
router.get('/dashboard/stats', async (req, res) => {
  try {
    const { schoolId } = req.user;

    // Get total students
    const studentsSnapshot = await db.collection('students')
      .where('schoolId', '==', schoolId)
      .where('isActive', '==', true)
      .get();
    
    const totalStudents = studentsSnapshot.size;

    // Get total drills
    const drillsSnapshot = await db.collection('drills')
      .where('schoolId', '==', schoolId)
      .get();
    
    const totalDrills = drillsSnapshot.size;

    // Get active alerts
    const alertsSnapshot = await db.collection('alerts')
      .where('schoolId', '==', schoolId)
      .where('isActive', '==', true)
      .get();
    
    const activeAlerts = alertsSnapshot.size;

    // Calculate average drill attendance
    const completedDrills = drillsSnapshot.docs.filter(doc => 
      doc.data().status === 'completed'
    );
    
    const avgAttendance = completedDrills.length > 0 ? 
      completedDrills.reduce((sum, doc) => sum + (doc.data().completionRate || 0), 0) / completedDrills.length :
      0;

    // Get students by class
    const studentsByClass = {};
    studentsSnapshot.docs.forEach(doc => {
      const studentClass = doc.data().class;
      studentsByClass[studentClass] = (studentsByClass[studentClass] || 0) + 1;
    });

    // Get recent drills
    const recentDrills = drillsSnapshot.docs
      .sort((a, b) => new Date(b.data().scheduledDate) - new Date(a.data().scheduledDate))
      .slice(0, 5)
      .map(doc => ({
        id: doc.id,
        title: doc.data().title,
        type: doc.data().type,
        status: doc.data().status,
        scheduledDate: doc.data().scheduledDate,
        completionRate: doc.data().completionRate
      }));

    res.json({
      totalStudents,
      totalDrills,
      activeAlerts,
      avgAttendance: avgAttendance.toFixed(1),
      studentsByClass,
      recentDrills
    });

  } catch (error) {
    logger.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard statistics' });
  }
});

// Get attendance report
router.get('/reports/attendance', async (req, res) => {
  try {
    const { schoolId } = req.user;
    const { startDate, endDate, class: filterClass, type } = req.query;

    let query = db.collection('drills')
      .where('schoolId', '==', schoolId)
      .where('status', '==', 'completed');

    if (startDate) {
      query = query.where('scheduledDate', '>=', startDate);
    }
    
    if (endDate) {
      query = query.where('scheduledDate', '<=', endDate);
    }

    const drillsSnapshot = await query.get();
    const drills = drillsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Filter by type if specified
    const filteredDrills = type ? drills.filter(drill => drill.type === type) : drills;

    // Get students for class filter
    let students = [];
    if (filterClass) {
      const studentsSnapshot = await db.collection('students')
        .where('schoolId', '==', schoolId)
        .where('class', '==', parseInt(filterClass))
        .get();
      
      students = studentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    }

    // Generate attendance report
    const report = filteredDrills.map(drill => {
      const participants = filterClass ? 
        drill.participants.filter(id => students.find(s => s.id === id)) :
        drill.participants;
      
      const attendedCount = participants.filter(id => drill.attendance[id]).length;
      
      return {
        drillId: drill.id,
        title: drill.title,
        type: drill.type,
        date: drill.scheduledDate,
        totalParticipants: participants.length,
        attended: attendedCount,
        completionRate: participants.length > 0 ? 
          ((attendedCount / participants.length) * 100).toFixed(1) : '0'
      };
    });

    res.json({ report });

  } catch (error) {
    logger.error('Get attendance report error:', error);
    res.status(500).json({ message: 'Failed to generate attendance report' });
  }
});

module.exports = router;
