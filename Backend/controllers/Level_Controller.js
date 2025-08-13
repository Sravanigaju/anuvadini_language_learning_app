const Level = require('../models/LevelModel');
const SlideContent = require('../models/SlideContent');

// Utility: clean "Chapter: " prefix from any language title
const cleanChapterTitle = (title) => {
  if (!title || typeof title !== 'string') return title;
  return title.replace(/^Chapter:\s*/i, '').trim();
};

// Helper function to clean title
const cleanTitle = (title) => {
  if (!title || typeof title !== 'string') return title;
  return title.replace(/^Chapter:\s*/i, '').trim();
};

// Helper: Case-insensitive match ignoring "Chapter:" and spaces
const matchesName = (stored, given) => {
  if (!stored || !given) return false;
  return cleanTitle(stored).toLowerCase() === cleanTitle(given).toLowerCase();
};

// Fetch all data by levelName (supports any language field)
exports.getLevelByName = async (req, res) => {
  try {
    const { name } = req.params;
    console.log(`🔍 Searching for level with name: "${name}"`);
    
    const regex = new RegExp(name.trim(), 'i');
    const fields = [
      'english','hindi','bengali','assamese','bodo','dogri','gujarati','kannada','kashmiri','konkani','maithili','malayalam','manipuri','marathi','nepali','odia','punjabi','sanskrit','santali','sindhi','tamil','telugu','urdu'
    ];
    
    const orQuery = fields.map(lang => ({ [`levelName.${lang}`]: regex }));
    const levels = await Level.find({ $or: orQuery });
    
    console.log(`✅ Found ${levels.length} levels`);
    res.json(levels);
  } catch (err) {
    console.error('❌ Error in getLevelByName:', err);
    res.status(500).json({ error: err.message });
  }
};

// Fetch all categories from all Level documents
exports.getAllCategories = async (req, res) => {
  try {
    console.log('🔍 Fetching all categories');
    const levels = await Level.find({}, { categories: 1, _id: 0 });
    const allCategories = levels.flatMap(level => level.categories || []);
    
    console.log(`✅ Found ${allCategories.length} categories`);
    res.json(allCategories);
  } catch (err) {
    console.error('❌ Error in getAllCategories:', err);
    res.status(500).json({ error: err.message });
  }
};

// Fetch all categories for a given level name
exports.getCategoriesByLevelName = async (req, res) => {
  try {
    const { name } = req.params;
    console.log(`🔍 Searching categories for level: "${name}"`);
    
    const regex = new RegExp(name.trim(), 'i');
    const fields = [
      'english','hindi','bengali','assamese','bodo','dogri','gujarati','kannada','kashmiri','konkani','maithili','malayalam','manipuri','marathi','nepali','odia','punjabi','sanskrit','santali','sindhi','tamil','telugu','urdu'
    ];
    
    const orQuery = fields.map(lang => ({ [`levelName.${lang}`]: regex }));
    const levels = await Level.find({ $or: orQuery }, { categories: 1, _id: 0 });
    const categories = levels.flatMap(level => level.categories || []);
    
    console.log(`✅ Found ${categories.length} categories for level "${name}"`);
    res.json(categories);
  } catch (err) {
    console.error('❌ Error in getCategoriesByLevelName:', err);
    res.status(500).json({ error: err.message });
  }
};

// Fetch all documents from the Levels collection
exports.getAllLevels = async (req, res) => {
  try {
    console.log('🔍 Fetching all levels');
    const levels = await Level.find({});
    
    console.log(`✅ Found ${levels.length} levels`);
    res.json(levels);
  } catch (err) {
    console.error('❌ Error in getAllLevels:', err);
    res.status(500).json({ error: err.message });
  }
};

