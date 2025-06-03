const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  levelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Level', index: true },
  order: Number,
  name: {
    default: String,
    translations: { type: Map, of: String }
  },
  icon: String
});

CategorySchema.index({ levelId: 1, order: 1 });

module.exports = mongoose.model('Category', CategorySchema);