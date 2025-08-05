const Quiz = require('../models/quiz_WEB'); // adjust the path if needed

// Create a new quiz
exports.createQuiz = async (req, res) => {
  try {
    const quiz = new Quiz(req.body);
    const savedQuiz = await quiz.save();
    res.status(201).json({ success: true, message: 'Quiz created successfully', data: savedQuiz });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get all quizzes
exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.json({ success: true, count: quizzes.length, data: quizzes });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get quiz by ID
exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });
    res.json({ success: true, data: quiz });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update quiz by ID
exports.updateQuiz = async (req, res) => {
  try {
    const updatedQuiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedQuiz) return res.status(404).json({ success: false, message: 'Quiz not found' });
    res.json({ success: true, message: 'Quiz updated successfully', data: updatedQuiz });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete quiz by ID
exports.deleteQuiz = async (req, res) => {
  try {
    const deletedQuiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!deletedQuiz) return res.status(404).json({ success: false, message: 'Quiz not found' });
    res.json({ success: true, message: 'Quiz deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get quizzes by createdBy ID
exports.getQuizzesByCreator = async (req, res) => {
  try {
    const { creatorId } = req.params;
    const quizzes = await Quiz.find({ createdBy: creatorId });
    
    if (quizzes.length === 0) {
      return res.status(404).json({ success: false, message: 'No quizzes found for this creator' });
    }

    res.json({ success: true, count: quizzes.length, data: quizzes });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
