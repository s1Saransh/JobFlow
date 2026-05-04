# ⚡ JobFlow — Job Application Tracker

A modern, full-stack job application tracker built with the **MERN** stack (MongoDB · Express · React · Node.js).

## 📁 Project Structure

```
jobflow/
├── client/            ← Vite + React frontend
│   ├── src/
│   │   ├── layouts/   ← AppLayout (sidebar + outlet)
│   │   ├── pages/     ← Dashboard, Applications, AddApplication, Login
│   │   ├── App.jsx    ← React Router v6 routes
│   │   ├── main.jsx   ← Entry point
│   │   └── index.css  ← Global design system
│   └── package.json
├── server/            ← Node.js + Express backend
│   ├── src/
│   │   └── index.js   ← Express server entry point
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
| Backend  | Node.js, Express 4               |
| Database | MongoDB + Mongoose               |
| Auth     | JWT (planned)                    |
| Styling  | Vanilla CSS, Inter font          |

## 📜 License

MIT
