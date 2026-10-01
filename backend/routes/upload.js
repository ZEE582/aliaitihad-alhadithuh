const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { auth } = require('../middleware/auth');
const path = require('path');

// POST /api/upload/avatar - Upload avatar image (for child, teacher, or user)
router.post('/avatar', auth, (req, res) => {
  upload.single('avatar')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'Please select an image to upload' });
    }

    const fileUrl = `/uploads/avatars/${req.file.filename}`;
    res.json({
      message: 'Image uploaded successfully',
      filename: req.file.filename,
      url: fileUrl
    });
  });
});

// POST /api/upload/document - Upload document (medical excuse, report, form)
router.post('/document', auth, (req, res) => {
  upload.single('document')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'Please select a file to upload' });
    }

    const fileUrl = `/uploads/documents/${req.file.filename}`;
    res.json({
      message: 'File uploaded successfully',
      filename: req.file.filename,
      url: fileUrl
    });
  });
});

module.exports = router;
