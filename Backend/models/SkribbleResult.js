const mongoose = require('mongoose');

const skribbleResultSchema = new mongoose.Schema({
  roomId: String,
  word: String,
  drawerId: String,
  drawerUsername: String,
  guesserId: String,
  guesserUsername: String,
  correct: Boolean,
  pointsAwarded: Number,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SkribbleResult', skribbleResultSchema);
