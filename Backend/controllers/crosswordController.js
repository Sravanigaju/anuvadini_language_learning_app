const Crossword = require('../models/Crossword');
const User = require('../models/User');
  
// ------------------ CREATE ENTRY ------------------
exports.createCrosswordEntry = async (req, res) => {
  try {
    const { userId } = req.body;

    // Check if crossword entry already exists
    const existing = await Crossword.findOne({ userId });
    if (existing) {
      return res.status(200).json({ message: "Crossword entry already exists", crossword: existing });
    }

    // Fetch user from User model
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create new Crossword entry
    const crossword = new Crossword({
      userId: user._id,
      username: user.username,
      sessions: [],
      dailyQuizSessions: [],
      globalStats: {
        coins: 0,
        totalGamesPlayed: 0,
        wins: 0,
        losses: 0,
        highestLevelReached: 1,
        achievementsUnlocked: 0,
        dailyStreak: 0
      }
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

    if (!language || !categoryLevel || !timeTaken || !score || !result) {
      return res.status(400).json({ message: "Missing required session fields." });
    }

    let crossword = await Crossword.findOne({ userId });

    // Auto-create crossword entry if missing
    if (!crossword) {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      crossword = new Crossword({
        userId: user._id,
        username: user.username,
        sessions: [],
        dailyQuizSessions: [],
        globalStats: {
          coins: 0,
          totalGamesPlayed: 0,
          wins: 0,
          losses: 0,
          highestLevelReached: 1,
          achievementsUnlocked: 0,
          dailyStreak: 0
        }
      });
    }

    // Add session
    crossword.sessions.push({ language, categoryLevel, timeTaken, score });

    // Update stats
    crossword.globalStats.totalGamesPlayed += 1;
    crossword.globalStats.coins += score * 10;
    crossword.globalStats[result === 'win' ? 'wins' : 'losses'] += 1;

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
      return res.status(404).json({ message: 'User not found in Crossword' });
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
        $lookup: {
          from: "userprofile", // 👈 your UserProfile collection name
          localField: "_id",
          foreignField: "userId",
          as: "profile"
        }
      },
      {
        $unwind: {
          path: "$profile",
          preserveNullAndEmptyArrays: true // so users without profiles don't crash it
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
          rank: 1,
          profilePic: "$profile.profilePic" // 👈 Include image URL
        }
      },
      { $limit: 50 }
    ]);

    res.status(200).json({ leaderboard });
  } catch (error) {
    console.error("Leaderboard error:", error);
    res.status(500).json({ error: error.message });
  }
}

// ------------------ ADD DAILY QUIZ SESSION ------------------
exports.addDailyQuizSession = async (req, res) => {
  try {
    const { userId } = req.params;
    const { timeTaken, correctAnswers } = req.body;

    if (!timeTaken || correctAnswers === undefined) {
      return res.status(400).json({ message: "Missing required daily quiz fields." });
    }

    let crossword = await Crossword.findOne({ userId });

    // Auto-create crossword entry if missing
    if (!crossword) {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      crossword = new Crossword({
        userId: user._id,
        username: user.username,
        sessions: [],
        dailyQuizSessions: [],
        globalStats: {
          coins: 0,
          totalGamesPlayed: 0,
          wins: 0,
          losses: 0,
          highestLevelReached: 1,
          achievementsUnlocked: 0,
          dailyStreak: 0
        }
      });
    }

    // Add daily quiz session
    crossword.dailyQuizSessions.push({ timeTaken, correctAnswers });

    // Update daily streak
    await updateDailyStreak(crossword);

    await crossword.save();
    res.status(200).json({ message: "Daily quiz session added successfully", crossword });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ------------------ UPDATE DAILY STREAK ------------------
const updateDailyStreak = async (crossword) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Check if user played today
    const playedToday = crossword.dailyQuizSessions.some(session => {
      const sessionDate = new Date(session.timestamp);
      sessionDate.setHours(0, 0, 0, 0);
      return sessionDate.getTime() === today.getTime();
    });

    // Check if user played yesterday
    const playedYesterday = crossword.dailyQuizSessions.some(session => {
      const sessionDate = new Date(session.timestamp);
      sessionDate.setHours(0, 0, 0, 0);
      return sessionDate.getTime() === yesterday.getTime();
    });

    if (playedToday) {
      if (playedYesterday) {
        // Continue streak
        crossword.globalStats.dailyStreak += 1;
      } else {
        // Start new streak
        crossword.globalStats.dailyStreak = 1;
      }
    }
  } catch (error) {
    console.error("Error updating daily streak:", error);
  }
};

// ------------------ GET DAILY QUIZ PROGRESS ------------------
exports.getDailyQuizProgress = async (req, res) => {
  try {
    const { userId } = req.params;

    const crossword = await Crossword.findOne({ userId });
    if (!crossword) {
      return res.status(404).json({ message: 'User not found in Crossword' });
    }

    const dailyQuizData = {
      dailyQuizSessions: crossword.dailyQuizSessions,
      dailyStreak: crossword.globalStats.dailyStreak
    };

    res.status(200).json(dailyQuizData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};