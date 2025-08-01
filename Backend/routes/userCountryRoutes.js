const express = require('express');
const router = express.Router();
const StatsController = require('../controllers/UserCountryController');

// Route for users per month
// router.get('/users-per-month', StatsController.UserpermonthController);

// Route for users by country and language
// Example: http://127.0.0.1:7273/api/stats/users-per-country-language
router.get('/users-per-country-language', StatsController.UserCountryController);

// Route for language stats (XP, coins, etc.)
// router.get('/language-stats', StatsController.LanguageStatsController);

// Fallback route
router.use((req, res) => {
  res.status(404).json({ success: false, message: 'Invalid stats API endpoint' });
});

module.exports = router;
