const express = require('express');
const childService = require('../services/ChildService');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all children
router.get('/', auth, async (req, res) => {
  try {
    const children = await childService.getAllChildren(req.user.roleType, req.user.id);
    res.json(children);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get child by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const child = await childService.getChildById(req.params.id, req.user.roleType, req.user.id);
    res.json(child);
  } catch (error) {
    if (error.message === 'Child not found') {
      return res.status(404).json({ message: error.message });
    }
    if (error.message === 'Not authorized') {
      return res.status(403).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new child (admin and teacher only)
router.post('/', auth, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const child = await childService.createChild(req.body);
    res.status(201).json(child);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update child
router.put('/:id', auth, async (req, res) => {
  try {
    const child = await childService.updateChild(req.params.id, req.body);
    res.json(child);
  } catch (error) {
    if (error.message === 'Child not found') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete child (admin only)
router.delete('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const result = await childService.deleteChild(req.params.id);
    res.json(result);
  } catch (error) {
    if (error.message === 'Child not found') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
