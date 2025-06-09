const UserProfile = require("../models/UserProfile");

// Get all user profiles
exports.getAllUserProfiles = async (req, res) => {
  try {
    const profiles = await UserProfile.find().populate("userId");
    res.status(200).json(profiles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user profile by ID
exports.getUserProfileById = async (req, res) => {
  try {
    const profile = await UserProfile.findById(req.params.id).populate("userId");
    if (!profile)
      return res.status(404).json({ message: "User profile not found" });
    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

// Create a new user profile
exports.createUserProfile = async (req, res) => {
  try {
    const newProfile = new UserProfile(req.body);
    const savedProfile = await newProfile.save();
    res.status(201).json({message: "User profile created successfully", success: true, userId: savedProfile.userId});
  } catch (error) {
    res.status(400).json({ message: error.message, success: false });
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const updatedProfile = await UserProfile.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedProfile)
      return res.status(404).json({ message: "User profile not found" });
    res.status(200).json(updatedProfile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update user points
exports.updateUserPoints = async (req, res) => {
  const { id } = req.params;
  const { total, breakdown } = req.body;

  try {
    const updateFields = {};
    if (typeof total === "number") updateFields["points.total"] = total;
    if (typeof breakdown === "object") updateFields["points.breakdown"] = breakdown;

    const updatedProfile = await UserProfile.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }

    res.status(200).json(updatedProfile);
  } catch (error) {
    console.error("Error updating points:", error);
    res.status(500).json({ message: error.message });
  }
};

// Delete user profile
exports.deleteUserProfile = async (req, res) => {
  try {
    const deletedProfile = await UserProfile.findByIdAndDelete(req.params.id);
    if (!deletedProfile)
      return res.status(404).json({ message: "User profile not found" });
    res.status(200).json({ message: "User profile deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
