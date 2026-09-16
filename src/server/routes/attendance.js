const express = require('express');
const { Attendance, Child, ClassRoom, Guardian, Child_Guardian } = require('../models');
const { auth, authorize } = require('../middleware/auth');
const { Op } = require('sequelize');

const router = express.Router();

// Get all attendance records
router.get('/', auth, async (req, res) => {
  try {
    const { childId, child_PersonID, classId, classID, date, AttendanceDate, status, Status } = req.query;
    let where = {};

    // Parents can only see attendance of their own children
    if (req.user.roleType === 'parent') {
      const guardian = await Guardian.findOne({ where: { userId: req.user.id } });
      if (guardian) {
        const relations = await Child_Guardian.findAll({
          where: { GID: guardian.GID },
          attributes: ['child_PersonID']
        });
        const childIds = relations.map(r => r.child_PersonID);
        where.child_PersonID = { [Op.in]: childIds };
      } else {
        return res.json([]);
      }
    }

    const targetChildId = childId || child_PersonID;
    const targetClassId = classId || classID;
    const targetDate = date || AttendanceDate;
    const targetStatus = status || Status;

    if (targetChildId) where.child_PersonID = targetChildId;
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
    res.status(500).json({ message: 'فشل جلب سجلات الحضور', error: error.message });
  }
});

// Get attendance by ID
router.get('/:id', auth, async (req, res) => {
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
      return res.status(404).json({ message: 'سجل الحضور غير موجود' });
    }

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'فشل جلب سجل الحضور', error: error.message });
  }
});

// Create attendance record (admin and teacher only)
router.post('/', auth, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const { child_PersonID, childId, classID, classId, AttendanceDate, date, Status, status, Reason, reason } = req.body;
    
    const attendance = await Attendance.create({
      child_PersonID: child_PersonID || childId,
      classID: classID || classId || 1,
      AttendanceDate: AttendanceDate || date || new Date(),
      Status: Status || status || 'Present',
      Reason: Reason || reason || ''
    });
    
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
    res.status(500).json({ message: 'فشل تسجيل الحضور', error: error.message });
  }
});

// Update attendance
router.put('/:id', auth, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const attendance = await Attendance.findByPk(req.params.id);
    if (!attendance) {
      return res.status(404).json({ message: 'سجل الحضور غير موجود' });
    }

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
    res.status(500).json({ message: 'فشل تحديث الحضور', error: error.message });
  }
});

// Delete attendance (admin only)
router.delete('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const attendance = await Attendance.findByPk(req.params.id);
    if (!attendance) {
      return res.status(404).json({ message: 'سجل الحضور غير موجود' });
    }
    await attendance.destroy();
    res.json({ message: 'تم حذف سجل الحضور بنجاح' });
  } catch (error) {
    res.status(500).json({ message: 'فشل الحذف', error: error.message });
  }
});

// ==========================================
// Teacher Attendance Endpoints (حضور المعلمين)
// ==========================================

const { TeacherAttendance, Teacher } = require('../models');

// GET /api/attendance/teachers - قائمة حضور المعلمين
router.get('/teachers/all', auth, authorize('admin'), async (req, res) => {
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
    res.status(500).json({ message: 'فشل جلب سجلات حضور المعلمين', error: error.message });
  }
});

// POST /api/attendance/teachers - تسجيل حضور لمعلم
router.post('/teachers', auth, authorize('admin'), async (req, res) => {
  try {
    const { TeacherID, Date: attDate, Status, Excuse, ExcuseAttachment } = req.body;
    if (!TeacherID || !attDate || !Status) {
      return res.status(400).json({ message: 'TeacherID, Date و Status مطلوبة' });
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
    res.status(500).json({ message: 'فشل تسجيل حضور المعلم', error: error.message });
  }
});

// PUT /api/attendance/teachers/:id - تحديث حضور معلم
router.put('/teachers/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const record = await TeacherAttendance.findByPk(req.params.id);
    if (!record) {
      return res.status(404).json({ message: 'سجل الحضور غير موجود' });
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
    res.status(500).json({ message: 'فشل تحديث سجل الحضور', error: error.message });
  }
});

// DELETE /api/attendance/teachers/:id - حذف سجل حضور معلم
router.delete('/teachers/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const record = await TeacherAttendance.findByPk(req.params.id);
    if (!record) {
      return res.status(404).json({ message: 'سجل الحضور غير موجود' });
    }
    await record.destroy();
    res.json({ message: 'تم حذف سجل حضور المعلم بنجاح' });
  } catch (error) {
    res.status(500).json({ message: 'فشل الحذف', error: error.message });
  }
});

module.exports = router;
