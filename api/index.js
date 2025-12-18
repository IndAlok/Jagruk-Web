const admin = require('firebase-admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { GoogleGenerativeAI } = require('@google/generative-ai');

if (!admin.apps.length) {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  admin.initializeApp({
    credential: admin.credential.cert({
      type: 'service_account',
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key: privateKey,
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
    }),
    projectId: process.env.FIREBASE_PROJECT_ID
  });
}

const db = admin.firestore();
const auth = admin.auth();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function generateToken(user) {
  return jwt.sign(
    { userId: user.id, email: user.email, role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
}

function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
}

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

const DISASTER_CONTEXT = `You are JAGRUK AI, an expert disaster management and safety education assistant for Indian schools and colleges. Provide accurate, actionable advice on disaster preparedness following NDMA guidelines. Be concise but thorough.`;

async function handleAuth(req, res, action) {
  const body = req.body || {};
  
  switch (action) {
    case 'register': {
      const { name, email, password, role = 'student' } = body;
      if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: 'Name, email, and password required' });
      }
      
      try {
        const firebaseUser = await auth.createUser({ email, password, displayName: name });
        const hashedPassword = await bcrypt.hash(password, 12);
        
        const userData = {
          uid: firebaseUser.uid, name, email, role, status: 'active', hashedPassword,
          phone: '', address: '', profilePhoto: null,
          createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
          ...(role === 'student' && { class: '', section: '', admissionNumber: `STU-${Date.now()}`, moduleProgress: {}, drillsAttended: 0, totalPoints: 0 }),
          ...(role === 'staff' && { staffId: `STF-${Date.now()}`, department: '', assignedClasses: [] }),
          ...(role === 'admin' && { adminId: `ADM-${Date.now()}` })
        };
        
        const collection = role === 'student' ? 'students' : role === 'staff' ? 'staff' : 'admins';
        await db.collection(collection).doc(firebaseUser.uid).set(userData);
        
        const token = generateToken({ id: firebaseUser.uid, email, role, name });
        const { hashedPassword: _, ...safeUser } = userData;
        
        return res.status(201).json({ success: true, token, user: { id: firebaseUser.uid, ...safeUser } });
      } catch (error) {
        if (error.code === 'auth/email-already-exists') {
          return res.status(400).json({ success: false, message: 'Email already registered' });
        }
        throw error;
      }
    }
    
    case 'login': {
      const { email, password } = body;
      if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password required' });
      }
      
      let userData = null, userId = null, userRef = null;
      for (const collection of ['admins', 'staff', 'students']) {
        const query = await db.collection(collection).where('email', '==', email).get();
        if (!query.empty) {
          const doc = query.docs[0];
          userData = doc.data();
          userId = doc.id;
          userRef = doc.ref;
          break;
        }
      }
      
      if (!userData) return res.status(401).json({ success: false, message: 'Invalid credentials' });
      if (userData.status !== 'active') return res.status(401).json({ success: false, message: 'Account inactive' });
      
      const isValid = await bcrypt.compare(password, userData.hashedPassword);
      if (!isValid) return res.status(401).json({ success: false, message: 'Invalid credentials' });
      
      await userRef.update({ lastLogin: new Date().toISOString() });
      const token = generateToken({ id: userId, email: userData.email, role: userData.role, name: userData.name });
      const { hashedPassword: _, ...safeUser } = userData;
      
      return res.json({ success: true, token, user: { id: userId, ...safeUser } });
    }
    
    case 'google-login': {
      const { idToken, role = 'student' } = body;
      
      try {
        const decodedToken = await auth.verifyIdToken(idToken);
        const { uid, email, name, picture } = decodedToken;
        
        let userData = null;
        let existingRole = null;
        let userRef = null;
        
        for (const collection of ['admins', 'staff', 'students']) {
          const doc = await db.collection(collection).doc(uid).get();
          if (doc.exists) {
            userData = doc.data();
            existingRole = userData.role;
            userRef = doc.ref;
            break;
          }
        }
        
        if (!userData) {
          const newUserData = {
            uid,
            name: name || email.split('@')[0],
            email,
            phone: '',
            address: '',
            role,
            status: 'active',
            profilePhoto: picture || null,
            provider: 'google',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
          };

          if (role === 'student') {
            newUserData.class = '';
            newUserData.section = '';
            newUserData.admissionNumber = `STU-${Date.now()}`;
            newUserData.moduleProgress = {};
            newUserData.drillsAttended = 0;
            newUserData.totalPoints = 0;
          } else if (role === 'staff') {
            newUserData.staffId = `STF-${Date.now()}`;
            newUserData.assignedClasses = [];
          } else if (role === 'admin') {
            newUserData.adminId = `ADM-${Date.now()}`;
          }

          const collection = role === 'student' ? 'students' : role === 'staff' ? 'staff' : 'admins';
          await db.collection(collection).doc(uid).set(newUserData);
          
          userData = newUserData;
          existingRole = role;
        } else {
          await userRef.update({
            lastLogin: new Date().toISOString(),
            profilePhoto: picture || userData.profilePhoto
          });
        }
        
        const token = generateToken({ id: uid, email: userData.email, role: existingRole, name: userData.name });
        
        return res.json({
          success: true,
          message: 'Login successful',
          token,
          user: { id: uid, ...userData, role: existingRole }
        });
      } catch (error) {
        console.error('Google login error:', error);
        return res.status(500).json({ success: false, message: 'Google login failed' });
      }
    }

    case 'verify': {
      const token = req.headers.authorization?.replace('Bearer ', '') || body.token;
      const decoded = verifyToken(token);
      if (!decoded) return res.status(401).json({ valid: false });
      
      for (const collection of ['admins', 'staff', 'students']) {
        const doc = await db.collection(collection).doc(decoded.userId).get();
        if (doc.exists) {
          const { hashedPassword: _, ...user } = doc.data();
          return res.json({ valid: true, user: { id: doc.id, ...user } });
        }
      }
      return res.status(401).json({ valid: false });
    }
    
    default:
      return res.status(400).json({ success: false, message: 'Invalid action' });
  }
}

