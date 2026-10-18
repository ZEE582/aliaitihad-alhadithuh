const express = require('express');
const { Op } = require('sequelize');
const { Section, ClassRoom, Teacher, Person, Child, classSession } = require('../models');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

const SECTION_INCLUDE = [
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
  },
  {
    model: Child,
    as: 'children',
    attributes: ['PersonID', 'F_name', 'L_name']
  }
];

async function currentTeacher(userId) {
  return Teacher.findOne({ where: { userId } });
}

async function validateTeacherAssignment(assignedTeacherId, excludeSectionId) {
  if (assignedTeacherId === undefined || assignedTeacherId === null) {
    return { ok: true, value: null };
  }

  const teacher = await Teacher.findByPk(assignedTeacherId);
  if (!teacher) {
    return { ok: false, status: 400, message: 'Assigned teacher not found' };
  }

  const where = { assigned_teacher_id: assignedTeacherId };
  if (excludeSectionId !== undefined && excludeSectionId !== null) {
    where.section_id = { [Op.ne]: excludeSectionId };
  }

  const existing = await Section.findOne({ where });
  if (existing) {
    return { ok: false, status: 409, message: 'Teacher is already assigned to another section' };
  }

  return { ok: true, value: assignedTeacherId };
}

async function validateClassId(classID) {
  if (classID === undefined || classID === null) return { ok: false, status: 400, message: 'classID is required' };
  const classRoom = await ClassRoom.findByPk(classID);
  if (!classRoom) return { ok: false, status: 404, message: 'Class not found' };
  return { ok: true, value: classID };
}

// Get all sections
router.get('/', auth, async (req, res, next) => {
  try {
    if (req.user.roleType === 'admin' || req.user.roleType === 'secretary') {
      const sections = await Section.findAll({ include: SECTION_INCLUDE, order: [['section_id', 'ASC']] });
      return res.json(sections);
    }

    if (req.user.roleType === 'teacher') {
      const teacher = await currentTeacher(req.user.id);
      if (!teacher) return res.json([]);
      const sections = await Section.findAll({
        where: { assigned_teacher_id: teacher.PersonID },
        include: SECTION_INCLUDE,
        order: [['section_id', 'ASC']]
      });
      return res.json(sections);
    }

    return res.status(403).json({ message: 'Not authorized' });
  } catch (error) {
    error.status = 500;
    error.publicMessage = 'Failed to fetch sections';
    return next(error);
  }
});

// Get section by ID
router.get('/:id', auth, async (req, res, next) => {
  try {
    const section = await Section.findByPk(req.params.id, { include: SECTION_INCLUDE });
    if (!section) return res.status(404).json({ message: 'Section not found' });

    if (req.user.roleType === 'teacher') {
      const teacher = await currentTeacher(req.user.id);
      if (!teacher || section.assigned_teacher_id !== teacher.PersonID) {
        return res.status(403).json({ message: 'Not authorized' });
      }
    } else if (req.user.roleType !== 'admin' && req.user.roleType !== 'secretary') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(section);
  } catch (error) {
    error.status = 500;
    error.publicMessage = 'Failed to fetch section';
    return next(error);
  }
});

// Create section (admin only)
router.post('/', auth, authorize('admin'), async (req, res, next) => {
  try {
    const { SectionName, Name_level, Level, Capacity, classID, assigned_teacher_id } = req.body;

    if (!SectionName || !Name_level) {
      return res.status(400).json({ message: 'SectionName and Name_level are required' });
    }

    const classCheck = await validateClassId(classID);
    if (!classCheck.ok) return res.status(classCheck.status).json({ message: classCheck.message });

    const teacherCheck = await validateTeacherAssignment(assigned_teacher_id);
    if (!teacherCheck.ok) return res.status(teacherCheck.status).json({ message: teacherCheck.message });

    const section = await Section.create({
      SectionName,
      Name_level,
      Level: Level || null,
      Capacity: Capacity || null,
      classID,
      assigned_teacher_id: teacherCheck.value
    });

    const created = await Section.findByPk(section.section_id, { include: SECTION_INCLUDE });
    res.status(201).json(created);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'Section name or level already exists' });
    }
    error.status = 500;
    error.publicMessage = 'Failed to create section';
    return next(error);
  }
});

// Update section (admin only)
router.put('/:id', auth, authorize('admin'), async (req, res, next) => {
  try {
    const section = await Section.findByPk(req.params.id);
    if (!section) return res.status(404).json({ message: 'Section not found' });

    const payload = {};
    if (req.body.SectionName !== undefined) payload.SectionName = req.body.SectionName;
    if (req.body.Name_level !== undefined) payload.Name_level = req.body.Name_level;
    if (req.body.Level !== undefined) payload.Level = req.body.Level;
    if (req.body.Capacity !== undefined) payload.Capacity = req.body.Capacity;

    if (req.body.classID !== undefined) {
      const classCheck = await validateClassId(req.body.classID);
      if (!classCheck.ok) return res.status(classCheck.status).json({ message: classCheck.message });
      payload.classID = req.body.classID;
    }

    if (req.body.assigned_teacher_id !== undefined) {
      const teacherCheck = await validateTeacherAssignment(req.body.assigned_teacher_id, section.section_id);
      if (!teacherCheck.ok) return res.status(teacherCheck.status).json({ message: teacherCheck.message });
      payload.assigned_teacher_id = teacherCheck.value;
    }

    await section.update(payload);
    const updated = await Section.findByPk(section.section_id, { include: SECTION_INCLUDE });
    res.json(updated);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'Section name or level already exists' });
    }
    error.status = 500;
    error.publicMessage = 'Failed to update section';
    return next(error);
  }
});

// Delete section (admin only)
router.delete('/:id', auth, authorize('admin'), async (req, res, next) => {
  try {
    const section = await Section.findByPk(req.params.id);
    if (!section) return res.status(404).json({ message: 'Section not found' });

    const childCount = await Child.count({ where: { section_id: section.section_id } });
    if (childCount > 0) {
      return res.status(409).json({ message: 'Section has children and cannot be deleted' });
    }

    const sessionCount = await classSession.count({ where: { section_id: section.section_id } });
    if (sessionCount > 0) {
      return res.status(409).json({ message: 'Section has sessions and cannot be deleted' });
    }

    await section.destroy();
    res.json({ message: 'Section deleted successfully' });
  } catch (error) {
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(409).json({ message: 'Section has linked records and cannot be deleted' });
    }
    error.status = 500;
    error.publicMessage = 'Failed to delete section';
    return next(error);
  }
});

module.exports = router;
