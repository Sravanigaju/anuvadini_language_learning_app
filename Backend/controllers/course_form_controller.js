const LessonContent = require('../models/course_form');

// Create a new lesson
exports.createLesson = async (req, res) => {
  try {
    const lesson = new LessonContent(req.body);
    await lesson.save();
    res.status(201).json({ success: true, data: lesson });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Get all lessons
exports.getAllLessons = async (req, res) => {
  try {
    const lessons = await LessonContent.find();
    res.json({ success: true, data: lessons });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get a lesson by ID
exports.getLessonById = async (req, res) => {
  try {
    const lesson = await LessonContent.findById(req.params.id);
    if (!lesson) return res.status(404).json({ success: false, message: 'Lesson not found' });
    res.json({ success: true, data: lesson });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
