const express = require("express");
const router = express.Router();
const samvadiniController = require("../controllers/samvadiniController");

// Combined first access + optional setup
router.post("/samvadini-access", samvadiniController.samvadiniAccessAndSetup);

module.exports = router;