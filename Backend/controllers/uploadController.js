const uploadToAzure = require("../utils/azureBlob"); // <-- adjust path if needed

exports.uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Upload to Azure
    const blobUrl = await uploadToAzure(req.file);
    console.log("✅ Azure upload URL:", blobUrl);

    if (!blobUrl) {
      return res.status(500).json({
        success: false,
        message: "Azure upload failed: No URL returned",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Upload successful",
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      size: req.file.size,
      path: blobUrl, // 👈 IMPORTANT (frontend expects `path`)
    });
  } catch (error) {
    console.error("❌ Upload failed:", error);
    return res
      .status(500)
      .json({ message: "Upload failed", error: error.message });
  }
};
