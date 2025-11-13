const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/anuvadini_language')
.then(async () => {
  console.log('Connected to MongoDB');
  
  // Check the Levels collection
  const levelsCollection = mongoose.connection.db.collection('Levels');
  const count = await levelsCollection.countDocuments();
  console.log('Levels collection count:', count);
  
  if (count > 0) {
    const sample = await levelsCollection.findOne();
    console.log('Sample level document:');
    console.log(JSON.stringify(sample, null, 2));
    
    // Get all levels
    const allLevels = await levelsCollection.find({}).toArray();
    console.log('All levels:');
    allLevels.forEach((level, index) => {
      console.log('Level ' + (index + 1) + ':', {
        id: level._id,
        levelName: level.levelName,
        categories: level.categories ? level.categories.length + ' categories' : 'no categories'
      });
    });
  }
  
  process.exit(0);
}).catch(err => {
  console.error('Database connection error:', err);
  process.exit(1);
});
