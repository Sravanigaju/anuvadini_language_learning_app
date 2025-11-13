const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  parentCommentId: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: null },
  content: { type: String, required: true, minlength: 1, maxlength: 2000 },

  author: {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    username: String,
    displayName: String,
    profilePic: String,
  },

  votes: {
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    score: { type: Number, default: 0 }
  },
  userVotes: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    voteType: { type: String, enum: ["upvote", "downvote"] }
  }],

  replyCount: { type: Number, default: 0 },
  depth: { type: Number, default: 0 }, // 0=top, 1=reply, 2=reply-of-reply
  isDeleted: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { versionKey: false });

module.exports = mongoose.model("Comment", commentSchema, "comments");
