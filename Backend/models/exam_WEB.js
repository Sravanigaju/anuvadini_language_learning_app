const mongoose = require('mongoose');

// Define Question Schema
const QuestionSchema = new mongoose.Schema({
  questionType: { type: String, required: true, enum: ['MCQ', 'FIB', 'TF','GOW'] },
  questionText: { type: String, required: true },
  media_id: { type: String, default: '' },
  options: { type: [String], required: true },
  options_media_id: { type: [String], default: [] },
  correctAnswer_index: { type: [String], required: true }
}, { _id: false });

// Define Quiz Schema
const QuizSchema = new mongoose.Schema({
  createdBy: { type: String, required: true },
  role: { type: String, required: true },
  quizName: { type: String, required: true },
  language: { type: String, required: true },
  numberOfQuestions: { type: Number, required: true }, 
  timeLimit: { type: Number, required: true },        
  level: { type: String, required: true },
  questions: [QuestionSchema]
});

module.exports = mongoose.model('Quiz', QuizSchema, 'Quizes');
