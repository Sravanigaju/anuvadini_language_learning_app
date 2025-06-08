// server/models/Feedback.js
const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
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
