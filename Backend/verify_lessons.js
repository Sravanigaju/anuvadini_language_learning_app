const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/content/levels',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const levels = JSON.parse(data);
      
      console.log('=== COMPLETE LESSON VERIFICATION ===');
      console.log(`Found ${levels.length} levels`);
      
      levels.forEach((level, levelIndex) => {
        console.log(`\nLevel ${levelIndex + 1}: ${level.levelName?.english || 'Unknown'}`);
        console.log(`  Categories: ${level.categories?.length || 0}`);
        
        level.categories?.forEach((category, catIndex) => {
          console.log(`    Category ${catIndex + 1}: ${category.categoryName?.english || 'Unknown'}`);
          console.log(`      Lessons: ${category.lessons?.length || 0}`);
          
          category.lessons?.forEach((lesson, lessonIndex) => {
            console.log(`        Lesson ${lessonIndex + 1}: ${lesson.lessonTitle?.english || 'Unknown'}`);
            console.log(`          Chapters: ${lesson.Chapters?.length || 0}`);
            
            lesson.Chapters?.forEach((chapter, chapterIndex) => {
              console.log(`            Chapter ${chapterIndex + 1}: ${chapter.ChapterTitle?.english || 'Unknown'}`);
            });
          });
        });
      });
      
      // Count totals
      let totalLessons = 0;
      let totalChapters = 0;
      
      levels.forEach(level => {
        level.categories?.forEach(category => {
          totalLessons += category.lessons?.length || 0;
          category.lessons?.forEach(lesson => {
            totalChapters += lesson.Chapters?.length || 0;
          });
        });
      });
      
      console.log(`\n=== SUMMARY ===`);
      console.log(`Total Levels: ${levels.length}`);
      console.log(`Total Lessons: ${totalLessons}`);
      console.log(`Total Chapters: ${totalChapters}`);
      
    } catch (err) {
      console.log('JSON Parse Error:', err.message);
    }
  });
});

req.on('error', (err) => {
  console.error('Request error:', err.message);
});

req.end();
