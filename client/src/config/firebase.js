// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { doc, setDoc, getDoc, collection, serverTimestamp } from 'firebase/firestore';

// Firebase configuration - replace with your actual config
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "demo-api-key",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "jagruk-demo.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "jagruk-demo",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "jagruk-demo.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:123456789012:web:abcdef123456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);

// Connect to emulators in development
if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_USE_FIREBASE_EMULATOR === 'true') {
  try {
    connectAuthEmulator(auth, 'http://localhost:9099');
    connectFirestoreEmulator(db, 'localhost', 8080);
    connectStorageEmulator(storage, 'localhost', 9199);
    console.log('🔧 Connected to Firebase emulators');
  } catch (error) {
    console.log('⚡ Firebase emulators already connected or using production');
  }
}

// Helper functions for common operations
export const createUserProfile = async (user, additionalData) => {
  if (!user) return;
  
  const { displayName, email, uid } = user;
  const userRef = doc(db, 'users', uid);
  const snapShot = await getDoc(userRef);
  
  if (!snapShot.exists()) {
    try {
      await setDoc(userRef, {
        displayName: displayName || 'Anonymous',
        email,
        createdAt: serverTimestamp(),
        role: 'student', // default role
        isActive: true,
        ...additionalData
      });
    } catch (error) {
      console.log('Error creating user profile:', error.message);
    }
  }
  
  return userRef;
};

// Student profile creation
export const createStudentProfile = async (studentData) => {
  try {
    const studentRef = doc(collection(db, 'students'));
    await setDoc(studentRef, {
      ...studentData,
      createdAt: serverTimestamp(),
      modulesCompleted: 0,
      isActive: true
    });
    return studentRef.id;
  } catch (error) {
    console.error('Error creating student profile:', error);
    throw error;
  }
};

// Authentication status checker
export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged(userAuth => {
      unsubscribe();
      resolve(userAuth);
    }, reject);
  });
};

// Firestore collections references
export const getUsersCollection = () => collection(db, 'users');
export const getStudentsCollection = () => collection(db, 'students');
export const getDrillsCollection = () => collection(db, 'drills');
export const getModulesCollection = () => collection(db, 'modules');
export const getAlertsCollection = () => collection(db, 'alerts');
export const getAttendanceCollection = () => collection(db, 'attendance');

console.log('🔥 Firebase initialized successfully');

export default app;