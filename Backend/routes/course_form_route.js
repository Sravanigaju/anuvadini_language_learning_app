const express = require('express');
const router = express.Router();
const courseController = require('../controllers/course_form_controller');

// POST: Upload all course content
router.post('/upload', courseController.createCourse);  //http://127.0.0.1:7273/api/course_form/upload

// GET: Fetch all courses
router.get('/all', courseController.getAllCourses);  ////http://127.0.0.1:7273/api/course_form/all

// GET: Fetch courses by institute_id
router.get('/institute/:institute_id', courseController.getCoursesByInstituteId);

// DELETE: Delete the full course by ID
router.delete('/:id', courseController.deleteCourse);

// PATCH: Update the content of the full course
router.patch('/:id', courseController.updateCourse);  

module.exports = router;