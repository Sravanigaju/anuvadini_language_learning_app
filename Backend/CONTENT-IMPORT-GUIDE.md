# Importing and Fetching Levels and Slides

This guide will help you import your levels and slides JSON data into your MongoDB database and fetch them through API endpoints.

## 1. Preparing Your JSON Files

Ensure your JSON files are correctly formatted:

### levels.json
```json
[
  {
    "languageId": "64a123456789abcdef123456", 
    "order": 1,
    "name": {
      "default": "Beginner Level",
      "translations": {
        "hi": "प्रारंभिक स्तर",
        "ta": "தொடக்க நிலை"
      }
    }
  },
  // More level objects...
]
```

### slides.json
```json
[
  {
    "chapterId": "64b123456789abcdef123456",
    "order": 1,
    "type": "text",
    "content": {
      "default": "Content text in default language",
      "translations": {
        "hi": "Content in Hindi",
        "ta": "Content in Tamil"
      }
    }
  },
  // More slide objects...
]
```

**Important**: Make sure the `languageId` and `chapterId` fields contain valid MongoDB ObjectIds that exist in your database.

## 2. Importing the Data

Run the import script:

```bash
node importFrontendData.js
```

This script will:
1. Look for your JSON files in the `frontend/data` folder
2. Parse the data
3. Import it into the corresponding MongoDB collections

## 3. API Endpoints to Fetch the Data

After importing, you can use the following API endpoints to fetch the data:

### Levels Endpoints

- `GET /api/content/levels` - Get all levels
- `GET /api/content/levels/:id` - Get a specific level by ID
- `GET /api/content/levels/language/:languageId` - Get all levels for a specific language

### Slides Endpoints

- `GET /api/content/slides` - Get all slides
- `GET /api/content/slides/:id` - Get a specific slide by ID
- `GET /api/content/slides/chapter/:chapterId` - Get all slides for a specific chapter

## 4. Testing the API

You can test the API endpoints using the provided script:

```bash
node testContentApi.js
```

This will make requests to all endpoints and log the results.

## 5. Integration in Frontend

To use this data in your frontend application, you can make API requests to these endpoints. For example:

```javascript
// Fetch all levels
fetch('/api/content/levels')
  .then(response => response.json())
  .then(data => {
    console.log('Levels:', data.data);
    // Process the levels data
  })
  .catch(error => console.error('Error fetching levels:', error));

// Fetch slides for a specific chapter
const chapterId = '64b123456789abcdef123456';
fetch(`/api/content/slides/chapter/${chapterId}`)
  .then(response => response.json())
  .then(data => {
    console.log('Slides for chapter:', data.data);
    // Process the slides data
  })
  .catch(error => console.error('Error fetching slides:', error));
```
