const { Child, Guardian, Child_Guardian, Teacher, Section } = require('../models');

const NOT_AUTHORIZED = 'Not authorized';

async function isParentOfChild(userId, childId) {
  const guardian = await Guardian.findOne({ where: { userId } });
  if (!guardian) return false;

  const link = await Child_Guardian.findOne({
    where: { GID: guardian.GID, child_PersonID: childId }
  });

  return !!link;
}

async function isTeacherOfChild(userId, childId) {
  const teacher = await Teacher.findOne({ where: { userId } });
  if (!teacher) return false;

  const child = await Child.findByPk(childId, {
    attributes: ['PersonID', 'section_id']
  });
  if (!child || child.section_id == null) return false;

  const section = await Section.findOne({
    where: {
      section_id: child.section_id,
      assigned_teacher_id: teacher.PersonID
    }
  });

  return !!section;
}

async function assertCanAccessChild(user, childId) {
  if (!user || !user.roleType || user.id == null) {
    throw new Error(NOT_AUTHORIZED);
  }

  if (user.roleType === 'admin') {
    return true;
  }

  let allowed = false;

  if (user.roleType === 'parent') {
    allowed = await isParentOfChild(user.id, childId);
  } else if (user.roleType === 'teacher') {
    allowed = await isTeacherOfChild(user.id, childId);
  }

  if (!allowed) {
    throw new Error(NOT_AUTHORIZED);
  }

  return true;
}

module.exports = { assertCanAccessChild, NOT_AUTHORIZED };
