const express = require("express");
const router = express.Router();

const { getXpLeaderboard } = require("../controllers/leaderboardController");

router.get("/:language", getXpLeaderboard);


module.exports = router;