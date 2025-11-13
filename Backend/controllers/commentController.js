const Post = require("../models/Post");
const Comment = require("../models/Comment");
const User = require("../models/User");

//  Create a comment or reply
exports.createComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId, content, parentCommentId } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ success: false, message: "Invalid userId" });

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });

    const depth = parentCommentId ? 1 : 0;

    const comment = new Comment({
      postId,
      parentCommentId: parentCommentId || null,
      content,
      depth,
      author: {
        userId: user._id,
        username: user.username,
        displayName: user.username,
        profilePic: user.profilePic || ""
      }
    });

    await comment.save();

    post.commentCount += 1;
    await post.save();

    if (parentCommentId) {
      await Comment.findByIdAndUpdate(parentCommentId, { $inc: { replyCount: 1 } });
    }

    res.status(201).json({ success: true, message: "Comment added", data: comment });
  } catch (error) {
    console.error("Create Comment Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//  Update a comment
exports.updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { userId, content } = req.body;

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ success: false, message: "Comment not found" });

    if (comment.author.userId.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    comment.editHistory.push({ editedAt: new Date(), previousContent: comment.content });
    comment.content = content;
    comment.updatedAt = new Date();

    await comment.save();

    res.status(200).json({ success: true, message: "Comment updated", data: comment });
  } catch (error) {
    console.error("Update Comment Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//  Delete a comment (soft delete)
exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { userId } = req.body;

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ success: false, message: "Comment not found" });

    if (comment.author.userId.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    comment.isDeleted = true;
    comment.content = "[deleted]";
    await comment.save();

    res.status(200).json({ success: true, message: "Comment deleted" });
  } catch (error) {
    console.error("Delete Comment Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//  Vote on a comment
exports.voteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { userId, voteType } = req.body;

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ success: false, message: "Comment not found" });

    comment.userVotes = comment.userVotes.filter(v => v.userId.toString() !== userId);

    if (voteType !== "remove") {
      comment.userVotes.push({ userId, voteType });
    }

    comment.votes.upvotes = comment.userVotes.filter(v => v.voteType === "upvote").length;
    comment.votes.downvotes = comment.userVotes.filter(v => v.voteType === "downvote").length;
    comment.votes.score = comment.votes.upvotes - comment.votes.downvotes;

    await comment.save();

    res.status(200).json({ success: true, data: { votes: comment.votes, userVote: voteType } });
  } catch (error) {
    console.error("Vote Comment Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
