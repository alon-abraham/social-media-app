import express from 'express';
import Post from '../models/Post.js';  // Ensure the correct path to your Post model
const router = express.Router();

// Create a new post
router.post('/', async (req, res) => {
  const { title, content, image } = req.body;
  try {
    const newPost = new Post({
      title,
      content,
      image,
      user: req.user.id,  // Attach the user ID from JWT
    });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate('user', 'username');
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

export default router;
