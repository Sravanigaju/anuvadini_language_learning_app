// const UserProfile = require("../models/UserProfile");

// exports.LanguageStatsController = async (req, res) => {
//   try {
//     const result = await UserProfile.aggregate([
//       { $unwind: "$interestedLanguages" },

//       {
//         $group: {
//           _id: "$interestedLanguages.languageName",

//           users: { $sum: 1 },
//           totalXP: { $sum: "$interestedLanguages.xp" },
//           totalCoins: { $sum: "$total_coin" },
//           totalProgress: { $sum: "$interestedLanguages.progressPercent" },
//           totalCertificates: {
//             $sum: {
//               $cond: ["$interestedLanguages.certificate", 1, 0]
//             }
//           }
//         }
//       },

//       {
//         $project: {
//           _id: 0,
//           language: "$_id",
//           users: 1,
//           enrolled: { $multiply: ["$users", 3] }, // or some logic if needed
//           averageXP: { $round: [{ $divide: ["$totalXP", "$users"] }, 0] },
//           averageCoins: { $round: [{ $divide: ["$totalCoins", "$users"] }, 0] },
//           averageProgress: {
//             $round: [{ $divide: ["$totalProgress", "$users"] }, 1]
//           },
//           certificatesIssued: "$totalCertificates"
//         }
//       },

//       { $sort: { users: -1 } }
//     ]);

//     res.status(200).json({ success: true, data: result });
//   } catch (error) {
//     console.error("Error in LanguageStatsController:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };
