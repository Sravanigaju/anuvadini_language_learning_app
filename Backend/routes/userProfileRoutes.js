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


router.patch("/:id/coins", userProfileController.updateUserCoins); //curl -X PATCH http://localhost:3000/api/userprofile/<USER_ID>/coins \  -H "Content-Type: application/json" \ -d '{"action": "increase", "amount": 20}'



module.exports = router;
