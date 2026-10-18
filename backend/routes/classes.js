const express = require('express');
const { Class, Teacher, Section, Child } = require('../models');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all classes
router.get('/', auth, async (req, res, next) => {
  try {
    const classes = await Class.findAll({
      order: [['className', 'ASC']]
    });
    res.json(classes);
  } catch (error) {
    error.status = 500;
    error.publicMessage = 'Server error';
    return next(error);
  }
});

// Get class by ID
router.get('/:id', auth, async (req, res, next) => {
  try {
    const { Section, Teacher, Person } = require('../models');
    const classData = await Class.findByPk(req.params.id, {
      include: [
        {
          model: Section,
          as: 'sections',
          include: [
            {
              model: Teacher,
              as: 'assignedTeacher',
              include: [{ model: Person, as: 'person', attributes: ['PersonID', 'Name'] }]
            }
          ]
        }
      ]
    });
    
    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }

    res.json(classData);
  } catch (error) {
    error.status = 500;
    error.publicMessage = 'Server error';
    return next(error);
  }
});

// Create new class (admin only)
router.post('/', auth, authorize('admin'), async (req, res, next) => {
  try {
    const className = req.body.className || req.body.name;
    if (!className) {
      return res.status(400).json({ message: 'Class name is required (className)' });
    }
    const classData = await Class.create({ className });
    res.status(201).json(classData);
  } catch (error) {
    error.status = 500;
    error.publicMessage = 'Server error';
    return next(error);
  }
});

// Update class
router.put('/:id', auth, authorize('admin'), async (req, res, next) => {
  try {
    const classData = await Class.findByPk(req.params.id);
    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }

    const { className, name } = req.body;
    const newName = className !== undefined ? className : name;
    if (newName !== undefined) {
      await classData.update({ className: newName });
    }

    res.json(classData);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'Class name already exists' });
    }
    error.status = 500;
    error.publicMessage = 'Failed to update class';
    return next(error);
  }
});

// Delete class (admin only)
router.delete('/:id', auth, authorize('admin'), async (req, res, next) => {
  try {
    const classData = await Class.findByPk(req.params.id);
    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }

    const childCount = await Child.count({ where: { classID: classData.classID } });
    const sectionCount = await Section.count({ where: { classID: classData.classID } });
    if (childCount > 0 || sectionCount > 0) {
      return res.status(409).json({ message: 'Class has children or sections and cannot be deleted' });
    }

    await classData.destroy();
    res.json({ message: 'Class deleted successfully' });
  } catch (error) {
    error.status = 500;
    error.publicMessage = 'Failed to delete class';
    return next(error);
  }
});

// ==========================================
// ClassRoom - ClassSession Junction Endpoints (hosts)
// ==========================================

const { ClassRoom_ClassSession, classSession } = require('../models');

// GET /api/classes/:id/sessions - Get sessions associated with this classroom
router.get('/:id/sessions', auth, async (req, res, next) => {
  try {
    const classID = req.params.id;
    const room = await Class.findByPk(classID, {
      include: [
        {
          model: classSession,
          as: 'sessions'
        }
      ]
    });
    res.json(room ? room.sessions : []);
  } catch (error) {
    error.status = 500;
    error.publicMessage = 'Failed to fetch associated sessions';
    return next(error);
  }
});

// POST /api/classes/:id/sessions - Link session to classroom (ClassRoom hosts ClassSession)
router.post('/:id/sessions', auth, authorize('admin'), async (req, res, next) => {
  try {
    const classID = req.params.id;
    const { SessionID } = req.body;
    if (!SessionID) {
      return res.status(400).json({ message: 'SessionID is required' });
    }

    const [record, created] = await ClassRoom_ClassSession.findOrCreate({
      where: { classID, SessionID }
    });

    res.status(201).json({ message: 'Session linked to classroom successfully', record, created });
  } catch (error) {
    error.status = 500;
    error.publicMessage = 'Failed to link session to classroom';
    return next(error);
  }
});

// DELETE /api/classes/:id/sessions/:sessionId - Unlink session from classroom
router.delete('/:id/sessions/:sessionId', auth, authorize('admin'), async (req, res, next) => {
  try {
    const { id: classID, sessionId: SessionID } = req.params;
    const record = await ClassRoom_ClassSession.findOne({
      where: { classID, SessionID }
    });
    if (!record) {
      return res.status(404).json({ message: 'Link not found' });
    }
    await record.destroy();
    res.json({ message: 'Association removed successfully' });
  } catch (error) {
    error.status = 500;
    error.publicMessage = 'Failed to remove association';
    return next(error);
  }
});

module.exports = router;
