// const User = require('../models/User');
// const UserProfile = require('../models/UserProfile');
// const mongoose = require('mongoose');

// exports.getUserDashboard = async (req, res) => {
//   try {
//     let { userId } = req.params;
//     userId = userId.trim();

//     if (!mongoose.Types.ObjectId.isValid(userId)) {
//       return res.status(400).json({ message: "Invalid userId" });
//     }

//     const userProfile = await UserProfile.findOne({ userId }).populate({
//       path: 'userId',
//       select: 'username'
//     });

//     if (!userProfile) {
//       return res.status(404).json({ message: "User profile not found." });
//     }

//     const username = userProfile.userId.username;

//     return res.status(200).json({
//       user_id: userProfile.userId._id,
//       username: username,
//       joined_date: userProfile.joinedDate?.toISOString().split('T')[0],
//       day_streak: userProfile.dashboardStats?.streak?.currentStreak || 0,
//       total_xp: userProfile.points?.total || 0,
//       lessons_completed: userProfile.dashboardStats?.completedLessons || 0,
//       coins: userProfile.dashboardStats?.coins?.total || 0,
//       language_progress: userProfile.languageProgress || [],
//       leaderboard: userProfile.leaderboard || {},
//     });

//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message:error.message });
//   }
// };


const mongoose = require("mongoose");
const UserProfile = require("../models/UserProfile");

exports.getUserDashboard = async (req, res) => {
  try {
    const { userId } = req.params;
    const { language } = req.query;

    const userProfile = await UserProfile.findOne({ userId });
    if (!userProfile) return res.status(404).json({ error: "User not found" });
    console.log("Available languages:", userProfile.interestedLanguages.map(l => l.languageName));
    console.log("Looking for language:", language);

    const selectedLang = userProfile.interestedLanguages.find(
      (lang) => lang.languageName.toLowerCase() === language.toLowerCase()
    );
    if (!selectedLang) return res.status(400).json({ error: "Language not found" });

    const langStats = {
      dayStreak: selectedLang.streak.currentStreak,
      totalXP: selectedLang.xp,
      totalCoins: selectedLang.coins,
      lessonsCompleted: selectedLang.completedLessons,
      categoriesCompleted: selectedLang.catagoriecount,
      assessmentsCompleted: selectedLang.assesmentcompleted,
      finalAssessmentCompleted: selectedLang.finalassesementcompleted,
      level: selectedLang.level,
      lastActiveAt: selectedLang.lastActiveAt,
      dailyGoal: selectedLang.dailyGoal,
      progressPercent: selectedLang.progressPercent,
      motivation: selectedLang.motivation,
    };

<<<<<<< HEAD
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
=======
    const languageProgress = userProfile.interestedLanguages.map((lang) => ({
      languageName: lang.languageName,
>>>>>>> 413e769c2d6cfdfd79761a7cf6a793a5c2386477
      progressPercent: lang.progressPercent,
    }));

    // Use $facet to get top 10 + count users with higher XP
    const [leaderboardData] = await UserProfile.aggregate([
      { $unwind: "$interestedLanguages" },
      { $match: { "interestedLanguages.languageName": language } },
      {
        $facet: {
          topLearners: [
            {
              $project: {
                userId: "$userId",
                name: { $concat: ["$firstName", " ", "$lastName"] },
                xp: "$interestedLanguages.xp",
              },
            },
            { $sort: { xp: -1 } },
            { $limit: 10 },
          ],
          topGamers: [
            {
              $project: {
                userId: "$userId",
                name: { $concat: ["$firstName", " ", "$lastName"] },
                coins: "$interestedLanguages.coins",
              },
            },
            { $sort: { coins: -1 } },
            { $limit: 10 },
          ],
          learnerRankCount: [
            {
              $match: {
                "interestedLanguages.xp": { $gt: selectedLang.xp },
              },
            },
            { $count: "rank" },
          ],
          gamerRankCount: [
            {
              $match: {
                "interestedLanguages.coins": { $gt: selectedLang.coins },
              },
            },
            { $count: "rank" },
          ],
        },
      },
    ]);

    const learnerRank =
      (leaderboardData.learnerRankCount[0]?.rank || 0) + 1;
    const gamerRank =
      (leaderboardData.gamerRankCount[0]?.rank || 0) + 1;

    const dashboard = {
      user: {
        name: `${userProfile.firstName} ${userProfile.lastName}`,
        username: `@${(userProfile.firstName + userProfile.lastName).toLowerCase()}`,
        joinDate: userProfile.joinedDate,
      },
      languageStats: langStats,
      languageProgress,
      topLearners: leaderboardData.topLearners,
      topGamers: leaderboardData.topGamers,
      userRank: {
        learnerRank,
        gamerRank,
      },
    };

    return res.json({ dashboard });
  } catch (error) {
<<<<<<< HEAD
    console.error("Dashboard error:", error);
    return res.status(500).json({ message: error.message });
=======
    console.error("Dashboard Error:", error);
    return res.status(500).json({ error: "Internal server error" });
>>>>>>> 413e769c2d6cfdfd79761a7cf6a793a5c2386477
  }
};
