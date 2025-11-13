const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/language_learning_app')
.then(async () => {
  console.log('Connected to MongoDB');
  
  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log('Available collections:', collections.map(c => c.name));
  
  const possibleNames = ['levels', 'Level', 'level', 'chapters', 'Chapter', 'chapter', 'contents', 'Content'];
  
  for (const name of possibleNames) {
    try {
      const collection = mongoose.connection.db.collection(name);
      const count = await collection.countDocuments();
      console.log('Collection ' + name + ': ' + count + ' documents');
      if (count > 0) {
        const sample = await collection.findOne();
        console.log('Sample from ' + name + ':', JSON.stringify(sample, null, 2));
      }
    } catch (err) {
      // Collection doesn't exist
    }
  }
  
  process.exit(0);
}).catch(err => {
  console.error('Database connection error:', err);
  process.exit(1);
});
