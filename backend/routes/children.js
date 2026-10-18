const express = require('express');
const childService = require('../services/ChildService');
const { assertCanAccessChild } = require('../utils/access');
const { auth, authorize } = require('../middleware/auth');
const { Child, Section } = require('../models');

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
router.get('/:id', auth, async (req, res, next) => {
  try {
    await assertCanAccessChild(req.user, req.params.id);
    const child = await childService.getChildById(req.params.id, req.user.roleType, req.user.id);
    res.json(child);
  } catch (error) {
    if (error.message === 'Child not found') {
      error.status = 404;
      return next(error);
    }
    if (error.message === 'Not authorized') {
      error.status = 403;
      return next(error);
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
router.put('/:id', auth, authorize('admin', 'teacher'), async (req, res, next) => {
  try {
    await assertCanAccessChild(req.user, req.params.id);
    const child = await childService.updateChild(req.params.id, req.body, req.user.roleType, req.user.id);
    res.json(child);
  } catch (error) {
    if (error.message === 'Child not found') {
      error.status = 404;
      return next(error);
    }
    if (error.message === 'Not authorized') {
      error.status = 403;
      return next(error);
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete child (admin only)
router.delete('/:id', auth, authorize('admin'), async (req, res, next) => {
  try {
    const result = await childService.deleteChild(req.params.id, req.user.roleType, req.user.id);
    res.json(result);
  } catch (error) {
    if (error.message === 'Child not found') {
      error.status = 404;
      return next(error);
    }
    if (error.message === 'Not authorized') {
      error.status = 403;
      return next(error);
    }
    if (error.status === 409) {
      return res.status(409).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Place a child in a class/section (admin only)
router.put('/:id/placement', auth, authorize('admin'), async (req, res, next) => {
  try {
    const child = await Child.findByPk(req.params.id);
    if (!child) {
      return res.status(404).json({ message: 'Child not found' });
    }

    const { classID, section_id } = req.body;
    let targetClassId = classID !== undefined ? classID : child.classID;
    let targetSectionId = section_id !== undefined ? section_id : child.section_id;

    if (targetSectionId !== null && targetSectionId !== undefined) {
      const section = await Section.findByPk(targetSectionId);
      if (!section) {
        return res.status(400).json({ message: 'Section not found' });
      }
      if (classID !== undefined && targetClassId !== null && targetClassId !== undefined &&
        Number(section.classID) !== Number(targetClassId)) {
        return res.status(400).json({ message: 'Section does not belong to the given class' });
      }
      if (classID === undefined) {
        targetClassId = section.classID;
      }
    }

    await child.update({
      classID: targetClassId === undefined ? null : targetClassId,
      section_id: targetSectionId === undefined ? null : targetSectionId
    });

    const updated = await childService.getChildById(child.PersonID);
    res.json(updated);
  } catch (error) {
    if (error.message === 'Child not found') {
      return res.status(404).json({ message: 'Child not found' });
    }
    error.status = 500;
    error.publicMessage = 'Failed to place child';
    return next(error);
  }
});

// ==========================================
// Health & Medicine Endpoints (Child Health Record)
// ==========================================

const { Health_Medicine, Child_Health_Medicine } = require('../models');

// GET /api/children/:id/health - Get child health record
router.get('/:id/health', auth, async (req, res, next) => {
  try {
    const childId = req.params.id;
    await assertCanAccessChild(req.user, childId);

    const relation = await Child_Health_Medicine.findOne({
      where: { child_PersonID: childId },
      include: [{ model: Health_Medicine, as: 'healthMedicine' }]
    });

    if (!relation || !relation.healthMedicine) {
      return res.json({ Diseases: '', vaccinations: '', allergies: '' });
    }

    res.json(relation.healthMedicine);
  } catch (error) {
    if (error.message === 'Not authorized') {
      error.status = 403;
      return next(error);
    }
    error.status = 500;
    error.publicMessage = 'Failed to fetch health record';
    return next(error);
  }
});

// PUT /api/children/:id/health - Save or update child health record
router.put('/:id/health', auth, authorize('admin', 'teacher'), async (req, res, next) => {
  try {
    const childId = req.params.id;
    await assertCanAccessChild(req.user, childId);

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
    if (error.message === 'Not authorized') {
      error.status = 403;
      return next(error);
    }
    error.status = 500;
    error.publicMessage = 'Failed to save health record';
    return next(error);
  }
});

module.exports = router;
