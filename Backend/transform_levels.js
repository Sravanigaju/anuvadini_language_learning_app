const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/anuvadini_language')
.then(async () => {
  console.log('Connected to MongoDB');
  
  // Get the levels data
  const levelsCollection = mongoose.connection.db.collection('Levels');
  const mongoLevels = await levelsCollection.find({}).toArray();
  
  // Transform to simple format for React Native
  const transformedLevels = mongoLevels.map((level, index) => ({
    id: level._id.toString(),
    levelId: index + 1,
    chapter_id: index + 1,
    chapter_name: level.levelName.english || 'Chapter ' + (index + 1),
    level_name: level.levelName.english || 'Level ' + (index + 1),
    title: level.levelName.english || 'Level ' + (index + 1),
    description: 'Learn ' + (level.levelName.english || 'basics'),
    level_number: index + 1,
    difficulty: index === 0 ? 'beginner' : index === 1 ? 'intermediate' : 'advanced',
    total_words: level.categories ? level.categories.length * 10 : 10,
    isActive: true,
    created_at: new Date().toISOString()
  }));
  
  console.log('\\nTransformed levels for React Native:');
  console.log(JSON.stringify(transformedLevels, null, 2));
  
  console.log('\\nAPI Response format:');
  console.log(JSON.stringify({ data: transformedLevels }, null, 2));
  
  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
