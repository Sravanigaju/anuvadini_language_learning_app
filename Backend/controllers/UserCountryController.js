const UserProfile = require("../models/UserProfile");

exports.UserCountryController = async (req, res) => {
  try {
    const result = await UserProfile.aggregate([
      {
        $unwind: "$interestedLanguages"  // Flatten the array
      },
      {
        $group: {
          _id: {
            country: "$country",
            language: "$interestedLanguages.languageName"
          },
          userCount: { $sum: 1 }
        }
      },
      {
        $sort: {
          "_id.country": 1,
          "userCount": -1
        }
      }
    ]);

    // Optional: reshape for readability
    const formatted = result.map(entry => ({
      country: entry._id.country,
      language: entry._id.language,
      userCount: entry.userCount
    }));

    res.status(200).json({ success: true, data: formatted });
  } catch (error) {
    console.error("Error in UsersPerCountryByLanguage:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
