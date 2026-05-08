# ⚡ JobFlow — Job Application Tracker

A modern, full-stack job application tracker built with the **MERN** stack (MongoDB · Express · React · Node.js). 

## ✨ Features
- **User Authentication:** Secure JWT-based login and registration.
- **Application Tracking:** Add, edit, delete, and view your job applications.
- **Status Updates:** Easily move applications through different stages (Applied, Interview, Offer, Rejected).
- **User Profiles:** Customize your personal profile, including a profile picture, bio, LinkedIn link, and contact details.
- **Modern UI:** A beautiful, responsive "glassmorphism" design system tailored for a premium user experience.

## 📁 Project Structure

```
jobflow/
├── client/            ← Vite + React frontend
│   ├── src/
│   │   ├── layouts/   ← AppLayout (sidebar + user profile chip)
│   │   ├── pages/     ← Dashboard, Applications, ApplicationDetail, AddApplication, Login, Profile
│   │   ├── App.jsx    ← React Router v6 routes
│   │   ├── main.jsx   ← Entry point
│   │   └── index.css  ← Global design system and components
│   └── package.json
├── server/            ← Node.js + Express backend
│   ├── src/
│   │   ├── controllers/ ← Business logic (auth, applications, profiles)
│   │   ├── models/      ← Mongoose schemas
│   │   ├── routes/      ← Express API routes
│   │   └── index.js     ← Express server entry point
│   └── package.json
├── .env.example       ← All environment variables
├── .gitignore
└── package.json       ← Root monorepo scripts
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **MongoDB** (local or Atlas)

### 1. Clone & Install

```bash
git clone <repo-url> jobflow
cd jobflow

# Install everything
npm run install:all
```

### 2. Configure Environment

```bash
# Server
cp server/.env.example server/.env
# Edit server/.env with your MONGO_URI and JWT_SECRET
```

### 3. Run in Development

```bash
# Terminal 1 — API
npm run dev:server

# Terminal 2 — Frontend
npm run dev:client
```

| Service  | URL                       |
| -------- | ------------------------- |
| Frontend | http://localhost:5173      |
| API      | http://localhost:5000      |
| Health   | http://localhost:5000/api/health |

## 🛠 Tech Stack

| Layer    | Tech                             |
| -------- | -------------------------------- |
| Frontend | React 19, Vite, React Router v6  |
| Backend  | Node.js, Express                 |
| Database | MongoDB + Mongoose               |
| Auth     | JSON Web Tokens (JWT) & bcryptjs |
| Styling  | Vanilla CSS, Glassmorphism UI    |

## 📜 License

MIT
