const mongoose = require('mongoose');

const gameStatSchema = new mongoose.Schema({
  timeTaken: { type: Number, default: 0 },
  score: { type: Number, default: 0 },
  category_level: { type: Number, default: 0 }
}, { _id: false });

const globalStatsSchema = new mongoose.Schema({
  total_coin: { type: Number, default: 0 },
  total_games_played: { type: Number, default: 0 },
  total_wins: { type: Number, default: 0 },
  total_losses: { type: Number, default: 0 },
  total_levels_completed: { type: Number, default: 0 },
  total_achievements: { type: Number, default: 0 }
}, { _id: false });

const gamerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  Game_Name: { type: String, required: true },
  categorycount: { type: Number, default: 0 },
  points: { type: Number, default: 0 },
  type: { type: String },               // e.g., "quiz"
  language: { type: String },           // e.g., "Hindi"
  gameStats: [gameStatSchema],          // per-game stats
  globalStats: globalStatsSchema        // single object, not array
}, { versionKey: false });

// Only index safe fields (avoid arrays in compound index)
gamerSchema.index({
  "gameStats.score": 1,
  "gameStats.category_level": 1
});

module.exports = mongoose.model('Gamer', gamerSchema, 'gamers');
