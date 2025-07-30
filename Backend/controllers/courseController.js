const Course = require('../models/Course');

// Create a new course with validation
exports.createCourse = async (req, res) => {
  try {
    const { name, order, lessons, files } = req.body;
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Course name is required and must be a non-empty string.' });
    }
    if (order === undefined || typeof order !== 'number' || order < 1) {
      return res.status(400).json({ error: 'Order is required and must be a positive number.' });
    }
    // Validate lessons if provided
    if (lessons && !Array.isArray(lessons)) {
      return res.status(400).json({ error: 'Lessons must be an array.' });
    }
    // Validate files if provided
    if (files && !Array.isArray(files)) {
      return res.status(400).json({ error: 'Files must be an array.' });
    }
    const course = new Course(req.body);
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'An unexpected error occurred while creating the course.' });
  }
};

// Get all courses
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single course by ID
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a course by ID with validation
exports.updateCourse = async (req, res) => {
  try {
    const { name, order, lessons, files } = req.body;
    if (name !== undefined && (typeof name !== 'string' || !name.trim())) {
      return res.status(400).json({ error: 'Course name must be a non-empty string.' });
    }
    if (order !== undefined && (typeof order !== 'number' || order < 1)) {
      return res.status(400).json({ error: 'Order must be a positive number.' });
    }
    if (lessons !== undefined && !Array.isArray(lessons)) {
      return res.status(400).json({ error: 'Lessons must be an array.' });
    }
    if (files !== undefined && !Array.isArray(files)) {
      return res.status(400).json({ error: 'Files must be an array.' });
    }
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json(course);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'An unexpected error occurred while updating the course.' });
  }
};

// Delete a course by ID
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json({ message: 'Course deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
