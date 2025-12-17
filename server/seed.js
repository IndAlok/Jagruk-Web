require('dotenv').config();
const bcrypt = require('bcryptjs');
const { db, auth } = require('./config/firebase');

async function seedDatabase() {
  console.log('Starting database seed...');

  try {
    const adminEmail = 'admin@jagruk.edu';
    const adminPassword = 'admin123';
    
    const adminQuery = await db.collection('admins').where('email', '==', adminEmail).get();
    
    if (adminQuery.empty) {
      const hashedPassword = await bcrypt.hash(adminPassword, 12);
      
      let firebaseUser;
      try {
        firebaseUser = await auth.createUser({
          email: adminEmail,
          password: adminPassword,
          displayName: 'System Administrator'
        });
        console.log('Firebase Auth user created');
      } catch (error) {
        if (error.code === 'auth/email-already-exists') {
          firebaseUser = await auth.getUserByEmail(adminEmail);
          console.log('Firebase Auth user already exists');
        } else {
          throw error;
        }
      }

      await db.collection('admins').doc(firebaseUser.uid).set({
        uid: firebaseUser.uid,
        name: 'System Administrator',
        email: adminEmail,
        phone: '+91 9876543210',
        role: 'admin',
        status: 'active',
        hashedPassword,
        adminId: 'ADM-001',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      console.log('Admin user created successfully');
      console.log(`Email: ${adminEmail}`);
      console.log(`Password: ${adminPassword}`);
    } else {
      console.log('Admin user already exists');
    }

    const modulesSnap = await db.collection('modules').get();
    if (modulesSnap.empty) {
      console.log('Seeding educational modules...');
      
      const modules = [
        {
          title: 'Earthquake Safety',
          category: 'Natural Disasters',
          description: 'Learn essential safety measures during earthquakes.',
          difficulty: 'beginner',
          duration: 30,
          points: 50,
          isActive: true,
          content: {
            sections: [
              { title: 'Before', content: 'Prepare emergency kit, secure furniture.' },
              { title: 'During', content: 'Drop, Cover, Hold On.' },
              { title: 'After', content: 'Check for injuries, evacuate if needed.' }
            ]
          },
          quiz: [
            {
              question: 'What should you do during an earthquake?',
              options: ['Run outside', 'Drop, Cover, Hold On', 'Stand near window', 'Use elevator'],
              correctAnswer: 1
            }
          ],
          createdAt: new Date().toISOString()
        },
        {
          title: 'Fire Safety',
          category: 'Emergency Response',
          description: 'Fire prevention and evacuation procedures.',
          difficulty: 'beginner',
          duration: 25,
          points: 50,
          isActive: true,
          content: {
            sections: [
              { title: 'Prevention', content: 'Never leave cooking unattended.' },
              { title: 'Response', content: 'Alert others, use stairs not elevators.' },
              { title: 'Evacuation', content: 'Stay low, feel doors before opening.' }
            ]
          },
          quiz: [
            {
              question: 'What should you use during fire evacuation?',
              options: ['Elevator', 'Stairs', 'Window', 'Wait for help'],
              correctAnswer: 1
            }
          ],
          createdAt: new Date().toISOString()
        },
        {
          title: 'Flood Preparedness',
          category: 'Natural Disasters',
          description: 'How to prepare for and respond to floods.',
          difficulty: 'intermediate',
          duration: 35,
          points: 60,
          isActive: true,
          content: {
            sections: [
              { title: 'Warning Signs', content: 'Heavy rainfall, rising water levels.' },
              { title: 'During', content: 'Move to higher ground, avoid moving water.' },
              { title: 'After', content: 'Return only when authorities say safe.' }
            ]
          },
          quiz: [
            {
              question: 'Where should you go during a flood?',
              options: ['Basement', 'Higher ground', 'Near river', 'Outside'],
              correctAnswer: 1
            }
          ],
          createdAt: new Date().toISOString()
        }
      ];

      for (const module of modules) {
        await db.collection('modules').add(module);
      }
      
      console.log(`Created ${modules.length} educational modules`);
    }

    console.log('\nDatabase seed completed successfully!');
    console.log('\nYou can now login with:');
    console.log('Email: admin@jagruk.edu');
    console.log('Password: admin123');
    
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
  
  process.exit(0);
}

seedDatabase();
