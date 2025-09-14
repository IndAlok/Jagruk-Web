const express = require('express');
const { db } = require('../config/firebase');
const { authenticateToken, authorizeAll } = require('../middleware/auth');
const logger = require('../config/logger');

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);
router.use(authorizeAll);

// Get all available modules
router.get('/', async (req, res) => {
  try {
    const { category, difficulty } = req.query;
    
    let query = db.collection('modules');
    
    if (category) {
      query = query.where('category', '==', category);
    }
    
    if (difficulty) {
      query = query.where('difficulty', '==', difficulty);
    }
    
    const modulesSnapshot = await query.orderBy('createdAt', 'desc').get();
    const modules = modulesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    res.json({ modules });

  } catch (error) {
    logger.error('Get modules error:', error);
    res.status(500).json({ message: 'Failed to fetch modules' });
  }
});

// Get specific module details
router.get('/:moduleId', async (req, res) => {
  try {
    const { moduleId } = req.params;
    
    const moduleDoc = await db.collection('modules').doc(moduleId).get();
    
    if (!moduleDoc.exists) {
      return res.status(404).json({ message: 'Module not found' });
    }
    
    const moduleData = moduleDoc.data();
    
    // Check if student has access to this module (if student)
    if (req.user.role === 'student') {
      const studentDoc = await db.collection('students').doc(req.user.uid).get();
      const studentData = studentDoc.data();
      
      // Add progress information
      const progress = studentData.moduleProgress?.[moduleId] || {
        completed: false,
        score: null,
        attempts: 0,
        lastAttempt: null
      };
      
      moduleData.userProgress = progress;
    }
    
    res.json({
      id: moduleId,
      ...moduleData
    });

  } catch (error) {
    logger.error('Get module details error:', error);
    res.status(500).json({ message: 'Failed to fetch module details' });
  }
});

// Submit module completion (for students)
router.post('/:moduleId/complete', async (req, res) => {
  try {
    const { moduleId } = req.params;
    const { score, answers, timeTaken } = req.body;
    const { uid: studentId, role } = req.user;
    
    if (role !== 'student') {
      return res.status(403).json({ message: 'Only students can complete modules' });
    }
    
    const moduleDoc = await db.collection('modules').doc(moduleId).get();
    if (!moduleDoc.exists) {
      return res.status(404).json({ message: 'Module not found' });
    }
    
    const studentRef = db.collection('students').doc(studentId);
    const studentDoc = await studentRef.get();
    const studentData = studentDoc.data();
    
    const currentProgress = studentData.moduleProgress || {};
    const moduleProgress = currentProgress[moduleId] || { attempts: 0 };
    
    // Update progress
    const updatedProgress = {
      ...currentProgress,
      [moduleId]: {
        completed: true,
        score,
        answers,
        timeTaken,
        attempts: moduleProgress.attempts + 1,
        completedAt: new Date().toISOString(),
        lastAttempt: new Date().toISOString()
      }
    };
    
    await studentRef.update({
      moduleProgress: updatedProgress,
      updatedAt: new Date().toISOString()
    });
    
    // Create completion record
    await db.collection('moduleCompletions').add({
      studentId,
      moduleId,
      score,
      timeTaken,
      completedAt: new Date().toISOString(),
      schoolId: req.user.schoolId
    });
    
    // Send real-time update
    const io = req.app.get('socketio');
    io.to(req.user.schoolId).emit('module-completed', {
      studentId,
      moduleId,
      score,
      studentName: studentData.name
    });
    
    logger.info(`Module ${moduleId} completed by student ${studentId} with score ${score}`);
    res.json({ 
      message: 'Module completed successfully',
      score,
      completed: true
    });

  } catch (error) {
    logger.error('Complete module error:', error);
    res.status(500).json({ message: 'Failed to complete module' });
  }
});

