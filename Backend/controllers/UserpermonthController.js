const UserProfile = require("../models/UserProfile");

exports.UserpermonthController = async (req, res) => {
  try {
    const result = await UserProfile.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$joinedDate" },
            month: { $month: "$joinedDate" },
          },
          userCount: { $sum: 1 },
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      }
    ]);

    // Format the result into a more readable structure
    const formattedResult = result.map(entry => ({
      year: entry._id.year,
      month: entry._id.month,
      userCount: entry.userCount
    }));

    res.status(200).json({ success: true, data: formattedResult });
  } catch (error) {
    console.error("Error in UserpermonthController:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
