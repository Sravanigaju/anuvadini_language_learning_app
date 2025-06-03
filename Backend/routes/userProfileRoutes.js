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

module.exports = router;
