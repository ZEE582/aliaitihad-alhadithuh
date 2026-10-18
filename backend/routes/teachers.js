const express = require('express');
const { Teacher, Person, User, Subject, Guardian, Child, Child_Guardian, Section, ClassRoom, sequelize } = require('../models');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

const SECTION_INCLUDE = {
  model: Section,
  as: 'assignedSection',
  attributes: ['section_id', 'SectionName', 'Name_level', 'classID'],
  include: [{ model: ClassRoom, as: 'classRoom', attributes: ['classID', 'className'] }]
};

const TEACHER_EDITABLE_FIELDS = [
  'F_name',
  'S_name',
  'Th_name',
  'L_name',
  'T_Number',
  'specialty',
  'years_of_experience',
  'subject_id'
];

const getParentTeacherIds = async (userId) => {
  const guardian = await Guardian.findOne({ where: { userId } });
  if (!guardian) return [];

  const links = await Child_Guardian.findAll({
    where: { GID: guardian.GID },
    attributes: ['child_PersonID']
  });

  const childIds = links.map((l) => l.child_PersonID);
  if (!childIds.length) return [];

  const children = await Child.findAll({
    where: { PersonID: childIds },
    attributes: ['section_id']
  });

  const sectionIds = [...new Set(children.map((c) => c.section_id).filter((id) => id !== null && id !== undefined))];
  if (!sectionIds.length) return [];

  const sections = await Section.findAll({
    where: { section_id: sectionIds },
    attributes: ['assigned_teacher_id']
  });

  return [...new Set(sections.map((s) => s.assigned_teacher_id).filter((id) => id !== null && id !== undefined))];
};

// Get all teachers
router.get('/', auth, async (req, res, next) => {
  try {
    const query = {
      include: [
        {
          model: Person,
          as: 'person',
          attributes: ['PersonID', 'Name']
        },
        {
          model: Subject,
          as: 'subject'
        },
        SECTION_INCLUDE
      ],
      order: [['createdAt', 'DESC']]
    };

    if (req.user.roleType === 'parent') {
      query.attributes = ['PersonID', 'F_name', 'S_name', 'Th_name', 'L_name'];
      query.include[1].attributes = ['Subject_name'];
      query.where = { PersonID: await getParentTeacherIds(req.user.id) };
    } else {
      query.include.push({
        model: User,
        as: 'user',
        attributes: ['id', 'fullName', 'email', 'phone', 'roleType']
      });
    }

    const teachers = await Teacher.findAll(query);
    res.json(teachers);
  } catch (error) {
    error.status = 500;
    error.publicMessage = 'Server error';
    return next(error);
  }
});

// Get teacher users without a linked Teacher profile (admin only)
router.get('/unlinked', auth, authorize('admin'), async (req, res, next) => {
  try {
    const users = await User.findAll({
      where: { roleType: 'teacher' },
      attributes: ['id', 'fullName', 'email', 'phone', 'roleType']
    });

    const teachers = await Teacher.findAll({ attributes: ['userId'] });
    const linkedUserIds = new Set(teachers.map((teacher) => teacher.userId));

    res.json(users.filter((user) => !linkedUserIds.has(user.id)));
  } catch (error) {
    error.status = 500;
    error.publicMessage = 'Server error';
    return next(error);
  }
});

// Get teacher by ID
router.get('/:id', auth, async (req, res, next) => {
  try {
    const query = {
      include: [
        {
          model: Person,
          as: 'person',
          attributes: ['PersonID', 'Name']
        },
        {
          model: Subject,
          as: 'subject'
        },
        SECTION_INCLUDE
      ]
    };

    if (req.user.roleType === 'parent') {
      query.attributes = ['PersonID', 'F_name', 'S_name', 'Th_name', 'L_name'];
      query.include[1].attributes = ['Subject_name'];

      const teacherIds = await getParentTeacherIds(req.user.id);
      if (!teacherIds.map(Number).includes(Number(req.params.id))) {
        return res.status(403).json({ message: 'Not authorized' });
      }
    } else {
      query.include.push({
        model: User,
        as: 'user',
        attributes: ['id', 'fullName', 'email', 'phone', 'roleType']
      });
    }

    const teacher = await Teacher.findByPk(req.params.id, query);

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    res.json(teacher);
  } catch (error) {
    error.status = 500;
    error.publicMessage = 'Server error';
    return next(error);
  }
});

// Create teacher profile
router.post('/', auth, authorize('admin'), async (req, res) => {
  return res.status(400).json({
    message: 'Teacher accounts are created via POST /api/users'
  });
});

// Update teacher
router.put('/:id', auth, authorize('admin'), async (req, res, next) => {
  try {
    let teacher = await Teacher.findByPk(req.params.id);
    if (!teacher) {
      teacher = await Teacher.findOne({ where: { userId: req.params.id } });
    }
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    const payload = {};
    TEACHER_EDITABLE_FIELDS.forEach((field) => {
      if (req.body[field] !== undefined) payload[field] = req.body[field];
    });

    await teacher.update(payload);

    const touchesName = ['F_name', 'S_name', 'Th_name', 'L_name'].some(
      (field) => payload[field] !== undefined
    );
    if (touchesName) {
      const fullName = [teacher.F_name, teacher.S_name, teacher.Th_name, teacher.L_name]
        .filter(Boolean)
        .join(' ');
      await Person.update({ Name: fullName }, { where: { PersonID: teacher.PersonID } });
    }

    const updated = await Teacher.findByPk(teacher.PersonID, {
      include: [
        { model: Person, as: 'person', attributes: ['PersonID', 'Name'] },
        { model: Subject, as: 'subject' },
        { model: User, as: 'user', attributes: ['id', 'fullName', 'email', 'phone', 'roleType'] },
        SECTION_INCLUDE
      ]
    });
    res.json(updated);
  } catch (error) {
    error.status = 500;
    error.publicMessage = 'Server error';
    return next(error);
  }
});

// Delete teacher (admin only)
router.delete('/:id', auth, authorize('admin'), async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    let teacher = await Teacher.findByPk(req.params.id, { transaction });
    if (!teacher) {
      teacher = await Teacher.findOne({ where: { userId: req.params.id }, transaction });
    }
    if (!teacher) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Teacher not found' });
    }

    const assignedSection = await Section.findOne({
      where: { assigned_teacher_id: teacher.PersonID },
      transaction
    });
    if (assignedSection) {
      await transaction.rollback();
      return res.status(409).json({ message: 'Teacher is assigned to a section and cannot be deleted' });
    }

    const personId = teacher.PersonID;
    const linkedUserId = teacher.userId;

    await teacher.destroy({ transaction });
    await Person.destroy({ where: { PersonID: personId }, transaction });
    if (linkedUserId) {
      await User.destroy({ where: { id: linkedUserId }, transaction });
    }

    await transaction.commit();
    res.json({ message: 'Teacher deleted successfully' });
  } catch (error) {
    try { await transaction.rollback(); } catch (e) {}
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(409).json({ message: 'Teacher has linked records and cannot be deleted' });
    }
    error.status = 500;
    error.publicMessage = 'Server error';
    return next(error);
  }
});

module.exports = router;
