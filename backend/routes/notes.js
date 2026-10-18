const express = require('express');
const { Note, User, Child, Guardian, Child_Guardian, Teacher, Section } = require('../models');
const { auth } = require('../middleware/auth');
const { Op } = require('sequelize');

const router = express.Router();

const NOTE_INCLUDE = [
  {
    model: User,
    as: 'sender',
    attributes: ['id', 'fullName', 'roleType']
  },
  {
    model: User,
    as: 'receiver',
    attributes: ['id', 'fullName', 'roleType']
  }
];

async function getParentUserIdOfChild(childId) {
  const links = await Child_Guardian.findAll({
    where: { child_PersonID: childId },
    attributes: ['GID']
  });

  const gids = links.map((link) => link.GID);
  if (gids.length === 0) return null;

  const guardians = await Guardian.findAll({
    where: { GID: { [Op.in]: gids } },
    attributes: ['userId']
  });

  const parent = guardians.find((g) => g.userId != null);
  return parent ? parent.userId : null;
}

async function isParentOfTeacherSectionChild(teacher, receiverId) {
  const section = await Section.findOne({
    where: { assigned_teacher_id: teacher.PersonID }
  });
  if (!section) return false;

  const sectionChildren = await Child.findAll({
    where: { section_id: section.section_id },
    attributes: ['PersonID']
  });
  const childIds = sectionChildren.map((c) => c.PersonID);
  if (childIds.length === 0) return false;

  const guardian = await Guardian.findOne({ where: { userId: receiverId } });
  if (!guardian) return false;

  const link = await Child_Guardian.findOne({
    where: {
      GID: guardian.GID,
      child_PersonID: { [Op.in]: childIds }
    }
  });

  return !!link;
}

async function resolveReceiverId(user, body) {
  if (body.childId != null) {
    const child = await Child.findByPk(Number(body.childId), {
      attributes: ['PersonID', 'section_id', 'classID']
    });
    if (!child) return { error: 400, message: 'Child not found' };

    if (user.roleType === 'teacher') {
      const teacher = await Teacher.findOne({ where: { userId: user.id } });
      if (!teacher) return { error: 403, message: 'Not authorized' };

      const section = await Section.findOne({
        where: {
          section_id: child.section_id,
          assigned_teacher_id: teacher.PersonID
        }
      });
      if (!section) return { error: 403, message: 'Not authorized' };
    }

    const parentUserId = await getParentUserIdOfChild(child.PersonID);
    if (parentUserId == null) return { error: 400, message: 'Child has no linked parent user' };
    return { receiverId: parentUserId };
  }

  const receiverId = Number(body.ReceiverID);
  if (!receiverId) return { error: 400, message: 'ReceiverID is required' };

  const receiver = await User.findByPk(receiverId, { attributes: ['id', 'roleType', 'fullName'] });
  if (!receiver) return { error: 400, message: 'Receiver not found' };

  if (user.roleType === 'teacher') {
    const teacher = await Teacher.findOne({ where: { userId: user.id } });
    if (!teacher) return { error: 403, message: 'Not authorized' };

    const allowed = await isParentOfTeacherSectionChild(teacher, receiverId);
    if (!allowed) return { error: 403, message: 'Not authorized' };
  }

  if (user.roleType === 'parent' && receiver.roleType === 'parent') {
    return { error: 403, message: 'Not authorized' };
  }

  return { receiverId };
}

