import express from 'express';
import Notification from '../models/Notification.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Create Notification
router.post('/create', verifyToken, async (req, res) => {
  try {
    const { user, message, type } = req.body;

    const newNotification = new Notification({
      user,
      message,
      type,
    });

    await newNotification.save();
    res.status(201).json('Notification created!');
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// Get Notifications
router.get('/', verifyToken, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id }).sort('-createdAt');
    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// Mark Notification as Read
router.patch('/:id/read', verifyToken, async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.status(200).json('Notification marked as read.');
  } catch (err) {
    res.status(500).json(err.message);
  }
});

export default router;
