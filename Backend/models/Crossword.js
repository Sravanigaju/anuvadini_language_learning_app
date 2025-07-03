const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  language:      { type: String, required: true },
  categoryLevel: { type: Number, default: 1 },
  timeTaken:     { type: String, required: true },
  score:         { type: Number, enum: [1, 2, 3], required: true },
  timestamp:     { type: Date, default: Date.now }
}, { _id: false });

const dailyQuizSessionSchema = new mongoose.Schema({
  timeTaken:      { type: String, required: true },
  correctAnswers: { type: Number, required: true },
  targetLanguage: { type: String, required: true },
  timestamp:      { type: Date, default: Date.now }
}, { _id: false });

const listeningSessionSchema = new mongoose.Schema({
  targetLanguage: { type: String, required: true },
  score:         { type: Number, min: 0, max: 3, required: true },
  timeTaken:     { type: String, required: true },
  currentLevel:  { type: Number, required: true },
  timestamp:     { type: Date, default: Date.now }
}, { _id: false });

const globalStatsSchema = new mongoose.Schema({
  coins:               { type: Number, default: 0 },
  totalGamesPlayed:    { type: Number, default: 0 },
  wins:                { type: Number, default: 0 },
  losses:              { type: Number, default: 0 },
  highestLevelReached: { type: Number, default: 1 },
  achievementsUnlocked:{ type: Number, default: 0 },
  dailyStreak:         { type: Number, default: 0 },
  languagesPlayed:     [String],
  lastPlayedDate:      { type: Date, default: Date.now }
}, { _id: false });

const crosswordSchema = new mongoose.Schema({
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  username:    { type: String, required: true },
  sessions:    [sessionSchema],
  dailyQuizSessions: [dailyQuizSessionSchema],
  listeningSessions: [listeningSessionSchema],
  globalStats: globalStatsSchema
}, { timestamps: true });

module.exports = mongoose.model('Crossword', crosswordSchema);