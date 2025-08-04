
const mongoose = require('mongoose');

// Chapter schema (embedded)
const ChapterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  content: { type: String, required: true }
}, { _id: false });

// Lesson schema (embedded)
const LessonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  order: { type: Number, required: true },
  chapters: [ChapterSchema]
}, { _id: false });

// Course schema (main)
const CourseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  order: { type: Number, required: true },
  lessons: [LessonSchema],
  files: [
    {
      filename: { type: String, required: true },
      url: { type: String, required: true }
    }
  ] // array of file objects
}, { versionKey: false });

module.exports = mongoose.model('Course', CourseSchema);
