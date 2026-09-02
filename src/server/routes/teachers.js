const express = require('express');
const { Teacher, User, Class, Subject } = require('../models');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all teachers
router.get('/', auth, async (req, res) => {
  try {
    const teachers = await Teacher.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'fullName', 'email', 'phone', 'roleType']
        },
        {
          model: Class,
          as: 'classes'
        },
        {
          model: Subject,
          as: 'subjects'
        }
      ]
    });
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get teacher by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const teacher = await Teacher.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'fullName', 'email', 'phone', 'roleType']
        },
        {
          model: Class,
          as: 'classes'
        },
        {
          model: Subject,
          as: 'subjects'
        }
      ]
    });
    
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    res.json(teacher);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create teacher profile
router.post('/', auth, authorize('admin'), async (req, res) => {
  try {
    const teacher = await Teacher.create(req.body);
    
    const newTeacher = await Teacher.findByPk(teacher.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'fullName', 'email', 'phone', 'roleType']
        }
      ]
    });
    
    res.status(201).json(newTeacher);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update teacher
router.put('/:id', auth, async (req, res) => {
  try {
    const teacher = await Teacher.findByPk(req.params.id);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    await teacher.update(req.body);
    
    const updatedTeacher = await Teacher.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'fullName', 'email', 'phone', 'roleType']
        }
      ]
    });

    res.json(updatedTeacher);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete teacher (admin only)
router.delete('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const teacher = await Teacher.findByPk(req.params.id);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    await teacher.destroy();
    res.json({ message: 'Teacher deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
