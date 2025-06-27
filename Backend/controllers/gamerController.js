const Gamer = require('../models/Gamer');

// Create a new gamer
exports.createGamer = async (req, res) => {
  try {
    const newGamer = new Gamer(req.body);
    const savedGamer = await newGamer.save();
    res.status(201).json(savedGamer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get gamer by userId
exports.getGamerByUserId = async (req, res) => {
  try {
    const gamer = await Gamer.findOne({ userId: req.params.userId });
    if (!gamer) return res.status(404).json({ message: 'Gamer not found' });
    res.json(gamer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update global stats
exports.updateGlobalStats = async (req, res) => {
  try {
    const { userId } = req.params;
    const { globalStats } = req.body;

    const gamer = await Gamer.findOne({ userId });
    if (!gamer) return res.status(404).json({ message: 'Gamer not found' });

    gamer.globalStats = globalStats;
    await gamer.save();

    res.json(gamer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ Add a new game stat only if that gameName doesn't already exist
exports.addGameStat = async (req, res) => {
  const { gameName, language, timeTaken, score, category_level } = req.body;
  const userId = req.params.userId;

  try {
    const gamer = await Gamer.findOne({ userId });
    if (!gamer) return res.status(404).json({ message: 'Gamer not found' });

    const alreadyExists = gamer.gameStats.some(stat => stat.gameName === gameName);
    if (alreadyExists) {
      return res.status(409).json({ message: `Stats for '${gameName}' already exist.` });
    }

    gamer.gameStats.push({
      gamerId: gamer._id,
      gameName,
      language,
      timeTaken,
      score,
      category_level
    });

    await gamer.save();
    res.status(200).json({ message: "Game stat added successfully", gamer });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ Update metrics like categorycount, type, language (not gameStats)
exports.updateGameMetrics = async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      categorycount,
      points,
      type,
      language,
      score,
      timeTaken,
      category_level
    } = req.body;

    const gamer = await Gamer.findOne({ userId });
    if (!gamer) return res.status(404).json({ message: 'Gamer not found' });

    if (categorycount !== undefined) gamer.categorycount = categorycount;
    if (points !== undefined) gamer.points = points;
    if (type) gamer.type = type;
    if (language) gamer.language = language;

    await gamer.save();
    res.status(200).json({ message: "Game metrics updated", gamer });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ NEW: Update specific game stat by gameName
exports.updateSpecificGameStat = async (req, res) => {
  const { userId } = req.params;
  const { gameName, updates } = req.body;

  try {
    const gamer = await Gamer.findOne({ userId });
    if (!gamer) {
      return res.status(404).json({ message: "Gamer not found" });
    }

    const statIndex = gamer.gameStats.findIndex(stat => stat.gameName === gameName);
    if (statIndex === -1) {
      return res.status(404).json({ message: `Game stat for '${gameName}' not found.` });
    }

    // Apply updates
    Object.keys(updates).forEach((key) => {
      if (gamer.gameStats[statIndex][key] !== undefined) {
        gamer.gameStats[statIndex][key] = updates[key];
      }
    });

    await gamer.save();
    res.status(200).json({ message: "Game stat updated successfully", gamer });

  } catch (error) {
    console.error("Error updating game stat:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete a gamer
exports.deleteGamer = async (req, res) => {
  try {
    const result = await Gamer.findOneAndDelete({ userId: req.params.userId });
    if (!result) return res.status(404).json({ message: 'Gamer not found' });
    res.json({ message: 'Gamer deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
