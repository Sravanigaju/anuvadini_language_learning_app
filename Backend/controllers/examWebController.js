const Exam = require('../models/exam_web');

// Create a new exam
exports.createExam = async (req, res) => {
  try {
    console.log('=== Creating new exam ===');
    
    // Check if request body is empty
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Request body is empty. Please provide exam data.' 
      });
    }
    
    // Validate required fields
    const requiredFields = ['createdBy', 'role', 'examName', 'language', 'questions'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`
      });
    }
    
    // Calculate number of questions from the questions array
    req.body.numberOfQuestions = req.body.questions?.length || 1;
    
    // Calculate total marks from questions
    if (!req.body.totalMarks) {
      req.body.totalMarks = req.body.questions.reduce((sum, q) => sum + (q.marks || 1), 0);
    }
    
    // Create new exam instance
    const exam = new Exam(req.body);
    const savedExam = await exam.save();
    
    res.status(201).json({ 
      success: true, 
      message: 'Exam created successfully',
      data: savedExam 
    });
    
  } catch (error) {
    console.log('ERROR in createExam:', error.message);
    
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
      error: error.message
    });
  }
};

// Get all exams
exports.getAllExams = async (req, res) => {
  try {
    const exams = await Exam.find();
    
    res.json({ 
      success: true, 
      count: exams.length,
      data: exams 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get exam by ID
exports.getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    
    if (!exam) {
      return res.status(404).json({ 
        success: false, 
        message: 'Exam not found' 
      });
    }
    
    res.json({ success: true, data: exam });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get exams by creator
exports.getExamsByCreator = async (req, res) => {
  try {
    const { createdBy } = req.params;
    const exams = await Exam.find({ createdBy });
    
    if (exams.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'No exams found for this creator' 
      });
    }
    
    res.json({ success: true, data: exams });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get exams by language
exports.getExamsByLanguage = async (req, res) => {
  try {
    const { language } = req.params;
    const exams = await Exam.find({ language });
    
    if (exams.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'No exams found for this language' 
      });
    }
    
    res.json({ success: true, data: exams });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update exam
exports.updateExam = async (req, res) => {
  try {
    const { id } = req.params;
    
    // If questions array is provided, update the number of questions
    if (req.body.questions) {
      req.body.numberOfQuestions = req.body.questions.length;
    }
    
    const updatedExam = await Exam.findByIdAndUpdate(
      id, 
      req.body, 
      { 
        new: true, 
        runValidators: true 
      }
    );
    
    if (!updatedExam) {
      return res.status(404).json({ 
        success: false, 
        message: 'Exam not found' 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Exam updated successfully',
      data: updatedExam 
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Delete exam
exports.deleteExam = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedExam = await Exam.findByIdAndDelete(id);
    
    if (!deletedExam) {
      return res.status(404).json({ 
        success: false, 
        message: 'Exam not found' 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Exam deleted successfully',
      data: deletedExam 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
