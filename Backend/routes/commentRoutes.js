const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");


// Comments
router.post("/:postId/comments", commentController.createComment);
router.put("/:commentId", commentController.updateComment);
router.delete("/:commentId",commentController.deleteComment);
router.post("/:commentId/vote", commentController.voteComment);

module.exports = router;
