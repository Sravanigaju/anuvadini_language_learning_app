const mongoose = require('mongoose');
require('dotenv').config();

// Import the models
const ExamResult = require('./models/examResult');

// Connect to MongoDB
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/anuvadini_language",
  { useNewUrlParser: true }
).then(() => {
  console.log('Connected to MongoDB');
  checkExamResults();
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

async function checkExamResults() {
  try {
    // Count ExamResults
    const count = await ExamResult.countDocuments();
    console.log(`Total exam results in database: ${count}`);
    
    if (count > 0) {
      // Get the most recent result
      const mostRecent = await ExamResult.findOne().sort({ submittedAt: -1 }).limit(1);
      
      if (mostRecent) {
        console.log('\nMost recent exam result:');
        console.log('ID:', mostRecent._id);
        console.log('User ID:', mostRecent.userId);
        console.log('Exam ID:', mostRecent.examId);
        console.log('Exam Name:', mostRecent.examName);
        console.log('Marks Obtained:', mostRecent.marksObtained);
        console.log('Total Marks:', mostRecent.totalMarks);
        console.log('Percentage:', mostRecent.percentageScore);
        console.log('Passed:', mostRecent.isPassed ? 'Yes' : 'No');
        console.log('Time Spent:', mostRecent.timeSpent, 'seconds');
        console.log('Submitted At:', mostRecent.submittedAt);
        
        console.log('\nAnswers:');
        mostRecent.answers.forEach((answer, i) => {
          console.log(`Answer ${i}:`);
          console.log(`  Question ID: ${answer.questionId}`);
          console.log(`  Selected: ${answer.selectedAnswer}`);
          console.log(`  Correct: ${answer.isCorrect}`);
          console.log(`  Marks: ${answer.marksObtained}`);
        });
      }
    }
  } catch (error) {
    console.error('Error checking exam results:', error);
  } finally {
    // Close the connection
    mongoose.connection.close();
  }
}
