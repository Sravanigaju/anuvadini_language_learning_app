const mongoose = require('mongoose');

// Define QuizDataSchema first
const QuizDataSchema = new mongoose.Schema({
  course_data_schema_id: { type: String, required: true },
  question: { type: String, required: true },
  options: { type: [String], required: true }, 
  answer: { type: String, required: true } // Correct answer
}, { 
  timestamps: true 
});

// Define CourseDataSchema second (after QuizDataSchema)
const CourseDataSchema = new mongoose.Schema({
  unit: { type: Number, required: true }, 
  chapterName:{ type: String, required: true },
  BriefDescriptipon: { type: String, required: true }, 
  content: { type: String, required: true }, 
  quiz: { type: [QuizDataSchema], default: [] } 
}, {
  timestamps: true
});


const CourseContentSchema = new mongoose.Schema({
  Status: { type: String, required: true, enum: ['Draft', 'Approved', 'Rejected'] },
  createdBy: { type: String, required: true }, //objectId of the user
  language: { type: String, required: true },
  level: { type: String, required: true },
  title: { type: String, required: true ,unique:true},
  author: { type: String, required: true },
  duration: { type: Number, required: true },
  tags: { type: [String], default: [] },
  description: { type: String, required: true },
  Course_data: { type: [CourseDataSchema], required: true } // HTML content as raw string
}, {
  timestamps: true
});

module.exports = mongoose.model('CourseContent', CourseContentSchema, 'CourseContents');


 