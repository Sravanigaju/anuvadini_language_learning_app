const express = require('express');
const router = express.Router();
const StatsController = require('../controllers/UserEnrollController');

// Route: Language-wise statistics
// Example: http://127.0.0.1:7273/api/language-stats
router.get('/', StatsController.LanguageStatsController);

// Catch-all for undefined subroutes under /api/language-stats
router.use((req, res) => {
  res.status(404).json({ success: false, message: 'Invalid language stats endpoint' });
});

module.exports = router;
