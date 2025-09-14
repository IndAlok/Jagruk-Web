# 🔧 Complete Environment Variables Configuration Guide for JAGRUK

## 📁 Client Environment Variables (.env in /client directory)

### 1. REACT_APP_API_URL
**Purpose**: Backend server URL for API calls
**Configuration**: 
- **Development**: `http://localhost:5000`
- **Production**: `https://your-domain.com` or `https://your-heroku-app.herokuapp.com`
**Manual Setup**: Change this to match your deployed backend URL
**Can Leave As Is**: ✅ Yes for local development

### 2. REACT_APP_FIREBASE_API_KEY
**Purpose**: Firebase project API key for web authentication
**Configuration Steps**:
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create new project or select existing
3. Go to Project Settings → General → Web Apps
4. Copy the `apiKey` value
**Example**: `AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
**Manual Setup**: ❌ MUST be configured
**Security**: Safe to expose in frontend (designed for public use)

### 3. REACT_APP_FIREBASE_AUTH_DOMAIN
**Purpose**: Firebase authentication domain
**Configuration**: From Firebase project settings
**Format**: `your-project-id.firebaseapp.com`
**Example**: `jagruk-disaster-mgmt.firebaseapp.com`
**Manual Setup**: ❌ MUST be configured

### 4. REACT_APP_FIREBASE_PROJECT_ID
**Purpose**: Unique Firebase project identifier
**Configuration**: From Firebase project settings
**Format**: Usually lowercase with hyphens
**Example**: `jagruk-disaster-mgmt`
**Manual Setup**: ❌ MUST be configured

### 5. REACT_APP_FIREBASE_STORAGE_BUCKET
**Purpose**: Firebase Cloud Storage bucket
**Configuration**: From Firebase project settings
**Format**: `your-project-id.appspot.com`
**Example**: `jagruk-disaster-mgmt.appspot.com`
**Manual Setup**: ❌ MUST be configured

### 6. REACT_APP_FIREBASE_MESSAGING_SENDER_ID
**Purpose**: Firebase Cloud Messaging sender ID
**Configuration**: From Firebase project settings
**Format**: Numeric string
**Example**: `123456789012`
**Manual Setup**: ❌ MUST be configured

### 7. REACT_APP_FIREBASE_APP_ID
**Purpose**: Unique Firebase app identifier
**Configuration**: From Firebase project settings
**Format**: `1:numbers:web:hexadecimal`
**Example**: `1:123456789012:web:abc123def456`
**Manual Setup**: ❌ MUST be configured

---

## 🖥️ Server Environment Variables (.env in /server directory)

### 1. NODE_ENV
**Purpose**: Application environment mode
**Options**: 
- `development` - Local development
- `production` - Live deployment
- `test` - Testing environment
**Manual Setup**: 
- Development: `development`
- Production: `production`
**Can Leave As Is**: ✅ Yes for development

### 2. PORT
**Purpose**: Server port number
**Default**: `5000`
**Configuration**: 
- Local: `5000` or any available port
- Heroku: Leave empty (auto-assigned)
- Other hosts: Check provider requirements
**Manual Setup**: ✅ Optional, defaults work fine

### 3. MONGODB_URI
**Purpose**: MongoDB database connection string
**Options**:

#### Local MongoDB:
```
mongodb://localhost:27017/jagruk-web
```

#### MongoDB Atlas (Cloud - Recommended):
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create free cluster
3. Create database user
4. Whitelist IP addresses
5. Get connection string
```
mongodb+srv://username:password@cluster.mongodb.net/jagruk-web
```

#### Docker MongoDB:
```
mongodb://mongo:27017/jagruk-web
```
**Manual Setup**: ❌ MUST be configured
**Security**: Keep credentials secure

### 4. JWT_SECRET
**Purpose**: Secret key for JSON Web Token signing
**Requirements**: 
- Minimum 32 characters
- Use random, complex string
- Different for each environment
**Generation Methods**:

#### Method 1 - Node.js:
```javascript
require('crypto').randomBytes(64).toString('hex')
```

#### Method 2 - Online Generator:
Use: https://generate-random.org/encryption-key-generator

#### Method 3 - Manual:
```
your_super_secret_jwt_key_here_make_it_at_least_32_characters_long_and_complex_123456789
```
**Manual Setup**: ❌ MUST be configured
**Security**: ⚠️ CRITICAL - Never expose publicly

### 5. FIREBASE_PROJECT_ID
**Purpose**: Firebase project ID for server-side operations
**Configuration**: Same as client's REACT_APP_FIREBASE_PROJECT_ID
**Manual Setup**: ❌ MUST be configured

### 6. FIREBASE_PRIVATE_KEY
**Purpose**: Firebase Admin SDK private key for server authentication
**Configuration Steps**:
1. Firebase Console → Project Settings
2. Service Accounts tab
3. Generate new private key
4. Download JSON file
5. Copy the `private_key` value
**Format**: 
```
"-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQ...\n-----END PRIVATE KEY-----\n"
```
**Manual Setup**: ❌ MUST be configured
**Security**: ⚠️ CRITICAL - Never expose publicly

### 7. FIREBASE_CLIENT_EMAIL
**Purpose**: Firebase service account email
**Configuration**: From the same JSON file as private key
**Format**: `firebase-adminsdk-xxxxx@project-id.iam.gserviceaccount.com`
**Manual Setup**: ❌ MUST be configured

### 8. EMAIL_FROM
**Purpose**: Sender email for system notifications
**Configuration**: Your system's email address
**Example**: `noreply@jagruk.com` or `notifications@yourdomain.com`
**Manual Setup**: ✅ Can use placeholder for development

### 9. EMAIL_SERVICE
**Purpose**: Email service provider
**Options**: `gmail`, `outlook`, `yahoo`, `smtp`
**Configuration**: Choose based on your email provider
**Manual Setup**: ✅ Can leave as `gmail` for development

### 10. EMAIL_USER
**Purpose**: Email account username
**Configuration**: Your actual email address
**Example**: `your-email@gmail.com`
**Manual Setup**: ❌ Required for email features

### 11. EMAIL_PASS
**Purpose**: Email account password or app password
**Gmail Setup**:
1. Enable 2-factor authentication
2. Go to Google Account settings
3. Security → App passwords
4. Generate app password
5. Use generated password (not your Gmail password)
**Manual Setup**: ❌ Required for email features
**Security**: ⚠️ Never expose publicly

### 12. CORS_ORIGIN
**Purpose**: Allowed origins for CORS (Cross-Origin Resource Sharing)
**Configuration**:
- Development: `http://localhost:3000`
- Production: `https://yourdomain.com`
**Multiple Origins**: `http://localhost:3000,https://yourdomain.com`
**Manual Setup**: ✅ Update for production deployment

