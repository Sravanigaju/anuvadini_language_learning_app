// const mongoose = require("mongoose");

// const userProfileSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   firstName: {
//     type: String,
//     required: true,
//   },
//   lastName: {
//     type: String,
//     required: true,
//   },
//   age: {
//     type: Number,
//     required: true,
//   },
//   gender: {
//     type: String,
//     required: true,
//   },
//   sourceLanguage: {
//     type: String,
//     required: true,
//   },
//   interestedLanguages: [String],
//   proficiency: [
//     {
//       languageId: { type: String, required: true },
//       level: { type: String, required: true },
//     },
//   ],
//   motivation: {
//     type: String,
//     required: true,
//   },
//   dailyGoal: {
//     type: Number,
//     required: true,
//   },
//   country: {
//     type: String,
//     required: true,
//   },
//   state: {
//     type: String,
//     required: true,
//   },

//   // ✅ New Field: profilePic
//   profilePic: {
//     type: String, // Store relative path or full URL
//     default: "",  // Or you can set a default avatar image path
//   },

//   points: {
//     total: {
//       type: Number,
//       default: 0,
//     },
//     breakdown: {
//       type: Map,
//       of: Number,
//       default: {},
//     },
//   },
//   dashboardStats: {
//     completedLessons: { type: Number, default: 0 },
//     totalTimeSpent: { type: Number, default: 0 }, // minutes
//     lastActiveAt: { type: Date },
//     badgesEarned: { type: [String], default: [] },
//     streak: {
//       currentStreak: { type: Number, default: 0 },
//       longestStreak: { type: Number, default: 0 },
//       lastCompletedDate: { type: Date },
//     },
//     coins: {
//       total: { type: Number, default: 0 },
//       earnedBreakdown: {
//         type: Map,
//         of: Number,
//         default: {},
//       },
//       redeemed: { type: Number, default: 0 },
//     },
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// }, { versionKey: false });

// module.exports = mongoose.model("userprofile", userProfileSchema, "userprofile");



const mongoose = require("mongoose");

const userProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  sourceLanguage: {
    type: String,
    required: true,
  },
  interestedLanguages: [String],
  proficiency: [
    {
      languageId: { type: String, required: true },
      level: { type: String, required: true },
    },
  ],
  motivation: {
    type: String,
    required: true,
  },
  dailyGoal: {
    type: Number,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  profilePic: {
    type: String,
    default: "",
  },
  joinedDate: {
    type: Date,
    default: Date.now,
  },
  languageProgress: [
    {
      language: { type: String },
      progress: { type: Number, default: 0 },
    },
  ],
  leaderboard: {
    english: {
      rank: { type: Number, default: 0 },
      xp: { type: Number, default: 0 },
    },
    gaming: {
      rank: { type: Number, default: 0 },
      xp: { type: Number, default: 0 },
    },
  },
  points: {
    total: {
      type: Number,
      default: 0,
    },
    breakdown: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  dashboardStats: {
    completedLessons: { type: Number, default: 0 },
    totalTimeSpent: { type: Number, default: 0 },
    lastActiveAt: { type: Date },
    badgesEarned: { type: [String], default: [] },
    streak: {
      currentStreak: { type: Number, default: 0 },
      longestStreak: { type: Number, default: 0 },
      lastCompletedDate: { type: Date },
    },
    coins: {
      total: { type: Number, default: 0 },
      earnedBreakdown: {
        type: Map,
        of: Number,
        default: {},
      },
      redeemed: { type: Number, default: 0 },
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { versionKey: false });

module.exports = mongoose.model("userprofile", userProfileSchema, "userprofile");
