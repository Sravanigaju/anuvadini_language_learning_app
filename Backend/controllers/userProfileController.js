const UserProfile = require("../models/UserProfile");
const User = require("../models/User");
const mongoose = require("mongoose");

// Get all user profiles
exports.getAllUserProfiles = async (req, res) => {
  try {
    const profiles = await UserProfile.find().populate("userId");
    res.status(200).json(profiles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user profile by ID
exports.getUserProfileById = async (req, res) => {
  try {
    const profile = await UserProfile.findById(req.params.id).populate("userId");
    if (!profile)
      return res.status(404).json({ message: "User profile not found" });
    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

// ✅ Create or update a user profile by userId (Minimal Response)
exports.createUserProfile = async (req, res) => {
  try {
    const { userId, ...rest } = req.body;

    await UserProfile.findOneAndUpdate(
      { userId },
      { $set: rest },
      { new: true, upsert: true }
    );

    res.status(200).json({
      message: "User profile created or updated successfully",
      success: true
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message, success: false });
  }
};

// Update user profile by MongoDB ID
exports.updateUserProfile = async (req, res) => {
  try {
    const updatedProfile = await UserProfile.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedProfile)
      return res.status(404).json({ message: "User profile not found" });
    res.status(200).json(updatedProfile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update user points
exports.updateUserPoints = async (req, res) => {
  const { id } = req.params;
  const { total, breakdown } = req.body;

  try {
    const updateFields = {};
    if (typeof total === "number") updateFields["points.total"] = total;
    if (typeof breakdown === "object") updateFields["points.breakdown"] = breakdown;

    const updatedProfile = await UserProfile.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }

    res.status(200).json(updatedProfile);
  } catch (error) {
    console.error("Error updating points:", error);
    res.status(500).json({ message: error.message });
  }
};







// ✅ Get basic user info by userId
exports.getBasicUserInfo = async (req, res) => {
  try {
    const userId = req.params.userId;

    const [user, profile] = await Promise.all([
      User.findById(userId).select("username phoneNumber"),
      UserProfile.findOne({ userId }).select("firstName lastName profilePic")
    ]);

    if (!user || !profile) {
      return res.status(404).json({ message: "User or profile not found", success: false });
    }

    res.status(200).json({
      success: true,
      data: {
        username: user.username,
        mobileNumber: user.phoneNumber,
        firstName: profile.firstName,
        lastName: profile.lastName,
        profilePic: profile.profilePic
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get full user profile using userId (not MongoDB _id)
exports.getUserProfileByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;

    const profile = await UserProfile.findOne({ userId }).populate("userId");

    if (!profile) {
      return res.status(404).json({ message: "Profile not found", success: false });
    }

    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

exports.updateUserGender = async (req, res) => {
  const { id } = req.params;
  const { gender } = req.body;
  try {
    const updatedProfile = await UserProfile.findByIdAndUpdate(id, { gender }, { new: true });
    if (!updatedProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }
    res.json(updatedProfile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateUserProfileFields = async (req, res) => {
  const { userId } = req.params;
  console.log(userId);
  const updateFields = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const updatedProfile = await UserProfile.findOneAndUpdate(
      { userId: userId },
      updateFields,
      { new: true }
    );
    if (!updatedProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }
    res.json(updatedProfile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.addNewLanguage = async (req, res) => {
  const { userId } = req.params;
  const newLang = req.body;

  try {
    // Check if the language already exists in user's profile
    const user = await UserProfile.findOne({ userId });
    if (!user) return res.status(404).json({ message: "User not found" });

    const alreadyExists = user.interestedLanguages.some(
      (lang) => lang.languageName === newLang.languageName
    );

    if (alreadyExists) {
      return res.status(400).json({ message: "Language already added." });
    }

    // Add default structure to the new language
    const languageToPush = {
      ...newLang,
      xp: 0,
      completedLessons: 0,
      catagoriecount: 0,
      assesmentcompleted: 0,
      finalassesementcompleted: 0,
      progressPercent: 0,
      lastActiveAt: null,
      streak: {
        currentStreak: 0,
        longestStreak: 0,
        lastCompletedDate: null
      },
      badgesEarned: []
    };

    // Push the new language into the array
    await UserProfile.updateOne(
      { userId },
      { $push: { interestedLanguages: languageToPush } }
    );

    return res.status(200).json({success: "True", message: "New language added successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.updateUserProgress = async (req, res) => {
  const { userId } = req.params;
  const {
    languageName,
    progressPercent,
    lessonsCompleted,
    assesmentcompleted,
    level,
    xp, // today's XP earned, from frontend
    catagoriecount,
    finalAssessmentCompleted,
    newBadges,
  } = req.body;

  try {
    const userProfile = await UserProfile.findOne({ userId });
    if (!userProfile) {
      return res.status(404).json({ error: "User profile not found" });
    }

    const language = userProfile.interestedLanguages.find(
      (lang) => lang.languageName.toLowerCase() === languageName.toLowerCase()
    );

    if (!language) {
      return res.status(404).json({ error: "Language not found in user profile" });
    }

    // 🔄 Update progress fields
    if (progressPercent !== undefined) language.progressPercent = progressPercent;
    if (lessonsCompleted !== undefined) language.completedLessons = lessonsCompleted;
    if (assesmentcompleted !== undefined) language.assesmentcompleted = assesmentcompleted;
    if (level !== undefined) language.level = level;
    if (catagoriecount !== undefined) language.catagoriecount = catagoriecount;
    if (finalAssessmentCompleted !== undefined) language.finalassesementcompleted = finalAssessmentCompleted;
    language.lastActiveAt = new Date();

    // ✅ Safely handle badge updates
    if (!Array.isArray(language.badgesEarned)) {
      language.badgesEarned = [];
    }
    if (Array.isArray(newBadges)) {
      const earnedSet = new Set(language.badgesEarned);
      newBadges.forEach((badge) => earnedSet.add(badge));
      language.badgesEarned = [...earnedSet];
    }

    // ✅ XP Update logic
    if (xp !== undefined && xp > 0) {
      const today = new Date();

      // Ensure xpHistory exists
      if (!Array.isArray(language.xpHistory)) language.xpHistory = [];

      // 1. Add today's XP entry
      language.xpHistory.push({ date: today, xpGained: xp });

      // 2. Recalculate total XP
      language.xp = language.xpHistory.reduce((sum, e) => sum + e.xpGained, 0);

      // 3. Recalculate time-based XP
      const weekStart = moment().startOf("isoWeek");
      const monthStart = moment().startOf("month");
      const yearStart = moment().startOf("year");

      language.xpWeekly = language.xpHistory
        .filter((e) => moment(e.date).isSameOrAfter(weekStart))
        .reduce((sum, e) => sum + e.xpGained, 0);

      language.xpMonthly = language.xpHistory
        .filter((e) => moment(e.date).isSameOrAfter(monthStart))
        .reduce((sum, e) => sum + e.xpGained, 0);

      language.xpYearly = language.xpHistory
        .filter((e) => moment(e.date).isSameOrAfter(yearStart))
        .reduce((sum, e) => sum + e.xpGained, 0);

      // 4. Update total_xp across all languages
      userProfile.total_xp = userProfile.interestedLanguages.reduce(
        (sum, lang) => sum + (lang.xp || 0),
        0
      );
    }

    await userProfile.save();

    return res.status(200).json({
      message: "Language progress, XP, and badges updated successfully",
      updatedBadges: language.badgesEarned,
      total_xp: userProfile.total_xp,
    });

  } catch (error) {
    console.error("❌ Error updating progress:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};