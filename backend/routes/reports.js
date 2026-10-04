const express = require('express');
const { Report, Child, ClassRoom, User, Guardian, Child_Guardian } = require('../models');
const { assertCanAccessChild } = require('../utils/access');
const { auth, authorize } = require('../middleware/auth');
const { Op } = require('sequelize');

const router = express.Router();

// Get all reports
router.get('/', auth, async (req, res) => {
  try {
    const { type, childId, classId } = req.query;
    let where = {};
    let ownChildIds = null;

    // Parents can only see reports about their children
    if (req.user.roleType === 'parent') {
      const guardian = await Guardian.findOne({ where: { userId: req.user.id } });
      if (guardian) {
        const relations = await Child_Guardian.findAll({
          where: { GID: guardian.GID },
          attributes: ['child_PersonID']
        });
        const childIds = relations.map(r => r.child_PersonID);
        ownChildIds = childIds;
        where.childId = { [Op.in]: childIds };
      } else {
        return res.json([]);
      }
    }

    if (type) where.type = type;
    if (childId) {
      if (ownChildIds) {
        // A parent may only narrow to one of their own children
        if (!ownChildIds.map(String).includes(String(childId))) {
          return res.status(403).json({ message: 'Not authorized' });
        }
        where.childId = Number(childId);
      } else {
        where.childId = childId;
      }
    }
    if (classId) where.classId = classId;

    const reports = await Report.findAll({
      where,
      include: [
        {
          model: Child,
          as: 'child',
          attributes: ['PersonID', 'F_name', 'L_name']
        },
        {
          model: ClassRoom,
          as: 'class',
          attributes: ['classID', 'className']
        },
        {
          model: User,
          as: 'generator',
          attributes: ['id', 'fullName', 'roleType']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch reports', error: error.message });
  }
});

// Get report by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const report = await Report.findByPk(req.params.id, {
      include: [
        {
          model: Child,
          as: 'child',
          attributes: ['PersonID', 'F_name', 'L_name']
        },
        {
          model: ClassRoom,
          as: 'class',
          attributes: ['classID', 'className']
        },
        {
          model: User,
          as: 'generator',
          attributes: ['id', 'fullName', 'roleType']
        }
      ]
    });
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    if (report.childId != null) {
      await assertCanAccessChild(req.user, report.childId);
    }

    res.json(report);
  } catch (error) {
    if (error.message === 'Not authorized') {
      return res.status(403).json({ message: error.message });
    }
    res.status(500).json({ message: 'Failed to fetch report', error: error.message });
  }
});

// Create new report (admin and teacher only)
router.post('/', auth, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const report = await Report.create({
      ...req.body,
      generatedBy: req.user.id
    });
    
    const newReport = await Report.findByPk(report.id, {
      include: [
        {
          model: Child,
          as: 'child',
          attributes: ['id', 'firstName', 'lastName']
        },
        {
          model: Class,
          as: 'class',
          attributes: ['id', 'name', 'level']
        },
        {
          model: User,
          as: 'generator',
          attributes: ['id', 'fullName', 'roleType']
        }
      ]
    });
    
    res.status(201).json(newReport);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete report (admin only)
router.delete('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const report = await Report.findByPk(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    await report.destroy();
    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
