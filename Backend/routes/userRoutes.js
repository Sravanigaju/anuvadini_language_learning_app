const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { updatePassword } = require("../controllers/userController");


// User routes
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.post("/", userController.createUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);
router.post("/update-password", updatePassword);


module.exports = router;
