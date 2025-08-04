const mongoose = require('mongoose');
require('dotenv').config();

// Import the Exam model schema
const Exam = require('./models/exam_web');

// Connect to MongoDB
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/anuvadini_language",
  { useNewUrlParser: true }
).then(() => {
  console.log('Connected to MongoDB');
  checkExam();
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

async function checkExam() {
  try {
    // We already imported the Exam model above
    
    // Check for exam with the ID from the Postman screenshot
    const examId = '6899092906487e3ecff978a7';
    console.log(`Searching for exam with ID: ${examId}`);
    
    const exam = await Exam.findById(examId);
    
    if (exam) {
      console.log('Exam found!');
      console.log('Exam name:', exam.examName);
      console.log('Number of questions:', exam.questions.length);
      console.log('Question types:', exam.questions.map(q => q.questionType));
      
      // Check question structure for correctAnswer_index
      console.log('\nQuestion correctAnswer_index details:');
      exam.questions.forEach((q, i) => {
        console.log(`Question ${i}:`, q.correctAnswer_index);
      });
    } else {
      console.log('Exam not found!');
      
      // Let's check if there are any exams at all
      const count = await Exam.countDocuments();
      console.log(`Total exams in database: ${count}`);
      
      if (count > 0) {
        // Get the most recent exam
        const mostRecent = await Exam.findOne().sort({ createdAt: -1 });
        console.log('\nMost recent exam:');
        console.log('ID:', mostRecent._id);
        console.log('Name:', mostRecent.examName);
        console.log('Created at:', mostRecent.createdAt);
      }
    }
  } catch (error) {
    console.error('Error checking exam:', error);
  } finally {
    // Close the connection
    mongoose.connection.close();
  }
}