async function handleStudents(req, res, action, id) {
  const method = req.method;
  
  if (method === 'GET' && !id) {
    const { search = '', page = 1, limit = 10 } = req.query || {};
    const snapshot = await db.collection('students').get();
    let students = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    
    if (search) {
      const s = search.toLowerCase();
      students = students.filter(st => st.name?.toLowerCase().includes(s) || st.email?.toLowerCase().includes(s));
    }
    
    const total = students.length;
    const paged = students.slice((page - 1) * limit, page * limit).map(({ hashedPassword, ...rest }) => rest);
    return res.json({ success: true, data: { students: paged, total, currentPage: +page, totalPages: Math.ceil(total / limit) } });
  }
  
  if (method === 'GET' && id) {
    const doc = await db.collection('students').doc(id).get();
    if (!doc.exists) return res.status(404).json({ success: false, message: 'Not found' });
    const { hashedPassword, ...data } = doc.data();
    return res.json({ success: true, data: { id: doc.id, ...data } });
  }
  
  if (method === 'POST') {
    const { name, email } = req.body || {};
    if (!name || !email) return res.status(400).json({ success: false, message: 'Name and email required' });
    const studentData = {
      name, email, role: 'student', status: 'active', admissionNumber: `STU-${Date.now()}`,
      class: req.body.class || '', section: req.body.section || '',
      moduleProgress: {}, drillsAttended: 0, totalPoints: 0,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
    };
    const docRef = await db.collection('students').add(studentData);
    return res.status(201).json({ success: true, data: { id: docRef.id, ...studentData } });
  }
  
  if (method === 'PUT' && id) {
    const updates = { ...req.body, updatedAt: new Date().toISOString() };
    delete updates.hashedPassword; delete updates.password;
    await db.collection('students').doc(id).update(updates);
    return res.json({ success: true, message: 'Updated' });
  }
  
  if (method === 'DELETE' && id) {
    await db.collection('students').doc(id).delete();
    return res.json({ success: true, message: 'Deleted' });
  }
  
  return res.status(405).json({ success: false, message: 'Method not allowed' });
}

