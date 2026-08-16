const express = require('express');
const { Subject, Teacher, Class } = require('../models');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all subjects
router.get('/', auth, async (req, res) => {
  try {
    const subjects = await Subject.findAll({
      include: [
        {
          model: Teacher,
          as: 'teacher',
          attributes: ['id', 'fullName']
        },
        {
          model: Class,
          as: 'class',
          attributes: ['id', 'name', 'level']
        }
      ]
    });
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get subject by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const subject = await Subject.findByPk(req.params.id, {
      include: [
        {
          model: Teacher,
          as: 'teacher',
          attributes: ['id', 'fullName', 'email', 'phone']
        },
        {
          model: Class,
          as: 'class',
          attributes: ['id', 'name', 'level']
        }
      ]
    });
    
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    res.json(subject);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new subject (admin and teacher only)
router.post('/', auth, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const subject = await Subject.create(req.body);
    
    const newSubject = await Subject.findByPk(subject.id, {
      include: [
        {
          model: Teacher,
          as: 'teacher',
          attributes: ['id', 'fullName']
        },
        {
          model: Class,
          as: 'class',
          attributes: ['id', 'name', 'level']
        }
      ]
    });
    
    res.status(201).json(newSubject);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update subject
router.put('/:id', auth, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const subject = await Subject.findByPk(req.params.id);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    await subject.update(req.body);
    
    const updatedSubject = await Subject.findByPk(req.params.id, {
      include: [
        {
          model: Teacher,
          as: 'teacher',
          attributes: ['id', 'fullName']
        },
        {
          model: Class,
          as: 'class',
          attributes: ['id', 'name', 'level']
        }
      ]
    });

    res.json(updatedSubject);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete subject (admin only)
router.delete('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const subject = await Subject.findByPk(req.params.id);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    await subject.destroy();
    res.json({ message: 'Subject deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
