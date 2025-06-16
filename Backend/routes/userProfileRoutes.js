const express = require("express");
const router = express.Router();
const userProfileController = require("../controllers/userProfileController");



// User profile routes
router.get("/", userProfileController.getAllUserProfiles);
router.get("/:id", userProfileController.getUserProfileById);
router.post("/", userProfileController.createUserProfile);
router.put("/:id", userProfileController.updateUserProfile);
router.delete("/:id", userProfileController.deleteUserProfile);
router.patch("/:id/points", userProfileController.updateUserPoints);
router.get("/basic/:userId", userProfileController.getBasicUserInfo);
router.get("/user/:userId", userProfileController.getUserProfileByUserId);
router.patch('/:userId', userProfileController.updateUserProfileFields);


module.exports = router;
