const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  language:      { type: String, required: true },
  categoryLevel: { type: Number, default: 1 },
  timeTaken:     { type: Number, required: true },
  score:         { type: Number, enum: [1, 2, 3], required: true },
  timestamp:     { type: Date, default: Date.now }
}, { _id: false });

const globalStatsSchema = new mongoose.Schema({
  coins:               { type: Number, default: 0 },
  totalGamesPlayed:    { type: Number, default: 0 },
  wins:                { type: Number, default: 0 },
  losses:              { type: Number, default: 0 },
  highestLevelReached: { type: Number, default: 1 },
  achievementsUnlocked:{ type: Number, default: 0 }
}, { _id: false });

const crosswordSchema = new mongoose.Schema({
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  username:    { type: String, required: true },
  sessions:    [sessionSchema],
  globalStats: globalStatsSchema
}, { timestamps: true });

module.exports = mongoose.model('Crossword', crosswordSchema);
