const express = require('express');
const multer = require('multer');
const uploadToAzure = require('../utils/azureBlob');
require('dotenv').config();
const router = express.Router();

const storage = multer.memoryStorage(); // Store in memory to send to Azure directly
const upload = multer({ storage: storage });
const sas_token = process.env.SAS_TOKEN;
router.post('/upload-profile-pic', upload.single('profilePic'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: "No file uploaded" });

    const blobUrl = await uploadToAzure(file);

    res.json({
      success: true,
      message: 'File uploaded successfully',
      path: blobUrl,
      sas_token : sas_token,
      complete_token : blobUrl + sas_token
    });
    
  } catch (error) {
    console.error("Azure upload error:", error);
    res.status(500).json({ success: false, message: 'Upload failed', error: error.message });
  }
});

module.exports = router;
