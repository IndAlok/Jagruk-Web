const express = require('express');
const { db } = require('../config/firebase');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Get all students in school
router.get('/students/:schoolId', authMiddleware, async (req, res) => {
  try {
    const { schoolId } = req.params;
    
    const studentsRef = db.collection('students').where('schoolId', '==', schoolId);
    const snapshot = await studentsRef.get();
    
    const students = [];
    snapshot.forEach(doc => {
      const studentData = doc.data();
      students.push({
        id: doc.id,
        admissionNumber: studentData.admissionNumber,
        name: studentData.name,
        class: studentData.class,
        age: studentData.age,
        modulesCompleted: studentData.modulesCompleted?.length || 0,
        drillsAttended: studentData.drillsAttended?.length || 0,
        email: studentData.email,
        parentContact: studentData.parentContact
      });
    });
    
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Failed to fetch students' });
  }
});

// Get drill attendance report
router.get('/drill-attendance/:schoolId/:drillId', authMiddleware, async (req, res) => {
  try {
    const { schoolId, drillId } = req.params;
    
    const attendanceRef = db.collection('drillAttendance')
      .where('schoolId', '==', schoolId)
      .where('drillId', '==', drillId);
    const snapshot = await attendanceRef.get();
    
    const attendance = [];
    snapshot.forEach(doc => {
      attendance.push(doc.data());
    });
    
    res.json(attendance);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ message: 'Failed to fetch attendance' });
  }
});

// Schedule drill
router.post('/schedule-drill', authMiddleware, async (req, res) => {
  try {
    const { 
      title, 
      description, 
      type, 
      scheduledDate, 
      duration, 
      schoolId, 
      targetClasses,
      instructions 
    } = req.body;
    
    const drillData = {
      title,
      description,
      type, // 'physical' or 'virtual'
      scheduledDate: new Date(scheduledDate),
      duration: parseInt(duration),
      schoolId,
      targetClasses: targetClasses || [],
      instructions,
      createdBy: req.user.uid,
      createdAt: new Date(),
      status: 'scheduled',
      participants: []
    };
    
    const drillRef = await db.collection('drills').add(drillData);
    
    // Send notification to all targeted students
    const io = req.app.get('socketio');
    io.to(schoolId).emit('drill-scheduled', {
      drillId: drillRef.id,
      ...drillData
    });
    
    res.status(201).json({ 
      message: 'Drill scheduled successfully',
      drillId: drillRef.id
    });
    
  } catch (error) {
    console.error('Error scheduling drill:', error);
    res.status(500).json({ message: 'Failed to schedule drill' });
  }
});

// Send emergency alert
router.post('/send-alert', authMiddleware, async (req, res) => {
  try {
    const { title, message, priority, schoolId, targetAudience } = req.body;
    
    const alertData = {
      title,
      message,
      priority, // 'low', 'medium', 'high', 'critical'
      schoolId,
      targetAudience, // 'all', 'students', 'staff', 'specific-class'
      sentBy: req.user.uid,
      sentAt: new Date(),
      isActive: true
    };
    
    const alertRef = await db.collection('alerts').add(alertData);
    
    // Send real-time alert
    const io = req.app.get('socketio');
    io.to(schoolId).emit('emergency-alert', {
      alertId: alertRef.id,
      ...alertData
    });
    
    res.status(201).json({ 
      message: 'Alert sent successfully',
      alertId: alertRef.id
    });
    
  } catch (error) {
    console.error('Error sending alert:', error);
    res.status(500).json({ message: 'Failed to send alert' });
  }
});

module.exports = router;