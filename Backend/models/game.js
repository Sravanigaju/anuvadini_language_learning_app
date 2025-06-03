const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
  stageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Stage', index: true },
  type: String,
  questions: [
    {
      question: {
        default: String,
        translations: { type: Map, of: String }
      },
      options: {
        default: [String],
        translations: { type: Map, of: [String] }
      },
      answer: {
        default: String,
        translations: { type: Map, of: String }
      }
    }
  ]
});

module.exports = mongoose.model('Game', GameSchema);