async function handleDrills(req, res, action, id) {
  const method = req.method;
  
  if (method === 'GET' && action === 'stats') {
    const snapshot = await db.collection('drills').get();
    let stats = { total: 0, completed: 0, scheduled: 0, inProgress: 0 };
    snapshot.forEach(doc => {
      const d = doc.data();
      stats.total++;
      if (d.status === 'completed') stats.completed++;
      else if (d.status === 'scheduled') stats.scheduled++;
      else if (d.status === 'in-progress') stats.inProgress++;
    });
    return res.json({ success: true, data: stats });
  }
  
  if (method === 'GET' && !id) {
    const snapshot = await db.collection('drills').orderBy('createdAt', 'desc').get();
    const drills = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    return res.json({ success: true, data: { drills, total: drills.length } });
  }
  
  if (method === 'GET' && id) {
    const doc = await db.collection('drills').doc(id).get();
    if (!doc.exists) return res.status(404).json({ success: false, message: 'Not found' });
    return res.json({ success: true, data: { id: doc.id, ...doc.data() } });
  }
  
  if (method === 'POST' && !action) {
    const { title, type, scheduledDate, description = '', duration = 30, targetClasses = [] } = req.body || {};
    if (!title || !type || !scheduledDate) return res.status(400).json({ success: false, message: 'Title, type, date required' });
    const drillData = {
      title, type, description, scheduledDate, duration, targetClasses,
      status: 'scheduled', attendance: {}, participantCount: 0,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
    };
    const docRef = await db.collection('drills').add(drillData);
    return res.status(201).json({ success: true, data: { id: docRef.id, ...drillData } });
  }
  
  if (method === 'POST' && action === 'start' && id) {
    await db.collection('drills').doc(id).update({ status: 'in-progress', startedAt: new Date().toISOString() });
    return res.json({ success: true, message: 'Drill started' });
  }
  
  if (method === 'POST' && action === 'end' && id) {
    await db.collection('drills').doc(id).update({ status: 'completed', endedAt: new Date().toISOString() });
    return res.json({ success: true, message: 'Drill completed' });
  }
  
  if (method === 'POST' && action === 'attendance' && id) {
    const { studentId, status = 'present' } = req.body || {};
    const docRef = db.collection('drills').doc(id);
    const doc = await docRef.get();
    if (!doc.exists) return res.status(404).json({ success: false, message: 'Not found' });
    const attendance = doc.data().attendance || {};
    attendance[studentId] = { status, markedAt: new Date().toISOString() };
    await docRef.update({ attendance, participantCount: Object.keys(attendance).length });
    if (status === 'present') {
      const studentRef = db.collection('students').doc(studentId);
      const studentDoc = await studentRef.get();
      if (studentDoc.exists) {
        await studentRef.update({ drillsAttended: (studentDoc.data().drillsAttended || 0) + 1, totalPoints: (studentDoc.data().totalPoints || 0) + 10 });
      }
    }
    return res.json({ success: true, message: 'Attendance marked' });
  }
  
  if (method === 'DELETE' && id) {
    await db.collection('drills').doc(id).delete();
    return res.json({ success: true, message: 'Deleted' });
  }
  
  return res.status(405).json({ success: false, message: 'Method not allowed' });
}

