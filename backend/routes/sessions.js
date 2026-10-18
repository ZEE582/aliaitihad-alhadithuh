const express = require('express');
const { Op } = require('sequelize');
const {
  classSession,
  Subject,
  Section,
  ClassRoom,
  Teacher,
  Person,
  Child,
  Guardian,
  Child_Guardian
} = require('../models');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

const SESSION_INCLUDE = [
  {
    model: Subject,
    as: 'subject',
    attributes: ['SubjectID', 'Subject_name', 'level', 'semester']
  },
  {
    model: Section,
    as: 'section',
    attributes: ['section_id', 'SectionName', 'Name_level', 'classID', 'assigned_teacher_id'],
    include: [
      {
        model: ClassRoom,
        as: 'classRoom',
        attributes: ['classID', 'className']
      },
      {
        model: Teacher,
        as: 'assignedTeacher',
        attributes: ['PersonID', 'F_name', 'S_name', 'Th_name', 'L_name'],
        include: [{ model: Person, as: 'person', attributes: ['PersonID', 'Name'] }]
      }
    ]
  },
  {
    model: Teacher,
    as: 'sessionTeacher',
    attributes: ['PersonID', 'F_name', 'S_name', 'Th_name', 'L_name'],
    include: [{ model: Person, as: 'person', attributes: ['PersonID', 'Name'] }]
  }
];

async function getSessionScope(user) {
  if (!user) return { type: 'none', sectionIds: [], personId: null };

  if (user.roleType === 'teacher') {
    const teacher = await Teacher.findOne({ where: { userId: user.id } });
    if (!teacher) return { type: 'teacher', sectionIds: [], personId: null };
    const sections = await Section.findAll({
      where: { assigned_teacher_id: teacher.PersonID },
      attributes: ['section_id']
    });
    return {
      type: 'teacher',
      sectionIds: sections.map((s) => s.section_id),
      personId: teacher.PersonID
    };
  }

  if (user.roleType === 'parent') {
    const guardian = await Guardian.findOne({ where: { userId: user.id } });
    if (!guardian) return { type: 'parent', sectionIds: [], personId: null };
    const links = await Child_Guardian.findAll({
      where: { GID: guardian.GID },
      attributes: ['child_PersonID']
    });
    if (links.length === 0) return { type: 'parent', sectionIds: [], personId: null };
    const children = await Child.findAll({
      where: { PersonID: { [Op.in]: links.map((l) => l.child_PersonID) } },
      attributes: ['section_id']
    });
    return {
      type: 'parent',
      sectionIds: [...new Set(children.map((c) => c.section_id).filter((v) => v != null))],
      personId: null
    };
  }

  return null;
}

