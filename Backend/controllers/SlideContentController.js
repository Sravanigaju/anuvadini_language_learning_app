const SlideContent = require('../models/SlideContent'); // <-- Use correct model name

// Supported languages
const SUPPORTED_LANGUAGES = [
  'english', 'hindi', 'sanskrit', 'bengali', 'marathi', 'tamil', 
  'telugu', 'assamese', 'bodo', 'santali', 'urdu', 'kannada', 
  'malayalam', 'punjabi', 'maithili', 'dogri', 'manipuri', 
  'konkani', 'odia', 'gujrati', 'kashmiri', 'sindhi', 'nepali'
];

// Helper function to validate language
const validateLanguage = (language) => {
  return SUPPORTED_LANGUAGES.includes(language.toLowerCase());
};

// Get all chapters
async function getAllChapters(req, res) {
  try {
    const { language, page = 1, limit = 10 } = req.query;
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 }
    };

    let projection = {};
    if (language && validateLanguage(language)) {
      projection[`slides.${language}`] = 1;
      projection.chapterId = 1;
    }

    const chapters = await SlideContent.find({}, projection)
      .skip((options.page - 1) * options.limit)
      .limit(options.limit)
      .sort(options.sort);

    const total = await SlideContent.countDocuments();

    res.json({
      success: true,
      data: chapters,
      pagination: {
        currentPage: options.page,
        totalPages: Math.ceil(total / options.limit),
        totalItems: total,
        itemsPerPage: options.limit
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching chapters',
      error: error.message
    });
  }
}

// Get specific chapter
async function getChapterById(req, res) {
  try {
    const { chapterId } = req.params;
    const { language } = req.query;

    let projection = {};
    if (language && validateLanguage(language)) {
      projection[`slides.${language}`] = 1;
      projection.chapterId = 1;
    }

    const chapter = await SlideContent.findOne({ chapterId }, projection);

    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: 'Chapter not found'
      });
    }

    res.json({
      success: true,
      data: chapter
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching chapter',
      error: error.message
    });
  }
}

// Get chapter in specific language
async function getChapterByLanguage(req, res) {
  try {
    const { chapterId, language } = req.params;

    if (!validateLanguage(language)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid language. Supported languages: ' + SUPPORTED_LANGUAGES.join(', ')
      });
    }

    const chapter = await SlideContent.findOne(
      { chapterId },
      { [`slides.${language}`]: 1, chapterId: 1 }
    );

    // Add this log for debugging
    console.log('Fetched chapter:', chapter);
    if (chapter) {
      console.log('Slides for language:', language, chapter.slides[language]);
    }

    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: 'Chapter not found'
      });
    }

    res.json({
      success: true,
      data: {
        chapterId: chapter.chapterId,
        language,
        slides: chapter.slides[language] || []
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching chapter content',
      error: error.message
    });
  }
}

// Create new chapter
async function createChapter(req, res) {
  try {
    const { chapterId, slides } = req.body;

    if (!chapterId || !slides) {
      return res.status(400).json({
        success: false,
        message: 'chapterId and slides are required'
      });
    }

    // Check if chapter already exists
    const existingChapter = await SlideContent.findOne({ chapterId });
    if (existingChapter) {
      return res.status(409).json({
        success: false,
        message: 'Chapter with this ID already exists'
      });
    }

    const chapter = new SlideContent({ chapterId, slides });
    await chapter.save();

    res.status(201).json({
      success: true,
      message: 'Chapter created successfully',
      data: chapter
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating chapter',
      error: error.message
    });
  }
}

// Update entire chapter
async function updateChapter(req, res) {
  try {
    const { chapterId } = req.params;
    const { slides } = req.body;

    if (!slides) {
      return res.status(400).json({
        success: false,
        message: 'slides data is required'
      });
    }

    const chapter = await SlideContent.findOneAndUpdate(
      { chapterId },
      { slides },
      { new: true, runValidators: true }
    );

    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: 'Chapter not found'
      });
    }

    res.json({
      success: true,
      message: 'Chapter updated successfully',
      data: chapter
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating chapter',
      error: error.message
    });
  }
}

