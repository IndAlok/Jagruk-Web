const express = require('express');
const { db } = require('../config/firebase');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');
const logger = require('../config/logger');

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  try {
    const { search = '', class: filterClass, page = 1, limit = 10 } = req.query;

    let query = db.collection('students');
    const snapshot = await query.get();
    
    let students = [];
    snapshot.forEach(doc => {
      students.push({ id: doc.id, ...doc.data() });
    });

    if (search) {
      const searchLower = search.toLowerCase();
      students = students.filter(s => 
        s.name?.toLowerCase().includes(searchLower) ||
        s.email?.toLowerCase().includes(searchLower) ||
        s.admissionNumber?.toLowerCase().includes(searchLower)
      );
    }

    if (filterClass) {
      students = students.filter(s => s.class === filterClass);
    }

    const total = students.length;
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const paginatedStudents = students.slice(startIndex, startIndex + parseInt(limit));

    const safeStudents = paginatedStudents.map(({ hashedPassword, ...rest }) => rest);

    res.json({
      success: true,
      data: {
        students: safeStudents,
        total,
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    logger.error('Get students error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch students' 
    });
  }
});

router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const doc = await db.collection('students').doc(id).get();
    
    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    const { hashedPassword, ...studentData } = doc.data();

    res.json({
      success: true,
      data: { id: doc.id, ...studentData }
    });

  } catch (error) {
    logger.error('Get student error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch student' 
    });
  }
});

router.post('/', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const { name, email, class: studentClass, section, rollNumber, parentContact, phone } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required'
      });
    }

    const existingQuery = await db.collection('students').where('email', '==', email).get();
    if (!existingQuery.empty) {
      return res.status(400).json({
        success: false,
        message: 'Student with this email already exists'
      });
    }

    const studentData = {
      name,
      email,
      class: studentClass || '',
      section: section || '',
      rollNumber: rollNumber || '',
      parentContact: parentContact || '',
      phone: phone || '',
      role: 'student',
      status: 'active',
      admissionNumber: `STU-${Date.now()}`,
      moduleProgress: {},
      drillsAttended: 0,
      totalPoints: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const docRef = await db.collection('students').add(studentData);

    res.status(201).json({
      success: true,
      message: 'Student created successfully',
      data: { id: docRef.id, ...studentData }
    });

  } catch (error) {
    logger.error('Create student error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create student' 
    });
  }
});

router.put('/:id', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const docRef = db.collection('students').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    delete updates.hashedPassword;
    delete updates.password;
    updates.updatedAt = new Date().toISOString();

    await docRef.update(updates);

    const updatedDoc = await docRef.get();
    const { hashedPassword, ...studentData } = updatedDoc.data();

    res.json({
      success: true,
      message: 'Student updated successfully',
      data: { id: updatedDoc.id, ...studentData }
    });

  } catch (error) {
    logger.error('Update student error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update student' 
    });
  }
});

router.delete('/:id', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const docRef = db.collection('students').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    await docRef.delete();

    res.json({
      success: true,
      message: 'Student deleted successfully'
    });

  } catch (error) {
    logger.error('Delete student error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete student' 
    });
  }
});

module.exports = router;
