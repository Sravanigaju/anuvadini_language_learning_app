const mongoose = require('mongoose');

const SlideSchema = new mongoose.Schema({
  chapterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter', index: true },
  order: Number,
  type: String,
  content: {
    default: String,
    translations: { type: Map, of: String }
  }
});

SlideSchema.index({ chapterId: 1, order: 1 });

module.exports = mongoose.model('Slide', SlideSchema);