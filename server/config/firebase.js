const admin = require('firebase-admin');
require('dotenv').config();

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

if (!projectId || !clientEmail || !privateKey) {
  console.error('Firebase Admin SDK credentials missing. Check your .env file.');
  process.exit(1);
}

const serviceAccount = {
  type: 'service_account',
  project_id: projectId,
  private_key: privateKey,
  client_email: clientEmail,
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: projectId
  });
}

const db = admin.firestore();
const auth = admin.auth();

module.exports = { admin, db, auth };