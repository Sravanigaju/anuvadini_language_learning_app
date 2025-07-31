const mongoose = require('mongoose');
const QuestionSchema = require('./Question');

const ExamSchema = new mongoose.Schema({
  title: { type: String, required: true },
  language: { type: String, required: true },
  timeLimit: { type: Number, required: true },
  questions: [QuestionSchema]
});

module.exports = mongoose.model('Exam', ExamSchema); 