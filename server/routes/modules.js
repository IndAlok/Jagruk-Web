const express = require('express');
const { db } = require('../config/firebase');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');
const logger = require('../config/logger');

const router = express.Router();

const defaultModules = [
  {
    title: 'Earthquake Safety',
    category: 'Natural Disasters',
    description: 'Learn essential safety measures during earthquakes including Drop, Cover, and Hold On.',
    difficulty: 'beginner',
    duration: 30,
    content: {
      sections: [
        {
          title: 'Before an Earthquake',
          content: 'Prepare an emergency kit, secure heavy furniture, and identify safe spots in each room.'
        },
        {
          title: 'During an Earthquake',
          content: 'DROP to your hands and knees, take COVER under a sturdy desk or table, HOLD ON until shaking stops.'
        },
        {
          title: 'After an Earthquake',
          content: 'Check for injuries, be prepared for aftershocks, and evacuate if building is damaged.'
        }
      ]
    },
    quiz: [
      {
        question: 'What are the three key actions during an earthquake?',
        options: ['Run, Hide, Wait', 'Drop, Cover, Hold On', 'Stop, Look, Listen', 'Duck, Roll, Stay'],
        correctAnswer: 1
      }
    ],
    points: 50,
    isActive: true
  },
  {
    title: 'Fire Safety and Evacuation',
    category: 'Emergency Response',
    description: 'Understanding fire prevention and safe evacuation procedures.',
    difficulty: 'beginner',
    duration: 25,
    content: {
      sections: [
        {
          title: 'Fire Prevention',
          content: 'Never leave cooking unattended, keep flammable items away from heat sources.'
        },
        {
          title: 'If You Discover a Fire',
          content: 'Alert others, activate the fire alarm, evacuate immediately, call emergency services.'
        },
        {
          title: 'Evacuation Procedures',
          content: 'Use stairs not elevators, stay low if there is smoke, feel doors before opening.'
        }
      ]
    },
    quiz: [
      {
        question: 'What should you do if you encounter smoke during evacuation?',
        options: ['Run through it quickly', 'Stay low to the ground', 'Open windows', 'Wait for help'],
        correctAnswer: 1
      }
    ],
    points: 50,
    isActive: true
  },
  {
    title: 'Flood Preparedness',
    category: 'Natural Disasters',
    description: 'How to prepare for and respond to flooding situations.',
    difficulty: 'intermediate',
    duration: 35,
    content: {
      sections: [
        {
          title: 'Flood Warning Signs',
          content: 'Heavy rainfall, rising water levels, flash flood warnings from authorities.'
        },
        {
          title: 'During a Flood',
          content: 'Move to higher ground, avoid walking in moving water, stay away from electrical equipment.'
        },
        {
          title: 'After a Flood',
          content: 'Return home only when authorities say it is safe, document damage, watch for hazards.'
        }
      ]
    },
    quiz: [
      {
        question: 'How deep does water need to be to knock you off your feet?',
        options: ['Waist deep', 'Knee deep', '6 inches', 'Ankle deep'],
        correctAnswer: 2
      }
    ],
    points: 60,
    isActive: true
  },
  {
    title: 'Cyclone Safety',
    category: 'Natural Disasters',
    description: 'Preparing for and surviving tropical cyclones.',
    difficulty: 'intermediate',
    duration: 40,
    content: {
      sections: [
        {
          title: 'Cyclone Categories',
          content: 'Understanding cyclone intensity from Category 1 to 5 and what to expect.'
        },
        {
          title: 'Preparation',
          content: 'Stock emergency supplies, secure outdoor items, know evacuation routes.'
        },
        {
          title: 'During the Cyclone',
          content: 'Stay indoors away from windows, have emergency kit ready, listen to official updates.'
        }
      ]
    },
    quiz: [
      {
        question: 'Where is the safest place during a cyclone?',
        options: ['Near windows', 'In an interior room', 'Outside to watch', 'On the roof'],
        correctAnswer: 1
      }
    ],
    points: 60,
    isActive: true
  },
  {
    title: 'First Aid Basics',
    category: 'Emergency Response',
    description: 'Essential first aid skills for emergency situations.',
    difficulty: 'beginner',
    duration: 45,
    content: {
      sections: [
        {
          title: 'Assessing the Situation',
          content: 'Check for danger, check responsiveness, call for help.'
        },
        {
          title: 'CPR Basics',
          content: '30 chest compressions, 2 rescue breaths, continue until help arrives.'
        },
        {
          title: 'Treating Common Injuries',
          content: 'Wounds, burns, fractures - basic care until professional help arrives.'
        }
      ]
    },
    quiz: [
      {
        question: 'What is the compression to breath ratio for adult CPR?',
        options: ['15:1', '30:2', '20:2', '10:1'],
        correctAnswer: 1
      }
    ],
    points: 70,
    isActive: true
  }
];

