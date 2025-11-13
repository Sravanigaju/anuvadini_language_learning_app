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
  console.log('Status:', res.statusCode);
  console.log('Content-Type:', res.headers['content-type']);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      console.log('Response is valid JSON:', parsed.length > 0 ? 'Yes' : 'No');
      console.log('Number of levels:', parsed.length);
      
      if (parsed.length > 0) {
        const firstLevel = parsed[0];
        console.log('\n=== FIRST LEVEL STRUCTURE ===');
        console.log('Level ID:', firstLevel._id);
        console.log('Level Name Keys:', Object.keys(firstLevel.levelName || {}));
        console.log('Has categories:', !!firstLevel.categories);
        console.log('Number of categories:', firstLevel.categories?.length || 0);
        
        if (firstLevel.categories && firstLevel.categories.length > 0) {
          const firstCategory = firstLevel.categories[0];
          console.log('\n=== FIRST CATEGORY STRUCTURE ===');
          console.log('Category Name Keys:', Object.keys(firstCategory.categoryName || {}));
          console.log('Has lessons:', !!firstCategory.lessons);
          console.log('Number of lessons:', firstCategory.lessons?.length || 0);
          
          if (firstCategory.lessons && firstCategory.lessons.length > 0) {
            const firstLesson = firstCategory.lessons[0];
            console.log('\n=== FIRST LESSON STRUCTURE ===');
            console.log('Lesson Title Keys:', Object.keys(firstLesson.lessonTitle || {}));
            console.log('Has Chapters:', !!firstLesson.Chapters);
            console.log('Number of Chapters:', firstLesson.Chapters?.length || 0);
            
            if (firstLesson.Chapters && firstLesson.Chapters.length > 0) {
              const firstChapter = firstLesson.Chapters[0];
              console.log('\n=== FIRST CHAPTER STRUCTURE ===');
              console.log('Chapter Title Keys:', Object.keys(firstChapter.ChapterTitle || {}));
              console.log('Sample Chapter Title (English):', firstChapter.ChapterTitle?.english || 'N/A');
            }
          }
        }
      }
    } catch (err) {
      console.log('Failed to parse JSON:', err.message);
      console.log('Raw response (first 500 chars):', data.substring(0, 500));
    }
  });
});

req.on('error', (err) => {
  console.error('Request error:', err.message);
});

req.end();
