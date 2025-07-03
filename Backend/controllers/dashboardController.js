
const mongoose = require("mongoose");
const UserProfile = require("../models/UserProfile");

exports.getUserDashboard = async (req, res) => {
  try {
    const { userId } = req.params;
    const { language } = req.query;

    const userProfile = await UserProfile.findOne({ userId });
    if (!userProfile) return res.status(404).json({ error: "User not found" });
    console.log("Available languages:", userProfile.interestedLanguages.map(l => l.languageName));
    console.log("Looking for language:", language);

    const selectedLang = userProfile.interestedLanguages.find(
      (lang) => lang.languageName.toLowerCase() === language.toLowerCase()
    );
    if (!selectedLang) return res.status(400).json({ error: "Language not found" });

    const langStats = {
      dayStreak: selectedLang.streak.currentStreak,
      totalXP: selectedLang.xp,
      totalCoins: selectedLang.coins,
      lessonsCompleted: selectedLang.completedLessons,
      categoriesCompleted: selectedLang.catagoriecount,
      assessmentsCompleted: selectedLang.assesmentcompleted,
      finalAssessmentCompleted: selectedLang.finalassesementcompleted,
      level: selectedLang.level,
      lastActiveAt: selectedLang.lastActiveAt,
      dailyGoal: selectedLang.dailyGoal,
      progressPercent: selectedLang.progressPercent,
      motivation: selectedLang.motivation,
      certificate: selectedLang.certificate
    };

    const languageProgress = userProfile.interestedLanguages.map((lang) => ({
      languageName: lang.languageName,
      progressPercent: lang.progressPercent,
    }));
     // 👇 Create array of all languages with certificate === true
    const certificate = userProfile.interestedLanguages
      .filter(lang => lang.certificate === true)
      .map(lang => lang.languageName);

    // Use $facet to get top 10 + count users with higher XP
    const [leaderboardData] = await UserProfile.aggregate([
      { $unwind: "$interestedLanguages" },
      { $match: { "interestedLanguages.languageName": language } },
      {
        $facet: {
          topLearners: [
            {
              $project: {
                userId: "$userId",
                name: { $concat: ["$firstName", " ", "$lastName"] },
                xp: "$interestedLanguages.xp",
              },
            },
            { $sort: { xp: -1 } },
            { $limit: 10 },
          ],
          topGamers: [
            {
              $project: {
                userId: "$userId",
                name: { $concat: ["$firstName", " ", "$lastName"] },
                coins: "$interestedLanguages.coins",
              },
            },
            { $sort: { coins: -1 } },
            { $limit: 10 },
          ],
          learnerRankCount: [
            {
              $match: {
                "interestedLanguages.xp": { $gt: selectedLang.xp },
              },
            },
            { $count: "rank" },
          ],
          gamerRankCount: [
            {
              $match: {
                "total.coins": { $gt: selectedLang.coins },
              },
            },
            { $count: "rank" },
          ],
        },
      },
    ]);

    const learnerRank =
      (leaderboardData.learnerRankCount[0]?.rank || 0) + 1;
    const gamerRank =
      (leaderboardData.gamerRankCount[0]?.rank || 0) + 1;

    const dashboard = {
      user: {
        name: `${userProfile.firstName} ${userProfile.lastName}`,
        username: `@${(userProfile.firstName + userProfile.lastName).toLowerCase()}`,
        joinDate: userProfile.joinedDate,
      },
      languageStats: langStats,
      languageProgress,
      topLearners: leaderboardData.topLearners,
      topGamers: leaderboardData.topGamers,
      userRank: {
        learnerRank,
        gamerRank,
      },
    };

   return res.json({ dashboard, certificate });
  } catch (error) {
    console.error("Dashboard Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getUserProgress = async (req, res) => {
  const { userId, language } = req.query;

  if (!userId || !language) {
    return res.status(400).json({ error: 'userId and language are required' });
  }

  try {
    const user = await UserProfile.findOne(
      { userId },
      {
        interestedLanguages: {
          $elemMatch: { languageName: language }
        }
      }
    );

    if (!user || !user.interestedLanguages || user.interestedLanguages.length === 0) {
      return res.status(404).json({ error: 'Progress not found' });
    }

    const langProgress = user.interestedLanguages[0];

    return res.status(200).json({
      progress: {
        level: langProgress.level,
        cat_count: langProgress.catagoriecount,
        less_count: langProgress.completedLessons,
        less_ass_count: langProgress.assesmentcompleted,
        fin_ass_count: langProgress.finalassesementcompleted,
        score: langProgress.xp,
        streak: langProgress.streak?.currentStreak || 0,
        progress_lang: langProgress.progressPercent,
        certificate: langProgress.certificate || false
        
      }
    });

  } catch (error) {
    console.error('Error fetching user progress:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

