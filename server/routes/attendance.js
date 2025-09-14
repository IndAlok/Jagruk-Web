const express = require('express');
const { db } = require('../config/firebase');
const { authenticateToken, authorizeAll } = require('../middleware/auth');
const logger = require('../config/logger');

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);
router.use(authorizeAll);

// Get attendance records
router.get('/', async (req, res) => {
  try {
    const { schoolId, role } = req.user;
    const { 
      studentId, 
      drillId, 
      startDate, 
      endDate, 
      class: filterClass,
      page = 1, 
      limit = 10 
    } = req.query;
    
    let query = db.collection('attendanceRecords').where('schoolId', '==', schoolId);
    
    if (studentId) {
      query = query.where('studentId', '==', studentId);
    }
    
    if (drillId) {
      query = query.where('drillId', '==', drillId);
    }
    
    if (startDate) {
      query = query.where('timestamp', '>=', startDate);
    }
    
    if (endDate) {
      query = query.where('timestamp', '<=', endDate);
    }
    
    const recordsSnapshot = await query.orderBy('timestamp', 'desc').get();
    let records = recordsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Get additional details
    const enrichedRecords = [];
    for (const record of records) {
      // Get student details
      const studentDoc = await db.collection('students').doc(record.studentId).get();
      const studentData = studentDoc.exists ? studentDoc.data() : null;
      
      // Filter by class if specified
      if (filterClass && studentData && studentData.class !== parseInt(filterClass)) {
        continue;
      }
      
      // Get drill details
      const drillDoc = await db.collection('drills').doc(record.drillId).get();
      const drillData = drillDoc.exists ? drillDoc.data() : null;
      
      enrichedRecords.push({
        ...record,
        studentName: studentData?.name || 'Unknown',
        studentClass: studentData?.class || 'Unknown',
        admissionNumber: studentData?.admissionNumber || 'Unknown',
        drillTitle: drillData?.title || 'Unknown',
        drillType: drillData?.type || 'Unknown'
      });
    }
    
    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedRecords = enrichedRecords.slice(startIndex, endIndex);
    
    res.json({
      records: paginatedRecords,
      total: enrichedRecords.length,
      page: parseInt(page),
      totalPages: Math.ceil(enrichedRecords.length / limit)
    });

  } catch (error) {
    logger.error('Get attendance records error:', error);
    res.status(500).json({ message: 'Failed to fetch attendance records' });
  }
});

// Get attendance statistics
router.get('/stats', async (req, res) => {
  try {
    const { schoolId, role } = req.user;
    const { startDate, endDate, class: filterClass } = req.query;
    
    if (role !== 'admin' && role !== 'staff') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Get drills in date range
    let drillsQuery = db.collection('drills')
      .where('schoolId', '==', schoolId)
      .where('status', '==', 'completed');
    
    if (startDate) {
      drillsQuery = drillsQuery.where('scheduledDate', '>=', startDate);
    }
    
    if (endDate) {
      drillsQuery = drillsQuery.where('scheduledDate', '<=', endDate);
    }
    
    const drillsSnapshot = await drillsQuery.get();
    const drills = drillsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Get students
    let studentsQuery = db.collection('students')
      .where('schoolId', '==', schoolId)
      .where('isActive', '==', true);
    
    if (filterClass) {
      studentsQuery = studentsQuery.where('class', '==', parseInt(filterClass));
    }
    
    const studentsSnapshot = await studentsQuery.get();
    const students = studentsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Calculate statistics
    let totalAttendance = 0;
    let totalPossibleAttendance = 0;
    const attendanceByClass = {};
    const attendanceByDrill = {};
    
    for (const drill of drills) {
      const drillParticipants = students.filter(s => drill.participants.includes(s.id));
      const drillAttendance = Object.values(drill.attendance || {}).filter(Boolean).length;
      
      totalAttendance += drillAttendance;
      totalPossibleAttendance += drillParticipants.length;
      
      // Group by drill type
      if (!attendanceByDrill[drill.type]) {
        attendanceByDrill[drill.type] = { attended: 0, total: 0 };
      }
      attendanceByDrill[drill.type].attended += drillAttendance;
      attendanceByDrill[drill.type].total += drillParticipants.length;
      
      // Group by class
      drillParticipants.forEach(student => {
        if (!attendanceByClass[student.class]) {
          attendanceByClass[student.class] = { attended: 0, total: 0 };
        }
        attendanceByClass[student.class].total += 1;
        if (drill.attendance && drill.attendance[student.id]) {
          attendanceByClass[student.class].attended += 1;
        }
      });
    }
    
    const overallAttendanceRate = totalPossibleAttendance > 0 ? 
      ((totalAttendance / totalPossibleAttendance) * 100).toFixed(1) : 0;
    
    // Calculate class-wise percentages
    Object.keys(attendanceByClass).forEach(className => {
      const classData = attendanceByClass[className];
      classData.percentage = classData.total > 0 ? 
        ((classData.attended / classData.total) * 100).toFixed(1) : 0;
    });
    
    // Calculate drill-wise percentages
    Object.keys(attendanceByDrill).forEach(drillType => {
      const drillData = attendanceByDrill[drillType];
      drillData.percentage = drillData.total > 0 ? 
        ((drillData.attended / drillData.total) * 100).toFixed(1) : 0;
    });
    
    res.json({
      overallAttendanceRate,
      totalDrills: drills.length,
      totalStudents: students.length,
      attendanceByClass,
      attendanceByDrill
    });

  } catch (error) {
    logger.error('Get attendance stats error:', error);
    res.status(500).json({ message: 'Failed to fetch attendance statistics' });
  }
});

