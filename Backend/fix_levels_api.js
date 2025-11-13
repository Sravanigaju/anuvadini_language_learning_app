// Quick fix for /api/content/levels endpoint
const express = require('express');
const mongoose = require('mongoose');

// Test endpoint
const app = express();

app.get('/test-levels', async (req, res) => {
  try {
    const levelsCollection = mongoose.connection.db.collection('Levels');
    const mongoLevels = await levelsCollection.find({}).toArray();
    
    // Transform complex MongoDB data to simple React Native format
    const transformedLevels = mongoLevels.map((level, index) => ({
      id: level._id.toString(),
      levelId: index + 1,
      chapter_id: index + 1,
      chapter_name: level.levelName.english || 'Chapter ' + (index + 1),
      level_name: level.levelName.english || 'Level ' + (index + 1),
      title: level.levelName.english || 'Level ' + (index + 1),
      description: 'Learn ' + (level.levelName.english || 'language basics'),
      level_number: index + 1,
      difficulty: index === 0 ? 'beginner' : index === 1 ? 'intermediate' : 'advanced',
      total_words: level.categories ? level.categories.length * 10 : 10,
      isActive: true,
      created_at: new Date().toISOString()
    }));
    
    console.log('Sending ' + transformedLevels.length + ' levels to React Native');
    res.json({ data: transformedLevels });
  } catch (error) {
    console.error('Error getting levels:', error);
    res.status(500).json({ error: 'Failed to get levels' });
  }
});

console.log('\\nTo test this fix:');
console.log('1. Add this code to your server.js file');
console.log('2. Or visit: http://localhost:3001/test-levels');
console.log('3. Copy the response format to your existing /api/content/levels endpoint');

module.exports = app;