// Update specific language content
async function updateChapterLanguage(req, res) {
  try {
    const { chapterId, language } = req.params;
    const { slides } = req.body;

    if (!validateLanguage(language)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid language. Supported languages: ' + SUPPORTED_LANGUAGES.join(', ')
      });
    }

    if (!slides || !Array.isArray(slides)) {
      return res.status(400).json({
        success: false,
        message: 'slides must be an array'
      });
    }

    const updateData = {};
    updateData[`slides.${language}`] = slides;

    const chapter = await SlideContent.findOneAndUpdate(
      { chapterId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: 'Chapter not found'
      });
    }

    res.json({
      success: true,
      message: `Chapter ${language} content updated successfully`,
      data: {
        chapterId: chapter.chapterId,
        language,
        slides: chapter.slides[language]
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating chapter content',
      error: error.message
    });
  }
}

// Add new slide to specific language
async function addSlideToLanguage(req, res) {
  try {
    const { chapterId, language } = req.params;
    const slideData = req.body;

    if (!validateLanguage(language)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid language'
      });
    }

    if (!slideData.title) {
      return res.status(400).json({
        success: false,
        message: 'Slide title is required'
      });
    }

    const chapter = await SlideContent.findOneAndUpdate(
      { chapterId },
      { $push: { [`slides.${language}`]: slideData } },
      { new: true, runValidators: true }
    );

    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: 'Chapter not found'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Slide added successfully',
      data: {
        chapterId,
        language,
        newSlide: slideData,
        totalSlides: chapter.slides[language].length
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error adding slide',
      error: error.message
    });
  }
}

// Delete entire chapter
async function deleteChapter(req, res) {
  try {
    const { chapterId } = req.params;

    const chapter = await SlideContent.findOneAndDelete({ chapterId });

    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: 'Chapter not found'
      });
    }

    res.json({
      success: true,
      message: 'Chapter deleted successfully',
      data: { chapterId }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting chapter',
      error: error.message
    });
  }
}

// Delete specific slide
async function deleteSlideFromLanguage(req, res) {
  try {
    const { chapterId, language, slideIndex } = req.params;
    const index = parseInt(slideIndex);

    if (!validateLanguage(language)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid language'
      });
    }

    if (isNaN(index) || index < 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid slide index'
      });
    }

    const chapter = await SlideContent.findOne({ chapterId });
    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: 'Chapter not found'
      });
    }

    if (!chapter.slides[language] || index >= chapter.slides[language].length) {
      return res.status(404).json({
        success: false,
        message: 'Slide not found'
      });
    }

    chapter.slides[language].splice(index, 1);
    await chapter.save();

    res.json({
      success: true,
      message: 'Slide deleted successfully',
      data: {
        chapterId,
        language,
        deletedIndex: index,
        remainingSlides: chapter.slides[language].length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting slide',
      error: error.message
    });
  }
}

// Search chapters by content
async function searchChapterContent(req, res) {
  try {
    const { query, language } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    let searchConditions = [];
    
    if (language && validateLanguage(language)) {
      // Search in specific language
      searchConditions.push({
        [`slides.${language}.title`]: { $regex: query, $options: 'i' }
      });
      searchConditions.push({
        [`slides.${language}.def`]: { $regex: query, $options: 'i' }
      });
      searchConditions.push({
        [`slides.${language}.example`]: { $regex: query, $options: 'i' }
      });
    } else {
      // Search in all languages
      SUPPORTED_LANGUAGES.forEach(lang => {
        searchConditions.push({
          [`slides.${lang}.title`]: { $regex: query, $options: 'i' }
        });
        searchConditions.push({
          [`slides.${lang}.def`]: { $regex: query, $options: 'i' }
        });
        searchConditions.push({
          [`slides.${lang}.example`]: { $regex: query, $options: 'i' }
        });
      });
    }

    const chapters = await SlideContent.find({
      $or: searchConditions
    });

    res.json({
      success: true,
      data: chapters,
      count: chapters.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching chapters',
      error: error.message
    });
  }
}

module.exports = {
  getAllChapters,
  getChapterById,
  getChapterByLanguage,
  createChapter,
  updateChapter,
  updateChapterLanguage,
  addSlideToLanguage,
  deleteChapter,
  deleteSlideFromLanguage,
  searchChapterContent
};