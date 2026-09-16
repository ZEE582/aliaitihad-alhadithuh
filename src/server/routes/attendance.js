const express = require('express');
const { Attendance, Child, Session, User } = require('../models');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

const { Op } = require('sequelize');

// Get all attendance records
router.get('/', auth, async (req, res) => {
  try {
    const { childId, sessionId, date, status } = req.query;
    let where = {};

    // Parents can only see attendance of their own children
    if (req.user.roleType === 'parent') {
      const children = await Child.findAll({
        where: { parentId: req.user.id },
        attributes: ['id']
      });
      const childIds = children.map(c => c.id);
      where.childId = { [Op.in]: childIds };
    }

    if (childId) where.childId = childId;
    if (sessionId) where.sessionId = sessionId;
    if (date) where.date = new Date(date);
    if (status) where.status = status;

    const attendance = await Attendance.findAll({
      where,
      include: [
        {
          model: Child,
          as: 'child',
          attributes: ['id', 'firstName', 'lastName']
        },
        {
          model: Session,
          as: 'session',
          attributes: ['id', 'topic', 'date']
        },
        {
          model: User,
          as: 'marker',
          attributes: ['id', 'fullName']
        }
      ],
      order: [['date', 'DESC']]
    });

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
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
          attributes: ['id', 'firstName', 'lastName', 'parentId']
        },
        {
          model: Session,
          as: 'session',
          attributes: ['id', 'topic', 'date']
        },
        {
          model: User,
          as: 'marker',
          attributes: ['id', 'fullName']
        }
      ]
    });
    
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    // Backend Authorization Check: Parent can only view attendance if the child belongs to them
    if (req.user.roleType === 'parent' && attendance.child?.parentId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view this attendance record' });
    }

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create attendance record (admin and teacher only)
router.post('/', auth, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const attendance = await Attendance.create({
      ...req.body,
      markedBy: req.user.id
    });
    
    const newAttendance = await Attendance.findByPk(attendance.id, {
      include: [
        {
          model: Child,
          as: 'child',
          attributes: ['id', 'firstName', 'lastName']
        },
        {
          model: Session,
          as: 'session',
          attributes: ['id', 'topic', 'date']
        },
        {
          model: User,
          as: 'marker',
          attributes: ['id', 'fullName']
        }
      ]
    });
    
    res.status(201).json(newAttendance);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update attendance
router.put('/:id', auth, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const attendance = await Attendance.findByPk(req.params.id);
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    await attendance.update(req.body);
    
    const updatedAttendance = await Attendance.findByPk(req.params.id, {
      include: [
        {
          model: Child,
          as: 'child',
          attributes: ['id', 'firstName', 'lastName']
        },
        {
          model: Session,
          as: 'session',
          attributes: ['id', 'topic', 'date']
        },
        {
          model: User,
          as: 'marker',
          attributes: ['id', 'fullName']
        }
      ]
    });

    res.json(updatedAttendance);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete attendance (admin only)
router.delete('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const attendance = await Attendance.findByPk(req.params.id);
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }
    await attendance.destroy();
    res.json({ message: 'Attendance record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
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
