const express = require('express');
const router = express.Router();
const crosswordController = require('../controllers/crosswordController');

router.post('/create', crosswordController.createCrosswordEntry);
router.post('/:userId/add-session', crosswordController.addCrosswordSession);
router.get('/progress/:userId', crosswordController.getCrosswordProgress);
router.get('/leaderboard', crosswordController.getCrosswordLeaderboard);

// Daily Quiz Routes
router.post('/:userId/add-daily-quiz', crosswordController.addDailyQuizSession);
router.get('/daily-quiz/:userId', crosswordController.getDailyQuizProgress);

module.exports = router;
