# JSON Import/Export Tools for Anuvadini Language Learning App

These tools allow you to import data from JSON files into the database and export data from the database to JSON files.

## Prerequisites

Make sure you have all dependencies installed:

```bash
npm install
```

## Importing JSON Data to Database

Use the import tool to load data from JSON files into the MongoDB database.

### Command Syntax

```bash
npm run import-json <model-name> <json-file-path> [--clear]
```

- `<model-name>`: The name of the model/collection (users, courses, etc.)
- `<json-file-path>`: Path to the JSON file containing the data
- `--clear` (optional): Flag to clear existing data in the collection before importing

### Examples

```bash
# Import users from JSON file without clearing existing users
npm run import-json users ./data/users.json

# Import courses from JSON file and clear existing courses first
npm run import-json courses ./data/courses.json --clear
```

### Supported Models

- users
- courses
- categories
- chapters
- lessons
- quizzes
- questions

## Exporting Database Data to JSON

Use the export tool to save data from the MongoDB database to JSON files.

### Command Syntax

```bash
npm run export-json <model-name> <output-file-path> [--query=<json-query>] [--fields=<comma-separated-fields>]
```

- `<model-name>`: The name of the model/collection (users, courses, etc.)
- `<output-file-path>`: Path where the JSON file will be saved
- `--query=<json-query>` (optional): JSON query to filter the data
- `--fields=<comma-separated-fields>` (optional): Specify fields to include in the export

### Examples

```bash
# Export all users to a JSON file
npm run export-json users ./data/exported/users.json

# Export only published courses
npm run export-json courses ./data/exported/courses.json --query='{"isPublished":true}'

# Export only specific fields from users
npm run export-json users ./data/exported/users.json --fields=name,email,role

# Export verified users with specific fields
npm run export-json users ./data/exported/users.json --query='{"isVerified":true}' --fields=name,email,role
```

## Note for Windows Users

When using Windows PowerShell, you may need to escape the quotes in your queries:

```powershell
npm run export-json users ./data/exported/users.json --query='{\"isVerified\":true}' --fields=name,email,role
```

## JSON File Format

### For importing data

The JSON file should contain either:
- An array of objects (for multiple documents)
- A single object (for a single document)

Each object should match the schema of the corresponding model.

### Sample JSON structure

```json
[
  {
    "field1": "value1",
    "field2": "value2",
    ...
  },
  {
    "field1": "value3",
    "field2": "value4",
    ...
  }
]
```

## Notes

- Make sure your MongoDB connection is properly configured in `.env` or it will use the default connection string
- The export tool automatically creates directories if they don't exist
- Password fields in user documents should be properly hashed before importing
- ObjectId references should be valid MongoDB ObjectIds
