const mongoose = require('mongoose');
const QuestionSchema = require('./Question');

const QuizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  language: { type: String, required: true },
  timeLimit: { type: Number, required: true },
  questions: [QuestionSchema]
}, { versionKey: false });

module.exports = mongoose.model('Quiz', QuizSchema); 