// POST – Create Level and ensure corresponding slides entries exist
exports.createLevel = async (req, res) => {
  try {
    console.log("📥 POST /create called");
    console.log("Request body:", JSON.stringify(req.body, null, 2));
    
    if (!req.body || Object.keys(req.body).length === 0) {
      console.log("❌ Empty request body");
      return res.status(400).json({ error: "Request body is required" });
    }

    if (!req.body.levelName || !req.body.categories) {
      console.log("❌ Missing required fields");
      return res.status(400).json({ 
        error: "levelName and categories are required fields",
        received: {
          hasLevelName: !!req.body.levelName,
          hasCategories: !!req.body.categories
        }
      });
    }

    console.log("🆕 Creating new level...");
    const newLevel = new Level(req.body);
    await newLevel.save();
    console.log(`✅ Level created with ID: ${newLevel._id}`);

    let createdSlides = [];
    let debugLogs = [];
    let slideCreationCount = 0;

    console.log("🔄 Processing chapters to create slide entries...");

    // Create slides entries for all chapters
    for (const [catIndex, category] of newLevel.categories.entries()) {
      const catName = category.categoryName?.english || `Category ${catIndex}`;
      console.log(`🔄 Processing category ${catIndex}: ${catName}`);
      debugLogs.push(`Processing category ${catIndex}: ${catName}`);
      
      for (const [lesIndex, lesson] of category.lessons.entries()) {
        const lesName = lesson.lessonTitle?.english || `Lesson ${lesIndex}`;
        console.log(`  🔄 Processing lesson ${lesIndex}: ${lesName}`);
        debugLogs.push(`  Processing lesson ${lesIndex}: ${lesName}`);
        
        for (const [chapIndex, chapter] of lesson.Chapters.entries()) {
          const englishTitle = chapter.ChapterTitle?.english;
          
          if (!englishTitle) {
            const msg = `    ⚠️ Chapter ${chapIndex} missing English title`;
            console.log(msg);
            debugLogs.push(msg);
            continue;
          }
          
          const chapterId = cleanChapterTitle(englishTitle);
          console.log(`    🔄 Processing chapter ${chapIndex}: "${englishTitle}" → chapterId: "${chapterId}"`);
          
          try {
            // Check if slide entry already exists
            const existingSlide = await SlideContent.findOne({ chapterId });
            
            if (existingSlide) {
              const msg = `    ℹ️ Slides entry already exists for chapter: "${chapterId}"`;
              console.log(msg);
              debugLogs.push(msg);
            } else {
              // Create new slides entry
              const slideData = { 
                chapterId, 
                slides: {
                  english: [], hindi: [], sanskrit: [], bengali: [], marathi: [],
                  tamil: [], telugu: [], assamese: [], bodo: [], santali: [],
                  urdu: [], kannada: [], malayalam: [], punjabi: [], maithili: [],
                  dogri: [], manipuri: [], konkani: [], odia: [], gujrati: [],
                  kashmiri: [], sindhi: [], nepali: []
                }
              };
              
              const newSlideEntry = await SlideContent.create(slideData);
              createdSlides.push(chapterId);
              slideCreationCount++;
              
              const msg = `    ✅ Created slides entry for chapter: "${chapterId}"`;
              console.log(msg);
              debugLogs.push(msg);
            }
          } catch (slideError) {
            const msg = `    ❌ Error creating slides for chapter "${chapterId}": ${slideError.message}`;
            console.log(msg);
            debugLogs.push(msg);
          }
        }
      }
    }

    const response = {
      success: true,
      message: "Level created successfully",
      level: newLevel,
      slideCreationCount,
      createdSlidesEntries: createdSlides,
      debug: debugLogs
    };

    console.log(`✅ Level creation completed. Created ${slideCreationCount} slide entries.`);
    res.status(201).json(response);
    
  } catch (err) {
    console.error('❌ Error in createLevel:', err);
    res.status(500).json({ 
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};





























exports.updateLevel = async (req, res) => {
  let level = null;

  try {
    console.log("📥 PATCH /update/:levelId called");
    console.log("Request params:", req.params);
    console.log("Request body:", JSON.stringify(req.body, null, 2));

    const { levelId } = req.params;
    const { lang, updates } = req.body;

    if (!levelId) return res.status(400).json({ error: "levelId parameter is required" });
    if (!lang) return res.status(400).json({ error: "lang field is required" });
    if (!updates || !Array.isArray(updates)) {
      return res.status(400).json({
        error: "updates field must be an array",
        received: typeof updates
      });
    }

    console.log(`🔍 Looking for level with ID: ${levelId}`);
    level = await Level.findById(levelId);
    if (!level) return res.status(404).json({ error: "Level not found" });

    console.log(`✅ Found level: ${level.levelName?.english || 'Unknown'}`);

    let chapterNameChanges = [];
    let debugLogs = [];
    let updateCount = 0;

    // Process each update
    for (const [index, update] of updates.entries()) {
      console.log(`🔄 Processing update ${index + 1}/${updates.length}:`, update);

      const { type, oldName, newName } = update;
      if (!type || !oldName || !newName) {
        debugLogs.push(`⚠️ Invalid update object at index ${index}`);
        continue;
      }

      switch (type) {
        case "level":
          if (level.levelName && level.levelName[lang] && matchesName(level.levelName[lang], oldName)) {
            const updatedLevelName = { ...level.levelName.toObject?.() || level.levelName };
            updatedLevelName[lang] = newName;
            level.levelName = updatedLevelName;
            updateCount++;
            debugLogs.push(`✅ Updated level name from "${oldName}" to "${newName}"`);
          }
          break;

        case "category":
          level.categories = level.categories.map(cat => {
            if (cat.categoryName && cat.categoryName[lang] && matchesName(cat.categoryName[lang], oldName)) {
              const updatedCatName = { ...cat.categoryName.toObject?.() || cat.categoryName };
              updatedCatName[lang] = newName;
              return { ...cat.toObject?.() || cat, categoryName: updatedCatName };
            }
            return cat;
          });
          updateCount++;
          debugLogs.push(`✅ Updated category from "${oldName}" to "${newName}"`);
          break;

        case "lesson":
          level.categories = level.categories.map(cat => {
            const updatedLessons = cat.lessons.map(les => {
              if (les.lessonTitle && les.lessonTitle[lang] && matchesName(les.lessonTitle[lang], oldName)) {
                const updatedLessonTitle = { ...les.lessonTitle.toObject?.() || les.lessonTitle };
                updatedLessonTitle[lang] = newName;
                return { ...les.toObject?.() || les, lessonTitle: updatedLessonTitle };
              }
              return les;
            });
            return { ...cat.toObject?.() || cat, lessons: updatedLessons };
          });
          updateCount++;
          debugLogs.push(`✅ Updated lesson from "${oldName}" to "${newName}"`);
          break;

        case "chapter":
          level.categories = level.categories.map(cat => {
            const updatedLessons = cat.lessons.map(les => {
              const updatedChapters = les.Chapters.map(chap => {
                if (chap.ChapterTitle && chap.ChapterTitle[lang] && matchesName(chap.ChapterTitle[lang], oldName)) {
                  const oldCleanName = cleanTitle(oldName);
                  const newCleanName = cleanTitle(newName);

                  const updatedChapterTitle = { ...chap.ChapterTitle.toObject?.() || chap.ChapterTitle };
                  updatedChapterTitle[lang] = newName;

                  if (oldCleanName !== newCleanName) {
                    chapterNameChanges.push({ lang, oldName: oldCleanName, newName: newCleanName });
                  }

                  return { ...chap.toObject?.() || chap, ChapterTitle: updatedChapterTitle };
                }
                return chap;
              });
              return { ...les.toObject?.() || les, Chapters: updatedChapters };
            });
            return { ...cat.toObject?.() || cat, lessons: updatedLessons };
          });
          updateCount++;
          debugLogs.push(`✅ Updated chapter from "${oldName}" to "${newName}"`);
          break;
      }
    }

    let updatedDoc = null;

    if (updateCount > 0) {
      level.markModified('categories');
      level.markModified('levelName');
      console.log(`💾 Saving level with ${updateCount} updates...`);
      await level.save();

      updatedDoc = await Level.findById(level._id);
      debugLogs.push(`📦 DB after save: ${JSON.stringify(updatedDoc.levelName)}`);
    } else {
      debugLogs.push("⚠️ No updates were applied to the level");
    }

    // Update slides for chapter name changes
    let slideUpdateCount = 0;
    if (chapterNameChanges.length > 0) {
      for (const change of chapterNameChanges) {
        const result = await SlideContent.updateMany(
          { chapterId: change.oldName },
          { $set: { chapterId: change.newName } }
        );
        slideUpdateCount += result.modifiedCount;
        debugLogs.push(`🔄 Updated ${result.modifiedCount} slides from "${change.oldName}" to "${change.newName}"`);
      }
    }

    res.json({
      success: true,
      message: "Update operation completed",
      levelUpdates: updateCount,
      slideUpdates: slideUpdateCount,
      debug: debugLogs,
      updatedLevel: updatedDoc
    });

  } catch (err) {
    console.error('❌ Error in updateLevel:', err);
    res.status(500).json({ error: err.message });
  }
};







// PATCH - Update category name by level name
exports.updateCategoryByLevelName = async (req, res) => {
  try {
    const { levelName, lang, oldCategory, newCategory } = req.body;

    if (!levelName || !lang || !oldCategory || !newCategory) {
      return res.status(400).json({ 
        error: "levelName, lang, oldCategory, and newCategory are required" 
      });
    }

    // Find level by name in the given language
    const level = await Level.findOne({ [`levelName.${lang}`]: levelName });
    if (!level) {
      return res.status(404).json({ error: "Level not found" });
    }

    // Find matching category and update
    let updated = false;
    for (const category of level.categories) {
      if (category.categoryName?.[lang] === oldCategory) {
        category.categoryName[lang] = newCategory;
        updated = true;
        break;
      }
    }

    if (!updated) {
      return res.status(404).json({ error: "Category not found" });
    }

    // Ensure deep changes are saved
    level.markModified('categories');
    await level.save();

    res.json({ success: true, message: "Category updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
