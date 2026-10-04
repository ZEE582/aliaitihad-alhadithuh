const express = require('express');
const router = express.Router();

// Settings routes removed:
// - GET  /database        exposed DB_PASSWORD from .env
// - POST /database/test   SSRF via mysql2.createConnection on client-supplied host
// - PUT  /database        wrote arbitrary values into .env
// The router is no longer mounted in server.js.

module.exports = router;
