const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');

// Create a new exam
router.post('/', examController.createExam);

// Get all exams
router.get('/', examController.getAllExams);

// Get a single exam by ID
router.get('/:id', examController.getExamById);

// Update an exam by ID (partial update)
router.patch('/:id', examController.updateExam);

// Delete an exam by ID
router.delete('/:id', examController.deleteExam);

module.exports = router;
