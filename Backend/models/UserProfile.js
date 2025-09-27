const mongoose = require("mongoose");

const userProfileSchema = new mongoose.Schema({
  userId: { type: String, ref: "User", required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  gender: { type: String, required: true },
  age: { type: Number, required: true },
  country: { type: String, required: true },
  state: { type: String, required: false },
  profilePic: { type: String, default: "" },
  joinedDate: { type: Date, default: Date.now },
  sourceLanguage: { type: String, required: true },
  total_xp: { type: Number, default: 0 },
  total_coin: { type: Number, default: 0 },
  totalActiveGoals: { type: Number, default: 0 },
  interestedLanguages: [
    {
      languageName: { type: String, required: true },
      level: { type: String, required: true },
      motivation: { type: String, required: true },
      dailyGoal: { type: Number, default: 5 },
      xp: { type: Number, default: 0 },
      completedLessons: { type: Number, default: 0 },
      catagoriecount: { type: Number, default: 0 },
      assesmentcompleted: { type: Number, default: 0 },
      finalassesementcompleted: { type: Number, default: 0 },

      xp: { type: Number, default: 0 },
      xpWeekly: { type: Number, default: 0 },
      xpMonthly: { type: Number, default: 0 },
      xpYearly: { type: Number, default: 0 },

      xpHistory: [
        {
          date: { type: Date, required: true },
          xpGained: { type: Number, required: true }
        }
      ],

      progressPercent: { type: Number, default: 0 },
      lastActiveAt: { type: Date },
      streak: {
        currentStreak: { type: Number, default: 0 },
        longestStreak: { type: Number, default: 0 },
        lastCompletedDate: { type: Date },
      },
      badgesEarned: { type: [String], default: [] },
      certificate: { type: Boolean, default: true },
    }
  ],

  createdAt: { type: Date, default: Date.now },
}, { versionKey: false });

userProfileSchema.index({
  "interested_languages.languageName": 1,
  "interested_languages.xp": -1,
  "interested_languages.coins": -1
});


module.exports = mongoose.model("userprofile", userProfileSchema, "userprofile");
