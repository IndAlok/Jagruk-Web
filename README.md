# JAGRUK - Advanced Disaster Management & Education Platform

**Empowering Educational Institutions with AI-Driven Disaster Preparedness**

JAGRUK is a state-of-the-art, comprehensive Disaster Management system designed specifically for Indian schools and colleges. Leveraging the power of Generative AI and real-time cloud data, it transforms how institutions prepare for, respond to, and recover from emergencies.

Unlike traditional static safety protocols, JAGRUK provides a dynamic, interactive, and role-specific experience for Administrators, Staff, and Students, bridging the gap between theoretical safety guidelines (NDMA) and practical implementation.

---

## 🚀 Key Standout Features

### 🧠 JAGRUK AI Assistant (Gemini 2.0 Flash)
An intelligent, always-on crisis companion.
*   **Context-Aware Guidance:** Instantly answers queries about earthquake protocols, fire safety, and first aid with markdown-formatted, easy-to-read instructions.
*   **Scenario Generation:** Auto-creates detailed, realistic drill scenarios for safety officers.
*   **Safety Tip Generator:** Provides location-specific and disaster-specific safety checklists.
*   **Interactive Quizzes:** Generates custom disaster management quizzes to test student awareness.

### 🏛️ Role-Based Ecosystem
A unified platform serving distinct needs:
*   **Admin Command Center:** Real-time dashboard for drill scheduling, resource tracking, and high-level analytics.
*   **Staff Interface:** Tools for attendance management during drills, emergency reporting, and module completion tracking.
*   **Student Learning Hub:** Gamified learning modules, interactive drills, and AI-powered safety education.

### ⚡ Real-Time Architecture
*   **Live Alerts:** Instant notification system for emergency broadcasts and system updates.
*   **Dynamic Dashboards:** Fluid, animated interfaces that adapt to the user's role and system state.
*   **Offline-Ready:** Critical safety guides cached for access during network disruptions.

### 🎨 Premium User Experience
*   **Glassmorphism Design:** Modern, visually stunning UI with fluid gradient animations and smooth page transitions.
*   **Adaptive Theming:** Seamless Dark and Light mode support for comfortable usage in any environment.
*   **Interactive Visuals:** Spring-physics animations and micro-interactions powered by Framer Motion.

---

## 🛠️ Technical Architecture

Built on a robust, scalable MERN stack with serverless capabilities:

*   **Frontend:** React.js, Material-UI (MUI), Framer Motion, Recharts
*   **Backend:** Node.js, Express (Serverless-ready architecture)
*   **AI Engine:** Google Gemini Pro / Flash 2.0
*   **Database:** Google Firestore (NoSQL)
*   **Auth:** Firebase Authentication with Role-Based Access Control (RBAC)
*   **Deployment:** Vercel (Frontend & Serverless Functions)

---

## 📂 Project Structure

```
JAGRUK-WEB/
├── client/                 # React Frontend Application
│   ├── public/             # Static assets (Favicon, Manifest)
│   └── src/
│       ├── components/     # Reusable UI Components & Dashboards
│       ├── contexts/       # Global State (Auth, Theme)
│       ├── services/       # API Integration Layer
│       └── utils/          # Helper Functions
├── server/                 # Backend API Service
│   ├── config/             # Firebase & Environment Config
│   ├── middleware/         # Auth & Validation Middleware
│   ├── routes/             # REST API Endpoints (AI, Drills, Usage)
│   └── index.js            # Server Entry Point
└── api/                    # Vercel Serverless Entry Point
```

---

## 🚀 Getting Started

Follow these steps to deploy JAGRUK locally or to production.

### Prerequisites
*   Node.js (v14+)
*   Firebase Project Credentials
*   Google Gemini API Key

### 1. Installation

Clone the repository and install dependencies for both client and server:

```bash
# Install Server Dependencies
cd server
npm install

# Install Client Dependencies
cd ../client
npm install
```

### 2. Configuration

Create `.env` files in both `server` and `client` directories.

**Server (.env):**
```env
PORT=5000
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_PRIVATE_KEY="your-private-key"
GEMINI_API_KEY=your-gemini-api-key
```

**Client (.env):**
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
```

### 3. Running Locally

Start the development servers:

```bash
# Terminal 1: Backend
cd server
npm run dev

# Terminal 2: Frontend
cd client
npm start
```

Access the application at `http://localhost:3000`.

### 4. Deployment

**Vercel / Production:**
The project is configured for seamless deployment on Vercel.
1.  Connect your GitHub repository to Vercel.
2.  Set the `Root Directory` to `./`.
3.  Add the environment variables in the Vercel dashboard.
4.  Deploy! The `api` folder handles serverless backend functions automatically.

---

## 🛡️ Security

*   **RBAC:** Strict middleware ensures users only access data relevant to their role.
*   **Data Protection:** All sensitive data is encrypted via Firebase rules.
*   **Secure API:** Endpoints are protected with JWT token verification.

---

*Transforming Disaster Management Education into a Proactive, Engaging, and Life-Saving Experience.*
