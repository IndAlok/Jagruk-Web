const express = require('express');
const { db } = require('../config/firebase');
const { authenticateToken, authorizeStudent } = require('../middleware/auth');
const logger = require('../config/logger');

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);
router.use(authorizeStudent);

// Get student dashboard data
router.get('/dashboard', async (req, res) => {
  try {
    const { uid: studentId, schoolId } = req.user;
    
    // Get student data
    const studentDoc = await db.collection('students').doc(studentId).get();
    if (!studentDoc.exists) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    const studentData = studentDoc.data();
    
    // Get upcoming drills
    const now = new Date().toISOString();
    const upcomingDrillsSnapshot = await db.collection('drills')
      .where('schoolId', '==', schoolId)
      .where('participants', 'array-contains', studentId)
      .where('status', 'in', ['scheduled', 'active'])
      .where('scheduledDate', '>=', now)
      .orderBy('scheduledDate')
      .limit(3)
      .get();
    
    const upcomingDrills = upcomingDrillsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        type: data.type,
        scheduledDate: data.scheduledDate,
        status: data.status
      };
    });
    
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
    
    // Get available modules
    const modulesSnapshot = await db.collection('modules')
      .where('isActive', '==', true)
      .get();
    
    const modules = modulesSnapshot.docs.map(doc => {
      const moduleData = doc.data();
      const progress = studentData.moduleProgress?.[doc.id] || { completed: false };
      
      return {
        id: doc.id,
        title: moduleData.title,
        category: moduleData.category,
        difficulty: moduleData.difficulty,
        estimatedDuration: moduleData.estimatedDuration,
        completed: progress.completed,
        score: progress.score
      };
    });
    
    // Calculate statistics
    const completedModules = Object.values(studentData.moduleProgress || {}).filter(p => p.completed).length;
    const totalModules = modules.length;
    const completionRate = totalModules > 0 ? ((completedModules / totalModules) * 100).toFixed(1) : 0;
    
    res.json({
      student: {
        name: studentData.name,
        class: studentData.class,
        admissionNumber: studentData.admissionNumber,
        drillsAttended: studentData.drillsAttended || 0
      },
      stats: {
        completedModules,
        totalModules,
        completionRate,
        drillsAttended: studentData.drillsAttended || 0
      },
      upcomingDrills,
      recentAlerts,
      availableModules: modules.filter(m => !m.completed).slice(0, 6)
    });

  } catch (error) {
    logger.error('Get student dashboard error:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard data' });
  }
});

// Get student's module progress
router.get('/modules/progress', async (req, res) => {
  try {
    const { uid: studentId } = req.user;
    
    const studentDoc = await db.collection('students').doc(studentId).get();
    if (!studentDoc.exists) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    const studentData = studentDoc.data();
    const moduleProgress = studentData.moduleProgress || {};
    
    // Get all modules with progress
    const modulesSnapshot = await db.collection('modules')
      .where('isActive', '==', true)
      .get();
    
    const modulesWithProgress = modulesSnapshot.docs.map(doc => {
      const moduleData = doc.data();
      const progress = moduleProgress[doc.id] || { 
        completed: false, 
        attempts: 0,
        score: null 
      };
      
      return {
        id: doc.id,
        title: moduleData.title,
        description: moduleData.description,
        category: moduleData.category,
        difficulty: moduleData.difficulty,
        estimatedDuration: moduleData.estimatedDuration,
        ...progress
      };
    });
    
    res.json({ modules: modulesWithProgress });

  } catch (error) {
    logger.error('Get module progress error:', error);
    res.status(500).json({ message: 'Failed to fetch module progress' });
  }
});

// Get student's drill history
router.get('/drills/history', async (req, res) => {
  try {
    const { uid: studentId, schoolId } = req.user;
    const { page = 1, limit = 10, type } = req.query;
    
    let query = db.collection('drills')
      .where('schoolId', '==', schoolId)
      .where('participants', 'array-contains', studentId);
    
    if (type) {
      query = query.where('type', '==', type);
    }
    
    const drillsSnapshot = await query.orderBy('scheduledDate', 'desc').get();
    
    const drills = drillsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        type: data.type,
        scheduledDate: data.scheduledDate,
        status: data.status,
        attended: data.attendance && data.attendance[studentId],
        completionRate: data.completionRate
      };
    });
    
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
    logger.error('Get drill history error:', error);
    res.status(500).json({ message: 'Failed to fetch drill history' });
  }
});

