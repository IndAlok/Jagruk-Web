const express = require('express');
const { db } = require('../config/firebase');
const { authenticateToken } = require('../middleware/auth');
const logger = require('../config/logger');

const router = express.Router();

router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const [studentsSnap, staffSnap, drillsSnap, alertsSnap, modulesSnap] = await Promise.all([
      db.collection('students').get(),
      db.collection('staff').get(),
      db.collection('drills').get(),
      db.collection('alerts').where('isActive', '==', true).get(),
      db.collection('modules').get()
    ]);

    let completedDrills = 0;
    let scheduledDrills = 0;
    let totalAttendance = 0;
    let drillCount = 0;

    drillsSnap.forEach(doc => {
      const drill = doc.data();
      if (drill.status === 'completed') {
        completedDrills++;
        totalAttendance += drill.participantCount || 0;
        drillCount++;
      } else if (drill.status === 'scheduled') {
        scheduledDrills++;
      }
    });

    const avgAttendance = drillCount > 0 ? Math.round(totalAttendance / drillCount) : 0;

    let totalProgress = 0;
    let studentCount = 0;
    studentsSnap.forEach(doc => {
      const student = doc.data();
      const progress = student.moduleProgress || {};
      const completedModules = Object.values(progress).filter(p => p.completed).length;
      totalProgress += (completedModules / Math.max(modulesSnap.size, 1)) * 100;
      studentCount++;
    });

    const avgModuleCompletion = studentCount > 0 ? Math.round(totalProgress / studentCount) : 0;

    res.json({
      success: true,
      stats: {
        totalStudents: studentsSnap.size,
        totalStaff: staffSnap.size,
        totalDrills: drillsSnap.size,
        completedDrills,
        scheduledDrills,
        activeAlerts: alertsSnap.size,
        totalModules: modulesSnap.size,
        avgDrillAttendance: avgAttendance,
        avgModuleCompletion,
        systemHealth: 98,
        lastUpdated: new Date().toISOString()
      }
    });

  } catch (error) {
    logger.error('Get dashboard stats error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch stats' });
  }
});

router.get('/activities', authenticateToken, async (req, res) => {
  try {
    const activities = [];
    
    const drillsSnap = await db.collection('drills')
      .orderBy('createdAt', 'desc')
      .limit(5)
      .get();
    
    drillsSnap.forEach(doc => {
      const drill = doc.data();
      activities.push({
        id: doc.id,
        type: 'drill',
        title: drill.title,
        message: `Drill ${drill.status}: ${drill.title}`,
        timestamp: drill.createdAt,
        severity: drill.status === 'completed' ? 'success' : 'info'
      });
    });

    const alertsSnap = await db.collection('alerts')
      .orderBy('createdAt', 'desc')
      .limit(5)
      .get();
    
    alertsSnap.forEach(doc => {
      const alert = doc.data();
      activities.push({
        id: doc.id,
        type: 'alert',
        title: alert.title,
        message: alert.message,
        timestamp: alert.createdAt,
        severity: alert.priority === 'high' ? 'warning' : 'info'
      });
    });

    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json({
      success: true,
      activities: activities.slice(0, 10)
    });

  } catch (error) {
    logger.error('Get activities error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch activities' });
  }
});

router.get('/upcoming-drills', authenticateToken, async (req, res) => {
  try {
    const now = new Date().toISOString();
    
    const snapshot = await db.collection('drills')
      .where('status', '==', 'scheduled')
      .orderBy('scheduledDate', 'asc')
      .limit(5)
      .get();
    
    let drills = [];
    snapshot.forEach(doc => {
      drills.push({ id: doc.id, ...doc.data() });
    });

    res.json({ success: true, data: drills });

  } catch (error) {
    logger.error('Get upcoming drills error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch upcoming drills' });
  }
});

router.get('/student/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const studentDoc = await db.collection('students').doc(id).get();
    
    if (!studentDoc.exists) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const student = studentDoc.data();
    const moduleProgress = student.moduleProgress || {};

    const modulesSnap = await db.collection('modules').get();
    let completedModules = 0;
    let totalPoints = 0;

    modulesSnap.forEach(doc => {
      if (moduleProgress[doc.id]?.completed) {
        completedModules++;
        totalPoints += doc.data().points || 0;
      }
    });

    res.json({
      success: true,
      data: {
        drillsAttended: student.drillsAttended || 0,
        modulesCompleted: completedModules,
        totalModules: modulesSnap.size,
        totalPoints: student.totalPoints || 0,
        rank: 1,
        recentActivity: []
      }
    });

  } catch (error) {
    logger.error('Get student dashboard error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch student dashboard' });
  }
});

router.get('/leaderboard', authenticateToken, async (req, res) => {
  try {
    const snapshot = await db.collection('students').orderBy('totalPoints', 'desc').limit(10).get();
    
    let leaderboard = [];
    let rank = 1;
    
    snapshot.forEach(doc => {
      const student = doc.data();
      leaderboard.push({
        rank: rank++,
        id: doc.id,
        name: student.name,
        points: student.totalPoints || 0,
        class: student.class,
        drillsAttended: student.drillsAttended || 0
      });
    });

    res.json({ success: true, data: leaderboard });

  } catch (error) {
    logger.error('Get leaderboard error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch leaderboard' });
  }
});

module.exports = router;
