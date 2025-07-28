const mongoose = require('mongoose');
const OptionSchema = require('./Option');

const QuestionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  image: { type: String },
  marks: { type: Number, required: true },
  negativeMarks: { type: Number }, // for exams
  type: { type: String, required: true }, // MCQ, etc.
  options: [OptionSchema],
  correctAnswer: { type: String, required: true }
});

module.exports = QuestionSchema; 