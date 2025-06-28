const express = require('express');
const router = express.Router();
const { getUserDashboard, getUserProgress } = require('../controllers/dashboardController');

// GET dashboard data for a user
router.get('/progress', getUserProgress); // specific first
router.get('/:userId', getUserDashboard); // dynamic after



module.exports = router;