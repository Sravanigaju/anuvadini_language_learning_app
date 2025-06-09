const UserProfile = require("../models/UserProfile");


// Get top 3 users for a type + language
exports.getLeaderboard = async (req, res) => {
  const { type, language } = req.params;
  const key = `${type}_${language.toLowerCase()}`;

  try {
    const topUsers = await UserProfile.find({
      [`points.breakdown.${key}`]: { $gt: 0 }
    })
      .sort({ [`points.breakdown.${key}`]: -1 })
      .limit(3)
      .select("firstName lastName profilePic points.breakdown");

    res.json({
      language,
      type,
      topUsers: topUsers.map((user, index) => ({
        name: `${user.firstName} ${user.lastName}`,
        profilePic: user.profilePic,
        points: user.points.breakdown.get(key) || 0,
        rank: index + 1,
      })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get user's rank for a type + language
exports.getUserRank = async (req, res) => {
  const { type, language } = req.params;
  const userId = req.query.userId;
  const key = `${type}_${language.toLowerCase()}`;

  try {
    const users = await UserProfile.find({
      [`points.breakdown.${key}`]: { $exists: true }
    })
      .sort({ [`points.breakdown.${key}`]: -1 })
      .select("userId points.breakdown");

    const userIndex = users.findIndex(u => u.userId.toString() === userId);

    if (userIndex === -1) {
      return res.status(404).json({ message: "User not found in ranking." });
    }

    const user = users[userIndex];
    res.json({
      userId,
      language,
      type,
      rank: userIndex + 1,
      points: user.points.breakdown.get(key) || 0,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update user's score
exports.updateUserPoints = async (req, res) => {
  const { userId, type, language, score } = req.body;
  const key = `${type}_${language.toLowerCase()}`;

  try {
    const profile = await UserProfile.findOne({ userId });
    if (!profile) {
      return res.status(404).json({ message: "User profile not found." });
    }

    const current = profile.points.breakdown.get(key) || 0;
    profile.points.breakdown.set(key, current + score);
    profile.points.total += score;

    await profile.save();
    res.json({ message: "Points updated successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
