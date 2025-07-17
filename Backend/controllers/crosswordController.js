const Crossword = require('../models/Crossword');
const User = require('../models/User');
const UserProfile = require('../models/UserProfile');
  
// ------------------ CREATE ENTRY ------------------
exports.createCrosswordEntry = async (req, res) => {
  try {
    const { userId } = req.body;
    console.log("done");

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

    // Calculate coins to be earned
    const coinsEarned = score * 10;

    // Update stats
    crossword.globalStats.totalGamesPlayed += 1;
    crossword.globalStats.coins += coinsEarned;
    crossword.globalStats[result === 'win' ? 'wins' : 'losses'] += 1;

    // Update highest level reached and unlock next level if score is good enough
    if (categoryLevel > crossword.globalStats.highestLevelReached || 
        (categoryLevel === crossword.globalStats.highestLevelReached && score >= 2)) {
      // Only increment highest level if current level was completed with good score
      if (score >= 2) {
        crossword.globalStats.highestLevelReached = categoryLevel + 1;
      } else {
        crossword.globalStats.highestLevelReached = Math.max(categoryLevel, crossword.globalStats.highestLevelReached);
      }
    }

    crossword.globalStats.achievementsUnlocked = Math.floor(
      crossword.globalStats.highestLevelReached / 100
    );

    // Update UserProfile's total_coin
    await UserProfile.findOneAndUpdate(
      { userId },
      { $inc: { total_coin: coinsEarned } },
      { new: true }
    );

    await crossword.save();
    res.status(200).json({ 
      message: "Session added successfully", 
      crossword,
      sessionSummary: {
        coinsEarned,
        newHighestLevel: crossword.globalStats.highestLevelReached,
        totalCoins: crossword.globalStats.coins
      }
    });
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
    const { timeTaken, correctAnswers, targetLanguage } = req.body;

    if (!timeTaken || correctAnswers === undefined || !targetLanguage) {
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

    // Add daily quiz session with target language
    crossword.dailyQuizSessions.push({ timeTaken, correctAnswers, targetLanguage });

    // Update daily streak
    await updateDailyStreak(crossword);

    // Calculate coins earned
    // Base coins for participation
    let coinsEarned = 10;
    
    // Additional coins for correct answers (10 coins per correct answer)
    coinsEarned += correctAnswers * 10;
    
    // Streak bonus (5 coins per day of streak, capped at 50)
    const streakBonus = Math.min(crossword.globalStats.dailyStreak * 5, 50);
    coinsEarned += streakBonus;

    // Update global stats
    crossword.globalStats.coins += coinsEarned;
    crossword.globalStats.totalGamesPlayed += 1;
    
    // Update wins/losses based on performance (win if more than 50% correct)
    if (correctAnswers >= 2) {
      crossword.globalStats.wins += 1;
    } else {
      crossword.globalStats.losses += 1;
    }

    // Update UserProfile's total_coin
    await UserProfile.findOneAndUpdate(
      { userId },
      { $inc: { total_coin: coinsEarned } },
      { new: true }
    );

    await crossword.save();
    res.status(200).json({ 
      message: "Daily quiz session added successfully", 
      crossword,
      sessionSummary: {
        coinsEarned,
        streakBonus,
        totalCoins: crossword.globalStats.coins,
        currentStreak: crossword.globalStats.dailyStreak
      }
    });
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
// ------------------ GET DAILY QUIZ LEADERBOARD ------------------
exports.getDailyQuizLeaderboard = async (_req, res) => {
  try {
    const leaderboard = await Crossword.aggregate([
      { $unwind: "$dailyQuizSessions" },
      {
        $sort: {
          "dailyQuizSessions.correctAnswers": -1,
          "dailyQuizSessions.timeTaken": 1
        }
      },
      {
        $group: {
          _id: "$userId",
          username: { $first: "$username" },
          bestSession: { $first: "$dailyQuizSessions" }
        }
      },
      {
        $lookup: {
          from: "userprofile",
          localField: "_id",
          foreignField: "userId",
          as: "profile"
        }
      },
      {
        $unwind: {
          path: "$profile",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $setWindowFields: {
          sortBy: { "bestSession.correctAnswers": -1 },
          output: {
            rank: { $rank: {} }
          }
        }
      },
      {
        $sort: {
          "bestSession.correctAnswers": -1,
          "bestSession.timeTaken": 1
        }
      },
      {
        $project: {
          userId: "$_id",
          username: 1,
          correctAnswers: "$bestSession.correctAnswers",
          timeTaken: "$bestSession.timeTaken",
          rank: 1,
          profilePic: "$profile.profilePic"
        }
      },
      { $limit: 50 }
    ]);
    res.status(200).json({ leaderboard });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ------------------ ADD LISTENING SESSION ------------------
exports.addListeningSession = async (req, res) => {
  try {
    const { userId } = req.params;
    const { targetLanguage, score, timeTaken, currentLevel } = req.body;

    if (!targetLanguage || score === undefined || !timeTaken || !currentLevel) {
      return res.status(400).json({ message: "Missing required listening session fields." });
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
        listeningSessions: [],
        globalStats: {
          coins: 0,
          totalGamesPlayed: 0,
          wins: 0,
          losses: 0,
          highestLevelReached: 1,
          achievementsUnlocked: 0,
          dailyStreak: 0,
          languagesPlayed: []
        }
      });
    }

    // Add listening session
    crossword.listeningSessions.push({
      targetLanguage,
      score,
      timeTaken,
      currentLevel
    });

    // Calculate coins earned
    // Base coins for participation
    let coinsEarned = 10;
    
    // Additional coins based on score (0-3 scale)
    coinsEarned += score * 15;
    
    // Level bonus (5 coins per level)
    const levelBonus = currentLevel * 5;
    coinsEarned += levelBonus;

    // Update global stats
    crossword.globalStats.coins += coinsEarned;
    crossword.globalStats.totalGamesPlayed += 1;
    
    // Update wins/losses based on score (win if score >= 2)
    if (score >= 2) {
      crossword.globalStats.wins += 1;
    } else {
      crossword.globalStats.losses += 1;
    }

    // Update highest level if current level is higher
    if (currentLevel > crossword.globalStats.highestLevelReached) {
      crossword.globalStats.highestLevelReached = currentLevel;
    }

    // Update languages played if not already included
    if (!crossword.globalStats.languagesPlayed.includes(targetLanguage)) {
      crossword.globalStats.languagesPlayed.push(targetLanguage);
    }

    // Update achievements based on highest level
    crossword.globalStats.achievementsUnlocked = Math.floor(
      crossword.globalStats.highestLevelReached / 100
    );

    // Update UserProfile's total_coin
    await UserProfile.findOneAndUpdate(
      { userId },
      { $inc: { total_coin: coinsEarned } },
      { new: true }
    );

    await crossword.save();
    res.status(200).json({
      message: "Listening session added successfully",
      crossword,
      sessionSummary: {
        coinsEarned,
        levelBonus,
        totalCoins: crossword.globalStats.coins,
        currentLevel
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ------------------ GET LISTENING PROGRESS ------------------
exports.getListeningProgress = async (req, res) => {
  try {
    const { userId } = req.params;

    const crossword = await Crossword.findOne({ userId });
    if (!crossword) {
      return res.status(404).json({ message: 'User not found in Crossword' });
    }

    const listeningData = {
      listeningSessions: crossword.listeningSessions,
      stats: {
        totalSessions: crossword.listeningSessions.length,
        highestLevel: Math.max(...crossword.listeningSessions.map(s => s.currentLevel), 0),
        languagesPlayed: [...new Set(crossword.listeningSessions.map(s => s.targetLanguage))],
        averageScore: crossword.listeningSessions.length > 0 
          ? (crossword.listeningSessions.reduce((acc, curr) => acc + curr.score, 0) / crossword.listeningSessions.length).toFixed(2)
          : 0
      }
    };

    res.status(200).json(listeningData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ------------------ GET LISTENING LEADERBOARD ------------------
exports.getListeningLeaderboard = async (_req, res) => {
  try {
    const leaderboard = await Crossword.aggregate([
      { $unwind: "$listeningSessions" },
      {
        $sort: {
          "listeningSessions.currentLevel": -1,
          "listeningSessions.score": -1,
          "listeningSessions.timeTaken": 1
        }
      },
      {
        $group: {
          _id: "$userId",
          username: { $first: "$username" },
          bestSession: { $first: "$listeningSessions" }
        }
      },
      {
        $lookup: {
          from: "userprofile",
          localField: "_id",
          foreignField: "userId",
          as: "profile"
        }
      },
      {
        $unwind: {
          path: "$profile",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $sort: {
          "bestSession.currentLevel": -1,
          "bestSession.score": -1,
          "bestSession.timeTaken": 1
        }
      },
      {
        $project: {
          userId: "$_id",
          username: 1,
          targetLanguage: "$bestSession.targetLanguage",
          currentLevel: "$bestSession.currentLevel",
          score: "$bestSession.score",
          timeTaken: "$bestSession.timeTaken",
          profilePic: "$profile.profilePic"
        }
      },
      { $limit: 50 }
    ]);

    // Add rank after aggregation
    const rankedLeaderboard = leaderboard.map((entry, index) => ({
      ...entry,
      rank: index + 1
    }));

    res.status(200).json({ leaderboard: rankedLeaderboard });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ------------------ GET UNLOCKED LEVELS ------------------
exports.getUnlockedLevels = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const crossword = await Crossword.findOne({ userId });
    if (!crossword) {
      // If no crossword entry exists, return default unlocked level (1)
      return res.status(200).json({ 
        unlockedLevel: 1,
        totalLevelsCompleted: 0,
        stars: {} 
      });
    }

    // Calculate stars for each completed level
    const stars = {};
    crossword.sessions.forEach(session => {
      const levelKey = `level_${session.categoryLevel}`;
      if (!stars[levelKey] || session.score > stars[levelKey]) {
        stars[levelKey] = session.score;
      }
    });

    res.status(200).json({
      unlockedLevel: crossword.globalStats.highestLevelReached,
      totalLevelsCompleted: Object.keys(stars).length,
      stars: stars
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};