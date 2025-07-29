const express = require('express');
const router = express.Router();
const LevelController = require('../controllers/Level_Controller');

// GET /levels/name/:name
router.get('/name/:name', LevelController.getLevelByName);

// GET /levels/categories
router.get('/categories', LevelController.getAllCategories);

// GET /levels/categories/:name
router.get('/categories/:name', LevelController.getCategoriesByLevelName);

module.exports = router;