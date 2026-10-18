const path = require('path');
const { Op } = require('sequelize');
const { User, Guardian, Child_Guardian, Child, Teacher, Section } = require('../models');

const uploadsRoot = path.join(__dirname, '..', 'uploads');

function safeRelativePath(rawPath) {
  if (typeof rawPath !== 'string' || rawPath.length === 0) return null;

  let decoded;
  try {
    decoded = decodeURIComponent(rawPath);
  } catch (e) {
    return null;
  }

  let doubleDecoded = decoded;
  try {
    doubleDecoded = decodeURIComponent(decoded);
  } catch (e) {
    doubleDecoded = decoded;
  }

  for (const candidate of [decoded, doubleDecoded]) {
    if (candidate.includes('\u0000')) return null;
    const parts = candidate.replace(/\\/g, '/').split('/');
    if (parts.some((part) => part === '..')) return null;
  }

  const normalized = decoded.replace(/\\/g, '/');
  const abs = path.resolve(uploadsRoot, '.' + (normalized.startsWith('/') ? normalized : '/' + normalized));
  const rel = path.relative(uploadsRoot, abs);

  if (!rel || rel.startsWith('..') || path.isAbsolute(rel)) return null;
  return rel.replace(/\\/g, '/');
}

function parseOwnerId(filename) {
  const match = /^u(\d+)-/.exec(filename || '');
  return match ? Number(match[1]) : null;
}

async function isSectionTeacherForParent(parentUserId, teacherUserId) {
  const teacher = await Teacher.findOne({ where: { userId: teacherUserId } });
  if (!teacher) return false;

  const guardian = await Guardian.findOne({ where: { userId: parentUserId } });
  if (!guardian) return false;

  const links = await Child_Guardian.findAll({
    where: { GID: guardian.GID },
    attributes: ['child_PersonID']
  });
  const childIds = links.map((link) => link.child_PersonID);
  if (!childIds.length) return false;

  const section = await Section.findOne({ where: { assigned_teacher_id: teacher.PersonID } });
  if (!section) return false;

  const child = await Child.findOne({
    where: { PersonID: { [Op.in]: childIds }, section_id: section.section_id },
    attributes: ['PersonID']
  });

  return !!child;
}

async function isParentOfSectionChild(teacherUserId, parentUserId) {
  return isSectionTeacherForParent(parentUserId, teacherUserId);
}

async function allowedByRelation(ownerId, requester) {
  if (!requester || !requester.roleType) return false;

  const owner = await User.findByPk(ownerId, { attributes: ['id', 'roleType'] });
  if (!owner) return false;

  if (owner.id === requester.id) return true;

  if (owner.roleType === 'parent' && requester.roleType === 'teacher') {
    return isSectionTeacherForParent(owner.id, requester.id);
  }

  if (owner.roleType === 'teacher' && requester.roleType === 'parent') {
    return isParentOfSectionChild(owner.id, requester.id);
  }

  return false;
}

const uploadsAccess = async (req, res, next) => {
  try {
    const rel = safeRelativePath(req.path);
    if (!rel) {
      return res.status(400).json({ message: 'Invalid file path' });
    }

    const segments = rel.split('/');
    const directory = segments.length > 1 ? segments[0] : '';
    const filename = segments[segments.length - 1];

    if (directory !== 'avatars' && directory !== 'documents') {
      return res.status(404).json({ message: 'File not found' });
    }

    const user = req.user;
    if (!user || user.id == null || !user.roleType) {
      return res.status(403).json({ message: 'Not authorized to access this file' });
    }

    const isAdmin = user.roleType === 'admin';
    const isSecretary = user.roleType === 'secretary';
    const ownerId = parseOwnerId(filename);
    const isOwner = ownerId !== null && ownerId === user.id;

    if (directory === 'avatars') {
      if (isAdmin || isOwner) return next();
      return res.status(403).json({ message: 'Not authorized to access this file' });
    }

    if (isAdmin || isSecretary || isOwner) return next();

    if (ownerId !== null && (await allowedByRelation(ownerId, user))) {
      return next();
    }

    return res.status(403).json({ message: 'Not authorized to access this file' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to authorize file access' });
  }
};

module.exports = uploadsAccess;
