const express = require('express');
const router = express.Router();
const crosswordController = require('../controllers/crosswordController');

router.post('/create', crosswordController.createCrosswordEntry);
router.post('/:userId/add-session', crosswordController.addCrosswordSession);
router.get('/progress/:userId', crosswordController.getCrosswordProgress);
router.get('/leaderboard', crosswordController.getCrosswordLeaderboard);

// Daily Quiz Routes - Updated to match frontend
router.post('/:userId/add-daily-quiz-session', crosswordController.addDailyQuizSession);
router.get('/daily-quiz/:userId', crosswordController.getDailyQuizProgress);
router.get('/dailyquiz/leaderboard', crosswordController.getDailyQuizLeaderboard);

module.exports = router;