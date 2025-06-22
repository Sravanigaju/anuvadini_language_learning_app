const express = require("express");
const router = express.Router();

// Existing routes
const userRoutes = require("./userRoutes");
const authRoutes = require("./authRoutes");
const userProfileRoutes = require("./userProfileRoutes");
const dashboardRoutes = require("./dashboardRoutes");
const uploadRoutes = require("./uploadRoutes");
const feedbackRoutes = require("./feedback");
const leaderboardRoutes = require("./leaderboardRoutes");
const gamerRoutes = require("./gamerRoutes"); // ✅ Add this line

// Use route modules
router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/userprofile", userProfileRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/upload", uploadRoutes);
router.use("/feedback", feedbackRoutes);
router.use("/leaderboard", leaderboardRoutes);
router.use("/gamers", gamerRoutes); // ✅ Add this line to mount gamer routes

module.exports = router;
