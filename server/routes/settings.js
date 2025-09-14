const express = require('express');
const { auth, db } = require('../config/firebase');
const jwt = require('jsonwebtoken');
const logger = require('../config/logger');

const router = express.Router();

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'demo_secret');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Get user settings
router.get('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // For demo users, return default settings
    if (userId?.startsWith('demo_')) {
      const defaultSettings = {
        theme: 'light',
        notifications: {
          email: true,
          push: true,
          sms: false,
          drillReminders: true,
          systemAlerts: true
        },
        dashboard: {
          autoRefresh: true,
          refreshInterval: 30,
          showAnimations: true,
          compactMode: false
        },
        privacy: {
          profileVisible: true,
          activityVisible: false,
          shareData: false
        },
        language: 'en',
        timezone: 'Asia/Kolkata'
      };
      
      return res.json({
        success: true,
        settings: defaultSettings
      });
    }

    // For real users, fetch from database
    const userDoc = await db.collection('user_settings').doc(userId).get();
    
    if (!userDoc.exists) {
      // Create default settings for new user
      const defaultSettings = {
        theme: 'light',
        notifications: {
          email: true,
          push: true,
          sms: false,
          drillReminders: true,
          systemAlerts: true
        },
        dashboard: {
          autoRefresh: true,
          refreshInterval: 30,
          showAnimations: true,
          compactMode: false
        },
        privacy: {
          profileVisible: true,
          activityVisible: false,
          shareData: false
        },
        language: 'en',
        timezone: 'Asia/Kolkata'
      };
      
      await db.collection('user_settings').doc(userId).set({
        ...defaultSettings,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      return res.json({
        success: true,
        settings: defaultSettings
      });
    }

    const settings = userDoc.data();
    delete settings.createdAt;
    delete settings.updatedAt;

    res.json({
      success: true,
      settings
    });

  } catch (error) {
    console.error('Settings fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch settings' });
  }
});

// Update user settings
router.put('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const updates = req.body;

    // For demo users, just return success
    if (userId?.startsWith('demo_')) {
      return res.json({
        success: true,
        message: 'Settings updated successfully (demo mode)',
        settings: updates
      });
    }

    // Validate settings structure
    const validSettings = {
      theme: updates.theme || 'light',
      notifications: updates.notifications || {},
      dashboard: updates.dashboard || {},
      privacy: updates.privacy || {},
      language: updates.language || 'en',
      timezone: updates.timezone || 'Asia/Kolkata'
    };

    // Update in database
    await db.collection('user_settings').doc(userId).update({
      ...validSettings,
      updatedAt: new Date()
    });

    res.json({
      success: true,
      message: 'Settings updated successfully',
      settings: validSettings
    });

  } catch (error) {
    console.error('Settings update error:', error);
    res.status(500).json({ message: 'Failed to update settings' });
  }
});

// Reset settings to default
router.post('/reset', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const defaultSettings = {
      theme: 'light',
      notifications: {
        email: true,
        push: true,
        sms: false,
        drillReminders: true,
        systemAlerts: true
      },
      dashboard: {
        autoRefresh: true,
        refreshInterval: 30,
        showAnimations: true,
        compactMode: false
      },
      privacy: {
        profileVisible: true,
        activityVisible: false,
        shareData: false
      },
      language: 'en',
      timezone: 'Asia/Kolkata'
    };

    // For demo users, just return success
    if (userId?.startsWith('demo_')) {
      return res.json({
        success: true,
        message: 'Settings reset successfully (demo mode)',
        settings: defaultSettings
      });
    }

    // Reset in database
    await db.collection('user_settings').doc(userId).set({
      ...defaultSettings,
      updatedAt: new Date()
    });

    res.json({
      success: true,
      message: 'Settings reset to default values',
      settings: defaultSettings
    });

  } catch (error) {
    console.error('Settings reset error:', error);
    res.status(500).json({ message: 'Failed to reset settings' });
  }
});

module.exports = router;
