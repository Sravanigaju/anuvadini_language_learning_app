const express = require('express');
const router = express.Router();
const StatsController = require('../controllers/UserpermonthController');

// Route: Get number of users joined per month
// Example: http://127.0.0.1:7273/api/user-per-month
router.get('/', StatsController.UserpermonthController);

// Catch-all for undefined subroutes under /api/user-per-month
router.use((req, res) => {
  res.status(404).json({ success: false, message: 'Invalid user-per-month endpoint' });
});

module.exports = router;
