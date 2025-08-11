// controllers/versionController.js
const Level = require('../models/LevelModel');
const SlideContent = require('../models/SlideContent');

exports.getContentVersions = async (req, res) => {
  try {
    const latestLevel = await Level.findOne().sort({ updatedAt: -1 }).select('updatedAt').lean();
    const latestSlide = await SlideContent.findOne().sort({ updatedAt: -1 }).select('updatedAt').lean();
    
    res.json({
      levelsVersion: latestLevel?.updatedAt?.toISOString() || null,
      slidesVersion: latestSlide?.updatedAt?.toISOString() || null
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
