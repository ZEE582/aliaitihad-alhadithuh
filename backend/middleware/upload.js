const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads folder and subdirectories exist
const uploadDir = path.join(__dirname, '../uploads');
const avatarsDir = path.join(uploadDir, 'avatars');
const documentsDir = path.join(uploadDir, 'documents');

[uploadDir, avatarsDir, documentsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'avatar') {
      cb(null, avatarsDir);
    } else {
      cb(null, documentsDir);
    }
  },
  filename: (req, file, cb) => {
    // Unique safe filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname).toLowerCase();
    const ownerPrefix = `u${req.user ? req.user.id : '0'}-`;
    cb(null, ownerPrefix + file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// File filter (images + common document formats)
const fileFilter = (req, file, cb) => {
  const allowedExtensions = /^(jpe?g|png|webp|pdf|docx?)$/;
  const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
  
  if (allowedExtensions.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type! Allowed: images (jpg, png, webp) and documents (pdf, doc, docx)'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  fileFilter
});

module.exports = upload;
