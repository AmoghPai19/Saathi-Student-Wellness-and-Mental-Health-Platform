// models/Mood.js
import mongoose from "mongoose";

const moodSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  mood: { type: String, required: true },
  date: { type: Date, default: Date.now }, // timestamp of when mood was selected
});

const Mood = mongoose.model("Mood", moodSchema);
export default Mood;
