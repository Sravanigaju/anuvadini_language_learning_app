const mongoose = require('mongoose');

const LanguageSchema = new mongoose.Schema({
  name: String,
  code: { type: String, unique: true },
  script: String,
  isOfficial: Boolean
});

module.exports = mongoose.model('Language', LanguageSchema);