async function handleModules(req, res, action, id) {
  const method = req.method;
  
  if (method === 'GET' && !id) {
    let snapshot = await db.collection('modules').where('isActive', '==', true).get();
    
    if (snapshot.empty) {
      const defaultModules = [
        { title: 'Earthquake Safety', category: 'Natural Disasters', description: 'Essential earthquake safety measures', difficulty: 'beginner', duration: 30, points: 50, isActive: true, content: { sections: [{ title: 'Drop, Cover, Hold On', content: 'The safest action during an earthquake' }] }, quiz: [{ question: 'What to do during earthquake?', options: ['Run outside', 'Drop, Cover, Hold On', 'Stand near window', 'Use elevator'], correctAnswer: 1 }], createdAt: new Date().toISOString() },
        { title: 'Fire Safety', category: 'Emergency Response', description: 'Fire prevention and evacuation', difficulty: 'beginner', duration: 25, points: 50, isActive: true, content: { sections: [{ title: 'Evacuation', content: 'Use stairs, stay low in smoke' }] }, quiz: [{ question: 'What to use during fire?', options: ['Elevator', 'Stairs', 'Window', 'Wait'], correctAnswer: 1 }], createdAt: new Date().toISOString() },
        { title: 'Flood Preparedness', category: 'Natural Disasters', description: 'Flood response procedures', difficulty: 'intermediate', duration: 35, points: 60, isActive: true, content: { sections: [{ title: 'Higher Ground', content: 'Move to higher ground immediately' }] }, quiz: [{ question: 'Where to go during flood?', options: ['Basement', 'Higher ground', 'Near river', 'Outside'], correctAnswer: 1 }], createdAt: new Date().toISOString() },
        { title: 'Cyclone Safety', category: 'Natural Disasters', description: 'Cyclone preparedness', difficulty: 'intermediate', duration: 40, points: 60, isActive: true, content: { sections: [{ title: 'Shelter', content: 'Stay in interior rooms away from windows' }] }, quiz: [{ question: 'Safest place during cyclone?', options: ['Near window', 'Interior room', 'Outside', 'Roof'], correctAnswer: 1 }], createdAt: new Date().toISOString() },
        { title: 'First Aid Basics', category: 'Emergency Response', description: 'Essential first aid skills', difficulty: 'beginner', duration: 45, points: 70, isActive: true, content: { sections: [{ title: 'CPR', content: '30 compressions, 2 breaths' }] }, quiz: [{ question: 'CPR ratio?', options: ['15:1', '30:2', '20:2', '10:1'], correctAnswer: 1 }], createdAt: new Date().toISOString() }
      ];
      for (const m of defaultModules) await db.collection('modules').add(m);
      snapshot = await db.collection('modules').where('isActive', '==', true).get();
    }
    
    const modules = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    return res.json({ success: true, data: { modules, total: modules.length } });
  }
  
  if (method === 'GET' && id) {
    const doc = await db.collection('modules').doc(id).get();
    if (!doc.exists) return res.status(404).json({ success: false, message: 'Not found' });
    return res.json({ success: true, data: { id: doc.id, ...doc.data() } });
  }
  
  if (method === 'POST' && action === 'progress' && id) {
    const { progress, completed = false, score = 0, userId } = req.body || {};
    const studentRef = db.collection('students').doc(userId);
    const studentDoc = await studentRef.get();
    if (!studentDoc.exists) return res.status(404).json({ success: false, message: 'Student not found' });
    
    const moduleProgress = studentDoc.data().moduleProgress || {};
    const wasCompleted = moduleProgress[id]?.completed;
    moduleProgress[id] = { progress, completed, score: Math.max(score, moduleProgress[id]?.score || 0), updatedAt: new Date().toISOString() };
    
    let pointsEarned = 0;
    if (completed && !wasCompleted) {
      const moduleDoc = await db.collection('modules').doc(id).get();
      if (moduleDoc.exists) pointsEarned = moduleDoc.data().points || 0;
    }
    
    await studentRef.update({ moduleProgress, totalPoints: (studentDoc.data().totalPoints || 0) + pointsEarned });
    return res.json({ success: true, message: completed ? 'Module completed!' : 'Progress saved', pointsEarned });
  }
  
  return res.status(405).json({ success: false, message: 'Method not allowed' });
}

