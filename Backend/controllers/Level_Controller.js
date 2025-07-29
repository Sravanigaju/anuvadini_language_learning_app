const Level = require('../models/LevelModel');

// Fetch all data by levelName (supports any language field)
exports.getLevelByName = async (req, res) => {
  try {
    const { name } = req.params;
    const regex = new RegExp(name.trim(), 'i');
    const fields = [
      'english','hindi','bengali','assamese','bodo','dogri','gujarati','kannada','kashmiri','konkani','maithili','malayalam','manipuri','marathi','nepali','odia','punjabi','sanskrit','santali','sindhi','tamil','telugu','urdu'
    ];
    const orQuery = fields.map(lang => ({ [`levelName.${lang}`]: regex }));
    const levels = await Level.find({ $or: orQuery });
    res.json(levels);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Fetch all categories from all Level documents
exports.getAllCategories = async (req, res) => {
  try {
    const levels = await Level.find({}, { categories: 1, _id: 0 });
    // Flatten all categories into a single array if needed
    const allCategories = levels.flatMap(level => level.categories || []);
    res.json(allCategories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Fetch all categories for a given level name (any language, case-insensitive)
exports.getCategoriesByLevelName = async (req, res) => {
  try {
    const { name } = req.params;
    const regex = new RegExp(name.trim(), 'i');
    const fields = [
      'english','hindi','bengali','assamese','bodo','dogri','gujarati','kannada','kashmiri','konkani','maithili','malayalam','manipuri','marathi','nepali','odia','punjabi','sanskrit','santali','sindhi','tamil','telugu','urdu'
    ];
    const orQuery = fields.map(lang => ({ [`levelName.${lang}`]: regex }));
    const levels = await Level.find({ $or: orQuery }, { categories: 1, _id: 0 });
    // Flatten all categories from all matching levels
    const categories = levels.flatMap(level => level.categories || []);
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};