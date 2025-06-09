
const mongoose = require("mongoose");
const UserProfile = require("../models/UserProfile");

exports.getUserDashboard = async (req, res) => {
  try {
    let { userId } = req.params;
    userId = userId.trim();

    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const userProfile = await UserProfile.findOne({ userId });

    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found." });
    }

    const dashboardData = {
      name: `${userProfile.firstName} ${userProfile.lastName}`,
      points: userProfile.points.total,
      completedLessons: userProfile.dashboardStats?.completedLessons || 0,
      totalTimeSpent: userProfile.dashboardStats?.totalTimeSpent || 0,
      lastActiveAt: userProfile.dashboardStats?.lastActiveAt,
      badges: userProfile.dashboardStats?.badgesEarned || [],
      dailyGoal: userProfile.dailyGoal,
      motivation: userProfile.motivation,
      interestedLanguages: userProfile.interestedLanguages,
      streakGoal: userProfile.streakGoal || 0,    
      coins: userProfile.coins || 0,               
    };

    res.status(200).json(dashboardData);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