// Update student profile
router.put('/profile', async (req, res) => {
  try {
    const { uid: studentId } = req.user;
    const { parentContact, address, emergencyContact } = req.body;
    
    const updateData = {
      updatedAt: new Date().toISOString()
    };
    
    if (parentContact) updateData.parentContact = parentContact;
    if (address) updateData.address = address;
    if (emergencyContact) updateData.emergencyContact = emergencyContact;
    
    await db.collection('students').doc(studentId).update(updateData);
    
    logger.info(`Student profile updated: ${studentId}`);
    res.json({ message: 'Profile updated successfully' });

  } catch (error) {
    logger.error('Update student profile error:', error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

// Get student's certificates
router.get('/certificates', async (req, res) => {
  try {
    const { uid: studentId, schoolId } = req.user;
    
    const certificatesSnapshot = await db.collection('certificates')
      .where('studentId', '==', studentId)
      .where('schoolId', '==', schoolId)
      .orderBy('issuedAt', 'desc')
      .get();
    
    const certificates = certificatesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    res.json({ certificates });

  } catch (error) {
    logger.error('Get certificates error:', error);
    res.status(500).json({ message: 'Failed to fetch certificates' });
  }
});

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const { schoolId } = req.user;
    const { period = 'all', class: filterClass } = req.query;
    
    let query = db.collection('students')
      .where('schoolId', '==', schoolId)
      .where('isActive', '==', true);
    
    if (filterClass) {
      query = query.where('class', '==', parseInt(filterClass));
    }
    
    const studentsSnapshot = await query.get();
    
    const students = studentsSnapshot.docs.map(doc => {
      const data = doc.data();
      const completedModules = Object.values(data.moduleProgress || {}).filter(p => p.completed).length;
      const avgScore = Object.values(data.moduleProgress || {})
        .filter(p => p.completed && p.score)
        .reduce((sum, p, _, arr) => sum + p.score / arr.length, 0) || 0;
      
      return {
        id: doc.id,
        name: data.name,
        class: data.class,
        admissionNumber: data.admissionNumber,
        completedModules,
        drillsAttended: data.drillsAttended || 0,
        avgScore: avgScore.toFixed(1),
        points: (completedModules * 10) + ((data.drillsAttended || 0) * 5) + (avgScore / 10)
      };
    });
    
    // Sort by points
    students.sort((a, b) => b.points - a.points);
    
    // Add ranks
    const leaderboard = students.map((student, index) => ({
      ...student,
      rank: index + 1
    }));
    
    res.json({ leaderboard: leaderboard.slice(0, 50) }); // Top 50

  } catch (error) {
    logger.error('Get leaderboard error:', error);
    res.status(500).json({ message: 'Failed to fetch leaderboard' });
  }
});

// Get personalized recommendations
router.get('/recommendations', async (req, res) => {
  try {
    const { uid: studentId } = req.user;
    
    const studentDoc = await db.collection('students').doc(studentId).get();
    if (!studentDoc.exists) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    const studentData = studentDoc.data();
    const moduleProgress = studentData.moduleProgress || {};
    
    // Get all modules
    const modulesSnapshot = await db.collection('modules')
      .where('isActive', '==', true)
      .get();
    
    const allModules = modulesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Find incomplete modules
    const incompleteModules = allModules.filter(module => 
      !moduleProgress[module.id] || !moduleProgress[module.id].completed
    );
    
    // Recommend based on difficulty progression
    const completedDifficulties = Object.values(moduleProgress)
      .filter(p => p.completed)
      .map(p => allModules.find(m => moduleProgress[m.id] === p)?.difficulty)
      .filter(Boolean);
    
    const hasBeginnerCompleted = completedDifficulties.includes('beginner');
    const hasIntermediateCompleted = completedDifficulties.includes('intermediate');
    
    let recommendedDifficulty = 'beginner';
    if (hasBeginnerCompleted && !hasIntermediateCompleted) {
      recommendedDifficulty = 'intermediate';
    } else if (hasIntermediateCompleted) {
      recommendedDifficulty = 'advanced';
    }
    
    const recommendations = incompleteModules
      .filter(module => module.difficulty === recommendedDifficulty)
      .slice(0, 3);
    
    res.json({ recommendations });

  } catch (error) {
    logger.error('Get recommendations error:', error);
    res.status(500).json({ message: 'Failed to fetch recommendations' });
  }
});

module.exports = router;
