import express from "express";
import mongoose from "mongoose";

const router = express.Router();

// Test analytics route
router.get("/", async (req, res) => {
  try {
    console.log("📊 Analytics route hit");

    // Example: count directly from collections
    const totalUsers = await mongoose.connection.db.collection("users").countDocuments();
    const totalMessages = await mongoose.connection.db.collection("messages").countDocuments();
    const totalAppointments = await mongoose.connection.db.collection("appointments").countDocuments();
    const totalCommunities = await mongoose.connection.db.collection("posts").countDocuments();

    res.json({
      totalUsers,
      totalMessages,
      totalAppointments,
      totalCommunities,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("❌ Analytics fetch error:", error);
    res.status(500).json({ message: "Error fetching analytics", error: error.message });
  }
});

export default router;
