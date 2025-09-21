import express from 'express';
import Message from '../models/message.js';

const router = express.Router();

// ## ROUTE 1: Send a new message
// METHOD: POST at /api/messages
router.post('/', async (req, res) => {
  try {
    const { senderId, receiverId, content } = req.body;

    const newMessage = new Message({
      senderId,
      receiverId,
      content
    });

    const savedMessage = await newMessage.save();
    res.status(201).json(savedMessage);

  } catch (error) {
    res.status(500).json({ message: "Server error while sending message." });
  }
});

// ## ROUTE 2: Get conversation between two users
// METHOD: GET at /api/messages/:user1Id/:user2Id
router.get('/:user1Id/:user2Id', async (req, res) => {
  try {
    const { user1Id, user2Id } = req.params;

    const messages = await Message.find({
      // Find messages where the sender/receiver pair matches either way
      $or: [
        { senderId: user1Id, receiverId: user2Id },
        { senderId: user2Id, receiverId: user1Id },
      ]
    }).sort({ createdAt: 'asc' }); // Sort by time to get the conversation in order

    res.status(200).json(messages);

  } catch (error) {
    res.status(500).json({ message: "Server error while fetching conversation." });
  }
});


export default router;