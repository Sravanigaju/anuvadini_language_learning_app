const mongoose = require('mongoose');

// Define Question Schema for exams
const ExamQuestionSchema = new mongoose.Schema({
  questionType: { type: String, required: true, enum: ['MCQ', 'FIB', 'TF', 'GOW'] }, // 
  questionText: { type: String, required: true },    
  media_id: { type: String, default: '' },           
  options: { type: [String], required: true },       
  options_media_id: { type: [String], default: [] }, 
  correctAnswer_index: { type: [String], required: true }, 
  marks: { type: Number, required: true, default: 1 }, 
  negativeMarks: { type: Number, default: 0 }       
}, { _id: false }); 

// Define Exam Schema - main structure for storing exam templates
const ExamSchema = new mongoose.Schema({
  Status: { type: String, required: true, enum: ['Draft','Pending', 'Approved', 'Rejected'] },
  createdBy: { type: String, required: true }, //objectId of the user    
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

// Mongoose middleware: Update the updatedAt field automatically before saving
ExamSchema.pre('save', function(next) {
  this.updatedAt = Date.now(); // Update the timestamp
  next(); 
});


module.exports = mongoose.model('Exam', ExamSchema, 'Exams');
