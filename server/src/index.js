import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";

// ─── Config ──────────────────────────────────────────
dotenv.config();

// Connect to database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ──────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── Health-check route ─────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ─── API Routes ──────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);

// ─── Start server ───────────────────────────────────
app.listen(PORT, () => {
  console.log(`⚡ JobFlow API running → http://localhost:${PORT}`);
});
