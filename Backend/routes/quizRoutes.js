const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');

// Create a new quiz
router.post('/new', quizController.createQuiz);

// Get all quizzes
router.get('/getall', quizController.getAllQuizzes);

// Get a single quiz by ID
router.get('/quiz/:id', quizController.getQuizById);

// Update a quiz by ID (partial update)
router.patch('/edit/:id', quizController.updateQuiz);

// Delete a quiz by ID
router.delete('/delete/:id', quizController.deleteQuiz);

module.exports = router;
