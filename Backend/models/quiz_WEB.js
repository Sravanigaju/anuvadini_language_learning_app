const mongoose = require('mongoose');


const QuestionSchema = new mongoose.Schema({
  questionType: { type: String, required: true, enum: ['MCQ', 'FIB', 'TF','GOW'] },
  questionText: { type: String, required: true },
  questionImage: { type: String, default: '' },
  marks: { type: Number, required: true },
  media_id: { type: String, default: '' },
  options: { type: [String],  },
  options_media_id: { type: [String], default: [] },
  correctAnswer_index: { type: [String],  }
}, { _id: false });

const QuizSchema = new mongoose.Schema({
  Status: { type: String, required: true, enum: ['Draft', 'Approved', 'Rejected'] },
  createdBy: { type: String, required: true }, //objectId of the user
  role: { type: String, required: true },
  quizName: { type: String, required: true },
  language: { type: String, required: true },
  numberOfQuestions: { type: Number, required: true }, 
  timeLimit: { type: Number, required: true },        
  level: { type: String, required: true },
  totalMarks: { type: Number, required: true },
  questions: [QuestionSchema]
});

module.exports = mongoose.model('Quiz', QuizSchema, 'Quizes');
