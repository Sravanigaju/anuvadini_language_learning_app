const express = require('express');
const router = express.Router();
const gamerController = require('../controllers/gamerController');

// Create a new gamer
router.post('/', gamerController.createGamer);

// Get gamer by userId
router.get('/:userId', gamerController.getGamerByUserId);

// Update global stats (coins, wins, etc.)
router.put('/:userId/global', gamerController.updateGlobalStats);

// Add a game stat (only if gameName is new)
router.post('/:userId/game-stats', gamerController.addGameStat);

// Update overall game metrics (e.g., categorycount, etc.)
router.patch('/:userId/update-metrics', gamerController.updateGameMetrics);

// ✅ NEW: Update specific game stat by gameName
router.patch('/:userId/update-stat', gamerController.updateSpecificGameStat);

// Delete a gamer
router.delete('/:userId', gamerController.deleteGamer);

module.exports = router;
