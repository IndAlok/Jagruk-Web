# Jagruk Web - Environment Variables

## Client Environment Variables (.env)

Create a `.env` file in the client directory with the following variables:

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain_here
REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id_here
REACT_APP_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket_here
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id_here
REACT_APP_FIREBASE_APP_ID=your_firebase_app_id_here
```

## Server Environment Variables (.env)

Create a `.env` file in the server directory with the following variables:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/jagruk-web
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_complex

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your_firebase_project_id_here
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_private_key_here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your_firebase_client_email_here

# Email Configuration (for password reset)
EMAIL_FROM=noreply@jagruk.com
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password

# Security
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
LOG_FILE=logs/app.log
```

## Firebase Setup Instructions

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable Authentication and Firestore Database
4. Get your web app configuration from Project Settings
5. For server-side, generate a private key from Service Accounts
6. Replace the placeholder values in your .env files

## Security Notes

- Never commit .env files to version control
- Use strong, unique JWT secrets
- Enable proper Firebase security rules
- Use environment-specific configurations for production

## Database Setup

1. Install MongoDB locally or use MongoDB Atlas
2. Update MONGODB_URI in server .env file
3. The application will create necessary collections automatically

## Getting Started

1. Set up environment variables as described above
2. Install dependencies: `npm install` in both client and server directories
3. Start the server: `cd server && npm run dev`
4. Start the client: `cd client && npm start`
5. Open http://localhost:3000 in your browser
