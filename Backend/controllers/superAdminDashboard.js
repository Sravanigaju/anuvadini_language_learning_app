const UserProfile = require("../models/UserProfile");

exports.getSuperAdminDashboard = async (req, res) => {
  try {
    const languageFilter = req.query.language || null;

    // Age distribution buckets
    const ageBuckets = [
      { label: "10-19", min: 10, max: 19 },
      { label: "20-29", min: 20, max: 29 },
      { label: "30-39", min: 30, max: 39 },
      { label: "40-49", min: 40, max: 49 },
      { label: "50+", min: 50, max: 200 },
    ];

    // Age Distribution
    const ageDistribution = await Promise.all(
      ageBuckets.map(async (b) => {
        const filter = { age: { $gte: b.min, $lte: b.max } };
        if (languageFilter) {
          filter["interestedLanguages.languageName"] = languageFilter;
        }
        const count = await UserProfile.countDocuments(filter);
        return { label: b.label, count };
      })
    );

    // Gender Distribution
    const genderMatch = languageFilter
      ? { $match: { "interestedLanguages.languageName": languageFilter } }
      : { $match: {} };

    const genderDistribution = await UserProfile.aggregate([
      genderMatch,
      { $group: { _id: "$gender", count: { $sum: 1 } } },
    ]);

    // Certificate Stats
    const certFilter = languageFilter
      ? { "interestedLanguages": { $elemMatch: { languageName: languageFilter } } }
      : {};

    const completed = await UserProfile.countDocuments({
      ...certFilter,
      "interestedLanguages.certificate": true,
    });
    const pending = await UserProfile.countDocuments({
      ...certFilter,
      "interestedLanguages.certificate": false,
    });

    // Funnel Chart
    const funnelFilter = languageFilter
      ? { "interestedLanguages.languageName": languageFilter }
      : {};

    const enrolled = await UserProfile.countDocuments(funnelFilter);
    const started = await UserProfile.countDocuments({
      ...funnelFilter,
      "interestedLanguages.progressPercent": { $gte: 10 },
    });
    const midway = await UserProfile.countDocuments({
      ...funnelFilter,
      "interestedLanguages.progressPercent": { $gte: 50 },
    });
    const certified = await UserProfile.countDocuments({
      ...funnelFilter,
      "interestedLanguages.certificate": true,
    });

    const funnelChart = { enrolled, started, midway, certified };

    // Game Stats – sample static
    const gameStats = [
      { game: "Crossword", plays: 1200 },
      { game: "Listening", plays: 900 },
      { game: "Drag & Drop", plays: 700 },
      { game: "Word Match", plays: 650 },
      { game: "Daily Quiz", plays: 1500 },
    ];

    // Language Leaderboard (top 3)
    const leaderboard = await UserProfile.aggregate([
      { $unwind: "$interestedLanguages" },
      {
        $match: {
          "interestedLanguages.languageName": languageFilter || "Hindi", // fallback
        },
      },
      {
        $project: {
          _id: 1,
          username: { $concat: ["$firstName", " ", "$lastName"] },
          xp: "$interestedLanguages.xp",
          lessons: "$interestedLanguages.completedLessons",
          assessments: {
            $add: [
              { $ifNull: ["$interestedLanguages.assesmentcompleted", 0] },
              { $ifNull: ["$interestedLanguages.finalassesementcompleted", 0] },
            ],
          },
          language: "$interestedLanguages.languageName",
        },
      },
      { $sort: { xp: -1 } },
      { $limit: 3 },
    ]);

    // Top Source and Target Languages
    const topSourceLanguage = await UserProfile.aggregate([
      { $group: { _id: "$sourceLanguage", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]);

    const topTargetLanguage = await UserProfile.aggregate([
      { $unwind: "$interestedLanguages" },
      { $group: { _id: "$interestedLanguages.languageName", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]);

    // Average XP and Coins
    const avgXpAndCoins = await UserProfile.aggregate([
      {
        $group: {
          _id: null,
          avgXp: { $avg: "$total_xp" },
          avgCoins: { $avg: "$total_coin" },
        },
      },
    ]);

    // Monthly User Join Trends
    const usersJoinedPerMonth = await UserProfile.aggregate([
      {
        $group: {
          _id: { $month: "$joinedDate" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    // Users by Country
    const usersByCountry = await UserProfile.aggregate([
      {
        $group: {
          _id: "$country",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Total user count
    const totalUsers = await UserProfile.countDocuments();

    // Final response
    res.status(200).json({
      totalUsers,
      avgXpPerUser: avgXpAndCoins[0]?.avgXp || 0,
      avgCoinsPerUser: avgXpAndCoins[0]?.avgCoins || 0,
      topSourceLanguage: topSourceLanguage[0]?._id || "N/A",
      topTargetLanguage: topTargetLanguage[0]?._id || "N/A",
      ageDistribution,
      genderDistribution,
      certificateStatus: { completed, pending },
      usersJoinedPerMonth,
      usersByCountry,
      funnelChart,
      gameStats,
      languageLearningLeaderboard: leaderboard,
    });
  } catch (error) {
    console.error("❌ Error fetching super admin dashboard:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
