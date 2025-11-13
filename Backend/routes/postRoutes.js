const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");


// Posts
router.get("/", postController.getPosts);
router.post("/", postController.createPost);
router.get("/:postId", postController.getPostById);
router.put("/:postId",  postController.updatePost);
router.delete("/:postId",  postController.deletePost);

// Voting
router.post("/:postId/vote",  postController.votePost);

// My Posts
router.get("/user/:userId",  postController.getUserPosts);

module.exports = router;
