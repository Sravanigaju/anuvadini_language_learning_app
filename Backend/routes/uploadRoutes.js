const express = require('express');
const multer = require('multer');
const uploadToAzure = require('../utils/azureBlob');
require('dotenv').config();
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const sas_token = process.env.SAS_TOKEN;
router.post('/upload-profile-pic', upload.single('profilePic'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: "No file uploaded" });

    const blobUrl = await uploadToAzure(file);
    // 📝 Update the DB with the profile pic URL
    // const updatedProfile = await UserProfile.findOneAndUpdate(
    //   { userId },
    //   { $set: { profilePicUrl: blobUrl } },
    //   { new: true, upsert: true }
    // );
    

    res.json({
      success: true,
      message: 'File uploaded successfully',
      path: blobUrl,
      // sas_token : sas_token,                /// sas token is in env always     "sas_token": "?sv=2023-01-03&st=2025-06-05T09%3A30%3A27Z&se=2026-06-05T09%3A30%3A00Z&sr=c&sp=racwdxltf&sig=6f%2F%2FELTwIDLKboml9%2FcKFX%2BWxC27VWc1DTzae58o1e8%3D",
      // complete_token : blobUrl + sas_token
    });
    
  } catch (error) {
    console.error("Azure upload error:", error);
    res.status(500).json({ success: false, message: 'Upload failed', error: error.message });
  }
});

module.exports = router;
