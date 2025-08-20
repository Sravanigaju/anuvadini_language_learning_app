const mongoose = require('mongoose');


const QuestionSchema = new mongoose.Schema({
  questionType: { type: String, required: true, enum: ['MCQ', 'Fill in the Blanks', 'True/False','GOW', 'One Word'] },
  questionText: { type: String, required: true },
  questionImage: { type: String, default: '' },
  marks: { type: Number, required: true },
  options: { type: [String],  },
  options_media_id: { type: [String], default: [] },
  correctAnswer_index: { type: [Number],  }
}, { _id: false });

const QuizSchema = new mongoose.Schema({
  Status: { type: String, required: true, enum: ['Draft','Submitted'] },
  Validation: { type: String, required: true, enum: ['Approved', 'Rejected', 'Pending'], default: 'Pending' },
  Reject_reason: { type: String, default: '' },
  Validator_id: { type: String, default: '' }, // ID of the user who validated the quiz
  createdBy: { type: String, required: true }, //objectId of the user
  role: { type: String, required: true },          // content creator/institutioin  
  quizName: { type: String, required: true },
  language: { type: String, required: true },
  numberOfQuestions: { type: Number, required: true }, 
  timeLimit: { type: Number, required: true },        
  level: { type: String, required: true },
  totalMarks: { type: Number, required: true },
  questions: [QuestionSchema]
});

module.exports = mongoose.model('Quiz', QuizSchema, 'Quizes');
