const CourseContent = require('../models/course_form');

// Create a new course (upload all content) - DEBUG VERSION
exports.createCourse = async (req, res) => {
  try {
    console.log('=== DEBUG: CREATE COURSE ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('Request body keys:', Object.keys(req.body));
    console.log('Request body empty?', Object.keys(req.body).length === 0);
    
    // Check if request body is empty
    if (!req.body || Object.keys(req.body).length === 0) {
      console.log('ERROR: Empty request body');
      return res.status(400).json({ 
        success: false, 
        error: 'Request body is empty. Please provide course data.' 
      });
    }
    
    // Validate required fields
    const requiredFields = ['institute_id', 'status', 'language', 'level', 'title', 'author', 'duration', 'description', 'Course_data'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      console.log('ERROR: Missing required fields:', missingFields);
      return res.status(400).json({
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`
      });
    }
    
    console.log('Creating new course instance...');
    const course = new CourseContent(req.body);
    console.log('Course instance created:', course);
    
    console.log('Saving course to database...');
    const savedCourse = await course.save();
    console.log('Course saved successfully:', savedCourse._id);
    
    res.status(201).json({ 
      success: true, 
      message: 'Course created successfully',
      data: savedCourse 
    });
    
  } catch (error) {
    console.log('ERROR in createCourse:', error.message);
    console.log('Full error:', error);
    
    // Handle validation errors specifically
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        details: validationErrors
      });
    }
    
    res.status(400).json({ 
      success: false, 
      error: error.message,
      stack: error.stack 
    });
  }
};

// Get all courses - DEBUG VERSION
exports.getAllCourses = async (req, res) => {
  try {
    console.log('=== DEBUG: GET ALL COURSES ===');
    const courses = await CourseContent.find();
    console.log('Found courses count:', courses.length);
    console.log('Courses:', courses.map(c => ({ id: c._id, title: c.title })));
    
    res.json({ 
      success: true, 
      count: courses.length,
      data: courses 
    });
  } catch (error) {
    console.log('ERROR in getAllCourses:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get courses by institute_id
exports.getCoursesByInstituteId = async (req, res) => {
  try {
    const { institute_id } = req.params;
    const courses = await CourseContent.find({ institute_id });
    
    if (courses.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'No courses found for this institute' 
      });
    }
    
    res.json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete a full course by ID
exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCourse = await CourseContent.findByIdAndDelete(id);
    
    if (!deletedCourse) {
      return res.status(404).json({ 
        success: false, 
        message: 'Course not found' 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Course deleted successfully',
      data: deletedCourse 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update the full course content
exports.updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCourse = await CourseContent.findByIdAndUpdate(
      id, 
      req.body, 
      { 
        new: true, // Return the updated document
        runValidators: true // Run schema validations
      }
    );
    
    if (!updatedCourse) {
      return res.status(404).json({ 
        success: false, 
        message: 'Course not found' 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Course updated successfully',
      data: updatedCourse 
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};