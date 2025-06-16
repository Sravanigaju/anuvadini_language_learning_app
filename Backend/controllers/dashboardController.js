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

    // Prepare language-wise stats
    console.log("testing data:", userProfile.interestedLanguages)
    const interestedLangs = userProfile.interestedLanguages.map(lang => ({
      languageId: lang.languageId,
      languageName: typeof lang.languageName === 'object'
        ? Object.values(lang.languageName).join('')
        : lang.languageName,
      level: lang.level,
      xp: lang.xp,
      dailyGoal: lang.dailyGoal,
      completedLessons: lang.completedLessons,
      progressPercent: lang.progressPercent,
      streak: lang.streak,
      badges: lang.badgesEarned,
      lastActiveAt: lang.lastActiveAt
    }));

    console.log("filter", interestedLangs);

    return res.status(200).json({
      user_id: userProfile.userId._id,
      username,
      joined_date: userProfile.joinedDate?.toISOString().split('T')[0],
      source_language: userProfile.sourceLanguage,
      profile_pic: userProfile.profilePic,
      total_xp: userProfile.total_xp || 0,
      total_coin: userProfile.total_coin || 0,
      interestedlanguages: interestedLangs,
      createdAt: userProfile.createdAt,
    });

  } catch (error) {
    console.error("Dashboard error:", error);
    return res.status(500).json({ message: error.message });
  }
};
