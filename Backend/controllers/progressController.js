import UserProfile from '../models/UserProfile.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

exports.xpEarned = async (req, res) => {
  const { userId, language, xpEarned, completedLesson } = req.body;

  try {
    const user = await UserProfile.findOne({ userId });

    if (!user) return res.status(404).json({ error: 'User not found' });

    // XP Update
    user.leaderboard[language] = user.leaderboard[language] || { xp: 0, rank: 0 };
    user.leaderboard[language].xp += xpEarned;

    // Lesson Progress
    user.dashboardStats.completedLessons += 1;

    // Streak Logic (simplified)
    const today = new Date().toDateString();
    const lastCompleted = user.dashboardStats.streak.lastCompletedDate?.toDateString();
    if (lastCompleted !== today) {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      if (lastCompleted === yesterday) {
        user.dashboardStats.streak.currentStreak += 1;
      } else {
        user.dashboardStats.streak.currentStreak = 1;
      }

      user.dashboardStats.streak.lastCompletedDate = new Date();

      // Longest streak
      user.dashboardStats.streak.longestStreak = Math.max(
        user.dashboardStats.streak.longestStreak,
        user.dashboardStats.streak.currentStreak
      );
    }

    await user.save();
    res.json({ success: true, message: 'Progress updated.' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};