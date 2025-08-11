const express = require('express');
const router = express.Router();
const versionController = require('../controllers/versionController');

// Get the latest versions of content (levels and slides)
router.get('/', versionController.getContentVersions);

module.exports = router;