async function handleAlerts(req, res, action, id) {
  const method = req.method;
  
  if (method === 'GET' && action === 'active') {
    const snapshot = await db.collection('alerts').where('isActive', '==', true).limit(20).get();
    const alerts = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    alerts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return res.json({ success: true, data: alerts.slice(0, 10) });
  }
  
  if (method === 'GET' && !id) {
    const snapshot = await db.collection('alerts').orderBy('createdAt', 'desc').get();
    const alerts = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    return res.json({ success: true, data: { alerts, total: alerts.length } });
  }
  
  if (method === 'POST' && !action) {
    const { title, message, type, priority = 'medium', targetAudience = 'all' } = req.body || {};
    if (!title || !message || !type) return res.status(400).json({ success: false, message: 'Title, message, type required' });
    const alertData = {
      title, message, type, priority, targetAudience, isActive: true,
      acknowledgments: {}, acknowledgedCount: 0,
      createdAt: new Date().toISOString(), expiresAt: new Date(Date.now() + 86400000).toISOString()
    };
    const docRef = await db.collection('alerts').add(alertData);
    return res.status(201).json({ success: true, data: { id: docRef.id, ...alertData } });
  }
  
  if (method === 'POST' && action === 'acknowledge' && id) {
    const { userId, userName } = req.body || {};
    const docRef = db.collection('alerts').doc(id);
    const doc = await docRef.get();
    if (!doc.exists) return res.status(404).json({ success: false, message: 'Not found' });
    const acknowledgments = doc.data().acknowledgments || {};
    acknowledgments[userId] = { acknowledgedAt: new Date().toISOString(), userName };
    await docRef.update({ acknowledgments, acknowledgedCount: Object.keys(acknowledgments).length });
    return res.json({ success: true, message: 'Acknowledged' });
  }
  
  if (method === 'PUT' && action === 'deactivate' && id) {
    await db.collection('alerts').doc(id).update({ isActive: false, deactivatedAt: new Date().toISOString() });
    return res.json({ success: true, message: 'Deactivated' });
  }
  
  if (method === 'DELETE' && id) {
    await db.collection('alerts').doc(id).delete();
    return res.json({ success: true, message: 'Deleted' });
  }
  
  return res.status(405).json({ success: false, message: 'Method not allowed' });
}

async function handleDashboard(req, res, action) {
  if (action === 'stats') {
    const [studentsSnap, staffSnap, drillsSnap, alertsSnap, modulesSnap] = await Promise.all([
      db.collection('students').get(),
      db.collection('staff').get(),
      db.collection('drills').get(),
      db.collection('alerts').where('isActive', '==', true).get(),
      db.collection('modules').get()
    ]);
    
    let completedDrills = 0, scheduledDrills = 0;
    drillsSnap.forEach(d => {
      if (d.data().status === 'completed') completedDrills++;
      else if (d.data().status === 'scheduled') scheduledDrills++;
    });
    
    return res.json({
      success: true,
      stats: {
        totalStudents: studentsSnap.size,
        totalStaff: staffSnap.size,
        totalDrills: drillsSnap.size,
        completedDrills, scheduledDrills,
        activeAlerts: alertsSnap.size,
        totalModules: modulesSnap.size,
        systemHealth: 98,
        lastUpdated: new Date().toISOString()
      }
    });
  }
  
  if (action === 'leaderboard') {
    const snapshot = await db.collection('students').orderBy('totalPoints', 'desc').limit(10).get();
    const leaderboard = snapshot.docs.map((d, i) => ({ rank: i + 1, id: d.id, name: d.data().name, points: d.data().totalPoints || 0, class: d.data().class }));
    return res.json({ success: true, data: leaderboard });
  }
  
  if (action === 'activities') {
    const [drillsSnap, alertsSnap] = await Promise.all([
      db.collection('drills').orderBy('createdAt', 'desc').limit(5).get(),
      db.collection('alerts').orderBy('createdAt', 'desc').limit(5).get()
    ]);
    
    const activities = [];
    drillsSnap.forEach(d => activities.push({ id: d.id, type: 'drill', title: d.data().title, message: `Drill ${d.data().status}`, timestamp: d.data().createdAt }));
    alertsSnap.forEach(d => activities.push({ id: d.id, type: 'alert', title: d.data().title, message: d.data().message, timestamp: d.data().createdAt }));
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    return res.json({ success: true, activities: activities.slice(0, 10) });
  }
  
  return res.status(400).json({ success: false, message: 'Invalid action' });
}

