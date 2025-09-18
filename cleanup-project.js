#!/usr/bin/env node

/**
 * JAGRUK PROJECT CLEANUP SCRIPT
 * Removes all unnecessary, duplicate, and unused files from the project
 * Keeps only essential files that are actually being used in production
 */

const fs = require('fs');
const path = require('path');

const projectRoot = 'c:/Users/Admin/Desktop/Jagruk-Web';

// Files and directories to DELETE (unnecessary/duplicate/unused)
const filesToDelete = [
  // Root level unnecessary documentation
  'DETAILED_ENV_GUIDE.md',
  'ENVIRONMENT_SETUP.md', 
  'FIREBASE_SETUP_GUIDE.md',
  'HAMBURGER_MENU_IMPLEMENTATION.md',
  'QUICK_START.md',
  
  // Debug and test files
  'firebase-debug.log',
  'firebase-email-test.html',
  'test-auth.js',
  'server/test-firebase-email.js',
  'server/Procfile', // Not needed for local development

  // Client - Multiple duplicate App files (keep only App.js)
  'client/src/App_broken.js',
  'client/src/App_new.js', 
  'client/src/App.js.backup',
  'client/src/App.simple.js',
  'client/src/App.test.js',
  'client/src/AppComplete.js',
  'client/src/AppNew.js',
  'client/src/AppNew2.js',

  // Client - Multiple environment files (keep only .env)
  'client/.env.clean',
  'client/.env.local',

  // Client - Duplicate AdminDashboard components (keep only AdminDashboard.js)
  'client/src/components/AdminDashboard_backup.js',
  'client/src/components/AdminDashboard_Clean.js', 
  'client/src/components/AdminDashboard_Fixed.js',
  'client/src/components/AdminDashboard_New.js',
  'client/src/components/OptimizedAdminDashboard.js',

  // Client - Unused/duplicate authentication components
  'client/src/components/AdminProfile.js',
  'client/src/components/FirebaseAuthTest.js',
  'client/src/components/LoginFirebase.js',
  'client/src/components/MigrationPanel.js',
  'client/src/components/ResetPassword.js', // Not implemented
  'client/src/components/ProtectedRoute_backup.js',

  // Client - Duplicate context files (keep only main ones)
  'client/src/contexts/AuthContext_backup.js',
  'client/src/contexts/AuthContext_new.js',
  'client/src/contexts/AuthContextFirebase.js',
  'client/src/contexts/SocketContext.js', // Not actually used

  // Client - Duplicate API service files (keep only api.js)
  'client/src/services/apiOptimized.js',
  'client/src/services/api_backup.js', 
  'client/src/services/api_clean.js',

  // Server - Duplicate route files (keep only main ones)
  'server/routes/admin-new.js', // Duplicate of admin.js
  'server/routes/auth-firebase.js', // Duplicate of auth.js
  'server/routes/auth-new.js', // Duplicate of auth.js
  'server/routes/student.js', // Use students.js instead

  // Server - Migration script (not needed after setup)
  'server/scripts/migrate-to-firebase-auth.js',

  // Server - Unused environment example
  'server/.env.example',

  // Server - Firebase dataconnect (not implemented)
  'server/dataconnect/',

  // Server - Functions directory (not used in current implementation) 
  'server/functions/',
];

// Essential files that MUST be kept (validation check)
const essentialFiles = [
  'package.json',
  'README.md',
  'LICENSE', 
  'firebase.json',
  'start.bat',
  'start.ps1',
  '.gitignore',
  '.firebaserc',
  
  // Client essentials
  'client/package.json',
  'client/public/index.html',
  'client/public/manifest.json', 
  'client/public/favicon.ico',
  'client/src/index.js',
  'client/src/index.css',
  'client/src/App.js', // MAIN APP FILE
  
  // Core components (actually used)
  'client/src/components/Login.js',
  'client/src/components/Register.js', 
  'client/src/components/AdminDashboard.js', // MAIN DASHBOARD
  'client/src/components/StaffDashboard.js',
  'client/src/components/StudentDashboard.js',
  'client/src/components/ProtectedRoute.js',
  'client/src/components/LoadingScreen.js',
  
  // Common components (used by main components)
  'client/src/components/Common/ProfileSidebar.js',
  'client/src/components/Common/Profile.js',
  'client/src/components/Common/ProfileCompletionDialog.js',
  'client/src/components/Common/NotificationCenter.js',
  
  // Dashboard alternatives (referenced in structure)
  'client/src/components/Dashboard/AdminDashboard.js',
  'client/src/components/Dashboard/ModernAdminDashboard.js',
  'client/src/components/Dashboard/StudentDashboard.js',
  
  // Auth components
  'client/src/components/Auth/Login.js',
  'client/src/components/Auth/Register.js',

  // Core contexts (actually used)
  'client/src/contexts/AuthContext.js', // MAIN AUTH
  'client/src/contexts/ThemeContext.js', // MAIN THEME
  
  // Core services  
  'client/src/services/api.js', // MAIN API SERVICE
  'client/src/config/firebase.js', // FIREBASE CONFIG
  
  // Server essentials
  'server/package.json',
  'server/index.js', // MAIN SERVER
  'server/firestore.rules',
  'server/firestore.indexes.json',
  
  // Server config
  'server/config/firebase.js',
  'server/config/logger.js',
  
  // Server middleware (all used)
  'server/middleware/auth.js',
  'server/middleware/rateLimiter.js', 
  'server/middleware/validation.js',
  
  // Server routes (only the ones actually imported)
  'server/routes/auth.js',
  'server/routes/admin.js', 
  'server/routes/students.js', // Main student routes
  'server/routes/dashboard.js',
  'server/routes/drills.js',
  'server/routes/alerts.js',
  'server/routes/modules.js', 
  'server/routes/attendance.js',
  'server/routes/settings.js',
  
  // Server logs directory
  'server/logs/',
];

