const express = require('express');
const { Message, User, Child, Guardian, Child_Guardian, Teacher, Section } = require('../models');
const { auth } = require('../middleware/auth');
const { Op } = require('sequelize');

const router = express.Router();

async function isTeacherOfParentChild(teacherUserId, guardianId) {
  const teacher = await Teacher.findOne({ where: { userId: teacherUserId } });
  if (!teacher) return false;

  const section = await Section.findOne({
    where: { assigned_teacher_id: teacher.PersonID }
  });
  if (!section) return false;

  const children = await Child.findAll({
    where: { section_id: section.section_id },
    attributes: ['PersonID']
  });
  const childIds = children.map((c) => c.PersonID);
  if (childIds.length === 0) return false;

  const link = await Child_Guardian.findOne({
    where: { GID: guardianId, child_PersonID: { [Op.in]: childIds } }
  });

  return !!link;
}

async function getParentUserIdOfChild(childId) {
  const links = await Child_Guardian.findAll({
    where: { child_PersonID: childId },
    attributes: ['GID']
  });

  const gids = links.map((link) => link.GID);
  if (gids.length === 0) return null;

  const guardians = await Guardian.findAll({
    where: { GID: { [Op.in]: gids } },
    attributes: ['userId']
  });

  const parent = guardians.find((g) => g.userId != null);
  return parent ? parent.userId : null;
}

async function resolveMessageReceiver(sender, { receiverId, childId }) {
  if (childId != null) {
    const child = await Child.findByPk(Number(childId), {
      attributes: ['PersonID', 'section_id']
    });
    if (!child) return { error: 400, message: 'Child not found' };

    const section = await Section.findOne({
      where: { section_id: child.section_id }
    });

    if (sender.roleType === 'parent') {
      const guardian = await Guardian.findOne({ where: { userId: sender.id } });
      if (!guardian) return { error: 403, message: 'Not authorized' };

      const link = await Child_Guardian.findOne({
        where: { GID: guardian.GID, child_PersonID: child.PersonID }
      });
      if (!link) return { error: 403, message: 'Not authorized' };

      if (!section || !section.assigned_teacher_id) {
        return { error: 400, message: 'No teacher is assigned to this child section' };
      }

      const teacher = await Teacher.findOne({
        where: { PersonID: section.assigned_teacher_id }
      });
      if (!teacher || !teacher.userId) {
        return { error: 400, message: 'Child teacher has no active account' };
      }

      return { receiver: { id: teacher.userId } };
    }

    if (sender.roleType === 'teacher') {
      const teacher = await Teacher.findOne({ where: { userId: sender.id } });
      if (!teacher || !section || section.assigned_teacher_id !== teacher.PersonID) {
        return { error: 403, message: 'Not authorized' };
      }

      const parentUserId = await getParentUserIdOfChild(child.PersonID);
      if (parentUserId == null) {
        return { error: 400, message: 'Child has no linked parent account' };
      }

      return { receiver: { id: parentUserId } };
    }

    const parentUserId = await getParentUserIdOfChild(child.PersonID);
    if (parentUserId == null) {
      return { error: 400, message: 'Child has no linked parent account' };
    }

    return { receiver: { id: parentUserId } };
  }

  const receiver = await User.findByPk(receiverId, {
    attributes: ['id', 'fullName', 'roleType']
  });
  if (!receiver) return { error: 400, message: 'Receiver not found' };

  if (sender.roleType === 'parent') {
    if (receiver.roleType === 'parent') {
      return { error: 403, message: 'Not authorized' };
    }

    if (receiver.roleType === 'teacher') {
      const guardian = await Guardian.findOne({ where: { userId: sender.id } });
      if (!guardian) return { error: 403, message: 'Not authorized' };

      const allowed = await isTeacherOfParentChild(receiver.id, guardian.GID);
      if (!allowed) return { error: 403, message: 'Not authorized' };
    }
  }

  if (sender.roleType === 'teacher' && receiver.roleType === 'parent') {
    const guardian = await Guardian.findOne({ where: { userId: receiver.id } });
    if (!guardian) return { error: 403, message: 'Not authorized' };

    const allowed = await isTeacherOfParentChild(sender.id, guardian.GID);
    if (!allowed) return { error: 403, message: 'Not authorized' };
  }

  return { receiver };
}

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
          attributes: ['id', 'fullName', 'roleType', 'avatar']
        },
        {
          model: User,
          as: 'receiver',
          attributes: ['id', 'fullName', 'roleType', 'avatar']
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
          attributes: ['id', 'fullName', 'roleType', 'avatar']
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
          attributes: ['id', 'fullName', 'roleType', 'avatar']
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
          attributes: ['id', 'fullName', 'roleType', 'avatar']
        },
        {
          model: User,
          as: 'receiver',
          attributes: ['id', 'fullName', 'roleType', 'avatar']
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
    const { receiverId, childId, subject, content, replyTo } = req.body;

    if (!content || !String(content).trim()) {
      return res.status(400).json({ message: 'Message content is required' });
    }

    const resolved = await resolveMessageReceiver(req.user, {
      receiverId: Number(receiverId),
      childId
    });
    if (resolved.error) {
      return res.status(resolved.error).json({ message: resolved.message });
    }

    const message = await Message.create({
      senderId: req.user.id,
      receiverId: resolved.receiver.id,
      subject,
      content,
      replyTo
    });

    const newMessage = await Message.findByPk(message.id, {
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'fullName', 'roleType', 'avatar']
        },
        {
          model: User,
          as: 'receiver',
          attributes: ['id', 'fullName', 'roleType', 'avatar']
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
