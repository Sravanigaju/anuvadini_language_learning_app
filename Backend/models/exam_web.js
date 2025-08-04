const mongoose = require('mongoose');

// Define Question Schema for exams
const ExamQuestionSchema = new mongoose.Schema({
  questionType: { type: String, required: true, enum: ['MCQ', 'FIB', 'TF', 'GOW'] },
  questionText: { type: String, required: true }, // "Enter your question here..." field
  media_id: { type: String, default: '' }, // For "Add Image" button next to question
  options: { type: [String], required: true }, // "Option 1", "Option 2", etc. from "+ Add More Options"
  options_media_id: { type: [String], default: [] }, // For option images (camera icon next to options)
  correctAnswer_index: { type: [String], required: true }, // Not visible in UI, but needed for processing
  marks: { type: Number, required: true, default: 1 }, // "Marks" input field
  negativeMarks: { type: Number, default: 0 } // "Negative Marks" input field
}, { _id: false });

// Define Exam Schema
const ExamSchema = new mongoose.Schema({
  createdBy: { type: String, required: true }, // User who created this exam (not shown in UI)
  role: { type: String, required: true }, // Creator's role (not shown in UI)
  examName: { type: String, required: true }, // "Name of Exam" input field
  language: { type: String, required: true }, // "Language" input field
  numberOfQuestions: { type: Number, required: true, default: 1 }, // The numeric field showing "1" in UI
  totalMarks: { type: Number, default: 0 }, // "Total Marks: 0" shown at bottom of UI
  timeLimit: { type: Number, default: 60 }, // Not in UI but useful for exam timing
  passingMarks: { type: Number, default: 0 }, // Not in UI but useful for results
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
