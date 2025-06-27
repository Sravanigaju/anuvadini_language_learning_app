const Crossword = require('../models/Crossword');
const User = require('../models/User');

// ------------------ CREATE ENTRY ------------------
exports.createCrosswordEntry = async (req, res) => {
  try {
    const { userId } = req.body;

    // Check if entry already exists
    const existing = await Crossword.findOne({ userId });
    if (existing) {
      return res.status(400).json({ message: "User already exists in Crossword." });
    }

    // Fetch username from User model
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Create Crossword entry
    const crossword = new Crossword({
      userId,
      username: user.username,
    });

    await crossword.save();
    res.status(201).json({ message: "Crossword entry created", crossword });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ------------------ ADD SESSION ------------------
exports.addCrosswordSession = async (req, res) => {
  try {
    const { userId } = req.params;
    const { language, categoryLevel, timeTaken, score, result } = req.body;

    const crossword = await Crossword.findOne({ userId });
    if (!crossword) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Ensure globalStats is initialized
    if (!crossword.globalStats) {
      crossword.globalStats = {
        coins: 0,
        totalGamesPlayed: 0,
        wins: 0,
        losses: 0,
        highestLevelReached: 1,
        achievementsUnlocked: 0
      };
    }

    // Add session
    crossword.sessions.push({ language, categoryLevel, timeTaken, score });

    // Update stats
    crossword.globalStats.totalGamesPlayed += 1;
    crossword.globalStats.coins += score * 10;

    if (result === 'win') {
      crossword.globalStats.wins += 1;
    } else {
      crossword.globalStats.losses += 1;
    }

    if (categoryLevel > crossword.globalStats.highestLevelReached) {
      crossword.globalStats.highestLevelReached = categoryLevel;
    }

    crossword.globalStats.achievementsUnlocked = Math.floor(
      crossword.globalStats.highestLevelReached / 100
    );

    await crossword.save();
    res.status(200).json({ message: "Session added successfully", crossword });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ------------------ GET USER PROGRESS ------------------
exports.getCrosswordProgress = async (req, res) => {
  try {
    const { userId } = req.params;

    const crossword = await Crossword.findOne({ userId });
    if (!crossword) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(crossword);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ------------------ GET LEADERBOARD ------------------
exports.getCrosswordLeaderboard = async (_req, res) => {
  try {
    const leaderboard = await Crossword.aggregate([
      { $unwind: "$sessions" },

      {
        $sort: {
          "sessions.categoryLevel": -1,
          "sessions.timeTaken": 1
        }
      },

      {
        $group: {
          _id: "$userId",
          username: { $first: "$username" },
          bestSession: { $first: "$sessions" }
        }
      },

      {
        $setWindowFields: {
          sortBy: { "bestSession.categoryLevel": -1 },
          output: {
            rank: { $rank: {} }
          }
        }
      },

      {
        $sort: {
          "bestSession.categoryLevel": -1,
          "bestSession.timeTaken": 1
        }
      },

      {
        $project: {
          userId: "$_id",
          username: 1,
          language: "$bestSession.language",
          categoryLevel: "$bestSession.categoryLevel",
          timeTaken: "$bestSession.timeTaken",
          score: "$bestSession.score",
          rank: 1
        }
      },

      { $limit: 50 }
    ]);

    res.status(200).json({ leaderboard });
  } catch (error) {
    console.error("Leaderboard error:", error);
    res.status(500).json({ error: error.message });
  }
};
