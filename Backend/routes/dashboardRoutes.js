const express = require('express');
const router = express.Router();
const { getUserDashboard } = require('../controllers/dashboardController');

// GET dashboard data for a user
router.get('/:userId', getUserDashboard);

module.exports = router;
