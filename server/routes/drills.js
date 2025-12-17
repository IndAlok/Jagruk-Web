const express = require('express');
const { db } = require('../config/firebase');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');
const logger = require('../config/logger');

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  try {
    const { status, type, page = 1, limit = 10 } = req.query;

    const snapshot = await db.collection('drills').orderBy('createdAt', 'desc').get();
    
    let drills = [];
    snapshot.forEach(doc => {
      drills.push({ id: doc.id, ...doc.data() });
    });

    if (status) {
      drills = drills.filter(d => d.status === status);
    }

    if (type) {
      drills = drills.filter(d => d.type === type);
    }

    const total = drills.length;
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const paginatedDrills = drills.slice(startIndex, startIndex + parseInt(limit));

    res.json({
      success: true,
      data: {
        drills: paginatedDrills,
        total,
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    logger.error('Get drills error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch drills' });
  }
});

router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const snapshot = await db.collection('drills').get();
    
    let stats = {
      total: 0,
      completed: 0,
      scheduled: 0,
      inProgress: 0,
      byType: {}
    };

    snapshot.forEach(doc => {
      const drill = doc.data();
      stats.total++;
      
      if (drill.status === 'completed') stats.completed++;
      else if (drill.status === 'scheduled') stats.scheduled++;
      else if (drill.status === 'in-progress') stats.inProgress++;
      
      if (drill.type) {
        stats.byType[drill.type] = (stats.byType[drill.type] || 0) + 1;
      }
    });

    res.json({ success: true, data: stats });

  } catch (error) {
    logger.error('Get drill stats error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch drill stats' });
  }
});

router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await db.collection('drills').doc(id).get();
    
    if (!doc.exists) {
      return res.status(404).json({ success: false, message: 'Drill not found' });
    }

    res.json({ success: true, data: { id: doc.id, ...doc.data() } });

  } catch (error) {
    logger.error('Get drill error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch drill' });
  }
});

router.post('/', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const { title, type, description, scheduledDate, duration, targetClasses = [] } = req.body;

    if (!title || !type || !scheduledDate) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title, type, and scheduled date are required' 
      });
    }

    const drillData = {
      title,
      type,
      description: description || '',
      scheduledDate,
      duration: duration || 30,
      targetClasses,
      status: 'scheduled',
      attendance: {},
      participantCount: 0,
      createdBy: req.user.userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const docRef = await db.collection('drills').add(drillData);

    res.status(201).json({
      success: true,
      message: 'Drill scheduled successfully',
      data: { id: docRef.id, ...drillData }
    });

  } catch (error) {
    logger.error('Create drill error:', error);
    res.status(500).json({ success: false, message: 'Failed to create drill' });
  }
});

router.put('/:id', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const docRef = db.collection('drills').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ success: false, message: 'Drill not found' });
    }

    updates.updatedAt = new Date().toISOString();
    await docRef.update(updates);

    const updatedDoc = await docRef.get();

    res.json({
      success: true,
      message: 'Drill updated successfully',
      data: { id: updatedDoc.id, ...updatedDoc.data() }
    });

  } catch (error) {
    logger.error('Update drill error:', error);
    res.status(500).json({ success: false, message: 'Failed to update drill' });
  }
});

router.post('/:id/start', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const docRef = db.collection('drills').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ success: false, message: 'Drill not found' });
    }

    await docRef.update({
      status: 'in-progress',
      startedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    res.json({ success: true, message: 'Drill started' });

  } catch (error) {
    logger.error('Start drill error:', error);
    res.status(500).json({ success: false, message: 'Failed to start drill' });
  }
});

router.post('/:id/end', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const docRef = db.collection('drills').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ success: false, message: 'Drill not found' });
    }

    await docRef.update({
      status: 'completed',
      endedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    res.json({ success: true, message: 'Drill completed' });

  } catch (error) {
    logger.error('End drill error:', error);
    res.status(500).json({ success: false, message: 'Failed to end drill' });
  }
});

router.post('/:id/attendance', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { studentId, status = 'present' } = req.body;

    const docRef = db.collection('drills').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ success: false, message: 'Drill not found' });
    }

    const drill = doc.data();
    const attendance = drill.attendance || {};
    attendance[studentId] = {
      status,
      markedAt: new Date().toISOString(),
      markedBy: req.user.userId
    };

    await docRef.update({
      attendance,
      participantCount: Object.keys(attendance).length,
      updatedAt: new Date().toISOString()
    });

    if (status === 'present') {
      const studentRef = db.collection('students').doc(studentId);
      const studentDoc = await studentRef.get();
      if (studentDoc.exists) {
        const currentCount = studentDoc.data().drillsAttended || 0;
        await studentRef.update({
          drillsAttended: currentCount + 1,
          totalPoints: (studentDoc.data().totalPoints || 0) + 10
        });
      }
    }

    res.json({ success: true, message: 'Attendance marked' });

  } catch (error) {
    logger.error('Mark attendance error:', error);
    res.status(500).json({ success: false, message: 'Failed to mark attendance' });
  }
});

router.delete('/:id', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const docRef = db.collection('drills').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ success: false, message: 'Drill not found' });
    }

    await docRef.delete();

    res.json({ success: true, message: 'Drill deleted successfully' });

  } catch (error) {
    logger.error('Delete drill error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete drill' });
  }
});

module.exports = router;