// Get all notes
router.get('/', auth, async (req, res, next) => {
  try {
    const { category, senderId, receiverId } = req.query;
    let where = {};

    if (category) where.NoteCategory = category;
    if (senderId) where.SenderID = senderId;
    if (receiverId) where.ReceiverID = receiverId;

    // A parent may only list notes they sent or received
    if (req.user.roleType === 'parent') {
      where[Op.or] = [
        { SenderID: req.user.id },
        { ReceiverID: req.user.id }
      ];
    }

    if (req.user.roleType === 'teacher') {
      const allowedUserIds = new Set([req.user.id]);
      const teacher = await Teacher.findOne({ where: { userId: req.user.id } });

      if (teacher) {
        const section = await Section.findOne({ where: { assigned_teacher_id: teacher.PersonID } });

        if (section) {
          const sectionChildren = await Child.findAll({
            where: { section_id: section.section_id },
            attributes: ['PersonID']
          });
          const childIds = sectionChildren.map((c) => c.PersonID);

          if (childIds.length) {
            const links = await Child_Guardian.findAll({
              where: { child_PersonID: { [Op.in]: childIds } },
              attributes: ['GID']
            });
            const gids = links.map((l) => l.GID);

            if (gids.length) {
              const guardians = await Guardian.findAll({
                where: { GID: { [Op.in]: gids } },
                attributes: ['userId']
              });
              guardians.forEach((g) => {
                if (g.userId != null) allowedUserIds.add(g.userId);
              });
            }
          }
        }
      }

      const allowed = [...allowedUserIds];
      where[Op.or] = [
        { SenderID: { [Op.in]: allowed } },
        { ReceiverID: { [Op.in]: allowed } }
      ];
    }

    const notes = await Note.findAll({
      where,
      include: NOTE_INCLUDE,
      order: [['NoteDate', 'DESC']]
    });

    res.json(notes);
  } catch (error) {
    error.status = 500;
    error.publicMessage = 'Failed to fetch notes';
    return next(error);
  }
});

// Get note by ID
router.get('/:id', auth, async (req, res, next) => {
  try {
    const note = await Note.findByPk(req.params.id, {
      include: NOTE_INCLUDE
    });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    if (req.user.roleType !== 'admin' && note.SenderID !== req.user.id && note.ReceiverID !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(note);
  } catch (error) {
    error.status = 500;
    error.publicMessage = 'Failed to fetch note';
    return next(error);
  }
});

// Create new note
router.post('/', auth, async (req, res, next) => {
  try {
    const { NoteCategory, category, NoteText, text, note, childId, ReceiverID, NoteDate } = req.body;

    const textValue = NoteText || text || note || '';
    if (!textValue.trim()) {
      return res.status(400).json({ message: 'Note text is required' });
    }

    const resolved = await resolveReceiverId(req.user, { childId, ReceiverID });
    if (resolved.error) {
      return res.status(resolved.error).json({ message: resolved.message });
    }

    const noteRecord = await Note.create({
      NoteCategory: NoteCategory || category || 'General',
      NoteText: textValue,
      SenderID: req.user.id,
      ReceiverID: resolved.receiverId,
      NoteDate: NoteDate || new Date()
    });

    const newNote = await Note.findByPk(noteRecord.NoteID, {
      include: NOTE_INCLUDE
    });

    res.status(201).json(newNote);
  } catch (error) {
    error.status = 500;
    error.publicMessage = 'Failed to create note';
    return next(error);
  }
});

// Update note
router.put('/:id', auth, async (req, res, next) => {
  try {
    const note = await Note.findByPk(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    if (req.user.roleType !== 'admin' && note.SenderID !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { NoteCategory, category, NoteText, text, NoteDate } = req.body;
    await note.update({
      NoteCategory: NoteCategory || category || note.NoteCategory,
      NoteText: NoteText || text || note.NoteText,
      NoteDate: NoteDate || note.NoteDate
    });

    const updatedNote = await Note.findByPk(req.params.id, {
      include: NOTE_INCLUDE
    });

    res.json(updatedNote);
  } catch (error) {
    error.status = 500;
    error.publicMessage = 'Failed to update note';
    return next(error);
  }
});

// Delete note
router.delete('/:id', auth, async (req, res, next) => {
  try {
    const note = await Note.findByPk(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    if (req.user.roleType !== 'admin' && note.SenderID !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await note.destroy();
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    error.status = 500;
    error.publicMessage = 'Failed to delete note';
    return next(error);
  }
});

module.exports = router;