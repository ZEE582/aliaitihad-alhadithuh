const express = require('express');
const { Parent, User, Child } = require('../models');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all parents
router.get('/', auth, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const parents = await Parent.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'fullName', 'email', 'phone', 'roleType']
        },
        {
          model: Child,
          as: 'children'
        }
      ]
    });
    res.json(parents);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get parent by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const parent = await Parent.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'fullName', 'email', 'phone', 'roleType']
        },
        {
          model: Child,
          as: 'children'
        }
      ]
    });
    
    if (!parent) {
      return res.status(404).json({ message: 'Parent not found' });
    }

    // Parents can only view their own profile
    if (req.user.roleType === 'parent' && parent.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(parent);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create parent profile
router.post('/', auth, authorize('admin'), async (req, res) => {
  try {
    const parent = await Parent.create(req.body);
    
    const newParent = await Parent.findByPk(parent.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'fullName', 'email', 'phone', 'roleType']
        }
      ]
    });
    
    res.status(201).json(newParent);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update parent
router.put('/:id', auth, async (req, res) => {
  try {
    const parent = await Parent.findByPk(req.params.id);
    if (!parent) {
      return res.status(404).json({ message: 'Parent not found' });
    }

    await parent.update(req.body);
    
    const updatedParent = await Parent.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'fullName', 'email', 'phone', 'roleType']
        }
      ]
    });

    res.json(updatedParent);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
