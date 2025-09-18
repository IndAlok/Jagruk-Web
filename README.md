# 🚨 Jagruk - Disaster Management & Safety Education System

[![Smart India Hackathon 2025](https://img.shields.io/badge/SIH_2025-Problem_ID_25008-FF6B35.svg?style=for-the-badge)](https://sih.gov.in)
[![React](https://img.shields.io/badge/React-18.2.0-61DAFB.svg?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933.svg?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-9.17.1-FFCA28.svg?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
[![Material-UI](https://img.shields.io/badge/Material--UI-5.11.10-0081CB.svg?style=for-the-badge&logo=material-ui)](https://mui.com/)

## 🎯 Project Overview

**Jagruk** is a comprehensive disaster preparedness and response education system designed for Indian schools and colleges. Built with modern React.js and Firebase, it provides role-based dashboards for disaster education management and emergency response coordination.

### 🏆 Smart India Hackathon 2025 Solution
- **Problem Statement ID**: 25008
- **Theme**: Disaster Management  
- **Ministry**: Government of Punjab, Department of Higher Education
- **Challenge**: Disaster Preparedness and Response Education System for Schools and Colleges

## ✨ Current Implementation

### � Authentication System
- **Demo-Based Authentication**:
  - Pre-configured demo accounts for all user roles
  - Email/Password login system with hardcoded demo credentials  
  - Google OAuth integration (configured, using demo fallback)
  - JWT token-based session management
- **Role-Based Access Control**:
  - Automatic dashboard routing based on user role (admin/staff/student)
  - Protected route system with authentication middleware
  - Permission-based UI component rendering

### 👨‍💼 Admin Dashboard (Fully Implemented)
- **Comprehensive Admin Interface** with mock data visualization
- **Student Management System** - Complete CRUD operations with demo student data
- **Staff Management Interface** - Staff administration with hardcoded staff records  
- **Dashboard Statistics** - Real-time stats display using mock data
- **Emergency Drill Management** - Drill scheduling and management interface
- **User Analytics** - Data visualization with charts and progress tracking
- **Responsive Navigation** - ProfileSidebar with role-based menu options
- **Theme System** - Dark/light mode toggle with persistent storage

### �‍🏫 Staff Dashboard  
- **Staff-Specific Interface** with basic dashboard statistics
- **Student Overview** - View assigned students (placeholder functionality)
- **Notification Display** - Alert system with mock notifications
- **Quick Actions** - Feature placeholders with "coming soon" notifications
- **Profile Management** - Universal profile system integration
- **Responsive Design** - Mobile-optimized interface with Material-UI

### 👨‍🎓 Student Dashboard (Basic Implementation)
- **Personalized Learning Interface** with progress visualization
- **Mock Course Management** - Demo learning module data display
- **Notification Center** - Sample emergency alerts and course updates
- **Profile System** - Universal profile management integration
- **Progress Tracking** - Mock completion statistics and attendance data
- **Interactive UI** - Modern, responsive design with smooth animations

### 👤 Universal Profile Management (Fully Implemented)
- **Google OAuth Integration** - Profile pre-filling from Google account data
- **Profile Completion Flow** - Guided multi-step profile setup for new users
- **Demo Profile Support** - Mock profile data for demo accounts
- **Security Settings** - Password management and user preferences
- **Photo Upload Ready** - Profile picture management interface (UI complete)
- **Real-Time Updates** - Live profile editing with form validation

### 🎨 Modern UI/UX Features
- **Unified ProfileSidebar Component** - Consistent navigation across all pages
- **NotificationCenter** - Real-time notification management
- **Dark/Light Theme System** - Global theme switching with persistence
- **Responsive Design** - Mobile-first approach with Material-UI
- **Smooth Animations** - Framer Motion integration for enhanced UX
- **Loading States** - Professional loading screens and skeletons

### 📊 Current Data Implementation
- **Demo Data System** - Comprehensive mock data for development and testing
- **In-Memory Storage** - Local state management for demo student/staff/drill records
- **Mock API Responses** - Server routes returning realistic demo data
- **Firebase Ready** - Database configuration complete for future migration to real data
- **JWT Authentication** - Token-based auth system with demo user validation

## 🏗️ Technology Stack

### Frontend Architecture
```
React 18.2.0              - Modern functional components with hooks
Material-UI 5.11.10       - Professional UI component library
Framer Motion 10.18.0     - Smooth animations and micro-interactions
React Router 6.30.1       - Advanced client-side routing with protection
Axios 1.3.4               - HTTP client with interceptors and error handling
React Toastify 9.1.3      - Professional toast notification system
Emotion React/Styled      - CSS-in-JS styling solution
Recharts 2.5.0            - Data visualization and charting
React Hook Form 7.43.5    - Form validation and management
Socket.io Client 4.8.1    - Real-time communication (configured)
```

### Backend Infrastructure
```
Node.js 18.x              - High-performance JavaScript runtime
Express.js 4.18.2         - Web application framework with RESTful API
Firebase Admin 11.5.0     - Firebase SDK (configured but using demo auth)
JWT 9.0.0                 - Secure token-based authentication
Winston 3.8.2             - Advanced logging and error tracking
Socket.io 4.6.1           - Real-time communication (configured)
Helmet 6.0.1              - Security headers and protection
CORS 2.8.5                - Cross-origin resource sharing
Express Rate Limit 6.7.0  - API rate limiting and DoS protection
Bcryptjs 2.4.3            - Password hashing and security
```

### Database & Data Management
```
Demo Data System          - In-memory mock data for development
Firebase Firestore        - NoSQL database (configured for future use)
Firebase Authentication   - OAuth & credential auth (configured)
Local Storage             - Client-side user preference storage
Session Management        - JWT-based authentication tokens
```
## 📁 Current Project Structure

```
Jagruk-Web/
├── 📂 client/                          # React Frontend Application
│   ├── 📂 public/                      # Static assets and PWA config
│   │   ├── index.html                  # Main HTML template
│   │   ├── manifest.json               # PWA configuration
│   │   └── favicon.ico                 # Application icon
│   ├── 📂 src/                         # Source code
│   │   ├── 📂 components/              # React Components
│   │   │   ├── 📂 Auth/                # Authentication components
│   │   │   ├── 📂 Common/              # Shared components
│   │   │   │   ├── LoadingScreen.js    # Loading animations
│   │   │   │   ├── Profile.js          # Universal profile management
│   │   │   │   ├── ProfileSidebar.js   # Unified navigation sidebar
│   │   │   │   └── NotificationCenter.js # Notification system
│   │   │   ├── 📂 Dashboard/           # Role-specific dashboards
│   │   │   │   ├── AdminDashboard.js   # Enhanced admin interface
│   │   │   │   └── ModernAdminDashboard.js # Alternative admin UI
│   │   │   ├── AdminDashboard.js       # Main admin component
│   │   │   ├── StaffDashboard.js       # Staff management interface
│   │   │   ├── StudentDashboard.js     # Student learning interface
│   │   │   ├── Login.js                # Authentication interface
│   │   │   ├── Register.js             # Admin-only registration
│   │   │   └── ProtectedRoute.js       # Route security
│   │   ├── 📂 contexts/                # React Context Providers
│   │   │   ├── AuthContext.js          # Authentication & user management
│   │   │   └── ThemeContext.js         # Theme and UI state
│   │   ├── 📂 services/                # API and external services
│   │   │   └── api.js                  # Centralized API client
│   │   ├── 📂 config/                  # Configuration files
│   │   │   └── firebase.js             # Firebase client setup
│   │   ├── App.js                      # Main application component
│   │   ├── index.js                    # React entry point
│   │   └── index.css                   # Global styles
│   └── package.json                    # Frontend dependencies
├── 📂 server/                          # Node.js Backend Application  
│   ├── 📂 config/                      # Server configuration
│   │   ├── firebase.js                 # Firebase Admin SDK
│   │   └── logger.js                   # Winston logging setup
│   ├── 📂 middleware/                  # Express middleware
│   │   ├── auth.js                     # Authentication middleware
│   │   ├── rateLimiter.js             # Rate limiting protection
│   │   └── validation.js               # Input validation
│   ├── 📂 routes/                      # API endpoints
│   │   ├── auth.js                     # Authentication routes
│   │   ├── dashboard.js                # Dashboard data API
│   │   ├── admin.js                    # Admin-specific endpoints
│   │   ├── students.js                 # Student management API
│   │   ├── drills.js                   # Emergency drill API
│   │   ├── alerts.js                   # Alert system API
│   │   └── settings.js                 # Configuration API
│   ├── 📂 functions/                   # Firebase Cloud Functions
│   │   └── src/                        # TypeScript source code
│   ├── 📂 logs/                        # Application logs
│   │   ├── combined.log                # All logs
│   │   └── error.log                   # Error-specific logs
│   ├── index.js                        # Server entry point
│   ├── package.json                    # Backend dependencies
│   ├── firestore.rules                # Database security rules
│   └── firestore.indexes.json         # Database indexing
├── 📄 firebase.json                    # Firebase project config
├── 📄 package.json                     # Root project config
├── 📄 README.md                        # This documentation
├── 📄 LICENSE                          # MIT License
└── 🚀 start.bat / start.ps1           # Quick start scripts
```

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** 18.x or later
- **npm** 8.x or later
- **Git** for version control
- **Firebase Account** with project created

### 1. Clone Repository
```bash
git clone https://github.com/IndAlok/Jagruk-Web.git
cd Jagruk-Web
```

### 2. Install Dependencies
```bash
# Install all dependencies (both client and server)
npm install
```

### 3. Firebase Configuration

#### Create Firebase Project
1. Visit [Firebase Console](https://console.firebase.google.com)
2. Create new project: `jagruk-disaster-management`
3. Enable Authentication (Email/Password and Google)
4. Create Firestore database in production mode

#### Environment Setup

**Server Environment** (`server/.env`):
```env
# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# Firebase Admin SDK (Get from Firebase Console > Service Accounts)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour Private Key\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com

# Security
JWT_SECRET=your-secure-jwt-secret-32-characters-minimum
JWT_EXPIRES_IN=24h

# Optional: Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

**Client Environment** (`client/.env`):
```env
# API Configuration
REACT_APP_API_URL=http://localhost:5000

# Firebase Web Configuration (Get from Firebase Console > Project Settings)
REACT_APP_FIREBASE_API_KEY=your-web-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id

# Application Info
REACT_APP_APP_NAME=Jagruk
REACT_APP_VERSION=1.0.0
```
```

### 4. Run Application
```bash
# Start both client and server concurrently
npm start

# Or run individually:
npm run server  # Starts backend on http://localhost:5000
npm run client  # Starts frontend on http://localhost:3000
```

## 🔐 Demo Accounts

For testing the current implementation, use these demo credentials:

### Admin Demo (All Features Available)
- **Email**: `admin@jagruk.edu`
- **Password**: `admin123`
- **Features**: Complete admin dashboard with all management functions

### Staff Demo (Basic Features)  
- **Email**: `staff@jagruk.edu`
- **Password**: `staff123`
- **Features**: Basic staff interface with placeholder functionality

### Student Demo (Basic Features)
- **Email**: `student@jagruk.edu` 
- **Password**: `student123`
- **Features**: Student dashboard with mock progress data

**Note**: All demo accounts route to admin-level functionality in the current implementation.

## 🛠️ Development Features

### ✅ Fully Implemented Features
- **Authentication System** - Demo-based login with JWT tokens and role routing
- **Admin Dashboard** - Complete interface with student/staff/drill management using mock data
- **Profile Management** - Universal profile system with role-specific forms and Google OAuth
- **Theme System** - Dark/light mode toggle with localStorage persistence  
- **Responsive Navigation** - ProfileSidebar component with role-based menu options
- **UI/UX Design** - Material-UI components with Framer Motion animations
- **API Architecture** - Express.js backend with organized route structure

### 🔄 Basic Implementation (UI Complete, Using Mock Data)
- **Staff Dashboard** - Basic interface with placeholder functionality
- **Student Dashboard** - Learning interface with mock progress tracking
- **Drill Management** - UI complete with demo drill scheduling
- **User Management** - CRUD operations on hardcoded demo data
- **Notification System** - Toast notifications and mock alert displays

### 📋 Configured But Not Active
- **Firebase Firestore** - Database configured for future real data integration
- **Real-time Communication** - Socket.io setup ready for live features
- **File Upload System** - Multer configured for future media uploads
- **Email Service** - Nodemailer ready for notification emails

### 🔄 Planned Real Data Integration
- **Database Migration** - Move from mock data to Firebase Firestore
- **Real Authentication** - Implement actual user registration and management  
- **Live Notifications** - Real-time emergency alert broadcasting
- **File Management** - Profile photos and document upload functionality
- 🔄 **Mobile App** - React Native companion application

## 📋 API Endpoints (Current Implementation)

### Authentication (Demo Data)
- `POST /api/auth/login` - Demo user login with hardcoded credentials
- `POST /api/auth/verify-token` - JWT token validation
- `GET /api/auth/profile/:id` - Get user profile (returns demo data for demo users)
- `PUT /api/auth/profile/:id` - Update user profile (simulated updates)

### Admin Dashboard (Mock Data)
- `GET /api/admin/stats` - Admin statistics (returns mock data)
- `GET /api/admin/demo/students` - Demo student records
- `GET /api/dashboard/admin/stats` - Admin dashboard statistics
- `GET /api/dashboard/admin/activities` - Recent activities (mock data)

### Student Management (Demo CRUD)
- `GET /api/students` - Get all demo students with pagination
- `GET /api/students/:id` - Get specific demo student
- `POST /api/students` - Create new demo student
- `PUT /api/students/:id` - Update demo student
- `DELETE /api/students/:id` - Delete demo student

### Drill Management (UI Complete, Mock Data)
- `GET /api/drills` - Get all scheduled drills (demo data)
- `POST /api/drills` - Schedule new drill (adds to mock data)
- `GET /api/drills/:id` - Get drill details
- `POST /api/drills/:id/attend` - Mark attendance (simulation)

## 🔧 Configuration

### Current Development Setup
The project is configured to run with mock data for development and testing:

**Demo Credential(s) (server/routes/auth.js)**:
```javascript
const demoCredentials = {
  'admin@jagruk.edu': { password: 'admin123', role: 'admin', name: 'Demo Admin' },
};
```

### Firebase Configuration (Ready for Migration)
Firebase is configured but currently using demo authentication:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Admin-only collections
    match /{collection}/{document} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

### Environment Variables Reference
| Variable | Description | Required |
|----------|-------------|----------|
| `FIREBASE_PROJECT_ID` | Firebase project identifier | ✅ |
| `FIREBASE_PRIVATE_KEY` | Firebase service account key | ✅ |
| `JWT_SECRET` | JWT signing secret (32+ chars) | ✅ |
| `EMAIL_SERVICE` | Email service provider | ❌ |
| `NODE_ENV` | Environment mode | ❌ |

## 🤝 Contributing

1. **Fork** the repository
2. **Create** feature branch (`git checkout -b feature/new-feature`)
3. **Commit** changes (`git commit -am 'Add new feature'`)
4. **Push** to branch (`git push origin feature/new-feature`)
5. **Create** Pull Request

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🏆 Smart India Hackathon 2025

This project is developed as a solution for **Smart India Hackathon 2025**, addressing the critical need for disaster preparedness education in educational institutions across India.

**Problem Statement ID**: 25008  
**Ministry**: Government of Punjab, Department of Higher Education  
**Theme**: Disaster Management & Safety Education

---

<p align="center">
  <strong>🚨 Jagruk - Building Disaster-Ready Communities Through Education 🚨</strong>
</p>

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

### Quick Login Credential(s)
```javascript
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
