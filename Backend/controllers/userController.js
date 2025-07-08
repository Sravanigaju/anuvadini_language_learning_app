const User = require("../models/User");
const bcrypt = require("bcrypt");
const UserProfile = require("../models/UserProfile");
const mongoose = require("mongoose");

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    console.log("....here")
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ Delete User and Profile (if exists)
exports.deleteUserAndProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    // Force conversion to ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const deletedProfile = await UserProfile.findOneAndDelete({ userId });
    if (deletedProfile) {
      return res.status(200).json({ message: "User and profile deleted successfully" });
    } else {
      return res.status(200).json({ message: "User deleted (profile not found)" });
    }
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update user password
exports.updatePassword = async (req, res) => {
  try {
    const { userid, newPassword } = req.body;

    if (!userid || !newPassword) {
      return res.status(400).json({ message: "User ID and new password are required." });
    }

    // Find the user by MongoDB ObjectId
    const user = await User.findById(userid);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Hash the new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully." });

  } catch (error) {
    console.error("Error in updatePassword:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

