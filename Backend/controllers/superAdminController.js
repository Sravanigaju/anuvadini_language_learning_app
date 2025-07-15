const UserProfile = require("../models/UserProfile");


exports.getTotalUsers = async (req, res) => {
  try {
    const totalUsers = await UserProfile.countDocuments();
    res.status(200).json({ totalUsers });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getAvgXpAndCoins = async (req, res) => {
  try {
    const result = await UserProfile.aggregate([
      {
        $group: {
          _id: null,
          avgXp: { $avg: "$total_xp" },
          avgCoins: { $avg: "$total_coin" }
        }
      }
    ]);
    res.status(200).json(result[0] || { avgXp: 0, avgCoins: 0 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTopLanguages = async (req, res) => {
  try {
    const topSource = await UserProfile.aggregate([
      { $group: { _id: "$sourceLanguage", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);

    const targetCounts = await UserProfile.aggregate([
      { $unwind: "$interestedLanguages" },
      { $group: { _id: "$interestedLanguages.languageName", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);

    res.status(200).json({
      topSourceLanguage: topSource[0]?._id || "N/A",
      topTargetLanguage: targetCounts[0]?._id || "N/A"
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getAgeDistribution = async (req, res) => {
  try {
    const buckets = [
      { label: "10-19", min: 10, max: 19 },
      { label: "20-29", min: 20, max: 29 },
      { label: "30-39", min: 30, max: 39 },
      { label: "40-49", min: 40, max: 49 },
      { label: "50+", min: 50, max: 200 }
    ];

    const results = await Promise.all(
      buckets.map(async (b) => {
        const count = await UserProfile.countDocuments({
          age: { $gte: b.min, $lte: b.max }
        });
        return { label: b.label, count };
      })
    );

    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getGenderDistribution = async (req, res) => {
  try {
    const distribution = await UserProfile.aggregate([
      { $group: { _id: "$gender", count: { $sum: 1 } } }
    ]);
    res.status(200).json(distribution);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCertificateStats = async (req, res) => {
  try {
    const completed = await UserProfile.countDocuments({
      "interestedLanguages.certificate": true
    });

    const pending = await UserProfile.countDocuments({
      "interestedLanguages.certificate": false
    });

    res.status(200).json({ completed, pending });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getUsersJoinedPerMonth = async (req, res) => {
  try {
    const monthlyJoins = await UserProfile.aggregate([
      {
        $group: {
          _id: { $month: "$joinedDate" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    res.status(200).json(monthlyJoins);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getUsersByCountry = async (req, res) => {
  try {
    const usersByCountry = await UserProfile.aggregate([
      {
        $group: {
          _id: "$country",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json(usersByCountry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
