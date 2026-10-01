const express = require('express');
const { Class, Teacher } = require('../models');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all classes
router.get('/', auth, async (req, res) => {
  try {
    const classes = await Class.findAll({
      order: [['className', 'ASC']]
    });
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get class by ID
router.get('/:id', auth, async (req, res) => {
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
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new class (admin only)
router.post('/', auth, authorize('admin'), async (req, res) => {
  try {
    const className = req.body.className || req.body.name;
    if (!className) {
      return res.status(400).json({ message: 'Class name is required (className)' });
    }
    const classData = await Class.create({ className });
    res.status(201).json(classData);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
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

// ==========================================
// ClassRoom - ClassSession Junction Endpoints (hosts)
// ==========================================

const { ClassRoom_ClassSession, classSession } = require('../models');

// GET /api/classes/:id/sessions - Get sessions associated with this classroom
router.get('/:id/sessions', auth, async (req, res) => {
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
    res.status(500).json({ message: 'Failed to fetch associated sessions', error: error.message });
  }
});

// POST /api/classes/:id/sessions - Link session to classroom (ClassRoom hosts ClassSession)
router.post('/:id/sessions', auth, authorize('admin'), async (req, res) => {
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
    res.status(500).json({ message: 'Failed to link session to classroom', error: error.message });
  }
});

// DELETE /api/classes/:id/sessions/:sessionId - Unlink session from classroom
router.delete('/:id/sessions/:sessionId', auth, authorize('admin'), async (req, res) => {
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
    res.status(500).json({ message: 'Failed to remove association', error: error.message });
  }
});

module.exports = router;