async function handleAI(req, res, action) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  
  if (action === 'chat') {
    const { message, conversationHistory = [] } = req.body || {};
    if (!message) return res.status(400).json({ success: false, message: 'Message required' });
    
    const chat = model.startChat({
      history: conversationHistory.map(m => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.content }] })),
      generationConfig: { maxOutputTokens: 1500, temperature: 0.7 }
    });
    
    const result = await chat.sendMessage(`${DISASTER_CONTEXT}\n\nUser: ${message}`);
    return res.json({ success: true, response: result.response.text(), timestamp: new Date().toISOString() });
  }
  
  if (action === 'quiz') {
    const { topic, difficulty = 'medium', count = 5 } = req.body || {};
    const prompt = `Generate ${count} MCQ questions about "${topic || 'disaster safety'}" for Indian students. Difficulty: ${difficulty}. Return ONLY JSON array: [{"question":"","options":["A)","B)","C)","D)"],"correctAnswer":0,"explanation":""}]`;
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const match = text.match(/\[[\s\S]*\]/);
    if (!match) throw new Error('Invalid format');
    return res.json({ success: true, quiz: JSON.parse(match[0]), topic, difficulty });
  }
  
  if (action === 'safety-tips') {
    const { disasterType = 'earthquake' } = req.body || {};
    const prompt = `Safety tips for ${disasterType} in Indian schools. Return ONLY JSON: {"disasterType":"","beforeDisaster":[],"duringDisaster":[],"afterDisaster":[],"emergencyContacts":["NDMA:1078","Police:100","Fire:101","Ambulance:102"]}`;
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('Invalid format');
    return res.json({ success: true, ...JSON.parse(match[0]) });
  }
  
  if (action === 'drill-scenario') {
    const { drillType = 'fire', duration = 30, participantCount = 100 } = req.body || {};
    const prompt = `Create ${drillType} drill scenario for ${participantCount} participants, ${duration} mins. Return ONLY JSON: {"title":"","scenario":"","objectives":[],"phases":[{"name":"","duration":"","actions":[]}],"evaluationCriteria":[],"safetyInstructions":""}`;
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('Invalid format');
    return res.json({ success: true, ...JSON.parse(match[0]) });
  }
  
  if (action === 'analyze-preparedness') {
    const { drillsCompleted = 0, modulesCompleted = 0, totalModules = 5, attendanceRate = 0 } = req.body || {};
    const prompt = `Analyze disaster preparedness: ${drillsCompleted} drills, ${modulesCompleted}/${totalModules} modules, ${attendanceRate}% attendance. Provide: score (0-100), strengths, improvements, recommendations. Return ONLY JSON: {"score":0,"level":"","strengths":[],"improvements":[],"recommendations":[],"nextSteps":[]}`;
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('Invalid format');
    return res.json({ success: true, ...JSON.parse(match[0]) });
  }
  
  if (action === 'emergency-guide') {
    const { emergencyType = 'earthquake', location = 'school' } = req.body || {};
    const prompt = `Emergency quick guide for ${emergencyType} at ${location}. Return ONLY JSON: {"emergency":"","immediateActions":[],"doNot":[],"afterEmergency":[],"assemblyPoint":"","emergencyContacts":[]}`;
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('Invalid format');
    return res.json({ success: true, ...JSON.parse(match[0]) });
  }
  
  return res.status(400).json({ success: false, message: 'Invalid AI action' });
}

module.exports = async (req, res) => {
  cors(res);
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    const url = req.url.replace('/api/', '').replace(/\?.*/, '');
    const parts = url.split('/').filter(Boolean);
    const resource = parts[0];
    const action = parts[1];
    const id = parts[2] || parts[1];
    
    switch (resource) {
      case 'health':
        return res.json({ status: 'OK', timestamp: new Date().toISOString() });
      case 'auth':
        return await handleAuth(req, res, action);
      case 'students':
        return await handleStudents(req, res, action, action && !['search'].includes(action) ? action : null);
      case 'drills':
        return await handleDrills(req, res, action, id);
      case 'modules':
        return await handleModules(req, res, action, action && !['progress'].includes(action) ? action : id);
      case 'alerts':
        return await handleAlerts(req, res, action, id);
      case 'dashboard':
        return await handleDashboard(req, res, action || 'stats');
      case 'ai':
        return await handleAI(req, res, action);
      default:
        return res.json({ 
          message: 'JAGRUK API', 
          version: '2.0', 
          endpoints: ['auth', 'students', 'drills', 'modules', 'alerts', 'dashboard', 'ai'] 
        });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Internal error' });
  }
};
