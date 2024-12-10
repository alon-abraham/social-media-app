import express from 'express';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Create Post
router.post('/', verifyToken, async (req, res) => {
  try {
    const newPost = new Post({ ...req.body, user: req.user.id });
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// Get All Posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate('user', 'username');
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// Delete Post
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.user.toString() !== req.user.id)
      return res.status(403).json('You can delete only your posts!');
    await post.delete();
    res.status(200).json('Post deleted.');
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// Add Comment
router.post('/:id/comments', verifyToken, async (req, res) => {
  try {
    const newComment = new Comment({
      text: req.body.text,
      post: req.params.id,
      user: req.user.id
    });
    const savedComment = await newComment.save();
    res.status(201).json(savedComment);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

export default router;
