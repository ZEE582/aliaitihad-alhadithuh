const express = require('express');
const { Session, Subject, Class, Teacher } = require('../models');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all sessions
router.get('/', auth, async (req, res) => {
  try {
    const { classId, subjectId, teacherId, date } = req.query;
    let where = {};

    if (classId) where.classId = classId;
    if (subjectId) where.subjectId = subjectId;
    if (teacherId) where.teacherId = teacherId;
    if (date) where.date = new Date(date);

    const sessions = await Session.findAll({
      where,
      include: [
        {
          model: Subject,
          as: 'subject',
          attributes: ['id', 'name', 'code']
        },
        {
          model: Class,
          as: 'class',
          attributes: ['id', 'name', 'level']
        },
        {
          model: Teacher,
          as: 'teacher',
          attributes: ['id', 'fullName']
        }
      ],
      order: [['date', 'ASC'], ['startTime', 'ASC']]
    });

    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get session by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const session = await Session.findByPk(req.params.id, {
      include: [
        {
          model: Subject,
          as: 'subject',
          attributes: ['id', 'name', 'code', 'description']
        },
        {
          model: Class,
          as: 'class',
          attributes: ['id', 'name', 'level']
        },
        {
          model: Teacher,
          as: 'teacher',
          attributes: ['id', 'fullName', 'email', 'phone']
        }
      ]
    });
    
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.json(session);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new session (admin and teacher only)
router.post('/', auth, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const session = await Session.create(req.body);
    
    const newSession = await Session.findByPk(session.id, {
      include: [
        {
          model: Subject,
          as: 'subject',
          attributes: ['id', 'name', 'code']
        },
        {
          model: Class,
          as: 'class',
          attributes: ['id', 'name', 'level']
        },
        {
          model: Teacher,
          as: 'teacher',
          attributes: ['id', 'fullName']
        }
      ]
    });
    
    res.status(201).json(newSession);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update session
router.put('/:id', auth, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const session = await Session.findByPk(req.params.id);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    await session.update(req.body);
    
    const updatedSession = await Session.findByPk(req.params.id, {
      include: [
        {
          model: Subject,
          as: 'subject',
          attributes: ['id', 'name', 'code']
        },
        {
          model: Class,
          as: 'class',
          attributes: ['id', 'name', 'level']
        },
        {
          model: Teacher,
          as: 'teacher',
          attributes: ['id', 'fullName']
        }
      ]
    });

    res.json(updatedSession);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete session (admin only)
router.delete('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const session = await Session.findByPk(req.params.id);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    await session.destroy();
    res.json({ message: 'Session deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
