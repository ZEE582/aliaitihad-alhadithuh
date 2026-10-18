const express = require('express');
const { Subject, Teacher, Person, classSession } = require('../models');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

const TEACHER_INCLUDE = {
  model: Teacher,
  as: 'teachers',
  attributes: ['PersonID', 'F_name', 'S_name', 'Th_name', 'L_name'],
  include: [{ model: Person, as: 'person', attributes: ['PersonID', 'Name'] }]
};

const SESSION_INCLUDE = {
  model: classSession,
  as: 'sessions',
  attributes: ['SessionID', 'Date', 'day', 'Period', 'Study_class_number', 'section_id']
};

// Get all subjects
router.get('/', auth, async (req, res) => {
  try {
    const subjects = await Subject.findAll({
      include: [TEACHER_INCLUDE, SESSION_INCLUDE],
      order: [['Subject_name', 'ASC']]
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
      include: [TEACHER_INCLUDE, SESSION_INCLUDE]
    });

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    res.json(subject);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new subject (admin only)
router.post('/', auth, authorize('admin'), async (req, res) => {
  try {
    const { Subject_name, level, semester } = req.body;
    if (!Subject_name || !level || !semester) {
      return res.status(400).json({ message: 'Subject_name, level and semester are required' });
    }

    const subject = await Subject.create({ Subject_name, level, semester });

    const newSubject = await Subject.findByPk(subject.SubjectID, {
      include: [TEACHER_INCLUDE, SESSION_INCLUDE]
    });

    res.status(201).json(newSubject);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'Subject already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Update subject (admin only)
router.put('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const subject = await Subject.findByPk(req.params.id);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    const payload = {};
    if (req.body.Subject_name !== undefined) payload.Subject_name = req.body.Subject_name;
    if (req.body.level !== undefined) payload.level = req.body.level;
    if (req.body.semester !== undefined) payload.semester = req.body.semester;

    await subject.update(payload);

    const updatedSubject = await Subject.findByPk(req.params.id, {
      include: [TEACHER_INCLUDE, SESSION_INCLUDE]
    });

    res.json(updatedSubject);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'Subject already exists' });
    }
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

    const teacherCount = await Teacher.count({ where: { subject_id: subject.SubjectID } });
    const sessionCount = await classSession.count({ where: { SubjectID: subject.SubjectID } });
    if (teacherCount > 0 || sessionCount > 0) {
      return res.status(409).json({ message: 'Subject has teachers or sessions and cannot be deleted' });
    }

    await subject.destroy();
    res.json({ message: 'Subject deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;