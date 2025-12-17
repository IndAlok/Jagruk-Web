const express = require('express');
const { db } = require('../config/firebase');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');
const logger = require('../config/logger');

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  try {
    const { type, priority, page = 1, limit = 10 } = req.query;

    const snapshot = await db.collection('alerts').orderBy('createdAt', 'desc').get();
    
    let alerts = [];
    snapshot.forEach(doc => {
      alerts.push({ id: doc.id, ...doc.data() });
    });

    if (type) {
      alerts = alerts.filter(a => a.type === type);
    }

    if (priority) {
      alerts = alerts.filter(a => a.priority === priority);
    }

    const total = alerts.length;
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const paginatedAlerts = alerts.slice(startIndex, startIndex + parseInt(limit));

    res.json({
      success: true,
      data: {
        alerts: paginatedAlerts,
        total,
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    logger.error('Get alerts error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch alerts' });
  }
});

router.get('/active', authenticateToken, async (req, res) => {
  try {
    const snapshot = await db.collection('alerts')
      .where('isActive', '==', true)
      .limit(20)
      .get();
    
    let alerts = [];
    snapshot.forEach(doc => {
      alerts.push({ id: doc.id, ...doc.data() });
    });

    // Sort in memory to avoid composite index requirement
    alerts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({ success: true, data: alerts });

  } catch (error) {
    logger.error('Get active alerts error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch active alerts' });
  }
});

router.post('/', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const { title, message, type, priority = 'medium', targetAudience = 'all' } = req.body;

    if (!title || !message || !type) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title, message, and type are required' 
      });
    }

    const alertData = {
      title,
      message,
      type,
      priority,
      targetAudience,
      isActive: true,
      acknowledgments: {},
      acknowledgedCount: 0,
      createdBy: req.user.userId,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };

    const docRef = await db.collection('alerts').add(alertData);

    res.status(201).json({
      success: true,
      message: 'Alert created successfully',
      data: { id: docRef.id, ...alertData }
    });

  } catch (error) {
    logger.error('Create alert error:', error);
    res.status(500).json({ success: false, message: 'Failed to create alert' });
  }
});

router.post('/:id/acknowledge', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const docRef = db.collection('alerts').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ success: false, message: 'Alert not found' });
    }

    const alert = doc.data();
    const acknowledgments = alert.acknowledgments || {};
    
    if (acknowledgments[userId]) {
      return res.json({ success: true, message: 'Already acknowledged' });
    }

    acknowledgments[userId] = {
      acknowledgedAt: new Date().toISOString(),
      userName: req.user.name
    };

    await docRef.update({
      acknowledgments,
      acknowledgedCount: Object.keys(acknowledgments).length
    });

    res.json({ success: true, message: 'Alert acknowledged' });

  } catch (error) {
    logger.error('Acknowledge alert error:', error);
    res.status(500).json({ success: false, message: 'Failed to acknowledge alert' });
  }
});

router.put('/:id/deactivate', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const docRef = db.collection('alerts').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ success: false, message: 'Alert not found' });
    }

    await docRef.update({
      isActive: false,
      deactivatedAt: new Date().toISOString()
    });

    res.json({ success: true, message: 'Alert deactivated' });

  } catch (error) {
    logger.error('Deactivate alert error:', error);
    res.status(500).json({ success: false, message: 'Failed to deactivate alert' });
  }
});

router.delete('/:id', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const docRef = db.collection('alerts').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ success: false, message: 'Alert not found' });
    }

    await docRef.delete();

    res.json({ success: true, message: 'Alert deleted successfully' });

  } catch (error) {
    logger.error('Delete alert error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete alert' });
  }
});

module.exports = router;
