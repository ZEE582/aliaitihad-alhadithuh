const express = require('express');
const { Attendance, Child, ClassRoom, Guardian, Child_Guardian, Section } = require('../models');
const { assertCanAccessChild } = require('../utils/access');
const { auth, authorize } = require('../middleware/auth');
const { Op, Sequelize } = require('sequelize');

const router = express.Router();

// Get all attendance records
router.get('/', auth, async (req, res, next) => {
  try {
    const { childId, child_PersonID, classId, classID, date, AttendanceDate, status, Status } = req.query;
    let where = {};
    let ownChildIds = null;

    // Parents can only see attendance of their own children
    if (req.user.roleType === 'parent') {
      const guardian = await Guardian.findOne({ where: { userId: req.user.id } });
      if (guardian) {
        const relations = await Child_Guardian.findAll({
          where: { GID: guardian.GID },
          attributes: ['child_PersonID']
        });
        const childIds = relations.map(r => r.child_PersonID);
        ownChildIds = childIds;
        where.child_PersonID = { [Op.in]: childIds };
      } else {
        return res.json([]);
      }
    }

    // Teachers can only see attendance of children in their assigned section
    if (req.user.roleType === 'teacher') {
      const teacher = await Teacher.findOne({ where: { userId: req.user.id } });
      if (!teacher) return res.json([]);
      const section = await Section.findOne({ where: { assigned_teacher_id: teacher.PersonID } });
      if (!section) return res.json([]);
      const sectionChildren = await Child.findAll({
        where: { section_id: section.section_id },
        attributes: ['PersonID']
      });
      const childIds = sectionChildren.map(c => c.PersonID);
      ownChildIds = childIds;
      where.child_PersonID = { [Op.in]: childIds };
    }

    const targetChildId = childId || child_PersonID;
    const targetClassId = classId || classID;
    const targetDate = date || AttendanceDate;
    const targetStatus = status || Status;

    if (targetChildId) {
      if (ownChildIds) {
        // A parent may only narrow to one of their own children
        if (!ownChildIds.map(String).includes(String(targetChildId))) {
          return res.status(403).json({ message: 'Not authorized' });
        }
        where.child_PersonID = Number(targetChildId);
      } else {
        where.child_PersonID = targetChildId;
      }
    }
    if (targetClassId) where.classID = targetClassId;
    if (targetDate) where.AttendanceDate = targetDate;
    if (targetStatus) where.Status = targetStatus;

    const attendance = await Attendance.findAll({
      where,
      include: [
        {
          model: Child,
          as: 'child',
          attributes: ['PersonID', 'F_name', 'L_name', 'gender']
        },
        {
          model: ClassRoom,
          as: 'classRoom',
          attributes: ['classID', 'className']
        }
      ],
      order: [['AttendanceDate', 'DESC']]
    });

    res.json(attendance);
  } catch (error) {
    error.status = 500;
    error.publicMessage = 'Failed to fetch attendance records';
    return next(error);
  }
});

// Get attendance by ID
router.get('/:id', auth, async (req, res, next) => {
  try {
    const attendance = await Attendance.findByPk(req.params.id, {
      include: [
        {
          model: Child,
          as: 'child',
          attributes: ['PersonID', 'F_name', 'L_name', 'gender']
        },
        {
          model: ClassRoom,
          as: 'classRoom',
          attributes: ['classID', 'className']
        }
      ]
    });
    
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    await assertCanAccessChild(req.user, attendance.child_PersonID);

    res.json(attendance);
  } catch (error) {
    if (error.message === 'Not authorized') {
      error.status = 403;
      return next(error);
    }
    error.status = 500;
    error.publicMessage = 'Failed to fetch attendance record';
    return next(error);
  }
});

const CHILD_STATUS_MAP = {
  present: 'Present',
  late: 'Late',
  absent: 'Absent',
  absent_unexcused: 'Absent',
  absent_excused: 'Excused',
  excused: 'Excused',
  Present: 'Present',
  Absent: 'Absent',
  Late: 'Late',
  Excused: 'Excused'
};

function normalizeStatusKey(value) {
  if (value == null) return null;
  const key = String(value);
  return CHILD_STATUS_MAP[key] !== undefined ? CHILD_STATUS_MAP[key] : null;
}

// Create attendance record (admin and teacher only) - upsert per child + day
router.post('/', auth, authorize('admin', 'teacher'), async (req, res, next) => {
  try {
    const { child_PersonID, childId, classID, classId, AttendanceDate, date, Status, status, Reason, reason } = req.body;

    const targetChildId = child_PersonID || childId;
    await assertCanAccessChild(req.user, targetChildId);

    const child = await Child.findByPk(Number(targetChildId), {
      attributes: ['PersonID', 'classID']
    });
    if (!child) {
      return res.status(404).json({ message: 'Child not found' });
    }

    const statusKey = normalizeStatusKey(Status || status || 'Present');
    if (!statusKey) {
      return res.status(400).json({ message: 'Invalid attendance status' });
    }

    const childClassID = classID || classId || child.classID || 1;
    const attDate = AttendanceDate || date || new Date();

    const existing = await Attendance.findOne({
      where: {
        child_PersonID: child.PersonID,
        [Op.and]: [
          Sequelize.where(Sequelize.fn('DATE', Sequelize.col('AttendanceDate')), '=', attDate)
        ]
      }
    });

    let attendance;
    if (existing) {
      await existing.update({
        classID: childClassID,
        Status: statusKey,
        Reason: reason !== undefined ? reason : (Reason !== undefined ? Reason : existing.Reason)
      });
      attendance = existing;
    } else {
      attendance = await Attendance.create({
        child_PersonID: child.PersonID,
        classID: childClassID,
        AttendanceDate: attDate,
        Status: statusKey,
        Reason: Reason || reason || ''
      });
    }

    const newAttendance = await Attendance.findByPk(attendance.AttendanceID, {
      include: [
        {
          model: Child,
          as: 'child',
          attributes: ['PersonID', 'F_name', 'L_name']
        },
        {
          model: ClassRoom,
          as: 'classRoom',
          attributes: ['classID', 'className']
        }
      ]
    });

    res.status(201).json(newAttendance);
  } catch (error) {
    if (error.message === 'Not authorized') {
      error.status = 403;
      return next(error);
    }
    error.status = 500;
    error.publicMessage = 'Failed to create attendance record';
    return next(error);
  }
});

