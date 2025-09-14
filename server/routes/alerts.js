const express = require('express');
const { db } = require('../config/firebase');
const { authenticateToken, authorizeAll } = require('../middleware/auth');
const logger = require('../config/logger');

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);
router.use(authorizeAll);

// Get all alerts for user
router.get('/', async (req, res) => {
  try {
    const { schoolId, role } = req.user;
    const { type, priority, page = 1, limit = 10 } = req.query;
    
    let query = db.collection('alerts')
      .where('schoolId', '==', schoolId)
      .where('isActive', '==', true);
    
    if (type) {
      query = query.where('type', '==', type);
    }
    
    if (priority) {
      query = query.where('priority', '==', priority);
    }
    
    const alertsSnapshot = await query.orderBy('createdAt', 'desc').get();
    let alerts = alertsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Filter alerts that haven't expired
    const now = new Date().toISOString();
    alerts = alerts.filter(alert => !alert.expiresAt || alert.expiresAt > now);
    
    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedAlerts = alerts.slice(startIndex, endIndex);
    
    res.json({
      alerts: paginatedAlerts,
      total: alerts.length,
      page: parseInt(page),
      totalPages: Math.ceil(alerts.length / limit)
    });

  } catch (error) {
    logger.error('Get alerts error:', error);
    res.status(500).json({ message: 'Failed to fetch alerts' });
  }
});

// Mark alert as read
router.patch('/:alertId/read', async (req, res) => {
  try {
    const { alertId } = req.params;
    const { uid: userId } = req.user;
    
    const alertDoc = await db.collection('alerts').doc(alertId).get();
    
    if (!alertDoc.exists) {
      return res.status(404).json({ message: 'Alert not found' });
    }
    
    // Add user to readBy array
    await db.collection('alerts').doc(alertId).update({
      readBy: db.FieldValue.arrayUnion(userId)
    });
    
    res.json({ message: 'Alert marked as read' });

  } catch (error) {
    logger.error('Mark alert as read error:', error);
    res.status(500).json({ message: 'Failed to mark alert as read' });
  }
});

// Dismiss alert (admin only)
router.patch('/:alertId/dismiss', async (req, res) => {
  try {
    const { alertId } = req.params;
    const { role, schoolId } = req.user;
    
    if (role !== 'admin' && role !== 'staff') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const alertDoc = await db.collection('alerts').doc(alertId).get();
    
    if (!alertDoc.exists) {
      return res.status(404).json({ message: 'Alert not found' });
    }
    
    const alertData = alertDoc.data();
    
    if (alertData.schoolId !== schoolId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    await db.collection('alerts').doc(alertId).update({
      isActive: false,
      dismissedAt: new Date().toISOString()
    });
    
    // Send real-time notification
    const io = req.app.get('socketio');
    io.to(schoolId).emit('alert-dismissed', { alertId });
    
    logger.info(`Alert ${alertId} dismissed by ${req.user.uid}`);
    res.json({ message: 'Alert dismissed successfully' });

  } catch (error) {
    logger.error('Dismiss alert error:', error);
    res.status(500).json({ message: 'Failed to dismiss alert' });
  }
});

// Get emergency contacts
router.get('/emergency-contacts', async (req, res) => {
  try {
    const { schoolId } = req.user;
    
    const contactsDoc = await db.collection('emergencyContacts').doc(schoolId).get();
    
    if (!contactsDoc.exists) {
      return res.json({ contacts: [] });
    }
    
    res.json({ contacts: contactsDoc.data().contacts || [] });

  } catch (error) {
    logger.error('Get emergency contacts error:', error);
    res.status(500).json({ message: 'Failed to fetch emergency contacts' });
  }
});

// Update emergency contacts (admin only)
router.put('/emergency-contacts', async (req, res) => {
  try {
    const { role, schoolId } = req.user;
    const { contacts } = req.body;
    
    if (role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can update emergency contacts' });
    }
    
    await db.collection('emergencyContacts').doc(schoolId).set({
      contacts,
      updatedAt: new Date().toISOString(),
      updatedBy: req.user.uid
    }, { merge: true });
    
    logger.info(`Emergency contacts updated by ${req.user.uid}`);
    res.json({ message: 'Emergency contacts updated successfully' });

  } catch (error) {
    logger.error('Update emergency contacts error:', error);
    res.status(500).json({ message: 'Failed to update emergency contacts' });
  }
});

// Get alert statistics (admin only)
router.get('/stats', async (req, res) => {
  try {
    const { role, schoolId } = req.user;
    
    if (role !== 'admin' && role !== 'staff') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const { startDate, endDate } = req.query;
    
    let query = db.collection('alerts').where('schoolId', '==', schoolId);
    
    if (startDate) {
      query = query.where('createdAt', '>=', startDate);
    }
    
    if (endDate) {
      query = query.where('createdAt', '<=', endDate);
    }
    
    const alertsSnapshot = await query.get();
    const alerts = alertsSnapshot.docs.map(doc => doc.data());
    
    // Calculate statistics
    const totalAlerts = alerts.length;
    const alertsByType = alerts.reduce((acc, alert) => {
      acc[alert.type] = (acc[alert.type] || 0) + 1;
      return acc;
    }, {});
    
    const alertsByPriority = alerts.reduce((acc, alert) => {
      acc[alert.priority] = (acc[alert.priority] || 0) + 1;
      return acc;
    }, {});
    
    const activeAlerts = alerts.filter(alert => alert.isActive).length;
    const criticalAlerts = alerts.filter(alert => alert.priority === 'critical').length;
    
    res.json({
      totalAlerts,
      activeAlerts,
      criticalAlerts,
      alertsByType,
      alertsByPriority
    });

  } catch (error) {
    logger.error('Get alert statistics error:', error);
    res.status(500).json({ message: 'Failed to fetch alert statistics' });
  }
});

module.exports = router;
