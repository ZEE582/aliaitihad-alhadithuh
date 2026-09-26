const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const mysql2 = require('mysql2/promise');
const { auth, authorize } = require('../middleware/auth');

const ENV_PATH = path.join(__dirname, '../.env');

// Helper: parse .env file into object
function parseEnv(content) {
  const result = {};
  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const idx = trimmed.indexOf('=');
    if (idx === -1) return;
    const key = trimmed.substring(0, idx).trim();
    const value = trimmed.substring(idx + 1).trim();
    result[key] = value;
  });
  return result;
}

// Helper: write object back to .env file
function writeEnv(envObj) {
  const content = Object.entries(envObj)
    .map(([k, v]) => `${k}=${v}`)
    .join('\n');
  fs.writeFileSync(ENV_PATH, content, 'utf8');
}

// GET /api/settings/database - get current DB settings (Admin only)
router.get('/database', auth, authorize('admin'), (req, res) => {
  try {
    const raw = fs.readFileSync(ENV_PATH, 'utf8');
    const env = parseEnv(raw);
    res.json({
      host: env.DB_HOST || '127.0.0.1',
      port: env.DB_PORT || '3306',
      user: env.DB_USER || 'root',
      password: env.DB_PASSWORD || '',
      database: env.DB_NAME || 'kindergarten_db',
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to read settings', error: err.message });
  }
});

// POST /api/settings/database/test - test connection (Admin only)
router.post('/database/test', auth, authorize('admin'), async (req, res) => {
  const { host, port, user, password, database } = req.body;
  try {
    const conn = await mysql2.createConnection({
      host, port: parseInt(port), user, password, database,
      connectTimeout: 5000,
    });
    await conn.query('SELECT 1');
    await conn.end();
    res.json({ success: true, message: 'Connection successful ✅' });
  } catch (err) {
    res.status(400).json({ success: false, message: `Connection failed: ${err.message}` });
  }
});

// PUT /api/settings/database - save DB settings to .env (Admin only)
router.put('/database', auth, authorize('admin'), (req, res) => {
  const { host, port, user, password, database } = req.body;
  try {
    const raw = fs.readFileSync(ENV_PATH, 'utf8');
    const env = parseEnv(raw);
    env.DB_HOST = host || env.DB_HOST;
    env.DB_PORT = port || env.DB_PORT;
    env.DB_USER = user || env.DB_USER;
    env.DB_PASSWORD = password !== undefined ? password : env.DB_PASSWORD;
    env.DB_NAME = database || env.DB_NAME;
    writeEnv(env);
    res.json({ success: true, message: 'Settings saved. Restart server to apply changes.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to save settings', error: err.message });
  }
});

module.exports = router;
