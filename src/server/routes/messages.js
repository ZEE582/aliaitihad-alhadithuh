const express = require('express');
const { Message, User } = require('../models');
const { auth } = require('../middleware/auth');
const { Op } = require('sequelize');

const router = express.Router();

// Get all messages for current user (sent and received)
router.get('/', auth, async (req, res) => {
  try {
    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId: req.user.id },
          { receiverId: req.user.id }
        ]
      },
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'fullName', 'email', 'roleType', 'avatar']
        },
        {
          model: User,
          as: 'receiver',
          attributes: ['id', 'fullName', 'email', 'roleType', 'avatar']
        },
        {
          model: Message,
          as: 'replyToMessage',
          attributes: ['id', 'subject', 'content', 'senderId', 'receiverId']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get sent messages
router.get('/sent', auth, async (req, res) => {
  try {
    const messages = await Message.findAll({
      where: { senderId: req.user.id },
      include: [
        {
          model: User,
          as: 'receiver',
          attributes: ['id', 'fullName', 'email', 'roleType', 'avatar']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get received messages
router.get('/inbox', auth, async (req, res) => {
  try {
    const messages = await Message.findAll({
      where: { receiverId: req.user.id },
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'fullName', 'email', 'roleType', 'avatar']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get message by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const message = await Message.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'fullName', 'email', 'roleType', 'avatar']
        },
        {
          model: User,
          as: 'receiver',
          attributes: ['id', 'fullName', 'email', 'roleType', 'avatar']
        },
        {
          model: Message,
          as: 'replyToMessage',
          attributes: ['id', 'subject', 'content', 'senderId', 'receiverId']
        }
      ]
    });
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Check if user is sender or receiver
    if (message.senderId !== req.user.id && message.receiverId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Mark as read if user is receiver
    if (message.receiverId === req.user.id && !message.isRead) {
      await message.update({ isRead: true, readAt: new Date() });
    }

    res.json(message);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new message
router.post('/', auth, async (req, res) => {
  try {
    const message = await Message.create({
      ...req.body,
      senderId: req.user.id
    });
    
    const newMessage = await Message.findByPk(message.id, {
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'fullName', 'email', 'roleType', 'avatar']
        },
        {
          model: User,
          as: 'receiver',
          attributes: ['id', 'fullName', 'email', 'roleType', 'avatar']
        }
      ]
    });
    
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark message as read
router.put('/:id/read', auth, async (req, res) => {
  try {
    const message = await Message.findByPk(req.params.id);
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    if (message.receiverId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await message.update({ isRead: true, readAt: new Date() });

    res.json(message);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete message
router.delete('/:id', auth, async (req, res) => {
  try {
    const message = await Message.findByPk(req.params.id);
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Only sender or receiver can delete
    if (message.senderId !== req.user.id && message.receiverId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await message.destroy();
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
