# 🚨 Jagruk - Advanced Disaster Management & Safety Education System

[![Smart India Hackathon 2025](https://img.shields.io/badge/SIH_2025-Problem_ID_25008-FF6B35.svg?style=for-the-badge)](https://sih.gov.in)
[![React](https://img.shields.io/badge/React-18.2.0-61DAFB.svg?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933.svg?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-9.17.1-FFCA28.svg?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
[![Material-UI](https://img.shields.io/badge/Material--UI-5.11.10-0081CB.svg?style=for-the-badge&logo=material-ui)](https://mui.com/)

## 🎯 Project Overview

**Jagruk** is a comprehensive, real-time disaster preparedness and response education system designed specifically for Indian schools and colleges. Built with modern web technologies, it provides an integrated platform for disaster education, emergency drill management, and crisis response coordination.

### 🏆 Smart India Hackathon 2025 Solution
- **Problem Statement ID**: 25008
- **Theme**: Disaster Management
- **Ministry**: Government of Punjab, Department of Higher Education
- **Challenge**: Disaster Preparedness and Response Education System for Schools and Colleges

## ✨ Key Features & Capabilities

### 👨‍🎓 For Students
- 🔐 **Multi-Auth System** - Email/Password, Google OAuth, and demo accounts
- � **Complete Profile Management** - Comprehensive profile system with Google OAuth integration
- �📚 **Interactive Learning Modules** - Earthquake, Fire, Flood, Cyclone education
- 🏠 **Virtual Home Drills** - Step-by-step guided safety procedures
- 📱 **Real-time Emergency Alerts** - Instant notifications and instructions
- 🎮 **Gamified Experience** - Progress tracking, badges, and achievements
- 📊 **Personal Dashboard** - Learning progress and drill participation history
- 🌙 **Dark/Light Theme** - Adaptive UI with smooth transitions

### 👩‍🏫 For Staff & Teachers  
- 👥 **Advanced Student Management** - Complete student lifecycle management
- 👤 **Staff Profile System** - Comprehensive staff information management
- 📅 **Smart Drill Scheduling** - Automated and manual drill coordination
- 📈 **Real-time Analytics** - Class-wise participation and progress reports
- 🚨 **Emergency Broadcasting** - Instant alert system with multi-channel delivery
- 📋 **Module Assignment** - Customized learning paths for different classes
- 🎯 **Performance Insights** - Individual and collective progress monitoring

### 👨‍💼 For Administrators
- 🏗️ **Comprehensive Admin Dashboard** - Real-time system overview and statistics
- 👤 **Admin Profile Management** - Complete administrative profile system
- 🔧 **System Configuration** - Theme settings, notification preferences, and system parameters
- 📊 **Advanced Analytics** - Detailed reports and data visualization
- 🛡️ **Security Management** - User roles, permissions, and access control
- 🔔 **Notification Center** - System alerts and communication management
- 📱 **Mobile-Responsive Interface** - Full functionality across all devices

## 👤 Profile Management System

### ✨ Complete Profile Experience
- **📝 Role-Based Forms** - Customized profile fields based on user role (Student/Staff/Admin)
- **🔗 Google OAuth Integration** - Seamless profile completion for Google sign-in users
- **📸 Photo Upload** - Profile photo management with placeholder support
- **🔒 Security Settings** - Password management and two-factor authentication
- **📱 Notification Preferences** - Granular control over alert types and delivery methods
- **✏️ Edit & Update** - Real-time profile editing with validation
- **📊 Progress Tracking** - Profile completion status for Google users

### 🎯 Role-Specific Features

#### Students
- Admission Number, Class, Roll Number
- Parent Contact Information
- Subject Preferences
- Academic Progress Integration

#### Staff
- Employee ID, Department, Designation
- Qualification and Experience
- Emergency Contact Details
- Teaching Subjects and Classes

#### Admins
- Administrative ID and School Details
- District and State Information
- School Management Preferences
- System Configuration Access

## 🏗️ Technology Architecture

### Frontend Stack
```
React 18.2.0          - Modern functional components with hooks
Material-UI 5.11.10   - Professional UI component library
Framer Motion 10.18.0 - Smooth animations and micro-interactions
React Router 6.30.1   - Advanced routing with nested routes
Socket.IO Client      - Real-time bidirectional communication
Axios 1.3.4           - HTTP client with interceptors
React Toastify        - Beautiful notification system
Recharts 2.5.0        - Interactive data visualization
```

### Backend Infrastructure
```
Node.js 18.x          - High-performance JavaScript runtime
Express.js 4.18.2     - Robust web application framework
Firebase Admin 11.5.0 - Authentication and database management
Socket.IO 4.6.1       - Real-time event-driven architecture
JWT 9.0.0             - Secure token-based authentication
Winston 3.8.2         - Advanced logging and monitoring
Nodemailer 6.9.1      - Email notification system
Express Rate Limit    - API security and rate limiting
```

### Database & Storage
```
Firebase Firestore    - NoSQL document database with real-time sync
Firebase Auth         - Secure user authentication and management
Firebase Storage      - File uploads and media management
Real-time Sync        - Live data updates across all clients
```

## 📁 Project Structure

```
Jagruk-Web/
├── 📂 client/                          # React Frontend Application
│   ├── 📂 public/                      # Static assets
│   │   ├── index.html                  # Main HTML template
│   │   ├── manifest.json               # PWA configuration
│   │   └── favicon.ico                 # App icon
│   ├── 📂 src/                         # Source code
│   │   ├── 📂 components/              # React Components
│   │   │   ├── 📂 Auth/                # Authentication components
│   │   │   │   ├── Login.js            # Advanced login with demo accounts
│   │   │   │   └── Register.js         # Multi-role registration system
│   │   │   ├── 📂 Common/              # Shared components
│   │   │   │   └── LoadingScreen.js    # Animated loading screens
│   │   │   ├── 📂 Dashboard/           # Dashboard components
│   │   │   │   ├── AdminDashboard.js   # Comprehensive admin interface
│   │   │   │   ├── ModernAdminDashboard.js # Enhanced admin features
│   │   │   │   ├── StudentDashboard.js # Student learning interface
│   │   │   │   ├── StaffDashboard.js   # Staff management interface
│   │   │   │   ├── SecurityDrills.js   # Drill management system
│   │   │   │   └── UserManagement.js   # User administration
│   │   │   ├── AdminDashboard.js       # Main admin component
│   │   │   ├── Login.js                # Authentication interface
│   │   │   ├── ProtectedRoute.js       # Route protection
│   │   │   ├── Register.js             # User registration
│   │   │   ├── StaffDashboard.js       # Staff interface
│   │   │   └── StudentDashboard.js     # Student interface
│   │   ├── 📂 contexts/                # React Context Providers
│   │   │   ├── AuthContext.js          # Authentication state management
│   │   │   ├── SocketContext.js        # Real-time communication
│   │   │   └── ThemeContext.js         # Theme and UI state management
│   │   ├── 📂 services/                # API and external services
│   │   │   └── api.js                  # Comprehensive API client
│   │   ├── 📂 config/                  # Configuration files
│   │   │   └── firebase.js             # Firebase client configuration
│   │   ├── App.js                      # Main application component
│   │   ├── index.js                    # React application entry point
│   │   └── index.css                   # Global styles
│   ├── package.json                    # Frontend dependencies
│   └── 📂 build/                       # Production build output
├── 📂 server/                          # Node.js Backend Application
│   ├── 📂 config/                      # Server configuration
│   │   ├── firebase.js                 # Firebase Admin SDK setup
│   │   └── logger.js                   # Winston logging configuration
│   ├── 📂 middleware/                  # Express middleware
│   │   ├── auth.js                     # Authentication middleware
│   │   ├── rateLimiter.js             # API rate limiting
│   │   └── validation.js               # Input validation middleware
│   ├── 📂 routes/                      # API route handlers
│   │   ├── admin.js                    # Admin-specific endpoints
│   │   ├── alerts.js                   # Emergency alert system
│   │   ├── attendance.js               # Drill attendance tracking
│   │   ├── auth.js                     # Authentication endpoints
│   │   ├── dashboard.js                # Dashboard data endpoints
│   │   ├── drills.js                   # Drill management API
│   │   ├── modules.js                  # Learning module API
│   │   ├── settings.js                 # System configuration API
│   │   ├── student.js                  # Student-specific endpoints
│   │   └── students.js                 # Student management API
│   ├── 📂 functions/                   # Firebase Cloud Functions
│   │   ├── src/                        # TypeScript source code
│   │   ├── package.json                # Cloud Functions dependencies
│   │   └── tsconfig.json               # TypeScript configuration
│   ├── 📂 dataconnect/                 # Firebase Data Connect
│   │   ├── dataconnect.yaml           # Data Connect configuration
│   │   ├── schema/                     # Database schema definitions
│   │   └── example/                    # Example queries and connectors
│   ├── 📂 logs/                        # Application logs
│   │   ├── combined.log                # All application logs
│   │   └── error.log                   # Error-specific logs
│   ├── index.js                        # Server entry point
│   ├── package.json                    # Backend dependencies
│   ├── firestore.rules                # Database security rules
│   └── firestore.indexes.json         # Database index definitions
├── 📄 firebase.json                    # Firebase project configuration
├── 📄 package.json                     # Root project configuration
├── 📄 README.md                        # Project documentation
├── 📄 LICENSE                          # MIT License
├── 📄 ENVIRONMENT_SETUP.md            # Environment setup guide
├── 📄 FIREBASE_SETUP_GUIDE.md         # Firebase configuration guide
├── 📄 DETAILED_ENV_GUIDE.md           # Detailed environment variables
├── 📄 QUICK_START.md                  # Quick start instructions
└── 🚀 start.bat / start.ps1           # Platform-specific startup scripts
```

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** 18.x or later
- **npm** 8.x or later  
- **Git** for version control
- **Firebase Account** with Firestore and Auth enabled

### 1. Clone & Setup
```bash
# Clone the repository
git clone https://github.com/IndAlok/Jagruk-Web.git
cd Jagruk-Web

# Install all dependencies (frontend + backend)
npm install
```

### 2. Firebase Configuration

#### Create Firebase Project
1. Visit [Firebase Console](https://console.firebase.google.com)
2. Create new project: `jagruk-disaster-management`
3. Enable Google Analytics (recommended)

#### Enable Authentication
```bash
# Enable the following sign-in methods:
# - Email/Password ✓
# - Google ✓
# - Anonymous (optional)
```

#### Setup Firestore Database
```bash
# Create Firestore database in production mode
# Choose location closest to your target users
# Apply provided security rules from firestore.rules
```

### 3. Environment Variables

#### Server Configuration (`server/.env`)
```env
# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# Firebase Admin SDK Configuration
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_DATABASE_URL=https://your-project-id-default-rtdb.firebaseio.com

# Security Configuration
JWT_SECRET=your-ultra-secure-jwt-secret-key-minimum-32-characters
JWT_EXPIRES_IN=24h
BCRYPT_ROUNDS=12

# Email Service Configuration (for notifications)
EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password

# Rate Limiting Configuration
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging Configuration
LOG_LEVEL=info
LOG_FILE=logs/combined.log
ERROR_LOG_FILE=logs/error.log
```

#### Client Configuration (`client/.env`)
```env
# API Configuration
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SOCKET_URL=http://localhost:5000

# Firebase Web SDK Configuration
REACT_APP_FIREBASE_API_KEY=your-web-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
REACT_APP_FIREBASE_MEASUREMENT_ID=your-measurement-id

# Application Configuration
REACT_APP_APP_NAME=Jagruk
REACT_APP_VERSION=1.0.0
REACT_APP_ENVIRONMENT=development

# Feature Flags
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_ENABLE_PWA=true
REACT_APP_ENABLE_NOTIFICATIONS=true
```

### 4. Launch Application
```bash
# Start both frontend and backend concurrently
npm start

# Or run them separately:
npm run server  # Backend only (http://localhost:5000)
npm run client  # Frontend only (http://localhost:3000)

# Build for production
npm run build
```

## 🎮 Demo Accounts & Testing

### Quick Login Credentials
```javascript
// Student Account
Email: student@jagruk.edu
Password: student123

// Staff Account  
Email: staff@jagruk.edu
Password: staff123

// Admin Account
Email: admin@jagruk.edu
Password: admin123
```

### Features Available in Demo Mode
- ✅ Full authentication flow
- ✅ Role-based dashboard access
- ✅ Real-time data visualization
- ✅ Interactive UI components
- ✅ Theme switching (Dark/Light mode)
- ✅ Responsive design testing
- ✅ API integration demonstration

## 📊 Database Schema & Architecture

### Firestore Collections Structure

#### 🎓 Students Collection
```javascript
students/{studentId} {
  // Authentication Data
  uid: "firebase-auth-uid",
  email: "student@school.edu",
  emailVerified: true,
  
  // Personal Information
  name: "Student Full Name",
  admissionNumber: "2024/STU/001",
  class: "10-A",
  rollNumber: 15,
  dateOfBirth: "2008-05-15",
  gender: "male|female|other",
  contactNumber: "+91-9876543210",
  parentContact: "+91-9876543211",
  address: "Complete Address",
  
  // Academic Information
  schoolId: "school-unique-identifier",
  academicYear: "2024-25",
  section: "A",
  subjects: ["math", "science", "english"],
  
  // System Information
  role: "student",
  status: "active|inactive|suspended",
  createdAt: "2024-01-15T10:30:00.000Z",
  updatedAt: "2024-01-15T10:30:00.000Z",
  lastLogin: "2024-01-15T10:30:00.000Z",
  
  // Learning Progress
  moduleProgress: {
    earthquake: {
      completed: true,
      score: 85,
      completedAt: "2024-01-10T14:20:00.000Z",
      timeSpent: 1800 // seconds
    },
    fire: {
      completed: false,
      progress: 60,
      lastAccessedAt: "2024-01-14T16:45:00.000Z"
    }
  },
  
  // Drill Participation
  drillHistory: [
    {
      drillId: "drill-001",
      participated: true,
      attendanceTime: "2024-01-12T09:15:30.000Z",
      performance: "excellent|good|average|poor"
    }
  ],
  drillsAttended: 15,
  totalDrillsScheduled: 18,
  attendanceRate: 83.33,
  
  // Achievements & Gamification
  badges: ["fire-safety-expert", "earthquake-prepared"],
  totalPoints: 1250,
  level: 5,
  achievements: [
    {
      title: "Fire Safety Champion",
      earnedAt: "2024-01-10T14:20:00.000Z",
      description: "Completed all fire safety modules"
    }
  ]
}
```

#### 👨‍🏫 Staff Collection
```javascript
staff/{staffId} {
  // Authentication Data
  uid: "firebase-auth-uid",
  email: "teacher@school.edu",
  emailVerified: true,
  
  // Personal Information
  name: "Teacher Full Name",
  employeeId: "EMP/2024/001",
  designation: "Principal|Vice-Principal|Teacher|Coordinator",
  department: "Science|Mathematics|Administration",
  contactNumber: "+91-9876543210",
  emergencyContact: "+91-9876543211",
  
  // Professional Information
  schoolId: "school-unique-identifier",
  joinDate: "2020-06-15",
  qualification: "B.Ed, M.Sc Physics",
  experience: 5, // years
  
  // System Information
  role: "staff",
  status: "active|inactive|on-leave",
  permissions: [
    "view_students",
    "schedule_drills", 
    "send_notifications",
    "generate_reports",
    "manage_modules"
  ],
  createdAt: "2024-01-15T10:30:00.000Z",
  updatedAt: "2024-01-15T10:30:00.000Z",
  lastLogin: "2024-01-15T10:30:00.000Z",
  
  // Assigned Responsibilities
  assignedClasses: ["10-A", "10-B", "11-A"],
  subjects: ["Physics", "General Science"],
  
  // Performance Metrics
  drillsScheduled: 25,
  studentsManaged: 150,
  modulesAssigned: 45,
  reportingMetrics: {
    averageAttendance: 92.5,
    studentEngagement: 88.2,
    drillEffectiveness: 95.1
  }
}
```

#### 🚨 Drills Collection
```javascript
drills/{drillId} {
  // Basic Information
  title: "Monthly Fire Evacuation Drill",
  description: "Practice fire evacuation procedures for all students",
  type: "fire|earthquake|flood|cyclone|lockdown|general",
  category: "physical|virtual|hybrid",
  
  // Scheduling Information
  scheduledDate: "2024-02-15T10:00:00.000Z",
  duration: 30, // minutes
  estimatedDuration: 25,
  actualStartTime: "2024-02-15T10:02:00.000Z",
  actualEndTime: "2024-02-15T10:28:00.000Z",
  
  // Scope & Targeting
  schoolId: "school-unique-identifier",
  targetClasses: ["9-A", "9-B", "10-A", "10-B"],
  targetBuildings: ["main-building", "science-block"],
  evacuationRoutes: ["route-1", "route-2", "route-3"],
  assemblyPoints: ["ground-1", "ground-2"],
  
  // Participation Management
  participants: ["student-uid-1", "student-uid-2"],
  totalParticipants: 200,
  mandatoryParticipants: ["student-uid-1"],
  optionalParticipants: ["student-uid-2"],
  
  // Status & Progress
  status: "scheduled|active|completed|cancelled|postponed",
  isActive: true,
  completionPercentage: 85.5,
  
  // Attendance Tracking
  attendance: {
    "student-uid-1": {
      marked: true,
      timestamp: "2024-02-15T10:05:00.000Z",
      location: "assembly-point-1",
      responseTime: 180, // seconds
      performance: "excellent"
    }
  },
  attendanceCount: 170,
  attendanceRate: 85.0,
  
  // Performance Metrics
  averageResponseTime: 165, // seconds
  quickestResponseTime: 45,
  slowestResponseTime: 300,
  performanceDistribution: {
    excellent: 45,
    good: 85,
    average: 35,
    poor: 5
  },
  
  // Staff Management
  coordinators: ["staff-uid-1", "staff-uid-2"],
  createdBy: "staff-uid-1",
  supervisors: ["staff-uid-3"],
  
  // Instructions & Resources
  instructions: {
    pre_drill: "Announcement will be made at 10:00 AM",
    during_drill: "Follow designated evacuation routes",
    post_drill: "Assemble at designated points for attendance"
  },
  resources: [
    {
      type: "document",
      url: "https://storage.googleapis.com/...",
      title: "Fire Safety Procedures"
    }
  ],
  
  // Weather & Environmental Conditions
  weatherConditions: {
    temperature: 28, // celsius
    humidity: 65,
    windSpeed: 12, // kmph
    conditions: "clear|cloudy|rainy|stormy"
  },
  
  // Metadata
  createdAt: "2024-02-10T14:30:00.000Z",
  updatedAt: "2024-02-15T10:28:00.000Z",
  version: 1,
  tags: ["monthly-drill", "fire-safety", "building-evacuation"]
}
```

#### 🚨 Alerts & Notifications Collection
```javascript
alerts/{alertId} {
  // Alert Classification
  title: "Emergency Weather Alert",
  message: "Heavy rainfall warning issued for next 2 hours. Stay indoors.",
  type: "weather|security|fire|earthquake|flood|system|maintenance",
  priority: "low|medium|high|critical|emergency",
  severity: 1-10, // 1=informational, 10=life-threatening
  
  // Targeting & Scope
  schoolId: "school-unique-identifier",
  targetAudience: "all|students|staff|specific-class|specific-user",
  targetGroups: ["10-A", "11-B"], // if specific targeting
  targetUsers: ["user-uid-1"], // if individual targeting
  buildingAreas: ["main-building", "hostel", "playground"],
  
  // Timing & Status
  isActive: true,
  isUrgent: false,
  scheduledTime: "2024-02-15T14:00:00.000Z", // for scheduled alerts
  expiresAt: "2024-02-15T18:00:00.000Z",
  
  // Delivery Channels
  channels: ["app-notification", "email", "sms", "announcement"],
  deliveryStatus: {
    app: {
      sent: 450,
      delivered: 440,
      failed: 10,
      opened: 320
    },
    email: {
      sent: 450,
      delivered: 445,
      failed: 5,
      opened: 200
    }
  },
  
  // User Interactions
  acknowledgments: {
    "user-uid-1": {
      acknowledgedAt: "2024-02-15T14:05:00.000Z",
      status: "safe|need-help|evacuated"
    }
  },
  totalAcknowledgments: 380,
  acknowledgmentRate: 84.4,
  
  // Rich Content
  mediaAttachments: [
    {
      type: "image|video|audio|document",
      url: "https://storage.googleapis.com/...",
      description: "Weather radar showing storm pattern"
    }
  ],
  actionButtons: [
    {
      text: "Mark Safe",
      action: "mark_safe",
      color: "green"
    },
    {
      text: "Need Help",
      action: "request_help", 
      color: "red"
    }
  ],
  
  // Location & Geographic Data
  affectedAreas: ["North Wing", "Playground", "Parking Area"],
  coordinates: {
    latitude: 28.7041,
    longitude: 77.1025
  },
  radius: 500, // meters
  
  // Escalation & Follow-up
  escalationLevel: 1, // 1-5
  parentAlert: "parent-alert-id", // if this is an update
  childAlerts: ["child-alert-1"], // if this spawned other alerts
  followUpRequired: true,
  followUpScheduled: "2024-02-15T16:00:00.000Z",
  
  // Administrative Information
  createdBy: "staff-uid-1",
  approvedBy: "admin-uid-1", // for high-priority alerts
  lastModifiedBy: "staff-uid-1",
  createdAt: "2024-02-15T13:45:00.000Z",
  updatedAt: "2024-02-15T13:45:00.000Z",
  
  // Analytics & Reporting
  responseMetrics: {
    averageResponseTime: 120, // seconds
    quickestResponse: 30,
    slowestResponse: 600,
    totalResponses: 380
  },
  
  // Integration Data
  externalReferences: {
    weatherServiceId: "WS-2024-02-15-001",
    emergencyServiceTicket: "ES-TICKET-001"
  }
}
```

## 🔧 Advanced Configuration

### Firebase Security Rules
```javascript
// Firestore Security Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Students can only read/write their own data
    match /students/{studentId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == studentId;
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/staff/$(request.auth.uid)).data.role in ['staff', 'admin'];
    }
    
    // Staff can read all students in their school
    match /staff/{staffId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == staffId;
    }
    
    // Drill access based on participation
    match /drills/{drillId} {
      allow read: if request.auth != null &&
        (request.auth.uid in resource.data.participants ||
         get(/databases/$(database)/documents/staff/$(request.auth.uid)).data.role in ['staff', 'admin']);
      allow write: if request.auth != null &&
        get(/databases/$(database)/documents/staff/$(request.auth.uid)).data.role in ['staff', 'admin'];
    }
    
    // Alerts are readable by all authenticated users
    match /alerts/{alertId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
        get(/databases/$(database)/documents/staff/$(request.auth.uid)).data.role in ['staff', 'admin'];
    }
  }
}
```

### API Rate Limiting Configuration
```javascript
// Express Rate Limiting Setup
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // Limit each IP to 5 auth requests per windowMs
  message: 'Too many authentication attempts, please try again later.',
});
```

## 🔌 API Documentation

### Authentication Endpoints

#### POST `/api/auth/login`
```javascript
// Request
{
  "email": "student@jagruk.edu",
  "password": "student123",
  "role": "student" // optional, auto-detected
}

// Response
{
  "success": true,
  "message": "Login successful",
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "email": "student@jagruk.edu", 
    "name": "Student Name",
    "role": "student",
    "schoolId": "school-id",
    "isDemo": true
  }
}
```

#### POST `/api/auth/register`
```javascript
// Request
{
  "name": "New Student",
  "email": "newstudent@school.edu",
  "password": "securepassword",
  "role": "student",
  "schoolId": "school-id",
  "class": "10-A",
  "admissionNumber": "2024/STU/002"
}

// Response
{
  "success": true,
  "message": "Registration successful",
  "token": "jwt-token-here",
  "user": { /* user object */ }
}
```

### Dashboard Endpoints

#### GET `/api/dashboard/admin/stats`
```javascript
// Headers: Authorization: Bearer <token>

// Response
{
  "success": true,
  "stats": {
    "totalStudents": 1250,
    "totalStaff": 85,
    "activeDrills": 3,
    "systemHealth": 98,
    "completedDrills": 245,
    "pendingAlerts": 2,
    "responseTime": "1.8s",
    "participationRate": 95.2,
    "lastUpdated": "2024-02-15T10:30:00.000Z"
  }
}
```

#### GET `/api/dashboard/admin/activities`
```javascript
// Response
{
  "success": true,
  "activities": [
    {
      "id": 1,
      "type": "drill_completed",
      "title": "Fire Drill Completed",
      "description": "All students evacuated successfully",
      "timestamp": "2024-02-15T08:30:00.000Z",
      "status": "success"
    }
  ]
}
```

### Student Management Endpoints

#### GET `/api/admin/students/:schoolId`
```javascript
// Response
{
  "success": true,
  "students": [
    {
      "id": "student-id",
      "name": "Student Name",
      "class": "10-A",
      "email": "student@school.edu",
      "attendanceRate": 95.5,
      "moduleProgress": 85,
      "lastActive": "2024-02-15T09:15:00.000Z"
    }
  ],
  "pagination": {
    "total": 1250,
    "page": 1,
    "limit": 50,
    "totalPages": 25
  }
}
```

#### POST `/api/admin/schedule-drill`
```javascript
// Request
{
  "title": "Fire Drill Practice",
  "type": "fire",
  "scheduledDate": "2024-02-20T10:00:00.000Z",
  "duration": 30,
  "targetClasses": ["10-A", "10-B"],
  "instructions": "Follow evacuation routes to assembly points"
}

// Response
{
  "success": true,
  "message": "Drill scheduled successfully",
  "drillId": "drill-new-id",
  "scheduledDate": "2024-02-20T10:00:00.000Z"
}
```

## 🌐 Real-time Features with Socket.IO

### Client-Side Connection
```javascript
import io from 'socket.io-client';

const socket = io(process.env.REACT_APP_SOCKET_URL);

// Listen for drill announcements
socket.on('drill_announced', (data) => {
  console.log('New drill announced:', data);
  // Update UI to show drill notification
});

// Listen for emergency alerts
socket.on('emergency_alert', (alert) => {
  console.log('Emergency alert received:', alert);
  // Show immediate alert notification
});

// Join school-specific room
socket.emit('join_school', { schoolId: user.schoolId });
```

### Server-Side Event Broadcasting
```javascript
// Announce drill to all school members
io.to(`school-${schoolId}`).emit('drill_announced', {
  drillId: drill.id,
  title: drill.title,
  type: drill.type,
  scheduledDate: drill.scheduledDate
});

// Broadcast emergency alert
io.to(`school-${schoolId}`).emit('emergency_alert', {
  alertId: alert.id,
  title: alert.title,
  message: alert.message,
  priority: alert.priority,
  timestamp: new Date().toISOString()
});
```

## 📱 Progressive Web App (PWA) Features

### Manifest Configuration
```json
{
  "name": "Jagruk - Disaster Management System",
  "short_name": "Jagruk",
  "description": "Comprehensive disaster preparedness and response education system",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#667eea",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-512x512.png", 
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### Service Worker Features
- 📱 Offline capability for critical features
- 🔄 Background sync for attendance marking
- 🔔 Push notifications for emergency alerts
- 💾 Caching strategy for improved performance

## 🚀 Deployment Guide

### Production Build
```bash
# Create production build
npm run build

# Test production build locally
npm install -g serve
serve -s client/build -l 3000
```

### Environment-Specific Deployment

#### Heroku Deployment
```bash
# Install Heroku CLI
npm install -g heroku

# Login and create app
heroku login
heroku create jagruk-disaster-system

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set FIREBASE_PROJECT_ID=your-project-id
heroku config:set JWT_SECRET=your-production-jwt-secret

# Deploy
git add .
git commit -m "Production deployment"
git push heroku main

# Open application
heroku open
```

#### Vercel Deployment (Frontend)
```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "client/package.json",
      "use": "@verceljs/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/static/(.*)",
      "headers": {
        "cache-control": "s-maxage=31536000,immutable"
      },
      "dest": "/static/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

#### Firebase Hosting
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login and initialize
firebase login
firebase init hosting

# Deploy
npm run build
firebase deploy --only hosting
```

## 📊 Performance Optimization

### Frontend Optimizations
- ⚡ **Code Splitting** - Dynamic imports for route-based code splitting
- 🎯 **Lazy Loading** - Components loaded on demand
- 📦 **Bundle Analysis** - Webpack Bundle Analyzer for optimization insights
- 🔄 **Caching Strategy** - Service worker with cache-first strategy
- 🖼️ **Image Optimization** - Compressed images with WebP format
- 📱 **Mobile Optimization** - Touch-friendly UI with optimized gestures

### Backend Optimizations
- 🚀 **Database Indexing** - Optimized Firestore indexes for faster queries
- 📊 **Connection Pooling** - Efficient database connection management
- 🔄 **Caching Layer** - Redis caching for frequently accessed data
- ⚡ **API Rate Limiting** - Prevents abuse and ensures fair usage
- 📝 **Compression** - Gzip compression for all API responses
- 🔍 **Query Optimization** - Efficient Firestore query patterns

## 🔒 Security Implementation

### Authentication Security
- 🔐 **JWT Tokens** - Secure token-based authentication with expiration
- 🛡️ **Password Hashing** - bcrypt with salt rounds for secure password storage
- 🔒 **Rate Limiting** - Prevents brute force attacks on login endpoints
- 🚫 **CORS Protection** - Configured for specific origins only
- 📱 **Multi-Factor Auth** - Optional 2FA for admin accounts

### Data Protection
- 🔒 **Firestore Rules** - Row-level security based on user roles
- 🛡️ **Input Validation** - Server-side validation for all inputs
- 🔐 **SQL Injection Prevention** - Parameterized queries and sanitization
- 📊 **Data Encryption** - Sensitive data encrypted at rest and in transit
- 🕵️ **Audit Logging** - Complete audit trail for admin actions

### Network Security
- 🌐 **HTTPS Enforcement** - SSL/TLS encryption for all communications
- 🔒 **Secure Headers** - Helmet.js for security headers
- 🛡️ **XSS Protection** - Content Security Policy and XSS filtering
- 🚫 **CSRF Protection** - Cross-site request forgery prevention
- 🔍 **API Security** - Input sanitization and output encoding

## 🧪 Testing Strategy

### Frontend Testing
```bash
# Unit Tests with Jest & React Testing Library
npm test

# Component Testing
npm run test:components

# Integration Testing
npm run test:integration

# End-to-End Testing with Cypress
npm run cypress:open
```

### Backend Testing  
```bash
# API Testing with Jest & Supertest
cd server
npm test

# Database Testing
npm run test:db

# Load Testing with Artillery
npm run test:load
```

### Testing Coverage
- ✅ **Unit Tests** - 90%+ code coverage
- 🔧 **Integration Tests** - API endpoint testing
- 🖱️ **E2E Tests** - Critical user journey testing
- 📊 **Performance Tests** - Load testing under realistic conditions

## 📈 Monitoring & Analytics

### Application Monitoring
- 📊 **Real-time Metrics** - System performance and user activity
- 🚨 **Error Tracking** - Automatic error detection and alerting  
- 📱 **User Analytics** - Engagement and usage pattern analysis
- 🔍 **Performance Monitoring** - Response times and bottleneck identification

### Business Intelligence
- 📈 **Drill Effectiveness** - Participation rates and response times
- 🎓 **Learning Analytics** - Module completion rates and knowledge retention
- 👥 **User Engagement** - Active users, session duration, feature adoption
- 🚨 **Emergency Response** - Alert response times and effectiveness metrics

## 🤝 Contributing Guidelines

### Development Workflow
1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Follow** coding standards and conventions
4. **Write** tests for new functionality
5. **Commit** changes (`git commit -m 'Add amazing feature'`)
6. **Push** to branch (`git push origin feature/amazing-feature`)
7. **Open** a Pull Request with detailed description

### Code Standards
- 📝 **ESLint & Prettier** - Automated code formatting and linting
- 📖 **JSDoc Comments** - Comprehensive function and component documentation
- 🧪 **Test Coverage** - All new features must include tests
- 🔄 **Conventional Commits** - Standardized commit message format
- 📋 **Code Reviews** - All PRs require review and approval

## 📞 Support & Resources

### Documentation
- 📚 **API Documentation** - Complete API reference with examples
- 🎮 **User Guides** - Step-by-step user manuals for each role
- 🔧 **Admin Manual** - System administration and configuration guide
- 🚀 **Deployment Guide** - Production deployment instructions

### Community Support
- 💬 **GitHub Discussions** - Community Q&A and feature discussions
- 🐛 **Issue Tracker** - Bug reports and feature requests
- 📧 **Email Support** - support@jagruk.edu for direct assistance
- 📱 **Discord Server** - Real-time community chat and support

### Professional Services
- 🏢 **Enterprise Support** - Priority support for educational institutions
- 🎓 **Training Programs** - Staff training and onboarding services
- 🔧 **Custom Development** - Tailored features for specific requirements
- 📊 **Consulting Services** - Disaster preparedness strategy consulting

## 📄 License & Legal

### MIT License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for complete details.

### Third-Party Licenses
- React - MIT License
- Material-UI - MIT License
- Firebase - Apache License 2.0
- Node.js - MIT License

### Disclaimer
This software is provided for educational purposes. While designed with safety in mind, it should complement, not replace, professional emergency preparedness training and protocols.

---

## 🏆 Smart India Hackathon 2025

**🎯 Problem Statement Details**
- **ID**: 25008
- **Title**: Disaster Preparedness and Response Education System for Schools and Colleges
- **Category**: Software
- **Theme**: Disaster Management
- **Ministry**: Government of Punjab, Department of Higher Education

**🌟 Solution Impact**
- 🏫 **Educational Institutions**: Streamlined disaster preparedness training
- 👨‍🎓 **Students**: Engaging, gamified safety education
- 👩‍🏫 **Educators**: Comprehensive management and reporting tools
- 🚨 **Emergency Response**: Faster, more coordinated disaster response
- 🇮🇳 **National Resilience**: Building a more prepared and safer India

---

<div align="center">
  <h2>🇮🇳 Built with ❤️ for a Safer, More Prepared India 🇮🇳</h2>
  
  **Empowering Educational Institutions with Advanced Disaster Preparedness Technology**
  
  [![GitHub Stars](https://img.shields.io/github/stars/IndAlok/Jagruk-Web?style=social)](https://github.com/IndAlok/Jagruk-Web)
  [![GitHub Forks](https://img.shields.io/github/forks/IndAlok/Jagruk-Web?style=social)](https://github.com/IndAlok/Jagruk-Web)
  [![GitHub Issues](https://img.shields.io/github/issues/IndAlok/Jagruk-Web)](https://github.com/IndAlok/Jagruk-Web/issues)
  [![GitHub License](https://img.shields.io/github/license/IndAlok/Jagruk-Web)](https://github.com/IndAlok/Jagruk-Web/blob/main/LICENSE)
</div>