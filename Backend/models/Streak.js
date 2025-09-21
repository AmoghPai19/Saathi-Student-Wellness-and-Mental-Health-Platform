import mongoose from "mongoose";

const streakSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  streakDays: { type: Number, default: 0 },
  lastMeditatedDate: { type: Date }
});

const Streak = mongoose.model("Streak", streakSchema);

export default Streak;
