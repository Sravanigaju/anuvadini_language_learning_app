const express = require("express");
const router = express.Router();

const userProfileController = require("../controllers/userProfileController");
const { addNewLanguage } = require("../controllers/userProfileController");

router.post("/updateprogress/:userId",userProfileController.updateUserProgress);
router.post("/:userId/language", addNewLanguage);
router.get("/basic/:userId", userProfileController.getBasicUserInfo);
router.get("/user/:userId", userProfileController.getUserProfileByUserId);
router.patch('/:userId', userProfileController.updateUserProfileFields);
router.patch("/updateprogress/:userId", userProfileController.updateUserProgress);

// Generic CRUD routes
router.get("/", userProfileController.getAllUserProfiles);
router.get("/:id", userProfileController.getUserProfileById);
router.post("/", userProfileController.createUserProfile);
router.put("/:id", userProfileController.updateUserProfile);

router.patch("/:id/points", userProfileController.updateUserPoints);



module.exports = router;
