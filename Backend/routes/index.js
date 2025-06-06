const express = require("express");
const router = express.Router();

// Import route modules
const userRoutes = require("./userRoutes");
const authRoutes = require("./authRoutes");
const userProfileRoutes = require("./userProfileRoutes");
const dashboardRoutes = require('./dashboardRoutes');



// Use route modules
router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/userprofile", userProfileRoutes);
router.use('/dashboard', dashboardRoutes);



module.exports = router;
