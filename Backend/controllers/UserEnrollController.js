const UserProfile = require("../models/UserProfile");

exports.LanguageStatsController = async (req, res) => {
  try {
    const result = await UserProfile.aggregate([
      { $unwind: "$interestedLanguages" },

      {
        $group: {
          _id: "$interestedLanguages.languageName",

          users: { $sum: 1 },
          totalXP: { $sum: "$interestedLanguages.xp" },
          totalCoins: { $sum: "$total_coin" }, // Note: adjust if coins are language-specific
          totalProgress: { $sum: "$interestedLanguages.progressPercent" },

          certificatesIssued: {
            $sum: {
              $cond: [
                { $eq: ["$interestedLanguages.certificate", true] },
                1,
                0
              ]
            }
          },

          enrolled: {
            $sum: {
              $cond: [
                { $gt: ["$interestedLanguages.progressPercent", 0] },
                1,
                0
              ]
            }
          }
        }
      },

      {
        $project: {
          _id: 0,
          language: "$_id",
          users: 1,
          enrolled: 1,
          averageXP: { $round: [{ $divide: ["$totalXP", "$users"] }, 0] },
          averageCoins: { $round: [{ $divide: ["$totalCoins", "$users"] }, 0] },
          averageProgress: {
            $concat: [
              { $toString: { $round: [{ $divide: ["$totalProgress", "$users"] }, 1] } },
              "%"
            ]
          },
          certificatesIssued: 1
        }
      },

      { $sort: { users: -1 } }
    ]);

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("Error in LanguageStatsController:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
