const express = require('express');
const router = express.Router();
const { getUserDashboard, getUserProgress } = require('../controllers/dashboardController');

// GET dashboard data for a user
router.get('/:userId', getUserDashboard);
router.get('/progress', getUserProgress);


module.exports = router;
