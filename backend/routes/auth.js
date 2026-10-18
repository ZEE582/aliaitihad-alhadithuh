const express = require('express');
const { body } = require('express-validator');
const authService = require('../services/AuthService');
const { auth, revokeToken } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validation');

const router = express.Router();

// Login
router.post('/login', [
  body('username').trim().notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required')
], validateRequest, async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const result = await authService.login(username, password);
    res.json(result);
  } catch (error) {
    error.status = 401;
    return next(error);
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const classroom = await authService.resolveClassroom(req.user);
    res.json({
      user: {
        id: req.user.id,
        username: req.user.username,
        email: req.user.email,
        fullName: req.user.fullName,
        roleType: req.user.roleType,
        phone: req.user.phone,
        avatar: req.user.avatar,
        mustChangePassword: req.user.mustChangePassword,
        classroom
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Logout (revokes the current token)
router.post('/logout', auth, (req, res) => {
  revokeToken(req.token);
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;
