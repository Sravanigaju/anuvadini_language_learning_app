# JSON Import Script for Levels and Slides

This script imports data from `levels.json` and `slides.json` files into your MongoDB database.

## Setup

1. Make sure both files are in the Backend directory:
   - `levels.json`
   - `slides.json`

2. Make sure these files follow the correct format (see examples below).

## Running the Script

From your Backend directory, run:

```bash
node importJson.js
```

## JSON File Formats

### levels.json

This file should contain an array of level objects with the following structure:

```json
[
  {
    "languageId": "<MongoDB ObjectId of the language>", 
    "order": 1,
    "name": {
      "default": "Level name in default language",
      "translations": {
        "hi": "Level name in Hindi",
        "ta": "Level name in Tamil",
        ...
      }
    }
  },
  ...
]
```

### slides.json

This file should contain an array of slide objects with the following structure:

```json
[
  {
    "chapterId": "<MongoDB ObjectId of the chapter>",
    "order": 1,
    "type": "text|image|audio|video|quiz",
    "content": {
      "default": "Content in default language or URL",
      "translations": {
        "hi": "Content in Hindi or URL",
        "ta": "Content in Tamil or URL",
        ...
      }
    }
  },
  ...
]
```

## Important Notes

1. The `languageId` in `levels.json` should be a valid MongoDB ObjectId that exists in your Language collection.
2. The `chapterId` in `slides.json` should be a valid MongoDB ObjectId that exists in your Chapter collection.
3. Make sure the MongoDB connection string in your `.env` file is correct.
4. The script will attempt to import both files and will report any errors.
