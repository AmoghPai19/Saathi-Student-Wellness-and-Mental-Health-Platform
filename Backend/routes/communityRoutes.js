import express from 'express';
import Post from '../models/post.js';

const router = express.Router();

// GET all posts (No changes needed)
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: 'desc' });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server error while fetching posts." });
  }
});

// POST a new post (Updated)
router.post('/', async (req, res) => {
  try {
    const { authorId, content, category, isAnonymous } = req.body;
    const newPost = new Post({ authorId, content, category, isAnonymous });
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(500).json({ message: "Server error while creating post." });
  }
});

// NEW: POST to like a post
router.post('/:postId/like', async (req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(
            req.params.postId,
            { $inc: { likes: 1 } }, // Atomically increment likes by 1
            { new: true } // Return the updated document
        );
        if (!post) return res.status(404).json({ message: "Post not found." });
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: "Server error while liking post." });
    }
});

// NEW: POST to reply to a post
router.post('/:postId/reply', async (req, res) => {
    try {
        const { authorId, content } = req.body;
        const reply = { authorId, content, createdAt: new Date() };
        const post = await Post.findByIdAndUpdate(
            req.params.postId,
            { $push: { replies: reply } }, // Atomically add reply to the array
            { new: true }
        );
        if (!post) return res.status(404).json({ message: "Post not found." });
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: "Server error while replying to post." });
    }
});

export default router;