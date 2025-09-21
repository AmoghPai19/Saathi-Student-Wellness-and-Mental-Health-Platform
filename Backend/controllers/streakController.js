// controllers/streakController.js

import User from '../models/user.js';

// A helper function to check if two dates are on consecutive days
const isConsecutiveDay = (date1, date2) => {
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  const firstDate = new Date(date1);
  firstDate.setHours(0, 0, 0, 0); // Normalize to start of the day

  const secondDate = new Date(date2);
  secondDate.setHours(0, 0, 0, 0); // Normalize to start of the day

  return secondDate.getTime() - firstDate.getTime() === oneDay;
};

// A helper function to check if two dates are on the same day
const isSameDay = (date1, date2) => {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
};

// Use "export const" to create a named export
export const logMeditation = async (req, res) => {
  try {
    const user = await User.findById(req.user.id); // Get user from protect middleware

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const today = new Date();
    const lastDate = user.lastMeditationDate;

    if (lastDate && isSameDay(lastDate, today)) {
      // User has already meditated today, do nothing.
      return res.status(200).json({ 
        message: 'Meditation already logged for today.',
        currentStreak: user.currentStreak 
      });
    }

    if (lastDate && isConsecutiveDay(lastDate, today)) {
      // It's a consecutive day, increment the streak
      user.currentStreak += 1;
    } else {
      // The streak is broken or it's the first time
      user.currentStreak = 1;
    }

    user.lastMeditationDate = today;
    await user.save();

    res.status(200).json({
      message: 'Streak updated successfully!',
      currentStreak: user.currentStreak
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};