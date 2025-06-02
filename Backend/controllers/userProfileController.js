const UserProfile = require("../models/userprofile");

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
    const profile = await UserProfile.findById(req.params.id).populate(
      "userId"
    );
    if (!profile)
      return res.status(404).json({ message: "User profile not found" });
    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new user profile
exports.createUserProfile = async (req, res) => {
  try {
    const newProfile = new UserProfile(req.body);
    const savedProfile = await newProfile.save();
    res.status(201).json(savedProfile);
  } catch (error) {
    res.status(400).json({ message: error.message });
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
