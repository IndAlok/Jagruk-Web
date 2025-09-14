# 🚀 Quick Start Guide for JAGRUK Development

## Prerequisites

- Node.js 16+ installed
- MongoDB installed locally OR MongoDB Atlas account
- Firebase account
- Git installed

## 📦 Installation Steps

### 1. Install Dependencies

```powershell
# Install server dependencies
cd server
npm install

# Install client dependencies  
cd ../client
npm install
```

### 2. Create Environment Files

#### Client .env (in /client directory):
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123:web:abc123
```

#### Server .env (in /server directory):
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/jagruk-web
JWT_SECRET=your_super_long_secret_key_minimum_32_characters

FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_private_key\n-----END PRIVATE KEY-----\n"
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

### 3. Start Development

```powershell
# Terminal 1: Start Server
cd server
npm run dev

# Terminal 2: Start Client  
cd client
npm start
```

## 🔑 Minimum Required Configuration

For basic functionality, you MUST configure:

1. **Firebase variables** (get from Firebase Console)
2. **JWT_SECRET** (generate random 32+ character string)
3. **MONGODB_URI** (local: `mongodb://localhost:27017/jagruk-web`)

## 📋 Default Login Credentials

After setup, create test accounts through the registration form:

- **Student**: Register with role "Student"
- **Admin/Staff**: Register with role "Staff" or "Admin"

## 🛠️ Troubleshooting

### Common Issues:

1. **"react-scripts not found"**:
   ```powershell
   cd client
   npm install
   ```

2. **MongoDB Connection Error**:
   - Ensure MongoDB is running: `mongod`
   - Or use MongoDB Atlas cloud URI

3. **Firebase Auth Errors**:
   - Double-check Firebase configuration
   - Ensure Authentication is enabled in Firebase Console

4. **Port Already in Use**:
   - Change PORT in server .env
   - Or stop other processes using port 5000

### Quick Fixes:

```powershell
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -r node_modules
npm install

# Check if ports are free
netstat -ano | findstr :5000
netstat -ano | findstr :3000
```

## 🌐 Access URLs

- **Client**: http://localhost:3000
- **Server API**: http://localhost:5000
- **API Documentation**: http://localhost:5000/api-docs (if implemented)

## 📱 Features Available

✅ **Ready to Use**:
- User registration/login (Student/Staff)
- Google OAuth authentication
- Real-time dashboard
- Student management (Admin)
- Alert system
- Drill scheduling

✅ **Test Data**:
- Register multiple students
- Create admin account
- Test real-time features
- Try Google login

This should get you up and running in under 10 minutes! 🚀
