const path = require('path');
const os = require('os');
const fs = require('fs');
const crypto = require('crypto');
const { spawn } = require('child_process');

const BACKEND = path.join(__dirname, '..');
const TEST_DB = 'kg_test_tmp';
const TEST_PORT = 26140;
const LOG_DIR = path.join(os.tmpdir(), 'kgfix');

function mysql() {
  return require(path.join(BACKEND, 'node_modules', 'mysql2', 'promise'));
}

async function dropAndCreateDb(env) {
  const { createConnection } = mysql();
  const conn = await createConnection({
    host: env.DB_HOST,
    port: Number(env.DB_PORT),
    user: env.DB_USER,
    password: env.DB_PASSWORD
  });
  await conn.query(`DROP DATABASE IF EXISTS \`${TEST_DB}\``);
  await conn.query(`CREATE DATABASE \`${TEST_DB}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  await conn.end();
}

async function dropDb(env) {
  const { createConnection } = mysql();
  const conn = await createConnection({
    host: env.DB_HOST,
    port: Number(env.DB_PORT),
    user: env.DB_USER,
    password: env.DB_PASSWORD
  });
  await conn.query(`DROP DATABASE IF EXISTS \`${TEST_DB}\``);
  await conn.end();
}

function buildEnv() {
  const secret = crypto.randomBytes(32).toString('hex');
  return {
    ...process.env,
    NODE_ENV: 'test',
    DB_HOST: 'localhost',
    DB_PORT: '3306',
    DB_USER: 'root',
    DB_PASSWORD: '',
    DB_NAME: TEST_DB,
    PORT: String(TEST_PORT),
    JWT_SECRET: secret,
    JWT_EXPIRATION: '1h',
    CORS_ORIGINS: ''
  };
}

async function init() {
  const env = buildEnv();
  Object.assign(process.env, env);

  await dropAndCreateDb(env);

  const models = require(path.join(BACKEND, 'models'));
  await models.sequelize.sync({ force: true });

  const seed = require('./seed');
  const ctx = await seed();

  if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });
  const outFd = fs.openSync(path.join(LOG_DIR, 'server.out.log'), 'a');
  const errFd = fs.openSync(path.join(LOG_DIR, 'server.err.log'), 'a');
  const server = spawn(process.execPath, ['server.js'], {
    cwd: BACKEND,
    env,
    stdio: ['ignore', outFd, errFd]
  });

  const baseUrl = `http://127.0.0.1:${TEST_PORT}/api`;

  const started = Date.now();
  for (;;) {
    if (server.exitCode !== null) {
      throw new Error(`test server exited with code ${server.exitCode}`);
    }
    try {
      const res = await fetch(`${baseUrl}/health`);
      if (res.status === 200) break;
    } catch (e) {}
    if (Date.now() - started > 30000) throw new Error('test server did not become healthy');
    await new Promise((r) => setTimeout(r, 400));
  }

  const { createConnection } = mysql();
  const dbConn = await createConnection({
    host: env.DB_HOST,
    port: Number(env.DB_PORT),
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: TEST_DB
  });

  async function http(method, apiPath, token, body) {
    const headers = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    if (body !== undefined) headers['Content-Type'] = 'application/json';
    const res = await fetch(`${baseUrl}${apiPath}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined
    });
    const text = await res.text();
    let data;
    try { data = text ? JSON.parse(text) : null; } catch { data = text; }
    return { status: res.status, data };
  }

  async function db(sql, params) {
    const [rows] = await dbConn.query(sql, params);
    return rows;
  }

  async function stop() {
    try { server.kill('SIGKILL'); } catch (e) {}
    await new Promise((r) => setTimeout(r, 600));
    try { await dbConn.end(); } catch (e) {}
    try { await models.sequelize.close(); } catch (e) {}
    for (let i = 0; i < 6; i++) {
      try {
        await dropDb(env);
        break;
      } catch (e) {
        await new Promise((r) => setTimeout(r, 500));
      }
    }
  }

  return { ...ctx, http, db, stop, baseUrl, server, env, models };
}

module.exports = { init, TEST_DB, TEST_PORT };
