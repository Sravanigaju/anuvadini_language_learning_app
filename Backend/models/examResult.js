const mongoose = require('mongoose');

// Define Answer Schema to store user's answers for each question
const UserAnswerSchema = new mongoose.Schema({
  questionId: { type: String, required: true },    
  selectedAnswer: { type: [String], default: [] }, 
  isCorrect: { type: Boolean, required: true },    
  marksObtained: { type: Number, required: true }  
}, { _id: false }); 

// Define Exam Result Schema to store complete exam submission data
const ExamResultSchema = new mongoose.Schema({
  userId: { type: String, required: true },           
  examId: { type: String, required: true },           
  examName: { type: String, required: true },         
  totalMarks: { type: Number, required: true },       
  marksObtained: { type: Number, required: true },   
  passingMarks: { type: Number, required: true },     
  isPassed: { type: Boolean, required: true, default: false }, 
  percentageScore: { type: Number, required: true },  
  timeSpent: { type: Number, required: true },        
  answers: [UserAnswerSchema],                      
  startTime: { type: Date, required: true },        
  endTime: { type: Date, required: true },          
  submittedAt: { type: Date, default: Date.now }
});

// Export the model with collection name 'ExamResults'
module.exports = mongoose.model('ExamResult', ExamResultSchema, 'ExamResults');