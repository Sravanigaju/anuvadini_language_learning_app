const UserProfile = require("../models/UserProfile");

// POST /api/language-preference
exports.addLanguagePreference = async (req, res) => {
  const { userId, targetLanguage, experience, reason, goal } = req.body;

  if (!userId || !targetLanguage) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  try {
    const userProfile = await UserProfile.findOne({ userId });

    if (!userProfile) {
      return res.status(404).json({ success: false, message: "User profile not found" });
    }

    const existingLang = userProfile.targetLanguages.find(lang => lang.language === targetLanguage);

    if (existingLang) {
      return res.status(400).json({ success: false, message: "Language already added" });
    }

    userProfile.targetLanguages.push({
      language: targetLanguage,
      experience,
      reason,
      goal
    });

    await userProfile.save();

    res.status(200).json({ success: true, message: "Language added successfully", profile: userProfile });
  } catch (error) {
    console.error("Add language error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
