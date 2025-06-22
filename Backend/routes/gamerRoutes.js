const express = require('express');
const router = express.Router();
const gamerController = require('../controllers/gamerController');

// POST /api/gamers - Create new gamer
router.post('/', gamerController.createGamer);

// GET /api/gamers/:userId - Get gamer by userId
router.get('/:userId', gamerController.getGamerByUserId);

// PUT /api/gamers/:userId/global - Update global stats
router.put('/:userId/global', gamerController.updateGlobalStats);

// POST /api/gamers/:userId/game-stats - Add a game stat
router.post('/:userId/game-stats', gamerController.addGameStat);

// PATCH /api/gamers/:userId/update-metrics - Update metrics after game
router.patch('/:userId/update-metrics', gamerController.updateGameMetrics);

// DELETE /api/gamers/:userId - Delete gamer
router.delete('/:userId', gamerController.deleteGamer);

module.exports = router;
