import express from "express";
import Journal from "../models/Journal.js";

const router = express.Router();

// Save a journal entry
router.post("/", async (req, res) => {
  try {
    const { userId, entry } = req.body;
    const newEntry = new Journal({ userId, entry });
    await newEntry.save();
    res.json({ message: "Journal entry saved successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Failed to save journal entry" });
  }
});

// Get all entries for a user
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const entries = await Journal.find({ userId }).sort({ date: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch journal entries" });
  }
});

export default router;
