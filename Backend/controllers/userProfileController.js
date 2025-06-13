const UserProfile = require("../models/UserProfile");
const User = require("../models/User");
const mongoose = require("mongoose");

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

// ✅ Create or update a user profile by userId (Minimal Response)
exports.createUserProfile = async (req, res) => {
  try {
    const { userId, ...rest } = req.body;

    await UserProfile.findOneAndUpdate(
      { userId },
      { $set: rest },
      { new: true, upsert: true }
    );

    res.status(200).json({
      message: "User profile created or updated successfully",
      success: true
    });
  } catch (error) {
    res.status(400).json({ message: error.message, success: false });
  }
};

// Update user profile by MongoDB ID
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



exports.updateUserCoins = async (req, res) => {
  const { userId } = req.params;
  const { action, amount } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }

  if (!["increase", "decrease"].includes(action)) {
    return res.status(400).json({ message: "Action must be 'increase' or 'decrease'" });
  }

  if (typeof amount !== "number" || amount <= 0) {
    return res.status(400).json({ message: "Amount must be a positive number" });
  }

  // Start a new MongoDB session for the transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    console.log('Attempting to update coins for userId:', userId);
    let cleanUserId = String(userId).trim();
    let user = null;
    
    // Strategy 1: Try direct string match on userId field
    user = await UserProfile.findOne({ userId: cleanUserId });
    
    // Strategy 2: If the ID is a valid ObjectId, try more comprehensive search
    if (!user && mongoose.Types.ObjectId.isValid(cleanUserId)) {
      const objectId = new mongoose.Types.ObjectId(cleanUserId);
      user = await UserProfile.findOne({
        $or: [
          { userId: objectId },
          { _id: objectId }
        ]
      });
    }

    // Strategy 3: As a last resort, try string match on _id field
    if (!user) {
      user = await UserProfile.findOne({ _id: cleanUserId });
    }

    if (!user) {
      console.log('User not found. Attempted with userId:', userId);
      return res.status(404).json({ message: "User not found" });
    }
    
    console.log('Found user:', { id: user._id, userId: user.userId });

    // Initialize coins if they don't exist
    if (!user.dashboardStats) {
      user.dashboardStats = {};
    }
    if (!user.dashboardStats.coins) {
      user.dashboardStats.coins = { total: 0 };
    }    // Update coins
    if (action === "increase") {
      user.dashboardStats.coins.total += amount;
    } else {
      user.dashboardStats.coins.total = Math.max(0, user.dashboardStats.coins.total - amount);
    }
    
    // Save the user document within the transaction
    await user.save({ session });
    
    // Commit the transaction
    await session.commitTransaction();
    console.log('Coins updated successfully:', { 
      userId: user._id, 
      newTotal: user.dashboardStats.coins.total 
    });

    res.status(200).json({
      message: `Coins ${action}d successfully`,
      totalCoins: user.dashboardStats.coins.total,
    });
  } catch (error) {
    // If an error occurs, abort the transaction
    await session.abortTransaction();
    console.error('Error updating coins:', error);
    res.status(500).json({ message: error.message });
  } finally {
    // End the session
    await session.endSession();
  }
};


// ✅ Get basic user info by userId
exports.getBasicUserInfo = async (req, res) => {
  try {
    const userId = req.params.userId;

    const [user, profile] = await Promise.all([
      User.findById(userId).select("username phoneNumber"),
      UserProfile.findOne({ userId }).select("firstName lastName profilePic")
    ]);

    if (!user || !profile) {
      return res.status(404).json({ message: "User or profile not found", success: false });
    }

    res.status(200).json({
      success: true,
      data: {
        username: user.username,
        mobileNumber: user.phoneNumber,
        firstName: profile.firstName,
        lastName: profile.lastName,
        profilePic: profile.profilePic
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};