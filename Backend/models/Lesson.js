const mongoose = require('mongoose');
const ChapterSchema = require('../Chapter');

const LessonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  order: { type: Number, required: true },
  chapters: [ChapterSchema]
});

module.exports = LessonSchema; 


