const express = require("express");
const router = express.Router();
const leaderboardController = require("../controllers/leaderboardController");

// GET Top 3 users for a given type and language
router.get("/:type/:language", leaderboardController.getLeaderboard);

// GET user rank for type and language with userId as query param
router.get("/my-rank/:type/:language", leaderboardController.getUserRank);

// POST to update points
router.post("/update-points", leaderboardController.updateUserPoints);

module.exports = router;