// Create new module (admin only)
router.post('/', async (req, res) => {
  try {
    const { role } = req.user;
    
    if (role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can create modules' });
    }
    
    const {
      title,
      description,
      category,
      difficulty,
      content,
      quiz,
      estimatedDuration,
      prerequisites
    } = req.body;
    
    const moduleData = {
      title,
      description,
      category,
      difficulty,
      content,
      quiz,
      estimatedDuration,
      prerequisites: prerequisites || [],
      createdBy: req.user.uid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true
    };
    
    const moduleRef = await db.collection('modules').add(moduleData);
    
    logger.info(`New module created: ${title} by ${req.user.uid}`);
    res.status(201).json({
      message: 'Module created successfully',
      moduleId: moduleRef.id
    });

  } catch (error) {
    logger.error('Create module error:', error);
    res.status(500).json({ message: 'Failed to create module' });
  }
});

// Update module (admin only)
router.put('/:moduleId', async (req, res) => {
  try {
    const { role } = req.user;
    const { moduleId } = req.params;
    
    if (role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can update modules' });
    }
    
    const moduleDoc = await db.collection('modules').doc(moduleId).get();
    if (!moduleDoc.exists) {
      return res.status(404).json({ message: 'Module not found' });
    }
    
    const updateData = {
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    await db.collection('modules').doc(moduleId).update(updateData);
    
    logger.info(`Module ${moduleId} updated by ${req.user.uid}`);
    res.json({ message: 'Module updated successfully' });

  } catch (error) {
    logger.error('Update module error:', error);
    res.status(500).json({ message: 'Failed to update module' });
  }
});

// Delete module (admin only)
router.delete('/:moduleId', async (req, res) => {
  try {
    const { role } = req.user;
    const { moduleId } = req.params;
    
    if (role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can delete modules' });
    }
    
    const moduleDoc = await db.collection('modules').doc(moduleId).get();
    if (!moduleDoc.exists) {
      return res.status(404).json({ message: 'Module not found' });
    }
    
    await db.collection('modules').doc(moduleId).update({
      isActive: false,
      deletedAt: new Date().toISOString(),
      deletedBy: req.user.uid
    });
    
    logger.info(`Module ${moduleId} deleted by ${req.user.uid}`);
    res.json({ message: 'Module deleted successfully' });

  } catch (error) {
    logger.error('Delete module error:', error);
    res.status(500).json({ message: 'Failed to delete module' });
  }
});

// Get module analytics (admin only)
router.get('/:moduleId/analytics', async (req, res) => {
  try {
    const { role, schoolId } = req.user;
    const { moduleId } = req.params;
    
    if (role !== 'admin' && role !== 'staff') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const completionsSnapshot = await db.collection('moduleCompletions')
      .where('moduleId', '==', moduleId)
      .where('schoolId', '==', schoolId)
      .get();
    
    const completions = completionsSnapshot.docs.map(doc => doc.data());
    
    // Calculate analytics
    const totalCompletions = completions.length;
    const avgScore = totalCompletions > 0 ? 
      completions.reduce((sum, completion) => sum + completion.score, 0) / totalCompletions : 0;
    const avgTime = totalCompletions > 0 ?
      completions.reduce((sum, completion) => sum + completion.timeTaken, 0) / totalCompletions : 0;
    
    // Score distribution
    const scoreDistribution = {
      '0-20': 0,
      '21-40': 0,
      '41-60': 0,
      '61-80': 0,
      '81-100': 0
    };
    
    completions.forEach(completion => {
      const score = completion.score;
      if (score <= 20) scoreDistribution['0-20']++;
      else if (score <= 40) scoreDistribution['21-40']++;
      else if (score <= 60) scoreDistribution['41-60']++;
      else if (score <= 80) scoreDistribution['61-80']++;
      else scoreDistribution['81-100']++;
    });
    
    res.json({
      totalCompletions,
      avgScore: avgScore.toFixed(1),
      avgTime: Math.round(avgTime),
      scoreDistribution
    });

  } catch (error) {
    logger.error('Get module analytics error:', error);
    res.status(500).json({ message: 'Failed to fetch module analytics' });
  }
});

module.exports = router;
