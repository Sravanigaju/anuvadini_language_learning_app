const express = require('express');
const router = express.Router();
const LevelController = require('../controllers/Level_Controller');

// GET /levels/name/:name
router.get('/name/:name', LevelController.getLevelByName);  ///http://127.0.0.1:7273/api/levels/name/Basic

// GET /levels/categories
router.get('/categories', LevelController.getAllCategories);  //http://127.0.0.1:7273/api/levels/categories

// GET /levels/categories/:name
router.get('/categories/:name', LevelController.getCategoriesByLevelName);

// GET /levels/all
router.get('/all', LevelController.getAllLevels); //http://127.0.0.1:7273/api/levels/all


router.patch('/updated/:levelId', LevelController.updateLevel); // Update level & slides   
router.post('/create/', LevelController.createLevel); // Create level & slides


router.patch('/updatedDD/:levelId', LevelController.updateCategoryByLevelName); // Update level

module.exports = router;


//              Sample JSON for PATCH request to update         http://127.0.0.1:3001/api/levels/updated/688327c8c26ccdcb4fd2347a
// {
//   "lang": "english",
//   "updates": [
//     {
//       "type": "level",
//       "oldName": "Basic",
//       "newName": "Basic Updated"
//     },
//     {
//       "type": "category",
//       "oldName": "Grammar",
//       "newName": "Advanced Grammar"
//     },
//     {
//       "type": "lesson",
//       "oldName": "Lesson One",
//       "newName": "Lesson 1 Updated"
//     },
//     {
//       "type": "chapter",
//       "oldName": "Chapter: Introduction",
//       "newName": "Intro Updated"
//     }
//   ]
// }