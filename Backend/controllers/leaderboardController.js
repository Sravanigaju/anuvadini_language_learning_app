const UserProfile = require("../models/UserProfile");

exports.getXpLeaderboard = async (req, res) => {
  try {
    const { language } = req.params;
    const type = req.query.type || "total";

    // Determine the XP field based on type
    let xpField;
    switch (type.toLowerCase()) {
      case "weekly":
        xpField = "$interestedLanguages.xpWeekly";
        break;
      case "monthly":
        xpField = "$interestedLanguages.xpMonthly";
        break;
      case "yearly":
        xpField = "$interestedLanguages.xpYearly";
        break;
      case "total":
      default:
        xpField = "$interestedLanguages.xp";
    }

    // Leaderboard aggregation
    const leaderboard = await UserProfile.aggregate([
      { $unwind: "$interestedLanguages" },
      { $match: { "interestedLanguages.languageName": language } },
      {
        $project: {
          _id: 0, // do not include _id in response
          userId: 1,
          name: { $concat: ["$firstName", " ", "$lastName"] },
          profilePic: 1,
          xp: xpField,
          completedLessons: "$interestedLanguages.completedLessons",
          totalAssessments: {
            $add: [
              { $ifNull: ["$interestedLanguages.assesmentcompleted", 0] },
              { $ifNull: ["$interestedLanguages.finalassesementcompleted", 0] }
            ]
          }
        }
      },
      { $sort: { xp: -1 } },
      { $limit: 10 }
    ]);

    return res.status(200).json({ leaderboard });
  } catch (error) {
    console.error("Leaderboard Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
