const express = require('express');
const { db } = require('../config/firebase');
const { authenticateToken, authorizeAll } = require('../middleware/auth');
const logger = require('../config/logger');

const router = express.Router();

// Demo endpoints (no authentication required) - add these first
router.get('/demo/stats', (req, res) => {
  const stats = {
    totalStudents: 1250,
    activeDrills: 3,
    systemHealth: 98,
    totalAlerts: 5,
    modulesCompleted: 320,
    attendanceRate: 94.5,
    emergencyReadiness: 87.2,
    staffMembers: 45
  };

  res.json({
    success: true,
    data: stats
  });
});

router.get('/demo/activities', (req, res) => {
  const activities = [
    {
      id: 1,
      type: 'info',
      title: 'System Health Check',
      message: 'System health check completed - All systems operational',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      severity: 'info'
    },
    {
      id: 2,
      type: 'success',
      title: 'Fire Drill Completed',
      message: 'Fire drill completed successfully - 98% participation',
      timestamp: new Date(Date.now() - 75 * 60 * 1000).toISOString(),
      severity: 'success'
    },
    {
      id: 3,
      type: 'warning',
      title: 'Database Backup',
      message: 'Student database backup initiated',
      timestamp: new Date(Date.now() - 105 * 60 * 1000).toISOString(),
      severity: 'warning'
    },
    {
      id: 4,
      type: 'info',
      title: 'New Registrations',
      message: 'New student registration: 3 students added',
      timestamp: new Date(Date.now() - 150 * 60 * 1000).toISOString(),
      severity: 'info'
    }
  ];

  res.json({
    success: true,
    data: activities
  });
});

router.get('/demo/alerts', (req, res) => {
  const alerts = [
    {
      id: 1,
      type: 'Fire Drill',
      message: 'Scheduled fire drill at 2:30 PM today',
      severity: 'warning',
      timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      isActive: true,
      acknowledged: false
    },
    {
      id: 2,
      type: 'Weather Alert',
      message: 'Heavy rain warning issued for next 2 hours',
      severity: 'info',
      timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      isActive: true,
      acknowledged: false
    },
    {
      id: 3,
      type: 'System Update',
      message: 'Emergency response system updated successfully',
      severity: 'success',
      timestamp: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
      isActive: false,
      acknowledged: true
    }
  ];

  res.json({
    success: true,
    data: alerts
  });
});

// Apply authentication to all other routes
router.use(authenticateToken);
router.use(authorizeAll);

// Get comprehensive dashboard data
router.get('/', async (req, res) => {
  try {
    const { uid, schoolId, role } = req.user;
    
    if (role === 'student') {
      // Student dashboard
      const dashboardData = await getStudentDashboard(uid, schoolId);
      res.json(dashboardData);
    } else {
      // Admin/Staff dashboard
      const dashboardData = await getAdminDashboard(schoolId);
      res.json(dashboardData);
    }

  } catch (error) {
    logger.error('Get dashboard data error:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard data' });
  }
});

