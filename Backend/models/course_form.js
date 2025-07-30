const mongoose = require('mongoose');

const CourseContentSchema = new mongoose.Schema({
  institute_id: { type: String, required: true },
  status: { type: String, required: true },
  language: { type: String, required: true },
  level: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  duration: { type: Number, required: true },
  tags: { type: [String], default: [] },
  description: { type: String, required: true },
  Course_data: { type: [CourseDataSchema], required: true } // HTML content as raw string
}, {
  timestamps: true
});
  const CourseDataSchema = new mongoose.Schema({
  Week: { type: Number, required: true },  
  content: { type: String, required: true }, // HTML content as raw string
  quiz: { type: [QuizDataSchema], default: [] } // Array of quiz questions
}, {
  timestamps: true
});
const QuizDataSchema = new mongoose.Schema({
  course_data_schema_id: { type: String, required: true },
  question: { type: String, required: true },
  options: { type: [String], required: true }, // Array of options
  answer: { type: String, required: true } // Correct answer
}, {  timestamps: true
});
module.exports = mongoose.model('CourseContent', CourseContentSchema, 'CourseContents');
