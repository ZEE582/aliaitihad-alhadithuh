const express = require('express');
const userService = require('../services/UserService');
const { generateTempPassword } = require('../utils/passwordGenerator');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all users (admin only)
router.get('/', auth, authorize('admin'), async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create user (admin only)
router.post('/', auth, authorize('admin'), async (req, res, next) => {
  try {
    const tempPassword = generateTempPassword();
    const user = await userService.createUser(req.body, tempPassword);
    res.status(201).json({ user, tempPassword });
  } catch (error) {
    if (error.message === 'Username or email already exists') {
      error.status = 409;
      return next(error);
    }
    if (
      error.message === 'Invalid role type' ||
      error.message === 'Parents are created from registration requests' ||
      error.message === 'National ID, full name and phone are required' ||
      error.message === 'National ID must be numeric' ||
      error.message === 'Password must be at least 8 characters'
    ) {
      error.status = 400;
      return next(error);
    }
    error.status = 500;
    return next(error);
  }
});

// Get user by ID
router.get('/:id', auth, async (req, res, next) => {
  try {
    if (req.user.roleType !== 'admin' && parseInt(req.params.id) !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const user = await userService.getUserById(req.params.id);
    res.json(user);
  } catch (error) {
    if (error.message === 'User not found') {
      error.status = 404;
      return next(error);
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user
router.put('/:id', auth, async (req, res, next) => {
  try {
    if (!userService.canUpdateUser(req.user.id, req.user.roleType, req.params.id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedUser = await userService.updateUser(req.params.id, req.body, req.user.roleType, req.user.id);
    res.json(updatedUser);
  } catch (error) {
    if (error.message === 'Current password is required' || error.message === 'Current password is incorrect') {
      error.status = 403;
      return next(error);
    }
    if (
      error.message === 'Password must be at least 8 characters' ||
      error.message === 'New password must be different from current password'
    ) {
      error.status = 400;
      return next(error);
    }
    if (error.message === 'User not found') {
      error.status = 404;
      return next(error);
    }
    if (error.name && error.name.startsWith('Sequelize')) {
      return next(error);
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user (admin only)
router.delete('/:id', auth, authorize('admin'), async (req, res, next) => {
  try {
    const result = await userService.deleteUser(req.params.id);
    res.json(result);
  } catch (error) {
    if (error.message === 'User not found') {
      error.status = 404;
      return next(error);
    }
    if (error.status === 409) {
      return res.status(409).json({ message: error.message });
    }
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(409).json({ message: 'User has linked records and cannot be deleted' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Reset password with a generated temp password (admin only)
router.post('/:id/reset-password', auth, authorize('admin'), async (req, res, next) => {
  try {
    const tempPassword = generateTempPassword();
    const user = await userService.updateUser(req.params.id, { password: tempPassword }, 'admin', req.user.id);
    res.json({ user, tempPassword });
  } catch (error) {
    if (error.message === 'User not found') {
      error.status = 404;
      return next(error);
    }
    if (
      error.message === 'Password must be at least 8 characters' ||
      error.message === 'New password must be different from current password'
    ) {
      error.status = 400;
      return next(error);
    }
    error.status = 500;
    return next(error);
  }
});

module.exports = router;