router.get('/', authenticateToken, async (req, res) => {
  try {
    const { category, difficulty, page = 1, limit = 10 } = req.query;

    const snapshot = await db.collection('modules').where('isActive', '==', true).get();
    
    let modules = [];
    snapshot.forEach(doc => {
      modules.push({ id: doc.id, ...doc.data() });
    });

    if (modules.length === 0) {
      for (const module of defaultModules) {
        const docRef = await db.collection('modules').add({
          ...module,
          createdAt: new Date().toISOString()
        });
        modules.push({ id: docRef.id, ...module });
      }
    }

    if (category) {
      modules = modules.filter(m => m.category === category);
    }

    if (difficulty) {
      modules = modules.filter(m => m.difficulty === difficulty);
    }

    const total = modules.length;
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const paginatedModules = modules.slice(startIndex, startIndex + parseInt(limit));

    res.json({
      success: true,
      data: {
        modules: paginatedModules,
        total,
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    logger.error('Get modules error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch modules' });
  }
});

router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await db.collection('modules').doc(id).get();
    
    if (!doc.exists) {
      return res.status(404).json({ success: false, message: 'Module not found' });
    }

    res.json({ success: true, data: { id: doc.id, ...doc.data() } });

  } catch (error) {
    logger.error('Get module error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch module' });
  }
});

router.post('/:id/progress', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { progress, completed = false, score = 0 } = req.body;
    const userId = req.user.userId;

    const studentRef = db.collection('students').doc(userId);
    const studentDoc = await studentRef.get();

    if (!studentDoc.exists) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const moduleProgress = studentDoc.data().moduleProgress || {};
    const previouslyCompleted = moduleProgress[id]?.completed || false;
    
    moduleProgress[id] = {
      progress: progress || moduleProgress[id]?.progress || 0,
      completed,
      score: Math.max(score, moduleProgress[id]?.score || 0),
      updatedAt: new Date().toISOString()
    };

    let pointsToAdd = 0;
    if (completed && !previouslyCompleted) {
      const moduleDoc = await db.collection('modules').doc(id).get();
      if (moduleDoc.exists) {
        pointsToAdd = moduleDoc.data().points || 0;
      }
    }

    await studentRef.update({
      moduleProgress,
      totalPoints: (studentDoc.data().totalPoints || 0) + pointsToAdd
    });

    res.json({ 
      success: true, 
      message: completed ? 'Module completed!' : 'Progress saved',
      pointsEarned: pointsToAdd
    });

  } catch (error) {
    logger.error('Update progress error:', error);
    res.status(500).json({ success: false, message: 'Failed to update progress' });
  }
});

router.post('/', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const moduleData = {
      ...req.body,
      isActive: true,
      createdAt: new Date().toISOString(),
      createdBy: req.user.userId
    };

    const docRef = await db.collection('modules').add(moduleData);

    res.status(201).json({
      success: true,
      message: 'Module created successfully',
      data: { id: docRef.id, ...moduleData }
    });

  } catch (error) {
    logger.error('Create module error:', error);
    res.status(500).json({ success: false, message: 'Failed to create module' });
  }
});

module.exports = router;
