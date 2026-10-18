const express = require('express');
const { Guardian: Parent, User, Child, Child_Guardian, RelationType } = require('../models');
const { assertCanAccessChild } = require('../utils/access');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all parents
router.get('/', auth, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const parents = await Parent.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'fullName', 'email', 'phone', 'roleType']
        },
        {
          model: Child,
          as: 'children'
        }
      ]
    });
    res.json(parents);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get parent by ID
router.get('/:id', auth, async (req, res, next) => {
  try {
    const parent = await Parent.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'fullName', 'email', 'phone', 'roleType']
        },
        {
          model: Child,
          as: 'children'
        }
      ]
    });
    
    if (!parent) {
      return res.status(404).json({ message: 'Parent not found' });
    }

    // Role-based access: admin, the guardian himself, or a teacher
    // responsible for one of this guardian's children
    if (req.user.roleType === 'admin') {
      // allowed
    } else if (req.user.roleType === 'parent') {
      if (parent.userId !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized' });
      }
    } else if (req.user.roleType === 'teacher') {
      const link = await Child_Guardian.findOne({
        where: { GID: parent.GID },
        attributes: ['child_PersonID']
      });

      if (!link) {
        return res.status(403).json({ message: 'Not authorized' });
      }

      await assertCanAccessChild(req.user, link.child_PersonID);
    } else {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(parent);
  } catch (error) {
    if (error.message === 'Not authorized') {
      error.status = 403;
      return next(error);
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Create parent profile
router.post('/', auth, authorize('admin'), async (req, res) => {
  try {
    const parent = await Parent.create(req.body);
    
    const newParent = await Parent.findByPk(parent.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'fullName', 'email', 'phone', 'roleType']
        }
      ]
    });
    
    res.status(201).json(newParent);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update parent
router.put('/:id', auth, async (req, res) => {
  try {
    const parent = await Parent.findByPk(req.params.id);
    if (!parent) {
      return res.status(404).json({ message: 'Parent not found' });
    }

    // Backend Auth Check: Only admin or the parent owner can update
    if (req.user.roleType !== 'admin' && (req.user.roleType !== 'parent' || parent.userId !== req.user.id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await parent.update(req.body);
    
    const updatedParent = await Parent.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'fullName', 'email', 'phone', 'roleType']
        }
      ]
    });

    res.json(updatedParent);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Link a child to a parent (admin only)
router.post('/:id/children', auth, authorize('admin'), async (req, res, next) => {
  try {
    const parent = await Parent.findByPk(req.params.id);
    if (!parent) {
      return res.status(404).json({ message: 'Parent not found' });
    }

    const child = await Child.findByPk(req.body.childId);
    if (!child) {
      return res.status(404).json({ message: 'Child not found' });
    }

    const existing = await Child_Guardian.findOne({
      where: { GID: parent.GID, child_PersonID: child.PersonID }
    });
    if (existing) {
      return res.status(409).json({ message: 'Child already linked to this parent' });
    }

    let relationType = await RelationType.findOne();
    if (!relationType) {
      relationType = await RelationType.create({ relation_type: 'Parent' });
    }

    await Child_Guardian.create({
      GID: parent.GID,
      child_PersonID: child.PersonID,
      RelationTypeID: relationType.RelationTypeID
    });

    res.status(201).json({ message: 'Child linked successfully' });
  } catch (error) {
    error.status = 500;
    error.publicMessage = 'Failed to link child to parent';
    return next(error);
  }
});

// Unlink a child from a parent (admin only)
router.delete('/:id/children/:childId', auth, authorize('admin'), async (req, res, next) => {
  try {
    const parent = await Parent.findByPk(req.params.id);
    if (!parent) {
      return res.status(404).json({ message: 'Parent not found' });
    }

    const link = await Child_Guardian.findOne({
      where: { GID: parent.GID, child_PersonID: req.params.childId }
    });
    if (!link) {
      return res.status(404).json({ message: 'Child not linked to this parent' });
    }

    await link.destroy();
    res.json({ message: 'Child unlinked successfully' });
  } catch (error) {
    error.status = 500;
    error.publicMessage = 'Failed to unlink child from parent';
    return next(error);
  }
});

// Delete parent (admin only)
router.delete('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const parent = await Parent.findByPk(req.params.id);
    if (!parent) {
      return res.status(404).json({ message: 'Parent not found' });
    }

    await parent.destroy();
    res.json({ message: 'Parent profile deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