// Get all sessions (scoped by role)
router.get('/', auth, async (req, res) => {
  try {
    const where = {};
    if (req.query.subjectId) where.SubjectID = req.query.subjectId;
    if (req.query.day) where.day = req.query.day;
    if (req.query.date) where.Date = req.query.date;

    const scope = await getSessionScope(req.user);
    if (scope === null) {
      if (req.query.sectionId) where.section_id = req.query.sectionId;
    } else if (scope.type === 'teacher') {
      const or = [];
      if (scope.sectionIds.length) or.push({ section_id: { [Op.in]: scope.sectionIds } });
      if (scope.personId != null) or.push({ teacher_PersonID: scope.personId });
      if (or.length === 0) return res.json([]);
      where[Op.or] = or;
    } else {
      if (scope.sectionIds.length === 0) return res.json([]);
      where.section_id = { [Op.in]: scope.sectionIds };
    }

    const sessions = await classSession.findAll({
      where,
      include: SESSION_INCLUDE,
      order: [['Date', 'ASC'], ['Period', 'ASC']]
    });

    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get session by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const scope = await getSessionScope(req.user);
    if (scope !== null && scope.type !== 'teacher' && scope.sectionIds.length === 0) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const session = await classSession.findByPk(req.params.id, {
      include: SESSION_INCLUDE
    });

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (scope !== null) {
      const allowed =
        (scope.sectionIds && scope.sectionIds.includes(session.section_id)) ||
        (scope.type === 'teacher' &&
          scope.personId != null &&
          session.teacher_PersonID === scope.personId);
      if (!allowed) {
        return res.status(404).json({ message: 'Session not found' });
      }
    }

    res.json(session);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

async function validateSessionBody(body) {
  if (body.SubjectID === undefined || body.SubjectID === null) {
    return { ok: false, status: 400, message: 'SubjectID is required' };
  }
  const subject = await Subject.findByPk(body.SubjectID);
  if (!subject) {
    return { ok: false, status: 400, message: 'Subject not found' };
  }
  if (!body.Date) {
    return { ok: false, status: 400, message: 'Date is required' };
  }
  if (!body.day) {
    return { ok: false, status: 400, message: 'day is required' };
  }
  if (!body.Period) {
    return { ok: false, status: 400, message: 'Period is required' };
  }
  if (body.section_id === undefined || body.section_id === null) {
    return { ok: false, status: 400, message: 'section_id is required' };
  }
  const section = await Section.findByPk(body.section_id);
  if (!section) {
    return { ok: false, status: 400, message: 'Section not found' };
  }
  if (body.teacher_PersonID !== undefined && body.teacher_PersonID !== null) {
    const teacher = await Teacher.findByPk(body.teacher_PersonID);
    if (!teacher) {
      return { ok: false, status: 400, message: 'Teacher not found' };
    }
  }
  return { ok: true };
}

// Create new session (admin only)
router.post('/', auth, authorize('admin'), async (req, res) => {
  try {
    const validation = await validateSessionBody(req.body);
    if (!validation.ok) {
      return res.status(validation.status).json({ message: validation.message });
    }

    const session = await classSession.create({
      Date: req.body.Date,
      day: req.body.day,
      Period: req.body.Period,
      Study_class_number: req.body.Study_class_number || null,
      SubjectID: req.body.SubjectID,
      section_id: req.body.section_id,
      Duration: req.body.Duration === undefined ? null : req.body.Duration,
      Notes: req.body.Notes === undefined ? null : req.body.Notes,
      teacher_PersonID:
        req.body.teacher_PersonID === undefined ? null : req.body.teacher_PersonID
    });

    const newSession = await classSession.findByPk(session.SessionID, {
      include: SESSION_INCLUDE
    });

    res.status(201).json(newSession);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update session (admin only)
router.put('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const session = await classSession.findByPk(req.params.id);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const payload = {};
    if (req.body.Date !== undefined) payload.Date = req.body.Date;
    if (req.body.day !== undefined) payload.day = req.body.day;
    if (req.body.Period !== undefined) payload.Period = req.body.Period;
    if (req.body.Study_class_number !== undefined) payload.Study_class_number = req.body.Study_class_number;
    if (req.body.Duration !== undefined) payload.Duration = req.body.Duration;
    if (req.body.Notes !== undefined) payload.Notes = req.body.Notes;
    if (req.body.SubjectID !== undefined) {
      const subject = await Subject.findByPk(req.body.SubjectID);
      if (!subject) {
        return res.status(400).json({ message: 'Subject not found' });
      }
      payload.SubjectID = req.body.SubjectID;
    }
    if (req.body.section_id !== undefined) {
      if (req.body.section_id === null) {
        return res.status(400).json({ message: 'section_id is required' });
      }
      const section = await Section.findByPk(req.body.section_id);
      if (!section) {
        return res.status(400).json({ message: 'Section not found' });
      }
      payload.section_id = req.body.section_id;
    }
    if (req.body.teacher_PersonID !== undefined) {
      if (req.body.teacher_PersonID !== null) {
        const teacher = await Teacher.findByPk(req.body.teacher_PersonID);
        if (!teacher) {
          return res.status(400).json({ message: 'Teacher not found' });
        }
      }
      payload.teacher_PersonID = req.body.teacher_PersonID;
    }

    await session.update(payload);

    const updatedSession = await classSession.findByPk(req.params.id, {
      include: SESSION_INCLUDE
    });

    res.json(updatedSession);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete session (admin only)
router.delete('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const session = await classSession.findByPk(req.params.id);
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
