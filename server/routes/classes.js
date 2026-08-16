const express = require('express');
const { Class, Teacher } = require('../models');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all classes
router.get('/', auth, async (req, res) => {
  try {
    const classes = await Class.findAll({
      include: [
        {
          model: Teacher,
          as: 'teacher',
          attributes: ['id', 'fullName']
        }
      ],
      order: [['level', 'ASC'], ['name', 'ASC']]
    });
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get class by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const classData = await Class.findByPk(req.params.id, {
      include: [
        {
          model: Teacher,
          as: 'teacher',
          attributes: ['id', 'fullName', 'email', 'phone']
        }
      ]
    });
    
    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }

    res.json(classData);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new class (admin only)
router.post('/', auth, authorize('admin'), async (req, res) => {
  try {
    const classData = await Class.create(req.body);
    
    const newClass = await Class.findByPk(classData.id, {
      include: [
        {
          model: Teacher,
          as: 'teacher',
          attributes: ['id', 'fullName']
        }
      ]
    });
    
    res.status(201).json(newClass);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update class
router.put('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const classData = await Class.findByPk(req.params.id);
    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }

    await classData.update(req.body);
    
    const updatedClass = await Class.findByPk(req.params.id, {
      include: [
        {
          model: Teacher,
          as: 'teacher',
          attributes: ['id', 'fullName']
        }
      ]
    });

    res.json(updatedClass);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete class (admin only)
router.delete('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const classData = await Class.findByPk(req.params.id);
    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }
    await classData.destroy();
    res.json({ message: 'Class deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