// Get real-time statistics
router.get('/stats/realtime', async (req, res) => {
  try {
    const { schoolId, role } = req.user;
    
    if (role !== 'admin' && role !== 'staff') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Get current active drills
    const activeDrillsSnapshot = await db.collection('drills')
      .where('schoolId', '==', schoolId)
      .where('status', '==', 'active')
      .get();
    
    const activeDrills = activeDrillsSnapshot.docs.map(doc => {
      const data = doc.data();
      const attendanceCount = Object.values(data.attendance || {}).filter(Boolean).length;
      const totalParticipants = data.participants.length;
      const currentRate = totalParticipants > 0 ? 
        ((attendanceCount / totalParticipants) * 100).toFixed(1) : 0;
      
      return {
        id: doc.id,
        title: data.title,
        type: data.type,
        startedAt: data.startedAt,
        attendanceCount,
        totalParticipants,
        currentAttendanceRate: currentRate
      };
    });
    
    // Get active alerts count
    const activeAlertsSnapshot = await db.collection('alerts')
      .where('schoolId', '==', schoolId)
      .where('isActive', '==', true)
      .get();
    
    const activeAlertsCount = activeAlertsSnapshot.size;
    
    // Get recent activity
    const recentActivitySnapshot = await db.collection('attendanceRecords')
      .where('schoolId', '==', schoolId)
      .where('markedAt', '>=', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .orderBy('markedAt', 'desc')
      .limit(10)
      .get();
    
    const recentActivity = [];
    for (const doc of recentActivitySnapshot.docs) {
      const record = doc.data();
      const studentDoc = await db.collection('students').doc(record.studentId).get();
      const drillDoc = await db.collection('drills').doc(record.drillId).get();
      
      recentActivity.push({
        id: doc.id,
        studentName: studentDoc.exists ? studentDoc.data().name : 'Unknown',
        drillTitle: drillDoc.exists ? drillDoc.data().title : 'Unknown',
        timestamp: record.markedAt
      });
    }
    
    res.json({
      activeDrills,
      activeAlertsCount,
      recentActivity,
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Get realtime stats error:', error);
    res.status(500).json({ message: 'Failed to fetch realtime statistics' });
  }
});

// Get analytics data
router.get('/analytics', async (req, res) => {
  try {
    const { schoolId, role } = req.user;
    const { period = '30', type = 'overview' } = req.query;
    
    if (role !== 'admin' && role !== 'staff') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const startDate = new Date(Date.now() - parseInt(period) * 24 * 60 * 60 * 1000).toISOString();
    
    let analyticsData = {};
    
    switch (type) {
      case 'attendance':
        analyticsData = await getAttendanceAnalytics(schoolId, startDate);
        break;
      case 'modules':
        analyticsData = await getModuleAnalytics(schoolId, startDate);
        break;
      case 'drills':
        analyticsData = await getDrillAnalytics(schoolId, startDate);
        break;
      case 'alerts':
        analyticsData = await getAlertAnalytics(schoolId, startDate);
        break;
      default:
        analyticsData = await getOverviewAnalytics(schoolId, startDate);
    }
    
    res.json(analyticsData);

  } catch (error) {
    logger.error('Get analytics data error:', error);
    res.status(500).json({ message: 'Failed to fetch analytics data' });
  }
});

// Helper functions
async function getStudentDashboard(studentId, schoolId) {
  try {
    const studentDoc = await db.collection('students').doc(studentId).get();
    const studentData = studentDoc.data();
    
    // Get upcoming drills
    const now = new Date().toISOString();
    const upcomingDrillsSnapshot = await db.collection('drills')
      .where('schoolId', '==', schoolId)
      .where('participants', 'array-contains', studentId)
      .where('status', 'in', ['scheduled', 'active'])
      .where('scheduledDate', '>=', now)
      .orderBy('scheduledDate')
      .limit(5)
      .get();
    
    const upcomingDrills = upcomingDrillsSnapshot.docs.map(doc => ({
      id: doc.id,
      title: doc.data().title,
      type: doc.data().type,
      scheduledDate: doc.data().scheduledDate,
      status: doc.data().status
    }));
    
    // Get recent alerts
    const recentAlertsSnapshot = await db.collection('alerts')
      .where('schoolId', '==', schoolId)
      .where('isActive', '==', true)
      .orderBy('createdAt', 'desc')
      .limit(5)
      .get();
    
    const recentAlerts = recentAlertsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Get module progress
    const moduleProgress = studentData.moduleProgress || {};
    const completedModules = Object.values(moduleProgress).filter(p => p.completed).length;
    
    // Get all modules for completion rate
    const modulesSnapshot = await db.collection('modules').where('isActive', '==', true).get();
    const totalModules = modulesSnapshot.size;
    const completionRate = totalModules > 0 ? ((completedModules / totalModules) * 100).toFixed(1) : 0;
    
    // Get recommended modules
    const recommendedModules = await getRecommendedModules(studentId, moduleProgress);
    
    return {
      student: {
        name: studentData.name,
        class: studentData.class,
        admissionNumber: studentData.admissionNumber
      },
      stats: {
        completedModules,
        totalModules,
        completionRate,
        drillsAttended: studentData.drillsAttended || 0
      },
      upcomingDrills,
      recentAlerts,
      recommendedModules,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    throw error;
  }
}

async function getAdminDashboard(schoolId) {
  try {
    // Get basic counts
    const [studentsSnapshot, staffSnapshot, drillsSnapshot, alertsSnapshot] = await Promise.all([
      db.collection('students').where('schoolId', '==', schoolId).where('isActive', '==', true).get(),
      db.collection('staff').where('schoolId', '==', schoolId).where('isActive', '==', true).get(),
      db.collection('drills').where('schoolId', '==', schoolId).get(),
      db.collection('alerts').where('schoolId', '==', schoolId).where('isActive', '==', true).get()
    ]);
    
    const totalStudents = studentsSnapshot.size;
    const totalStaff = staffSnapshot.size;
    const totalDrills = drillsSnapshot.size;
    const activeAlerts = alertsSnapshot.size;
    
    // Calculate average attendance
    const completedDrills = drillsSnapshot.docs.filter(doc => doc.data().status === 'completed');
    const avgAttendance = completedDrills.length > 0 ? 
      completedDrills.reduce((sum, doc) => sum + (doc.data().completionRate || 0), 0) / completedDrills.length :
      0;
    
    // Get students by class distribution
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
    
    // Get recent activity
    const recentActivitySnapshot = await db.collection('attendanceRecords')
      .where('schoolId', '==', schoolId)
      .where('markedAt', '>=', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .orderBy('markedAt', 'desc')
      .limit(10)
      .get();
    
    const recentActivity = [];
    for (const doc of recentActivitySnapshot.docs) {
      const record = doc.data();
      const studentDoc = await db.collection('students').doc(record.studentId).get();
      
      recentActivity.push({
        id: doc.id,
        studentName: studentDoc.exists ? studentDoc.data().name : 'Unknown',
        action: 'marked_attendance',
        timestamp: record.markedAt
      });
    }
    
    return {
      stats: {
        totalStudents,
        totalStaff,
        totalDrills,
        activeAlerts,
        avgAttendance: avgAttendance.toFixed(1)
      },
      distributions: {
        studentsByClass
      },
      recentDrills,
      recentActivity,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    throw error;
  }
}

async function getRecommendedModules(studentId, moduleProgress) {
  try {
    const modulesSnapshot = await db.collection('modules').where('isActive', '==', true).get();
    const allModules = modulesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Find incomplete modules
    const incompleteModules = allModules.filter(module => 
      !moduleProgress[module.id] || !moduleProgress[module.id].completed
    );
    
    return incompleteModules.slice(0, 3);
  } catch (error) {
    return [];
  }
}

async function getOverviewAnalytics(schoolId, startDate) {
  // Implementation for overview analytics
  return {
    type: 'overview',
    period: 'last_30_days',
    data: {
      totalActivities: 0,
      completionTrend: [],
      categoryDistribution: {}
    }
  };
}

async function getAttendanceAnalytics(schoolId, startDate) {
  // Implementation for attendance analytics
  return {
    type: 'attendance',
    period: startDate,
    data: {
      attendanceTrend: [],
      classWiseAttendance: {},
      drillTypeAttendance: {}
    }
  };
}

async function getModuleAnalytics(schoolId, startDate) {
  // Implementation for module analytics
  return {
    type: 'modules',
    period: startDate,
    data: {
      completionTrend: [],
      popularModules: [],
      difficultyDistribution: {}
    }
  };
}

async function getDrillAnalytics(schoolId, startDate) {
  // Implementation for drill analytics
  return {
    type: 'drills',
    period: startDate,
    data: {
      drillFrequency: [],
      typeDistribution: {},
      effectivenessScores: {}
    }
  };
}

async function getAlertAnalytics(schoolId, startDate) {
  // Implementation for alert analytics
  return {
    type: 'alerts',
    period: startDate,
    data: {
      alertFrequency: [],
      priorityDistribution: {},
      responseTime: {}
    }
  };
}

module.exports = router;