// Get student attendance summary
router.get('/student/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    const { schoolId, role } = req.user;
    
    // Check if accessing own data (for students) or admin/staff access
    if (role === 'student' && req.user.uid !== studentId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const studentDoc = await db.collection('students').doc(studentId).get();
    if (!studentDoc.exists) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    const studentData = studentDoc.data();
    if (studentData.schoolId !== schoolId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Get all drills the student was supposed to attend
    const drillsSnapshot = await db.collection('drills')
      .where('schoolId', '==', schoolId)
      .where('participants', 'array-contains', studentId)
      .where('status', '==', 'completed')
      .orderBy('scheduledDate', 'desc')
      .get();
    
    const drillHistory = drillsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        type: data.type,
        scheduledDate: data.scheduledDate,
        attended: data.attendance && data.attendance[studentId],
        completionRate: data.completionRate
      };
    });
    
    const totalDrills = drillHistory.length;
    const attendedDrills = drillHistory.filter(drill => drill.attended).length;
    const attendanceRate = totalDrills > 0 ? ((attendedDrills / totalDrills) * 100).toFixed(1) : 0;
    
    // Group by drill type
    const attendanceByType = {};
    drillHistory.forEach(drill => {
      if (!attendanceByType[drill.type]) {
        attendanceByType[drill.type] = { total: 0, attended: 0 };
      }
      attendanceByType[drill.type].total += 1;
      if (drill.attended) {
        attendanceByType[drill.type].attended += 1;
      }
    });
    
    Object.keys(attendanceByType).forEach(type => {
      const typeData = attendanceByType[type];
      typeData.percentage = typeData.total > 0 ? 
        ((typeData.attended / typeData.total) * 100).toFixed(1) : 0;
    });
    
    res.json({
      student: {
        name: studentData.name,
        class: studentData.class,
        admissionNumber: studentData.admissionNumber
      },
      summary: {
        totalDrills,
        attendedDrills,
        attendanceRate,
        attendanceByType
      },
      drillHistory
    });

  } catch (error) {
    logger.error('Get student attendance summary error:', error);
    res.status(500).json({ message: 'Failed to fetch student attendance summary' });
  }
});

// Export attendance report (admin/staff only)
router.get('/export', async (req, res) => {
  try {
    const { schoolId, role } = req.user;
    const { startDate, endDate, class: filterClass, format = 'json' } = req.query;
    
    if (role !== 'admin' && role !== 'staff') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Get attendance records
    let query = db.collection('attendanceRecords').where('schoolId', '==', schoolId);
    
    if (startDate) {
      query = query.where('timestamp', '>=', startDate);
    }
    
    if (endDate) {
      query = query.where('timestamp', '<=', endDate);
    }
    
    const recordsSnapshot = await query.orderBy('timestamp', 'desc').get();
    const records = recordsSnapshot.docs.map(doc => doc.data());
    
    // Enrich with student and drill details
    const enrichedRecords = [];
    for (const record of records) {
      const studentDoc = await db.collection('students').doc(record.studentId).get();
      const studentData = studentDoc.exists ? studentDoc.data() : null;
      
      // Filter by class if specified
      if (filterClass && studentData && studentData.class !== parseInt(filterClass)) {
        continue;
      }
      
      const drillDoc = await db.collection('drills').doc(record.drillId).get();
      const drillData = drillDoc.exists ? drillDoc.data() : null;
      
      enrichedRecords.push({
        studentName: studentData?.name || 'Unknown',
        admissionNumber: studentData?.admissionNumber || 'Unknown',
        class: studentData?.class || 'Unknown',
        drillTitle: drillData?.title || 'Unknown',
        drillType: drillData?.type || 'Unknown',
        attendanceDate: record.timestamp,
        location: record.location || 'Not specified'
      });
    }
    
    if (format === 'csv') {
      // Convert to CSV format
      const csvHeader = 'Student Name,Admission Number,Class,Drill Title,Drill Type,Attendance Date,Location\n';
      const csvData = enrichedRecords.map(record => 
        `"${record.studentName}","${record.admissionNumber}","${record.class}","${record.drillTitle}","${record.drillType}","${record.attendanceDate}","${record.location}"`
      ).join('\n');
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=attendance-report.csv');
      res.send(csvHeader + csvData);
    } else {
      res.json({ 
        report: enrichedRecords,
        generatedAt: new Date().toISOString(),
        totalRecords: enrichedRecords.length
      });
    }

  } catch (error) {
    logger.error('Export attendance report error:', error);
    res.status(500).json({ message: 'Failed to export attendance report' });
  }
});

module.exports = router;
