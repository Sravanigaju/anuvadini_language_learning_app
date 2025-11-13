const express = require('express');
const router = express.Router();
const LevelController = require('../controllers/Level_Controller');

// GET /content/levels (root path) - Return all levels
router.get('/', LevelController.getAllLevels); //http://127.0.0.1:7273/api/content/levels

// GET /levels/name/:name
router.get('/name/:name', LevelController.getLevelByName);  ///http://127.0.0.1:7273/api/levels/name/Basic

// GET /levels/categories
router.get('/categories', LevelController.getAllCategories);  //http://127.0.0.1:7273/api/levels/categories

// GET /levels/categories/:name
router.get('/categories/:name', LevelController.getCategoriesByLevelName);

// GET /levels/all
router.get('/all', LevelController.getAllLevels); //http://127.0.0.1:7273/api/levels/all

module.exports = router;