// Update attendance
router.put('/:id', auth, authorize('admin', 'teacher'), async (req, res, next) => {
  try {
    const attendance = await Attendance.findByPk(req.params.id);
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    await assertCanAccessChild(req.user, attendance.child_PersonID);

    const { Status, status, Reason, reason, AttendanceDate, date } = req.body;
    await attendance.update({
      Status: Status || status || attendance.Status,
      Reason: Reason !== undefined ? Reason : (reason !== undefined ? reason : attendance.Reason),
      AttendanceDate: AttendanceDate || date || attendance.AttendanceDate
    });
    
    const updatedAttendance = await Attendance.findByPk(req.params.id, {
      include: [
        {
          model: Child,
          as: 'child',
          attributes: ['PersonID', 'F_name', 'L_name']
        },
        {
          model: ClassRoom,
          as: 'classRoom',
          attributes: ['classID', 'className']
        }
      ]
    });

    res.json(updatedAttendance);
  } catch (error) {
    if (error.message === 'Not authorized') {
      error.status = 403;
      return next(error);
    }
    error.status = 500;
    error.publicMessage = 'Failed to update attendance';
    return next(error);
  }
});

// Delete attendance (admin only)
router.delete('/:id', auth, authorize('admin'), async (req, res, next) => {
  try {
    const attendance = await Attendance.findByPk(req.params.id);
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }
    await attendance.destroy();
    res.json({ message: 'Attendance record deleted successfully' });
  } catch (error) {
    error.status = 500;
    error.publicMessage = 'Failed to delete';
    return next(error);
  }
});

// ==========================================
// Teacher Attendance Endpoints (Teacher Attendance)
// ==========================================

const { TeacherAttendance, Teacher } = require('../models');

// GET /api/attendance/teachers/all - List teacher attendance records
router.get('/teachers/all', auth, authorize('admin'), async (req, res, next) => {
  try {
    const { teacherId, date, status } = req.query;
    let where = {};
    if (teacherId) where.TeacherID = teacherId;
    if (date) where.Date = date;
    if (status) where.Status = status;

    const records = await TeacherAttendance.findAll({
      where,
      include: [
        {
          model: Teacher,
          as: 'teacher',
          attributes: ['PersonID', 'F_name', 'S_name', 'T_Number', 'specialty']
        }
      ],
      order: [['Date', 'DESC']]
    });
    res.json(records);
  } catch (error) {
    error.status = 500;
    error.publicMessage = 'Failed to fetch teacher attendance records';
    return next(error);
  }
});

// POST /api/attendance/teachers - Create teacher attendance record
router.post('/teachers', auth, authorize('admin'), async (req, res, next) => {
  try {
    const { TeacherID, Date: attDate, Status, Excuse, ExcuseAttachment } = req.body;
    if (!TeacherID || !attDate || !Status) {
      return res.status(400).json({ message: 'TeacherID, Date, and Status are required' });
    }

    const record = await TeacherAttendance.create({
      TeacherID,
      Date: attDate,
      Status,
      Excuse,
      ExcuseAttachment
    });
    res.status(201).json(record);
  } catch (error) {
    error.status = 500;
    error.publicMessage = 'Failed to create teacher attendance record';
    return next(error);
  }
});

// PUT /api/attendance/teachers/:id - Update teacher attendance record
router.put('/teachers/:id', auth, authorize('admin'), async (req, res, next) => {
  try {
    const record = await TeacherAttendance.findByPk(req.params.id);
    if (!record) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }
    const { Status, Excuse, ExcuseAttachment, Date: attDate } = req.body;
    await record.update({
      Status: Status || record.Status,
      Excuse: Excuse !== undefined ? Excuse : record.Excuse,
      ExcuseAttachment: ExcuseAttachment !== undefined ? ExcuseAttachment : record.ExcuseAttachment,
      Date: attDate || record.Date
    });
    res.json(record);
  } catch (error) {
    error.status = 500;
    error.publicMessage = 'Failed to update teacher attendance record';
    return next(error);
  }
});

// DELETE /api/attendance/teachers/:id - Delete teacher attendance record
router.delete('/teachers/:id', auth, authorize('admin'), async (req, res, next) => {
  try {
    const record = await TeacherAttendance.findByPk(req.params.id);
    if (!record) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }
    await record.destroy();
    res.json({ message: 'Attendance record deleted successfully' });
  } catch (error) {
    error.status = 500;
    error.publicMessage = 'Failed to delete attendance record';
    return next(error);
  }
});

module.exports = router;
