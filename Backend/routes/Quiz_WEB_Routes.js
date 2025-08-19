const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quiz_WEB_Controller'); // adjust path if needed

// Routes
router.post('/new', quizController.createQuiz); //http://127.0.0.1:7273/api/quizes/new
router.get('/all', quizController.getAllQuizzes);
router.get('/getby_ID/:id', quizController.getQuizById);
router.patch('/update/:id', quizController.updateQuiz);
router.delete('/delete-byID/:id', quizController.deleteQuiz);
router.get('/by-creator/:creatorId', quizController.getQuizzesByCreator);


module.exports = router;