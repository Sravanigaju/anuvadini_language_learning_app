const mongoose = require("mongoose");

const StagingSuggestionSchema = new mongoose.Schema({
  targetCollection: { type: [String], required: true }, // "slides", "Levels"
  targetId: { type: mongoose.Schema.Types.ObjectId, required: true }, // _id of the doc to update
  fieldPath: { type: String, required: true }, // e.g., "categories.1.lessons.3.lessonTitle.en"
  oldValue: { type: mongoose.Schema.Types.Mixed },
  newValue: { type: mongoose.Schema.Types.Mixed },
  suggestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // User who suggested the change
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("StagingSuggestion",StagingSuggestionSchema,"StagingChanges");

