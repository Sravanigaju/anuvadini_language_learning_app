const express = require("express");
const router = express.Router();

// Import route modules
const userRoutes = require("./userRoutes");
const authRoutes = require("./authRoutes");
const userProfileRoutes = require("./userProfileRoutes");

// Use route modules
router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/profiles", userProfileRoutes);

module.exports = router;
