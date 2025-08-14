const express = require('express');
const router = express.Router();
const examController = require('../controllers/examWebController');

// Create a new exam
router.post('/create', examController.createExam);

// Get all exams
router.get('/all', examController.getAllExams);

// Get a single exam by ID
router.get('/id/:id', examController.getExamById);

// Get exams by creator
router.get('/creator/:createdBy', examController.getExamsByCreator);

// Get exams by language
router.get('/language/:language', examController.getExamsByLanguage);

// Update an exam
router.put('/:id', examController.updateExam);

// Delete an exam
router.delete('/:id', examController.deleteExam);

module.exports = router;
