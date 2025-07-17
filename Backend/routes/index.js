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
const deleteRoutes = require("./deleteRoutes"); 
const crosswordRoutes = require('./crosswordRoutes');
const creatorRoutes = require("./creatorAuthRoutes");
const validatorRoutes = require("./validatorRoutes");
const institutionRoutes = require("./institutionAuthRoutes");


// Use route modules
router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/userprofile", userProfileRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/upload", uploadRoutes);
router.use("/feedback", feedbackRoutes);
router.use("/leaderboard", leaderboardRoutes);
router.use("/deleteusers", deleteRoutes);
router.use('/crossword', crosswordRoutes);

// Skribble game route
router.get('/skribble', (req, res) => {
  res.redirect('/skribble');
});

// Skribble status endpoint
router.get('/skribble-status', (req, res) => {
  res.json({ 
    status: 'active', 
    message: 'Skribble game server is running',
    access_url: '/skribble'
  });
});

router.use('/creator', creatorRoutes);
router.use("/validator", validatorRoutes);
router.use("/institution", institutionRoutes);






module.exports = router;
