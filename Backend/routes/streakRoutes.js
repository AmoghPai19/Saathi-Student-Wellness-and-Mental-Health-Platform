import express from "express";


const router = express.Router();

// Get current streak
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      streakDays: user.streakDays || 0,
      lastMeditatedDate: user.lastMeditatedDate || null,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Mark today
router.post("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastDate = user.lastMeditatedDate ? new Date(user.lastMeditatedDate) : null;

    if (!lastDate || lastDate < today) {
      user.streakDays = (user.streakDays || 0) + 1;
      user.lastMeditatedDate = today;
      await user.save();
    }

    res.json({ streakDays: user.streakDays, lastMeditatedDate: user.lastMeditatedDate });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
