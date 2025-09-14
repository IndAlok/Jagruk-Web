const express = require('express');
const router = express.Router();

// Demo students data
const demoStudents = [
  { 
    id: 1, 
    admissionNumber: 'ADM001', 
    class: 10, 
    name: 'Rahul Sharma', 
    modulesCompleted: 8, 
    age: 16,
    email: 'rahul@demo.edu',
    isActive: true,
    drillsAttended: 5
  },
  { 
    id: 2, 
    admissionNumber: 'ADM002', 
    class: 9, 
    name: 'Priya Patel', 
    modulesCompleted: 6, 
    age: 15,
    email: 'priya@demo.edu',
    isActive: true,
    drillsAttended: 4
  },
  { 
    id: 3, 
    admissionNumber: 'ADM003', 
    class: 11, 
    name: 'Amit Kumar', 
    modulesCompleted: 12, 
    age: 17,
    email: 'amit@demo.edu',
    isActive: true,
    drillsAttended: 8
  },
  { 
    id: 4, 
    admissionNumber: 'ADM004', 
    class: 10, 
    name: 'Sneha Reddy', 
    modulesCompleted: 9, 
    age: 16,
    email: 'sneha@demo.edu',
    isActive: true,
    drillsAttended: 6
  },
  { 
    id: 5, 
    admissionNumber: 'ADM005', 
    class: 12, 
    name: 'Vikram Singh', 
    modulesCompleted: 15, 
    age: 18,
    email: 'vikram@demo.edu',
    isActive: true,
    drillsAttended: 10
  }
];

// Get all students
router.get('/', (req, res) => {
  const { search = '', class: filterClass, page = 1, limit = 10 } = req.query;

  let filteredStudents = demoStudents;

  // Apply search filter
  if (search) {
    filteredStudents = filteredStudents.filter(student =>
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.admissionNumber.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Apply class filter
  if (filterClass) {
    filteredStudents = filteredStudents.filter(student =>
      student.class === parseInt(filterClass)
    );
  }

  // Apply pagination
  const startIndex = (page - 1) * limit;
  const paginatedStudents = filteredStudents.slice(startIndex, startIndex + parseInt(limit));

  res.json({
    success: true,
    data: {
      students: paginatedStudents,
      total: filteredStudents.length,
      currentPage: parseInt(page),
      totalPages: Math.ceil(filteredStudents.length / limit)
    }
  });
});

// Get student by ID
router.get('/:id', (req, res) => {
  const student = demoStudents.find(s => s.id === parseInt(req.params.id));
  
  if (!student) {
    return res.status(404).json({
      success: false,
      message: 'Student not found'
    });
  }

  res.json({
    success: true,
    data: student
  });
});

// Create new student
router.post('/', (req, res) => {
  const newStudent = {
    id: demoStudents.length + 1,
    ...req.body,
    modulesCompleted: 0,
    isActive: true,
    drillsAttended: 0
  };
  
  demoStudents.push(newStudent);
  
  res.status(201).json({
    success: true,
    message: 'Student created successfully',
    data: newStudent
  });
});

// Update student
router.put('/:id', (req, res) => {
  const studentIndex = demoStudents.findIndex(s => s.id === parseInt(req.params.id));
  
  if (studentIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Student not found'
    });
  }

  demoStudents[studentIndex] = {
    ...demoStudents[studentIndex],
    ...req.body
  };

  res.json({
    success: true,
    message: 'Student updated successfully',
    data: demoStudents[studentIndex]
  });
});

// Delete student
router.delete('/:id', (req, res) => {
  const studentIndex = demoStudents.findIndex(s => s.id === parseInt(req.params.id));
  
  if (studentIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Student not found'
    });
  }

  demoStudents.splice(studentIndex, 1);

  res.json({
    success: true,
    message: 'Student deleted successfully'
  });
});

module.exports = router;
