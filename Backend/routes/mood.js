// routes/mood.js
import express from "express";
import Mood from "../models/Mood.js";

const router = express.Router();

// Add mood entry
router.post("/", async (req, res) => {
  try {
    const { userId, mood } = req.body;
    if (!userId || !mood) return res.status(400).json({ message: "Missing fields" });

    const newMood = new Mood({ userId, mood });
    await newMood.save();
    res.status(201).json({ message: "Mood saved successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get weekly report
router.get("/weekly/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    // Fetch moods in the last 7 days
    const moods = await Mood.find({ userId, date: { $gte: oneWeekAgo } }).sort({ date: 1 });

    // Aggregate count by mood
    const moodCount = {};
    moods.forEach((entry) => {
      moodCount[entry.mood] = (moodCount[entry.mood] || 0) + 1;
    });

    res.json({ weeklyReport: moodCount, entries: moods });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
