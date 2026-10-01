const express = require('express');
const childService = require('../services/ChildService');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all children
router.get('/', auth, async (req, res) => {
  try {
    const children = await childService.getAllChildren(req.user.roleType, req.user.id);
    res.json(children);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get child by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const child = await childService.getChildById(req.params.id, req.user.roleType, req.user.id);
    res.json(child);
  } catch (error) {
    if (error.message === 'Child not found') {
      return res.status(404).json({ message: error.message });
    }
    if (error.message === 'Not authorized') {
      return res.status(403).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new child (admin and teacher only)
router.post('/', auth, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const child = await childService.createChild(req.body);
    res.status(201).json(child);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update child (admin and teacher only)
router.put('/:id', auth, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const child = await childService.updateChild(req.params.id, req.body, req.user.roleType, req.user.id);
    res.json(child);
  } catch (error) {
    if (error.message === 'Child not found') {
      return res.status(404).json({ message: error.message });
    }
    if (error.message === 'Not authorized') {
      return res.status(403).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete child (admin only)
router.delete('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const result = await childService.deleteChild(req.params.id, req.user.roleType, req.user.id);
    res.json(result);
  } catch (error) {
    if (error.message === 'Child not found') {
      return res.status(404).json({ message: error.message });
    }
    if (error.message === 'Not authorized') {
      return res.status(403).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// ==========================================
// Health & Medicine Endpoints (Child Health Record)
// ==========================================

const { Health_Medicine, Child_Health_Medicine } = require('../models');

// GET /api/children/:id/health - Get child health record
router.get('/:id/health', auth, async (req, res) => {
  try {
    const childId = req.params.id;
    const relation = await Child_Health_Medicine.findOne({
      where: { child_PersonID: childId },
      include: [{ model: Health_Medicine, as: 'healthMedicine' }]
    });

    if (!relation || !relation.healthMedicine) {
      return res.json({ Diseases: '', vaccinations: '', allergies: '' });
    }

    res.json(relation.healthMedicine);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch health record', error: error.message });
  }
});

// PUT /api/children/:id/health - Save or update child health record
router.put('/:id/health', auth, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const childId = req.params.id;
    const { Diseases, vaccinations, allergies } = req.body;

    let relation = await Child_Health_Medicine.findOne({
      where: { child_PersonID: childId }
    });

    let healthRecord;
    if (relation) {
      healthRecord = await Health_Medicine.findByPk(relation.CH_M_ID);
      if (healthRecord) {
        await healthRecord.update({ Diseases, vaccinations, allergies });
      }
    } else {
      healthRecord = await Health_Medicine.create({ Diseases, vaccinations, allergies });
      await Child_Health_Medicine.create({
        child_PersonID: childId,
        CH_M_ID: healthRecord.CH_M_ID
      });
    }

    res.json({ message: 'Health record updated successfully', health: healthRecord });
  } catch (error) {
    res.status(500).json({ message: 'Failed to save health record', error: error.message });
  }
});

module.exports = router;
