const path = require("path");

// Helper to sanitize file name
const sanitizeFileName = (filename) => {
  return filename.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_.]/g, "");
};

exports.uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Sanitize and rename
    const originalName = sanitizeFileName(req.file.originalname);
    const uniqueName = `${Date.now()}_${originalName}`;

    // req.file.buffer contains the file in memory
    // You can upload this buffer to a cloud service

    // For now, simulate uploading and return mock path
    const mockPath = `https://your-cloud.com/uploads/${uniqueName}`;

    return res.status(200).json({
      message: "Upload successful (not stored locally)",
      fileName: uniqueName,
      fileType: req.file.mimetype,
      size: req.file.size,
      path: mockPath,
    });
  } catch (error) {
    return res.status(500).json({ message: "Upload failed", error: error.message });
  }
};
