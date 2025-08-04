const mongoose = require('mongoose');

// Define Question Schema for exams
const ExamQuestionSchema = new mongoose.Schema({
  questionType: { type: String, required: true, enum: ['MCQ', 'FIB', 'TF', 'GOW'] },
  questionText: { type: String, required: true }, 
  media_id: { type: String, default: '' }, 
  options: { type: [String], required: true }, 
  options_media_id: { type: [String], default: [] },
  correctAnswer_index: { type: [String], required: true },
  marks: { type: Number, required: true, default: 1 },
  negativeMarks: { type: Number, default: 0 }
}, { _id: false });

// Define Exam Schema
const ExamSchema = new mongoose.Schema({
  createdBy: { type: String, required: true },
  role: { type: String, required: true },
  examName: { type: String, required: true },
  language: { type: String, required: true },
  numberOfQuestions: { type: Number, required: true, default: 1 },
  totalMarks: { type: Number, default: 0 },
  timeLimit: { type: Number, default: 60 },
  passingMarks: { type: Number, default: 0 },
  questions: [ExamQuestionSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field on save
ExamSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Exam', ExamSchema, 'Exams');
