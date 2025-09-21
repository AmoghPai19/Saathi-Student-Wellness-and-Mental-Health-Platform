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


// API Routes
app.use("/api/appointments", appointmentRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/auth", authRoutes); 
app.use("/api/streaks", streakRoutes);
app.use("/api/analytics", analyticsRoutes); // ✅ analytics endpoint
app.use("/api/journal", journalRoutes);
app.use("/api/mood", moodRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("🚀 Saathi backend server is running!");
});

// Global error handling (optional but recommended)
app.use((err, req, res, next) => {
  console.error("🔥 Error stack:", err.stack);
  res.status(500).json({ message: "Server Error", error: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`⚡ Server running at http://localhost:${PORT}`);
});

