const ExamResult = require('../models/examResult');
const Exam = require('../models/exam_web');

// Submit an exam attempt
exports.submitExam = async (req, res) => {
  try {
    const { userId, examId, answers, startTime, endTime } = req.body;
    
    // Validate required fields
    if (!userId || !examId || !answers || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields for exam submission'
      });
    }
    
    // Get the exam data
    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({
        success: false,
        error: 'Exam not found'
      });
    }
    
    // Calculate the result
    let totalMarksObtained = 0;
    const processedAnswers = [];
    
    for (const answer of answers) {
      // Use array index instead of id() method since _id is false in schema
      const questionIndex = parseInt(answer.questionId);
      const question = exam.questions[questionIndex];
      if (!question) continue;
      
      let isCorrect = false;
      let marksForThisQuestion = 0;
      
      // Check if the answer is correct
      console.log('Processing answer for question index:', questionIndex);
      console.log('Question:', question ? {
        type: question.questionType,
        text: question.questionText.substring(0, 30),
        correctAnswers: question.correctAnswer_index
      } : 'Question not found');
      console.log('User answer:', answer.selectedAnswer);
      
      if (Array.isArray(answer.selectedAnswer) && Array.isArray(question.correctAnswer_index)) {
        if (answer.selectedAnswer.length === question.correctAnswer_index.length) {
          isCorrect = question.correctAnswer_index.every(
            (correctIndex) => answer.selectedAnswer.includes(correctIndex)
          );
        }
      }
      console.log('Is correct:', isCorrect);
      
      // Calculate marks
      if (isCorrect) {
        marksForThisQuestion = question.marks || 0;
      } else {
        marksForThisQuestion = -(question.negativeMarks || 0);
      }
      
      totalMarksObtained += marksForThisQuestion;
      
      processedAnswers.push({
        questionId: answer.questionId,
        selectedAnswer: answer.selectedAnswer,
        isCorrect,
        marksObtained: marksForThisQuestion
      });
    }
    
    // Calculate percentage and pass/fail status
    const totalMarks = exam.totalMarks || 1; // Prevent division by zero
    const percentageScore = (totalMarksObtained / totalMarks) * 100;
    const passingMarks = exam.passingMarks || (totalMarks * 0.4); // Default passing is 40% if not specified
    const isPassed = totalMarksObtained >= passingMarks;
    
    // Calculate time spent
    const timeSpent = Math.floor((new Date(endTime) - new Date(startTime)) / 1000);
    
    // Create exam result
    const examResult = new ExamResult({
      userId,
      examId,
      examName: exam.examName,
      totalMarks: totalMarks,
      marksObtained: totalMarksObtained,
      passingMarks: passingMarks,
      isPassed,
      percentageScore,
      timeSpent,
      answers: processedAnswers,
      startTime,
      endTime
    });
    
    // Add detailed logging for debugging
    console.log('About to save exam result:', {
      userId,
      examId,
      examName: exam.examName,
      totalMarks,
      marksObtained: totalMarksObtained,
      answers: processedAnswers.length,
      isPassed
    });
    
    try {
      // Enhanced debugging before save
      console.log('FULL exam result object before saving:', JSON.stringify(examResult.toObject(), null, 2));
      
      // Save result to database
      const savedResult = await examResult.save();
      console.log('Exam result saved successfully with ID:', savedResult._id);
      
      res.status(201).json({
        success: true,
        message: isPassed ? 'Exam passed successfully' : 'Exam submission recorded',
        data: {
          resultId: savedResult._id,
          marksObtained: totalMarksObtained,
          totalMarks: exam.totalMarks,
          percentageScore,
          isPassed,
          timeSpent
        }
      });
    } catch (saveError) {
      console.error('Error saving exam result:', saveError);
      // Enhanced error logging
      console.error('Error name:', saveError.name);
      console.error('Error message:', saveError.message);
      console.error('Error stack:', saveError.stack);
      
      // Check for validation errors
      if (saveError.name === 'ValidationError') {
        const validationErrors = Object.keys(saveError.errors).map(field => ({
          field,
          message: saveError.errors[field].message
        }));
        console.error('Validation errors:', validationErrors);
      }
      
      // Return the error in response instead of re-throwing
      return res.status(400).json({
        success: false,
        error: saveError.message,
        details: saveError.name === 'ValidationError' ? 
          Object.keys(saveError.errors).map(field => ({
            field,
            message: saveError.errors[field].message
          })) : null
      });
    }
    
  } catch (error) {
    console.error('Error submitting exam:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get exam result by ID
exports.getResultById = async (req, res) => {
  try {
    const result = await ExamResult.findById(req.params.id);
    if (!result) {
      return res.status(404).json({
        success: false,
        error: 'Exam result not found'
      });
    }
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get all results for a specific user
exports.getUserResults = async (req, res) => {
  try {
    const { userId } = req.params;
    const results = await ExamResult.find({ userId });
    
    res.json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get all results for a specific exam
exports.getExamResults = async (req, res) => {
  try {
    const { examId } = req.params;
    const results = await ExamResult.find({ examId });
    
    res.json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
