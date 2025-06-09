const multer = require("multer");

// Store file in memory instead of saving to disk
const storage = multer.memoryStorage();

const upload = multer({ storage });

module.exports = upload;
