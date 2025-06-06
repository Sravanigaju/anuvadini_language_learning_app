const mongoose = require('mongoose');

const LevelSchema = new mongoose.Schema({
  languageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Language', index: true },
  order: Number,
  name: {
    default: String,
    translations: { type: Map, of: String }
  }
});

// Index for performance
LevelSchema.index({ languageId: 1, order: 1 });

module.exports = mongoose.model('Level', LevelSchema);