const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { auth } = require('../middleware/auth');
const path = require('path');

// POST /api/upload/avatar - رفع صورة شخصية (للطفل أو المعلم أو المستخدم)
router.post('/avatar', auth, (req, res) => {
  upload.single('avatar')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'الرجاء اختيار صورة لرفعها' });
    }

    const fileUrl = `/uploads/avatars/${req.file.filename}`;
    res.json({
      message: 'تم رفع الصورة بنجاح',
      filename: req.file.filename,
      url: fileUrl
    });
  });
});

// POST /api/upload/document - رفع مرفق (عذر طبي، تقرير، استمارة)
router.post('/document', auth, (req, res) => {
  upload.single('document')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'الرجاء اختيار ملف لرفعه' });
    }

    const fileUrl = `/uploads/documents/${req.file.filename}`;
    res.json({
      message: 'تم رفع الملف بنجاح',
      filename: req.file.filename,
      url: fileUrl
    });
  });
});

module.exports = router;
