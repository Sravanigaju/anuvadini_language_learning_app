const Quiz = require('../models/Quiz');

// Create a new quiz with validation
exports.createQuiz = async (req, res) => {
  try {
    const { title, language, timeLimit, questions } = req.body;
    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ error: 'Quiz title is required and must be a non-empty string.' });
    }
    if (!language || typeof language !== 'string' || !language.trim()) {
      return res.status(400).json({ error: 'Language is required and must be a non-empty string.' });
    }
    if (timeLimit === undefined || typeof timeLimit !== 'number' || timeLimit < 1) {
      return res.status(400).json({ error: 'Time limit is required and must be a positive number.' });
    }
    if (questions && !Array.isArray(questions)) {
      return res.status(400).json({ error: 'Questions must be an array.' });
    }
    const quiz = new Quiz(req.body);
    await quiz.save();
    res.status(201).json(quiz);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'An unexpected error occurred while creating the quiz.' });
  }
};

// Get all quizzes
exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single quiz by ID
exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a quiz by ID with validation
exports.updateQuiz = async (req, res) => {
  try {
    const { title, language, timeLimit, questions } = req.body;
    if (title !== undefined && (typeof title !== 'string' || !title.trim())) {
      return res.status(400).json({ error: 'Quiz title must be a non-empty string.' });
    }
    if (language !== undefined && (typeof language !== 'string' || !language.trim())) {
      return res.status(400).json({ error: 'Language must be a non-empty string.' });
    }
    if (timeLimit !== undefined && (typeof timeLimit !== 'number' || timeLimit < 1)) {
      return res.status(400).json({ error: 'Time limit must be a positive number.' });
    }
    if (questions !== undefined && !Array.isArray(questions)) {
      return res.status(400).json({ error: 'Questions must be an array.' });
    }
    const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
    res.json(quiz);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'An unexpected error occurred while updating the quiz.' });
  }
};

// Delete a quiz by ID
exports.deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
    res.json({ message: 'Quiz deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
