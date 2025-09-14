const express = require('express');
const { db } = require('../config/firebase');
const { authenticateToken, authorizeAll } = require('../middleware/auth');
const logger = require('../config/logger');

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);
router.use(authorizeAll);

// Get all drills for student
router.get('/', async (req, res) => {
  try {
    const { uid: studentId, schoolId, role } = req.user;
    const { status, type, page = 1, limit = 10 } = req.query;
    
    let query = db.collection('drills').where('schoolId', '==', schoolId);
    
    if (role === 'student') {
      query = query.where('participants', 'array-contains', studentId);
    }
    
    if (status) {
      query = query.where('status', '==', status);
    }
    
    if (type) {
      query = query.where('type', '==', type);
    }
    
    const drillsSnapshot = await query.orderBy('scheduledDate', 'desc').get();
    let drills = drillsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        userAttended: role === 'student' ? (data.attendance && data.attendance[studentId]) : undefined
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
    logger.error('Get drills error:', error);
    res.status(500).json({ message: 'Failed to fetch drills' });
  }
});

// Get specific drill details
router.get('/:drillId', async (req, res) => {
  try {
    const { drillId } = req.params;
    const { uid: userId, schoolId, role } = req.user;
    
    const drillDoc = await db.collection('drills').doc(drillId).get();
    
    if (!drillDoc.exists) {
      return res.status(404).json({ message: 'Drill not found' });
    }
    
    const drillData = drillDoc.data();
    
    // Check access
    if (drillData.schoolId !== schoolId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    if (role === 'student' && !drillData.participants.includes(userId)) {
      return res.status(403).json({ message: 'You are not registered for this drill' });
    }
    
    // Add user-specific information
    const response = {
      id: drillId,
      ...drillData,
      userAttended: role === 'student' ? (drillData.attendance && drillData.attendance[userId]) : undefined
    };
    
    // For admins/staff, include participant details
    if (role === 'admin' || role === 'staff') {
      const participantDetails = [];
      
      for (const participantId of drillData.participants) {
        const studentDoc = await db.collection('students').doc(participantId).get();
        if (studentDoc.exists) {
          const studentData = studentDoc.data();
          participantDetails.push({
            id: participantId,
            name: studentData.name,
            admissionNumber: studentData.admissionNumber,
            class: studentData.class,
            attended: drillData.attendance && drillData.attendance[participantId]
          });
        }
      }
      
      response.participantDetails = participantDetails;
    }
    
    res.json(response);

  } catch (error) {
    logger.error('Get drill details error:', error);
    res.status(500).json({ message: 'Failed to fetch drill details' });
  }
});

// Mark attendance for a drill (students)
router.post('/:drillId/attend', async (req, res) => {
  try {
    const { drillId } = req.params;
    const { uid: studentId, schoolId, role } = req.user;
    const { location, timestamp, deviceInfo } = req.body;
    
    if (role !== 'student') {
      return res.status(403).json({ message: 'Only students can mark attendance' });
    }
    
    const drillDoc = await db.collection('drills').doc(drillId).get();
    
    if (!drillDoc.exists) {
      return res.status(404).json({ message: 'Drill not found' });
    }
    
    const drillData = drillDoc.data();
    
    if (drillData.schoolId !== schoolId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    if (!drillData.participants.includes(studentId)) {
      return res.status(403).json({ message: 'You are not registered for this drill' });
    }
    
    if (drillData.status !== 'active') {
      return res.status(400).json({ message: 'Drill is not currently active' });
    }
    
    // Check if already marked attendance
    if (drillData.attendance && drillData.attendance[studentId]) {
      return res.status(400).json({ message: 'Attendance already marked' });
    }
    
    // Mark attendance
    await db.collection('drills').doc(drillId).update({
      [`attendance.${studentId}`]: true,
      updatedAt: new Date().toISOString()
    });
    
    // Create detailed attendance record
    await db.collection('attendanceRecords').add({
      drillId,
      studentId,
      schoolId,
      location,
      timestamp: timestamp || new Date().toISOString(),
      deviceInfo,
      markedAt: new Date().toISOString()
    });
    
    // Send real-time update
    const io = req.app.get('socketio');
    io.to(schoolId).emit('attendance-marked', {
      drillId,
      studentId,
      timestamp: new Date().toISOString()
    });
    
    logger.info(`Attendance marked for drill ${drillId} by student ${studentId}`);
    res.json({ message: 'Attendance marked successfully' });

  } catch (error) {
    logger.error('Mark attendance error:', error);
    res.status(500).json({ message: 'Failed to mark attendance' });
  }
});

// Update attendance (admin/staff only)
router.patch('/:drillId/attendance/:studentId', async (req, res) => {
  try {
    const { drillId, studentId } = req.params;
    const { attended } = req.body;
    const { schoolId, role } = req.user;
    
    if (role !== 'admin' && role !== 'staff') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const drillDoc = await db.collection('drills').doc(drillId).get();
    
    if (!drillDoc.exists) {
      return res.status(404).json({ message: 'Drill not found' });
    }
    
    const drillData = drillDoc.data();
    
    if (drillData.schoolId !== schoolId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    if (!drillData.participants.includes(studentId)) {
      return res.status(400).json({ message: 'Student not registered for this drill' });
    }
    
    // Update attendance
    await db.collection('drills').doc(drillId).update({
      [`attendance.${studentId}`]: attended,
      updatedAt: new Date().toISOString()
    });
    
    logger.info(`Attendance updated for drill ${drillId}, student ${studentId}: ${attended}`);
    res.json({ message: 'Attendance updated successfully' });

  } catch (error) {
    logger.error('Update attendance error:', error);
    res.status(500).json({ message: 'Failed to update attendance' });
  }
});

// Get upcoming drills
router.get('/upcoming/all', async (req, res) => {
  try {
    const { uid: userId, schoolId, role } = req.user;
    
    const now = new Date().toISOString();
    let query = db.collection('drills')
      .where('schoolId', '==', schoolId)
      .where('status', 'in', ['scheduled', 'active'])
      .where('scheduledDate', '>=', now);
    
    if (role === 'student') {
      query = query.where('participants', 'array-contains', userId);
    }
    
    const drillsSnapshot = await query.orderBy('scheduledDate').limit(5).get();
    
    const upcomingDrills = drillsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        type: data.type,
        scheduledDate: data.scheduledDate,
        status: data.status,
        duration: data.duration,
        userAttended: role === 'student' ? (data.attendance && data.attendance[userId]) : undefined
      };
    });
    
    res.json({ drills: upcomingDrills });

  } catch (error) {
    logger.error('Get upcoming drills error:', error);
    res.status(500).json({ message: 'Failed to fetch upcoming drills' });
  }
});

