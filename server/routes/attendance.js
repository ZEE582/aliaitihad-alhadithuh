const express = require('express');
const { Attendance, Child, Session, User } = require('../models');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all attendance records
router.get('/', auth, async (req, res) => {
  try {
    const { childId, sessionId, date, status } = req.query;
    let where = {};

    if (childId) where.childId = childId;
    if (sessionId) where.sessionId = sessionId;
    if (date) where.date = new Date(date);
    if (status) where.status = status;

    const attendance = await Attendance.findAll({
      where,
      include: [
        {
          model: Child,
          as: 'child',
          attributes: ['id', 'firstName', 'lastName']
        },
        {
          model: Session,
          as: 'session',
          attributes: ['id', 'topic', 'date']
        },
        {
          model: User,
          as: 'marker',
          attributes: ['id', 'fullName']
        }
      ],
      order: [['date', 'DESC']]
    });

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get attendance by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const attendance = await Attendance.findByPk(req.params.id, {
      include: [
        {
          model: Child,
          as: 'child',
          attributes: ['id', 'firstName', 'lastName']
        },
        {
          model: Session,
          as: 'session',
          attributes: ['id', 'topic', 'date']
        },
        {
          model: User,
          as: 'marker',
          attributes: ['id', 'fullName']
        }
      ]
    });
    
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create attendance record (admin and teacher only)
router.post('/', auth, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const attendance = await Attendance.create({
      ...req.body,
      markedBy: req.user.id
    });
    
    const newAttendance = await Attendance.findByPk(attendance.id, {
      include: [
        {
          model: Child,
          as: 'child',
          attributes: ['id', 'firstName', 'lastName']
        },
        {
          model: Session,
          as: 'session',
          attributes: ['id', 'topic', 'date']
        },
        {
          model: User,
          as: 'marker',
          attributes: ['id', 'fullName']
        }
      ]
    });
    
    res.status(201).json(newAttendance);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update attendance
router.put('/:id', auth, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const attendance = await Attendance.findByPk(req.params.id);
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    await attendance.update(req.body);
    
    const updatedAttendance = await Attendance.findByPk(req.params.id, {
      include: [
        {
          model: Child,
          as: 'child',
          attributes: ['id', 'firstName', 'lastName']
        },
        {
          model: Session,
          as: 'session',
          attributes: ['id', 'topic', 'date']
        },
        {
          model: User,
          as: 'marker',
          attributes: ['id', 'fullName']
        }
      ]
    });

    res.json(updatedAttendance);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete attendance (admin only)
router.delete('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const attendance = await Attendance.findByPk(req.params.id);
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }
    await attendance.destroy();
    res.json({ message: 'Attendance record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
