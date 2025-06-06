const mongoose = require('mongoose');

const StageSchema = new mongoose.Schema({
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', index: true },
  order: Number,
  name: {
    default: String,
    translations: { type: Map, of: String }
  },
  gameId: { type: mongoose.Schema.Types.ObjectId, ref: 'Game' },
  assessmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assessment' }
});

StageSchema.index({ categoryId: 1, order: 1 });

module.exports = mongoose.model('Stage', StageSchema);
