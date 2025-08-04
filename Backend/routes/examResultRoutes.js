const express = require('express');
const router = express.Router();
const examResultController = require('../controllers/examResultController');

// Submit exam results
router.post('/submit', examResultController.submitExam);

// Get result by ID
router.get('/id/:id', examResultController.getResultById);

// Get all results for a specific user
router.get('/user/:userId', examResultController.getUserResults);

// Get all results for a specific exam
router.get('/exam/:examId', examResultController.getExamResults);

module.exports = router;
