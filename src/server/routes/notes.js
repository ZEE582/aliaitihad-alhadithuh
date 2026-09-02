const express = require('express');
const { Note, Child, Class, User } = require('../models');
const { auth, authorize } = require('../middleware/auth');
const { Op } = require('sequelize');

const router = express.Router();

// Get all notes
router.get('/', auth, async (req, res) => {
  try {
    const { childId, classId, type, priority } = req.query;
    let where = {};

    // Parents can only see notes about their children
    if (req.user.roleType === 'parent') {
      const children = await Child.findAll({
        where: { parentId: req.user.id },
        attributes: ['id']
      });
      const childIds = children.map(c => c.id);
      where.childId = { [Op.in]: childIds };
    }

    if (childId) where.childId = childId;
    if (classId) where.classId = classId;
    if (type) where.type = type;
    if (priority) where.priority = priority;

    // Hide private notes unless user is author or admin
    if (req.user.roleType !== 'admin') {
      where[Op.or] = [
        { isPrivate: false },
        { authorId: req.user.id }
      ];
    }

    const notes = await Note.findAll({
      where,
      include: [
        {
          model: Child,
          as: 'child',
          attributes: ['id', 'firstName', 'lastName']
        },
        {
          model: Class,
          as: 'class',
          attributes: ['id', 'name', 'level']
        },
        {
          model: User,
          as: 'author',
          attributes: ['id', 'fullName', 'roleType']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get note by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findByPk(req.params.id, {
      include: [
        {
          model: Child,
          as: 'child',
          attributes: ['id', 'firstName', 'lastName']
        },
        {
          model: Class,
          as: 'class',
          attributes: ['id', 'name', 'level']
        },
        {
          model: User,
          as: 'author',
          attributes: ['id', 'fullName', 'roleType']
        }
      ]
    });
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Check privacy
    if (note.isPrivate && note.authorId !== req.user.id && req.user.roleType !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this note' });
    }

    res.json(note);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new note
router.post('/', auth, async (req, res) => {
  try {
    const note = await Note.create({
      ...req.body,
      authorId: req.user.id
    });
    
    const newNote = await Note.findByPk(note.id, {
      include: [
        {
          model: Child,
          as: 'child',
          attributes: ['id', 'firstName', 'lastName']
        },
        {
          model: Class,
          as: 'class',
          attributes: ['id', 'name', 'level']
        },
        {
          model: User,
          as: 'author',
          attributes: ['id', 'fullName', 'roleType']
        }
      ]
    });
    
    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update note
router.put('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findByPk(req.params.id);
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Only author or admin can update
    if (note.authorId !== req.user.id && req.user.roleType !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await note.update(req.body);
    
    const updatedNote = await Note.findByPk(req.params.id, {
      include: [
        {
          model: Child,
          as: 'child',
          attributes: ['id', 'firstName', 'lastName']
        },
        {
          model: Class,
          as: 'class',
          attributes: ['id', 'name', 'level']
        },
        {
          model: User,
          as: 'author',
          attributes: ['id', 'fullName', 'roleType']
        }
      ]
    });

    res.json(updatedNote);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete note
router.delete('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findByPk(req.params.id);
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Only author or admin can delete
    if (note.authorId !== req.user.id && req.user.roleType !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await note.destroy();
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
