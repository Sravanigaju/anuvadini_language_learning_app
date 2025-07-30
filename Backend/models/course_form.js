const mongoose = require('mongoose');

const CourseContentSchema = new mongoose.Schema({
  status: { type: String, required: true },
  language: { type: String, required: true },
  level: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  duration: { type: Number, required: true },
  tags: { type: [String], default: [] },
  description: { type: String, required: true },
  file: { type: String, required: true } // HTML content as raw string
}, {
  timestamps: true
});

module.exports = mongoose.model('CourseContent', CourseContentSchema, 'CourseContents');
