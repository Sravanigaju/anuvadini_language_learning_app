
const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
    userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  course: String,
  experience: String,
  navigationEase: String,
  engagement: String,
  translationAccuracy: String,
  audioSatisfaction: String,
  technicalIssues: String,
  technicalIssuesDescription: String,
  recommendLikelihood: String,
  featuresToImprove: String,
  additionalComments: String,
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Feedback", feedbackSchema);
