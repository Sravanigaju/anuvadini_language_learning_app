const mongoose = require('mongoose');

const gamerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required, unique: true },

  Game_Name: { type: String, required: true } ,
  gameStats: [
    {
    languageName: { type: String, required: true }, 
    timeTaken: { type: Number, required: true},
    score: { type: Number, default: 0 },   // stars
    categorycount:{ type: Number, default: 0 }, // number of levels completed
   }
    ],
  GlobalStats: [ 
    {
    total_coin: { type: Number, default: 0 },
    total_games_played: { type: Number, default: 0 },
    total_wins: { type: Number, default: 0 },
    total_losses: { type: Number, default: 0 },
 
    total_levels_completed: { type: Number, default: 0 },
    total_achievements: { type: Number, default: 0 },
    },
  ],
}, 
{ versionKey: false });

gamerSchema.index({
  "gameStats.timeTaken": 1, 
  "gameStats.score": 1,
  "gameStats.category_level": 1,
  "GlobalStats.total_coin": 1,
  "GlobalStats.total_games_played": 1,
  "GlobalStats.total_wins": 1,
  "GlobalStats.total_losses": 1,
  "GlobalStats.total_levels_completed": 1,
  "GlobalStats.total_achievements": 1
});

module.exports = mongoose.model('Gamer', gamerSchema, 'gamers');



// const startTime = Date.now();

// // after level is completed
// const endTime = Date.now();
// const timeTaken = (endTime - startTime) / 1000; // in seconds