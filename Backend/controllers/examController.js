const Exam = require('../models/Exam');

// Create a new exam with validation
exports.createExam = async (req, res) => {
  try {
    const { title, language, timeLimit, questions } = req.body;
    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ error: 'Exam title is required and must be a non-empty string.' });
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
    const exam = new Exam(req.body);
    await exam.save();
    res.status(201).json(exam);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'An unexpected error occurred while creating the exam.' });
  }
};

// Get all exams
exports.getAllExams = async (req, res) => {
  try {
    const exams = await Exam.find();
    res.json(exams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single exam by ID
exports.getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).json({ error: 'Exam not found' });
    res.json(exam);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update an exam by ID with validation
exports.updateExam = async (req, res) => {
  try {
    const { title, language, timeLimit, questions } = req.body;
    if (title !== undefined && (typeof title !== 'string' || !title.trim())) {
      return res.status(400).json({ error: 'Exam title must be a non-empty string.' });
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
    const exam = await Exam.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!exam) return res.status(404).json({ error: 'Exam not found' });
    res.json(exam);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'An unexpected error occurred while updating the exam.' });
  }
};

// Delete an exam by ID
exports.deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndDelete(req.params.id);
    if (!exam) return res.status(404).json({ error: 'Exam not found' });
    res.json({ message: 'Exam deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
