const User = require('../models/User');
const UserProfile = require('../models/UserProfile');
const mongoose = require('mongoose');

exports.getUserDashboard = async (req, res) => {
  try {
    let { userId } = req.params;
    userId = userId.trim();

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const userProfile = await UserProfile.findOne({ userId }).populate({
      path: 'userId',
      select: 'username'
    });

    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found." });
    }

    const username = userProfile.userId.username;

    return res.status(200).json({
      user_id: userProfile.userId._id,
      username: username,
      joined_date: userProfile.joinedDate?.toISOString().split('T')[0],
      day_streak: userProfile.dashboardStats?.streak?.currentStreak || 0,
      total_xp: userProfile.points?.total || 0,
      lessons_completed: userProfile.dashboardStats?.completedLessons || 0,
      coins: userProfile.dashboardStats?.coins?.total || 0,
      language_progress: userProfile.languageProgress || [],
      leaderboard: userProfile.leaderboard || {},
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message:error.message });
  }
};
