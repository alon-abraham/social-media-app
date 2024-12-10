import express from 'express';
import Chat from '../models/Chat.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Save Message
router.post('/send', verifyToken, async (req, res) => {
  try {
    const { receiver, message } = req.body;

    const newMessage = new Chat({
      sender: req.user.id,
      receiver,
      message,
    });

    await newMessage.save();
    res.status(201).json('Message sent!');
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// Get Chat History
router.get('/:userId', verifyToken, async (req, res) => {
  try {
    const messages = await Chat.find({
      $or: [
        { sender: req.user.id, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.user.id },
      ],
    }).sort('createdAt');

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

export default router;