// Submit drill feedback (students)
router.post('/:drillId/feedback', async (req, res) => {
  try {
    const { drillId } = req.params;
    const { uid: studentId, schoolId, role } = req.user;
    const { rating, comments, improvements } = req.body;
    
    if (role !== 'student') {
      return res.status(403).json({ message: 'Only students can submit feedback' });
    }
    
    const drillDoc = await db.collection('drills').doc(drillId).get();
    
    if (!drillDoc.exists) {
      return res.status(404).json({ message: 'Drill not found' });
    }
    
    const drillData = drillDoc.data();
    
    if (drillData.schoolId !== schoolId || !drillData.participants.includes(studentId)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    if (drillData.status !== 'completed') {
      return res.status(400).json({ message: 'Can only provide feedback for completed drills' });
    }
    
    // Save feedback
    await db.collection('drillFeedback').add({
      drillId,
      studentId,
      schoolId,
      rating,
      comments,
      improvements,
      submittedAt: new Date().toISOString()
    });
    
    logger.info(`Feedback submitted for drill ${drillId} by student ${studentId}`);
    res.json({ message: 'Feedback submitted successfully' });

  } catch (error) {
    logger.error('Submit feedback error:', error);
    res.status(500).json({ message: 'Failed to submit feedback' });
  }
});

// Get drill feedback (admin/staff)
router.get('/:drillId/feedback', async (req, res) => {
  try {
    const { drillId } = req.params;
    const { schoolId, role } = req.user;
    
    if (role !== 'admin' && role !== 'staff') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const feedbackSnapshot = await db.collection('drillFeedback')
      .where('drillId', '==', drillId)
      .where('schoolId', '==', schoolId)
      .get();
    
    const feedback = [];
    
    for (const doc of feedbackSnapshot.docs) {
      const feedbackData = doc.data();
      const studentDoc = await db.collection('students').doc(feedbackData.studentId).get();
      
      feedback.push({
        id: doc.id,
        ...feedbackData,
        studentName: studentDoc.exists ? studentDoc.data().name : 'Unknown'
      });
    }
    
    res.json({ feedback });

  } catch (error) {
    logger.error('Get drill feedback error:', error);
    res.status(500).json({ message: 'Failed to fetch drill feedback' });
  }
});

module.exports = router;
