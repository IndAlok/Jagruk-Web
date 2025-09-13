# Jagruk - Disaster Preparedness and Response Education System

## 🎯 Project Overview

Jagruk is a comprehensive web-based disaster management education platform designed for schools and colleges in India. Built for Smart India Hackathon 2025, this system provides interactive disaster education modules, virtual drills, and real-time emergency management tools.

## ✨ Key Features

### For Students
- 🔐 **Secure Authentication** (Email/Password + Google OAuth)
- 📚 **Interactive Learning Modules** on various disaster types
- 🏃 **Virtual Home Drills** with guided instructions
- 📱 **Real-time Emergency Alerts**
- 📊 **Progress Tracking** and achievement badges
- 🎮 **Gamified Learning Experience**

### For Staff/Administrators
- 👥 **Student Management System** with detailed analytics
- 📅 **Drill Scheduling** (Physical + Virtual)
- 📈 **Attendance Tracking** with class-wise reports
- 🚨 **Emergency Alert Broadcasting**
- 📊 **Comprehensive Dashboard** with insights
- 📋 **Module Assignment** and progress monitoring

## 🏗️ Technology Stack

### Frontend
- **React 18** with functional components and hooks
- **Material-UI 5** for modern, accessible UI components
- **Framer Motion** for smooth animations
- **Socket.io Client** for real-time communication
- **Recharts** for data visualization

### Backend
- **Node.js** with Express.js framework
- **Firebase Admin SDK** for authentication and database
- **Socket.io** for real-time features
- **JWT** for secure session management
- **Nodemailer** for email notifications

### Database
- **Firebase Firestore** for scalable NoSQL data storage
- **Real-time synchronization** for live updates
- **Optimized queries** for performance

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm 8+
- Firebase project with authentication enabled
- Git for version control

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/IndAlok/Jagruk-Web.git
cd Jagruk-Web
```

2. **Install dependencies**
```bash
npm install
```

3. **Firebase Setup**
   - Create a new Firebase project at https://console.firebase.google.com
   - Enable Authentication with Email/Password and Google providers
   - Create a Firestore database
   - Download service account key for Admin SDK
   - Get web app configuration

4. **Environment Configuration**

Create `server/.env`:
```env
PORT=5000
CLIENT_URL=http://localhost:3000

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour-private-key\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_DATABASE_URL=https://your-project-id-default-rtdb.firebaseio.com

# JWT Secret (use a secure random string)
JWT_SECRET=your-super-secret-jwt-key-here

# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

Create `client/.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api

# Firebase Web Configuration
REACT_APP_FIREBASE_API_KEY=your-web-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
```

5. **Run the application**
```bash
# Development mode (runs both client and server)
npm start

# Or run separately
npm run server  # Backend only
npm run client  # Frontend only
```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📖 Firebase Configuration Guide

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a project"
3. Enter project name: `jagruk-disaster-management`
4. Enable Google Analytics (optional)

### 2. Enable Authentication
1. Go to Authentication → Sign-in method
2. Enable "Email/Password"
3. Enable "Google" and configure OAuth consent screen

### 3. Create Firestore Database
1. Go to Firestore Database
2. Click "Create database"
3. Start in production mode
4. Choose location closest to your users

### 4. Generate Service Account Key
1. Go to Project Settings → Service Accounts
2. Click "Generate new private key"
3. Download the JSON file
4. Extract values for your `.env` file

### 5. Get Web App Config
1. Go to Project Settings → General
2. Scroll to "Your apps" section
3. Click "Web app" icon
4. Register your app
5. Copy configuration values

## 📱 API Integration for Mobile App

The backend provides RESTful APIs that can be easily integrated with mobile applications:

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register/student` - Student registration
- `POST /api/auth/register/staff` - Staff registration
- `POST /api/auth/google-login` - Google OAuth login

### Student Endpoints
- `GET /api/student/modules` - Get learning modules
- `POST /api/student/complete-module` - Mark module as completed
- `GET /api/student/drills` - Get assigned drills
- `POST /api/student/join-drill` - Join a drill session

### Admin Endpoints
- `GET /api/admin/students/:schoolId` - Get all students
- `POST /api/admin/schedule-drill` - Schedule a new drill
- `GET /api/admin/drill-attendance/:schoolId/:drillId` - Get attendance report
- `POST /api/admin/send-alert` - Send emergency alert

## 🗄️ Database Schema

### Collections Structure

#### Students Collection
```javascript
{
  uid: "firebase-user-id",
  admissionNumber: "ADM001",
  name: "Student Name",
  email: "student@example.com",
  class: 10,
  age: 16,
  schoolId: "school-unique-id",
  role: "student",
  modulesCompleted: ["earthquake", "flood"],
  drillsAttended: ["drill-id-1", "drill-id-2"],
  createdAt: "2024-01-15T10:30:00Z"
}
```

#### Staff Collection
```javascript
{
  uid: "firebase-user-id",
  employeeId: "EMP001",
  name: "Teacher Name",
  email: "teacher@example.com",
  designation: "Principal",
  schoolId: "school-unique-id",
  role: "staff",
  permissions: ["view_students", "schedule_drills"],
  createdAt: "2024-01-15T10:30:00Z"
}
```

#### Drills Collection
```javascript
{
  title: "Fire Drill Practice",
  description: "Monthly fire evacuation drill",
  type: "physical", // or "virtual"
  scheduledDate: "2024-02-15T14:00:00Z",
  duration: 30, // minutes
  schoolId: "school-unique-id",
  targetClasses: [9, 10, 11, 12],
  status: "scheduled", // scheduled, active, completed
  participants: ["student-uid-1", "student-uid-2"]
}
```

## 🎨 UI/UX Features

- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Dark/Light Theme** - Automatic theme switching based on user preference
- **Smooth Animations** - Framer Motion for engaging user interactions
- **Accessibility** - WCAG compliant with screen reader support
- **Progressive Web App** - Offline capability and app-like experience

## 🔒 Security Features

- **Firebase Authentication** - Industry-standard security
- **JWT Tokens** - Secure API access with expiring tokens
- **Input Validation** - Server-side validation for all inputs
- **CORS Protection** - Configured for secure cross-origin requests
- **Environment Variables** - Sensitive data secured in environment files

## 📊 Monitoring & Analytics

- **Real-time User Activity** - Live dashboard showing active users
- **Drill Participation Metrics** - Track engagement and completion rates
- **Learning Progress Analytics** - Monitor educational outcomes
- **Emergency Response Times** - Measure system effectiveness

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Deployment Options
- **Heroku** - Easy deployment with Git integration
- **Vercel** - Optimized for React applications
- **Firebase Hosting** - Seamless integration with Firebase backend
- **AWS/DigitalOcean** - Full control over infrastructure

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support and questions:
- Create an issue in the repository
- Email: support@jagruk.edu
- Documentation: [Wiki](https://github.com/IndAlok/Jagruk-Web/wiki)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏆 Smart India Hackathon 2025

This project addresses Problem Statement ID **25008**: "Disaster Preparedness and Response Education System for Schools and Colleges" under the Disaster Management theme by the Government of Punjab, Department of Higher Education.

---

**Built with ❤️ for a safer, more prepared India**