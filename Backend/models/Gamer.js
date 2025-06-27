const mongoose = require('mongoose');

const gameStatSchema = new mongoose.Schema({
  gamerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Gamer', required: true },
  gameName: { type: String, required: true },  // 👈 game name field
  language: { type: String, required: true },
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
  categorycount: { type: Number, default: 1 },
  language: { type: String },
  gameStats: [gameStatSchema],
  globalStats: globalStatsSchema
}, { timestamps: true });

gamerSchema.index({
  "gameStats.gameName": 1,
  "gameStats.category_level": -1,
  "gameStats.timeTaken": 1
});

module.exports = mongoose.model('Gamer', gamerSchema, 'gamers');



// const startTime = Date.now();

// // after level is completed
// const endTime = Date.now();
// const timeTaken = (endTime - startTime) / 1000; // in seconds