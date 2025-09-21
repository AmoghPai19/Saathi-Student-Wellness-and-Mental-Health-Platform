import express from "express";
import Streak from "../models/Streak.js";

const router = express.Router();

// Get current streak for a user
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    let streak = await Streak.findOne({ userId });
    if (!streak) {
      streak = new Streak({ userId, streakDays: 0 });
      await streak.save();
    }
    res.json(streak);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update streak when user meditates
router.post("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    let streak = await Streak.findOne({ userId });
    if (!streak) {
      streak = new Streak({ userId, streakDays: 0 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastDate = streak.lastMeditatedDate ? new Date(streak.lastMeditatedDate) : null;
    if (!lastDate || lastDate < today) {
      streak.streakDays += 1;
      streak.lastMeditatedDate = today;
      await streak.save();
    }

    res.json(streak);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
