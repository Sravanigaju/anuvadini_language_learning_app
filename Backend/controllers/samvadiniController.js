const User = require("../models/User");
const UserProfile = require("../models/UserProfile");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

// Samvadini user access & setup
exports.samvadiniAccessAndSetup = async (req, res) => {
  try {
    const {
      samvadiniId,
      firstName,
      lastName,
      gender,
      age,
      country,
      state,
      sourceLanguage,
      interestedLanguages
    } = req.body;

    if (!samvadiniId) {
      return res.status(400).json({ message: "samvadiniId is required" });
    }

    // 1️⃣ Check if User exists
    let user = await User.findOne({ samvadiniId });
    let created = false;

    if (!user) {
      const randomPassword = crypto.randomBytes(12).toString("hex");
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      user = new User({
        username: firstName || `samv_${samvadiniId}`,
        email: `${samvadiniId}@samvadini.com`,
        password: hashedPassword,
        samvadiniId,
        userType: "Samvadini",
        isVerified: true
      });
      await user.save();
      created = true; // new user created
    }

    // 2️⃣ Check if UserProfile exists
    let profile = await UserProfile.findOne({ userId: user._id });
    if (!profile) {
      profile = new UserProfile({
        userId: user._id,
        firstName,
        lastName,
        gender,
        age,
        country,
        state,
        sourceLanguage: sourceLanguage || "English",
        interestedLanguages: []
      });
    }

    // 3️⃣ Update interestedLanguages if provided
    if (Array.isArray(interestedLanguages) && interestedLanguages.length > 0) {
      interestedLanguages.forEach((lang) => {
        const newLangData = {
          languageName: lang.languageName,
          level: lang.level,
          motivation: lang.motivation,
          dailyGoal: lang.dailyGoal,
          xp: 0,
          completedLessons: 0,
          catagoriecount: 0,
          assesmentcompleted: 0,
          finalassesementcompleted: 0,
          xpWeekly: 0,
          xpMonthly: 0,
          xpYearly: 0,
          progressPercent: 0,
          streak: { currentStreak: 0, longestStreak: 0 },
          badgesEarned: [],
          certificate: true,
          xpHistory: []
        };

        const existingIndex = profile.interestedLanguages.findIndex(
          (l) => l.languageName === lang.languageName
        );
        if (existingIndex >= 0) {
          profile.interestedLanguages[existingIndex] = newLangData;
        } else {
          profile.interestedLanguages.push(newLangData);
        }
      });
    }

    await profile.save();

    res.status(200).json({
      success: true,
      created, // true if new user created, false if already existed
      message: created
        ? "Samvadini user created successfully"
        : "Samvadini user already exists, profile fetched",
      user,
      profile
    });

  } catch (error) {
    console.error("Samvadini Access & Setup Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
