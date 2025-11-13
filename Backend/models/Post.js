const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: { type: String, required: true, minlength: 5, maxlength: 200 },
  content: { type: String, required: true, minlength: 10, maxlength: 5000 },

  author: {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    username: String,
    displayName: String,
    profilePic: String,
  },

  language: { type: String, required: true },
  category: { type: String, enum: ["question", "discussion", "announcement", "help"], default: "discussion" },
  tags: [String],

  // Voting
  votes: {
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    score: { type: Number, default: 0 },
  },
  userVotes: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    voteType: { type: String, enum: ["upvote", "downvote"] }
  }],

  // Counts
  commentCount: { type: Number, default: 0 },
  viewCount: { type: Number, default: 0 },

  // Learning-specific fields
  learningCategory: { type: String, enum: ["Grammar", "Pronunciation", "Vocabulary", "Culture", "Assessment Help"] },
  difficultyLevel: { type: String, enum: ["Beginner", "Intermediate", "Advanced"] },
  relatedLesson: { type: String },
  isNativeSpeakerPost: { type: Boolean, default: false },
  educationalRating: { type: Number, default: 0 },

  isPinned: { type: Boolean, default: false },
  isLocked: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { versionKey: false });

module.exports = mongoose.model("Post", postSchema, "posts");
