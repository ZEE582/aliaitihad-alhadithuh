const express = require('express');
const { Report, Child, Class, User } = require('../models');
const { auth, authorize } = require('../middleware/auth');
const { Op } = require('sequelize');

const router = express.Router();

// Get all reports
router.get('/', auth, async (req, res) => {
  try {
    const { type, childId, classId } = req.query;
    let where = {};

    // Parents can only see reports about their children
    if (req.user.roleType === 'parent') {
      const children = await Child.findAll({
        where: { parentId: req.user.id },
        attributes: ['id']
      });
      const childIds = children.map(c => c.id);
      where.childId = { [Op.in]: childIds };
    }

    if (type) where.type = type;
    if (childId) where.childId = childId;
    if (classId) where.classId = classId;

    const reports = await Report.findAll({
      where,
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
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
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
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Parents can only view reports about their children
    if (req.user.roleType === 'parent' && report.childId) {
      const child = await Child.findByPk(report.childId);
      if (child.parentId !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized' });
      }
    }

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
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