### 13. RATE_LIMIT_WINDOW_MS
**Purpose**: Rate limiting time window in milliseconds
**Default**: `900000` (15 minutes)
**Configuration**: Adjust based on your needs
- Stricter: `300000` (5 minutes)
- Lenient: `1800000` (30 minutes)
**Can Leave As Is**: ✅ Yes, defaults are good

### 14. RATE_LIMIT_MAX_REQUESTS
**Purpose**: Maximum requests per time window per IP
**Default**: `100`
**Configuration**: Adjust based on expected usage
- High traffic: `500`
- Low traffic: `50`
**Can Leave As Is**: ✅ Yes, defaults are good

### 15. LOG_LEVEL
**Purpose**: Application logging level
**Options**: `error`, `warn`, `info`, `debug`
**Configuration**: 
- Production: `error` or `warn`
- Development: `info` or `debug`
**Can Leave As Is**: ✅ Yes

### 16. LOG_FILE
**Purpose**: Log file path
**Default**: `logs/app.log`
**Configuration**: Ensure logs directory exists
**Can Leave As Is**: ✅ Yes

---

## 🚀 Quick Setup Guide

### For Development (Local):
1. **Can Leave Default**: NODE_ENV, PORT, CORS_ORIGIN, rate limiting, logging
2. **Must Configure**: All Firebase variables, MongoDB URI, JWT_SECRET
3. **Optional**: Email variables (for testing password reset)

### For Production:
1. **Must Update**: NODE_ENV=production, CORS_ORIGIN, MongoDB URI (Atlas recommended)
2. **Must Configure**: All Firebase variables, strong JWT_SECRET
3. **Recommended**: Email configuration, proper logging levels

---

## 📋 Environment Files Templates

### Client .env Template:
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123:web:abc123
```

### Server .env Template:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/jagruk-web
JWT_SECRET=generate_a_very_long_random_secret_key_here_minimum_32_characters

FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_private_key_here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com

EMAIL_FROM=noreply@jagruk.com
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your_app_password

CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

LOG_LEVEL=info
LOG_FILE=logs/app.log
```

---

## ⚠️ Security Checklist

### ✅ Safe to Leave Default:
- PORT
- NODE_ENV (for development)
- Rate limiting values
- Log settings
- CORS_ORIGIN (for development)

### ❌ Must Configure (Critical):
- JWT_SECRET (generate unique, strong secret)
- All Firebase variables
- MongoDB URI with proper credentials
- FIREBASE_PRIVATE_KEY (keep secret!)

### 📧 Optional (for full functionality):
- Email configuration (needed for password reset)

### 🔒 Never Commit to Git:
- JWT_SECRET
- Database passwords
- Firebase private keys
- Email passwords
- Any production credentials

---

This guide covers everything needed for a perfect deployment. Start with the development setup using local MongoDB and basic Firebase configuration, then upgrade to production-ready settings when deploying.