console.log('🧹 JAGRUK PROJECT CLEANUP SCRIPT');
console.log('=====================================');
console.log('⚠️  This will PERMANENTLY DELETE unnecessary files!');
console.log('✅ Essential files will be preserved\n');

console.log('📋 FILES SCHEDULED FOR DELETION:');
console.log('=================================');

let deletedCount = 0;
let preservedCount = 0;
let errorCount = 0;

// Delete unnecessary files
filesToDelete.forEach((relativeFilePath) => {
  const fullPath = path.join(projectRoot, relativeFilePath);
  
  try {
    if (fs.existsSync(fullPath)) {
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Delete directory recursively
        fs.rmSync(fullPath, { recursive: true, force: true });
        console.log(`🗂️  DELETED DIRECTORY: ${relativeFilePath}`);
      } else {
        // Delete file
        fs.unlinkSync(fullPath);
        console.log(`📄 DELETED FILE: ${relativeFilePath}`);
      }
      
      deletedCount++;
    } else {
      console.log(`⚠️  NOT FOUND: ${relativeFilePath}`);
    }
  } catch (error) {
    console.error(`❌ ERROR deleting ${relativeFilePath}:`, error.message);
    errorCount++;
  }
});

console.log('\n📋 VERIFYING ESSENTIAL FILES:');
console.log('==============================');

// Verify essential files are still present
essentialFiles.forEach((relativeFilePath) => {
  const fullPath = path.join(projectRoot, relativeFilePath);
  
  if (fs.existsSync(fullPath)) {
    console.log(`✅ PRESERVED: ${relativeFilePath}`);
    preservedCount++;
  } else {
    console.log(`❌ MISSING ESSENTIAL FILE: ${relativeFilePath}`);
    errorCount++;
  }
});

console.log('\n📊 CLEANUP SUMMARY:');
console.log('===================');
console.log(`🗑️  Files Deleted: ${deletedCount}`);
console.log(`✅ Files Preserved: ${preservedCount}`);
console.log(`❌ Errors: ${errorCount}`);

if (errorCount === 0) {
  console.log('\n🎉 CLEANUP COMPLETED SUCCESSFULLY!');
  console.log('✨ Your project is now clean and optimized!');
  console.log('\nNext steps:');
  console.log('1. Run "npm install" in both root and client directories');
  console.log('2. Test the application: npm start');
  console.log('3. Commit the cleaned project to git');
} else {
  console.log('\n⚠️  CLEANUP COMPLETED WITH ERRORS');
  console.log('Please review the errors above and fix any issues.');
}

console.log('\n📁 CURRENT PROJECT STRUCTURE AFTER CLEANUP:');
console.log('=============================================');
console.log(`
Jagruk-Web/
├── 📄 README.md                        # ONLY documentation file
├── 📄 LICENSE                          # MIT License  
├── 📄 package.json                     # Root dependencies
├── 📄 firebase.json                    # Firebase config
├── 🚀 start.bat / start.ps1           # Startup scripts
├── 📂 client/                          # React Frontend
│   ├── 📂 public/                      # Static assets
│   ├── 📂 src/
│   │   ├── App.js                      # MAIN APP (single file)
│   │   ├── index.js                    # Entry point
│   │   ├── index.css                   # Global styles
│   │   ├── 📂 components/
│   │   │   ├── AdminDashboard.js       # MAIN dashboard
│   │   │   ├── StaffDashboard.js       # Staff interface
│   │   │   ├── StudentDashboard.js     # Student interface  
│   │   │   ├── Login.js                # Authentication
│   │   │   ├── Register.js             # Registration
│   │   │   ├── ProtectedRoute.js       # Route protection
│   │   │   ├── LoadingScreen.js        # Loading component
│   │   │   ├── 📂 Auth/                # Auth components
│   │   │   ├── 📂 Common/              # Shared components
│   │   │   └── 📂 Dashboard/           # Dashboard variants
│   │   ├── 📂 contexts/
│   │   │   ├── AuthContext.js          # MAIN auth context
│   │   │   └── ThemeContext.js         # MAIN theme context
│   │   ├── 📂 services/
│   │   │   └── api.js                  # MAIN API service
│   │   └── 📂 config/
│   │       └── firebase.js             # Firebase client
├── 📂 server/                          # Node.js Backend
│   ├── index.js                        # MAIN server file
│   ├── firestore.rules                 # Database rules
│   ├── firestore.indexes.json         # Database indexes
│   ├── 📂 config/                      # Server config
│   ├── 📂 middleware/                  # Express middleware
│   ├── 📂 routes/                      # API routes (only used ones)
│   └── 📂 logs/                        # Application logs
`);
