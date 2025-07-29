const express = require('express');
const router = express.Router();
const LevelController = require('../controllers/Level_Controller');

// GET /levels/name/:name
router.get('/name/:name', LevelController.getLevelByName);  //http://127.0.0.1:7273/api/levels/categories/basic

// GET /levels/categories
router.get('/categories', LevelController.getAllCategories);

// GET /levels/categories/:name
router.get('/categories/:name', LevelController.getCategoriesByLevelName);

module.exports = router;