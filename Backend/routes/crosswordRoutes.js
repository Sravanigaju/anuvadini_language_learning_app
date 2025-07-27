const express = require('express');
const router = express.Router();
const crosswordController = require('../controllers/crosswordController');
const SkribbleResult = require('../models/SkribbleResult');

router.post('/create', crosswordController.createCrosswordEntry);
router.post('/:userId/add-session', crosswordController.addCrosswordSession);
router.get('/progress/:userId', crosswordController.getCrosswordProgress);
router.get('/leaderboard', crosswordController.getCrosswordLeaderboard);
// Daily Quiz Routes - Updated to match frontend
router.post('/:userId/add-daily-quiz-session', crosswordController.addDailyQuizSession);
router.get('/daily-quiz/:userId', crosswordController.getDailyQuizProgress);
router.get('/dailyquiz/leaderboard', crosswordController.getDailyQuizLeaderboard);

// Listening Session Routes
router.post('/:userId/add-listening-session', crosswordController.addListeningSession);
router.get('/listening/:userId', crosswordController.getListeningProgress);
router.get('/listening-leaderboard', crosswordController.getListeningLeaderboard);

// New route for getting unlocked levels
router.get('/unlocked-levels/:userId', crosswordController.getUnlockedLevels);

// Skribble Results API (for admin/testing)
router.get('/skribble-results', async (req, res) => {
  try {
    const results = await SkribbleResult.find().sort({ timestamp: -1 }).limit(20);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch results' });
  }
});

module.exports = router;