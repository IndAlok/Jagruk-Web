# 🔥 Firebase Setup Guide for JAGRUK

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a project" or "Add project"
3. Enter project name: `jagruk-disaster-mgmt` (or any name you prefer)
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Authentication

1. In Firebase Console, go to **Authentication** → **Get started**
2. Go to **Sign-in method** tab
3. Enable the following providers:
   - **Email/Password**: Enable this
   - **Google**: Enable this (you'll need to set up OAuth consent screen)

### Google OAuth Setup:
1. Click on Google provider
2. Enable it
3. Add your email as a test user
4. Set support email
5. Save configuration

## Step 3: Create Firestore Database

1. Go to **Firestore Database** → **Create database**
2. Choose **Start in test mode** (for development)
3. Select a location closest to your users
4. Click **Done**

### Security Rules (Update after testing):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Students can read/write their own data
    match /students/{studentId} {
      allow read, write: if request.auth != null && request.auth.uid == studentId;
    }
    
    // Staff can read all student data
    match /students/{document=**} {
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/staff/$(request.auth.uid)).data.role in ['staff', 'admin'];
    }
    
    // Similar rules for other collections...
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Step 4: Get Web App Configuration

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to **Your apps** section
3. Click **Web** icon (`</>`)
4. Register your app with nickname: "JAGRUK Web"
5. Copy the configuration object:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456ghi789"
};
```

## Step 5: Create Service Account (For Server)

1. Go to **Project Settings** → **Service accounts** tab
2. Click **Generate new private key**
3. Download the JSON file
4. **IMPORTANT**: Keep this file secure and never commit to Git!

The JSON file contains:
```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "...",
  "client_x509_cert_url": "..."
}
```

## Step 6: Configure Environment Variables

### Client .env file:
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_FIREBASE_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789012
REACT_APP_FIREBASE_APP_ID=1:123456789012:web:abc123def456ghi789
```

### Server .env file:
```env
# ... other variables ...
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQ...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
```

## Step 7: Test Firebase Connection

Create a test file to verify your Firebase setup:

```javascript
// test-firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  // Your config here
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

console.log('Firebase initialized successfully');
console.log('Auth:', auth);
console.log('Firestore:', db);
```

## Step 8: MongoDB Atlas Setup (Recommended Database)

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create free account
3. Create new cluster (free tier)
4. Create database user:
   - Username: `jagruk_user`
   - Password: Generate secure password
5. Whitelist IP addresses:
   - Add `0.0.0.0/0` for development (restrict in production)
6. Get connection string:
   ```
   mongodb+srv://jagruk_user:your_password@cluster0.xxxxx.mongodb.net/jagruk-web
   ```

## Step 9: JWT Secret Generation

Generate a secure JWT secret:

### Method 1 (Node.js):
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Method 2 (Online):
Visit: https://generate-random.org/encryption-key-generator
- Select: 256-bit
- Format: Hex

### Method 3 (Manual):
Create a random string with at least 32 characters:
```
jagruk_disaster_management_super_secure_jwt_secret_key_2024_v1_production_ready
```

## Step 10: Email Configuration (Gmail Example)

1. Enable 2-factor authentication on Gmail
2. Go to Google Account → Security → App passwords
3. Generate app password for "Mail"
4. Use this password in EMAIL_PASS (not your regular Gmail password)

```env
EMAIL_FROM=noreply@yourdomain.com
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=generated_app_password_here
```

## Step 11: Final Environment Files

### Client .env:
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_FIREBASE_API_KEY=your_actual_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789012
REACT_APP_FIREBASE_APP_ID=1:123456789012:web:abc123def456
```

### Server .env:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://jagruk_user:your_password@cluster0.xxxxx.mongodb.net/jagruk-web
JWT_SECRET=your_generated_jwt_secret_minimum_32_characters

FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_actual_private_key\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com

EMAIL_FROM=noreply@jagruk.com
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your_gmail_app_password

CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

LOG_LEVEL=info
LOG_FILE=logs/app.log
```

## ⚠️ Security Reminders

1. **Never commit .env files to Git**
2. **Keep Firebase private key secure**
3. **Use strong, unique JWT secrets**
4. **Restrict MongoDB IP whitelist in production**
5. **Use environment-specific configurations**

## 🧪 Testing Your Setup

1. Start the server: `npm run dev`
2. Check console for "Connected to MongoDB" and "Firebase Admin initialized"
3. Start the client: `npm start`
4. Try registering a new user
5. Test Google login functionality

Your Firebase and environment setup is now complete! 🎉
