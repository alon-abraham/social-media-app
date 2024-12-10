import express from 'express';
import Follow from '../models/Follow.js';
import User from '../models/User.js';
import { verifyToken } from '../middleware/auth.js';
import { sendFollowNotification } from '../utils/mailer.js';

const router = express.Router();

// Follow a User
router.post('/:id/follow', verifyToken, async (req, res) => {
  try {
    const targetUserId = req.params.id;

    // Check if already following
    const existingFollow = await Follow.findOne({
      follower: req.user.id,
      following: targetUserId,
    });

    if (existingFollow) return res.status(400).json('Already following this user.');

    // Save new follow relationship
    const newFollow = new Follow({
      follower: req.user.id,
      following: targetUserId,
    });
    await newFollow.save();

    // Update user's follower count
    const followedUser = await User.findByIdAndUpdate(
      targetUserId,
      { $inc: { followers: 1 } },
      { new: true }
    );

    // Send email notification
    sendFollowNotification(followedUser.email, req.user.username);

    res.status(200).json('Followed successfully.');
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// Unfollow a User
router.delete('/:id/unfollow', verifyToken, async (req, res) => {
  try {
    const targetUserId = req.params.id;

    const follow = await Follow.findOneAndDelete({
      follower: req.user.id,
      following: targetUserId,
    });

    if (!follow) return res.status(400).json("You don't follow this user.");

    // Update user's follower count
    await User.findByIdAndUpdate(targetUserId, { $inc: { followers: -1 } });

    res.status(200).json('Unfollowed successfully.');
  } catch (err) {
    res.status(500).json(err.message);
  }
});

export default router;
