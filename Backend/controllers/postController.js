const Post = require("../models/Post");
const Comment = require("../models/Comment");

// Create a comment or reply
exports.createComment = async (req, res) => {
  try {
    const { postId } = req.params;
    res.status(201).json({ message: `Comment added to post ${postId}`, data: req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all comments for a post
exports.getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;
    res.status(200).json({ message: `Fetched comments for post ${postId}`, data: [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a comment
exports.updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    res.status(200).json({ message: `Comment ${commentId} updated`, data: req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a comment
exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    res.status(200).json({ message: `Comment ${commentId} deleted` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Vote on a comment
exports.voteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    res.status(200).json({ message: `Voted on comment ${commentId}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// -------------------------
// Post handlers (used by routes/postRoutes.js)
// -------------------------

// Get all posts (with optional pagination)

exports.getPosts = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Math.max(1, parseInt(page)) - 1) * parseInt(limit);
    const posts = await Post.find().sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit));
    res.status(200).json({ success: true, data: posts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new post
exports.createPost = async (req, res) => {
  try {
    const payload = req.body;
    // Basic validation
    if (!payload.title || !payload.content || !payload.author || !payload.language) {
      return res.status(400).json({ error: 'title, content, author and language are required' });
    }
    const post = new Post(payload);
    await post.save();
    res.status(201).json({ success: true, data: post });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a post by id
exports.getPostById = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.status(200).json({ success: true, data: post });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a post
exports.updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const updated = await Post.findByIdAndUpdate(postId, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Post not found' });
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a post
exports.deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const deleted = await Post.findByIdAndDelete(postId);
    if (!deleted) return res.status(404).json({ error: 'Post not found' });
    res.status(200).json({ success: true, message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Vote on a post (simple upvote/downvote)
exports.votePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId, voteType } = req.body; // voteType: 'upvote' or 'downvote'
    if (!['upvote', 'downvote'].includes(voteType)) return res.status(400).json({ error: 'Invalid voteType' });

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    // remove existing vote by this user
    post.userVotes = post.userVotes.filter(v => String(v.userId) !== String(userId));
    // add new vote
    post.userVotes.push({ userId, voteType });

    // recompute counts
    const upvotes = post.userVotes.filter(v => v.voteType === 'upvote').length;
    const downvotes = post.userVotes.filter(v => v.voteType === 'downvote').length;
    post.votes.upvotes = upvotes;
    post.votes.downvotes = downvotes;
    post.votes.score = upvotes - downvotes;

    await post.save();
    res.status(200).json({ success: true, data: post.votes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get posts by a specific user
exports.getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await Post.find({ 'author.userId': userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: posts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};