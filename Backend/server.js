import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// Import your existing route files
import appointmentRoutes from "./routes/appointmentRoutes.js";
import messageRoutes from "./routes/messagesRoutes.js";
import communityRoutes from "./routes/communityRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import streakRoutes from "./routes/streakRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js"; // ✅ new analytics routes
import journalRoutes from "./routes/journalRoutes.js";
import moodRoutes from "./routes/mood.js";

dotenv.config();

// Helpful startup checks for required environment variables
if (!process.env.MONGODB_URI) {
  console.warn('⚠️ Warning: MONGODB_URI is not set. Database connection will fail without it.');
}
if (!process.env.JWT_SECRET) {
  console.warn('⚠️ Warning: JWT_SECRET is not set. Authentication tokens cannot be signed.');
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, { dbName: "saathiDatabase" })
  .then(() => console.log("✅ MongoDB connected successfully!"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

  mongoose.connection.on("connected", () => {
  console.log("✅ MongoDB connection is OPEN");
});

mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("⚠️ MongoDB disconnected");
});
// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection (only if MONGODB_URI is provided)
let mongoConnected = false;
if (process.env.MONGODB_URI) {
  mongoose
    .connect(process.env.MONGODB_URI, { dbName: "saathiDatabase" })
    .then(() => {
      console.log("✅ MongoDB connected successfully!");
      mongoConnected = true;
    })
    .catch((err) => console.error("❌ MongoDB connection error:", err));

  mongoose.connection.on("connected", () => {
    console.log("✅ MongoDB connection is OPEN");
    mongoConnected = true;
  });

  mongoose.connection.on("error", (err) => {
    console.error("❌ MongoDB connection error:", err);
    mongoConnected = false;
  });

  mongoose.connection.on("disconnected", () => {
    console.log("⚠️ MongoDB disconnected");
    mongoConnected = false;
  });
} else {
  console.warn('Skipping MongoDB connect because MONGODB_URI is not configured.');
}


// API Routes
app.use("/api/appointments", appointmentRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/auth", authRoutes); 
app.use("/api/streaks", streakRoutes);
app.use("/api/analytics", analyticsRoutes); // ✅ analytics endpoint
app.use("/api/journal", journalRoutes);
app.use("/api/mood", moodRoutes);

// Debug endpoint to help identify deployment misconfiguration
app.get('/api/debug', (req, res) => {
  res.json({
    env: {
      MONGODB_URI: !!process.env.MONGODB_URI,
      JWT_SECRET: !!process.env.JWT_SECRET,
      PORT: process.env.PORT || null,
    },
    mongoConnectionState: mongoose.connection.readyState, // 0 = disconnected, 1 = connected
    mongoConnected,
  });
});

