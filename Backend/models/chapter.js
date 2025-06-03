const mongoose = require('mongoose');

const ChapterSchema = new mongoose.Schema({
  stageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Stage', index: true },
  order: Number,
  name: {
    default: String,
    translations: { type: Map, of: String }
  }
});

ChapterSchema.index({ stageId: 1, order: 1 });

module.exports = mongoose.model('Chapter', ChapterSchema);