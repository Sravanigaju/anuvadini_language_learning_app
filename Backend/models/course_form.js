const mongoose = require('mongoose');


const chapterSchema= new mongoose.Schema({
  Chaptername:{ type: String, required: true },
  BriefDescriptipon: { type: String, required: true }, 
  content: { type: String, required: true }, 
}, {
  timestamps: true
});
// Define CourseDataSchema second (after QuizDataSchema)
const CourseDataSchema = new mongoose.Schema({
  unit: { type: Number, required: true, default: 1 },           // Unit number
  chapterDetails: { type: [chapterSchema], required: true },
  quizData: { type: mongoose.Schema.Types.ObjectId, ref: 'Quizes' }, // Reference to Quiz model
});




const CourseContentSchema = new mongoose.Schema({
  Status: { type: String, required: true, enum: ['Draft','Pending', 'Approved', 'Rejected'] },
  createdBy: { type: String, required: true }, //objectId of the user
  role: { type: String, required: true },
  language: { type: String, required: true },
  level: { type: String, required: true },
  title: { type: String, required: true ,unique:true},
  author: { type: String, required: true },
  duration: { type: Number, required: true },
  tags: { type: [String], default: [] },
  description: { type: String, required: true },
  final_assesment:{ type: mongoose.Schema.Types.ObjectId, ref: 'Quizes' }, // Reference to Quiz model
  Course_data: { type: [CourseDataSchema], required: true } // HTML content as raw string
}, {
  timestamps: true
});

module.exports = mongoose.model('CourseContent', CourseContentSchema, 'CourseContents');


 