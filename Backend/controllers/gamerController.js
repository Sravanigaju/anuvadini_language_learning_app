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

// Add new game stat entry
exports.addGameStat = async (req, res) => {
  try {
    const gamer = await Gamer.findOneAndUpdate(
      { userId: req.params.userId },
      { $push: { gameStats: req.body } },
      { new: true }
    );
    if (!gamer) return res.status(404).json({ message: 'Gamer not found' });
    res.json(gamer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update game metrics after a game (PATCH)
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

    // Add new game stat if provided
    if (score !== undefined || timeTaken !== undefined || category_level !== undefined) {
      gamer.gameStats.push({
        score: score || 0,
        timeTaken: timeTaken || 0,
        category_level: category_level || 0
      });
    }

    await gamer.save();
    res.status(200).json({ message: "Game metrics updated", gamer });

  } catch (error) {
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
