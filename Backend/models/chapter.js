const mongoose = require('mongoose');

const ChapterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  content: { type: String, required: true }
});

module.exports = ChapterSchema;