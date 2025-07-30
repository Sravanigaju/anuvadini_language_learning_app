const express = require('express');
const router = express.Router();
const lessonController = require('../controllers/course_form_controller');

router.post('/upload', lessonController.createLesson);
router.get('/', lessonController.getAllLessons);
router.get('/:id', lessonController.getLessonById);

module.exports = router;
