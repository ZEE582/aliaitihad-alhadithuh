const fs = require('fs');
const path = require('path');
const os = require('os');

const REPO_DB = path.join(__dirname, '..', 'database.sqlite');
const BACKUP_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'pwd-test-'));
const BACKUP_DB = path.join(BACKUP_DIR, 'database.sqlite');
const dbExisted = fs.existsSync(REPO_DB);
if (dbExisted) fs.copyFileSync(REPO_DB, BACKUP_DB);

process.env.NODE_ENV = 'development';
process.env.DB_HOST = '127.0.0.1';
process.env.JWT_SECRET = 'password_change_flow_test_secret_1234567890';
process.env.JWT_EXPIRATION = '1h';

const express = require('express');
const authService = require('./services/AuthService');
const userService = require('./services/UserService');
const passwordService = require('./services/PasswordService');
const { sequelize, User } = require('./models');

let server = null;
const summary = { passed: 0, failed: 0 };

function assert(condition, name) {
  if (condition) {
    console.log(`PASS ${name}`);
    summary.passed += 1;
  } else {
    console.error(`FAIL ${name}`);
    summary.failed += 1;
  }
}

const reqJson = (method, url, body, token) =>
  fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    ...(body ? { body: JSON.stringify(body) } : {})
  });

async function run() {
  await sequelize.authenticate();
  await sequelize.sync({ force: true });

  const admin = await User.create({
    username: 'admin_test',
    email: 'admin_test@alittihad.edu',
    password: await passwordService.hash('Admin@123'),
    fullName: 'Admin Test',
    roleType: 'admin',
    mustChangePassword: false
  });
  const adminToken = authService.generateToken(admin);

  const created = await userService.createUser(
    {
      nationalId: '1111111111',
      fullName: 'Teacher Temp',
      phone: '0590000001',
      roleType: 'teacher'
    },
    'TempPass@123'
  );
  assert(created.mustChangePassword === true, '1. admin-created user is flagged mustChangePassword');

  const app = express();
  app.use(express.json());
  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/users', require('./routes/users'));
  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  const base = `http://127.0.0.1:${server.address().port}/api`;

  const login1 = await reqJson('POST', `${base}/auth/login`, { username: 'T1111111111@kg.alittihad', password: 'TempPass@123' });
  const loginBody = await login1.json();
  assert(login1.status === 200 && loginBody.user.mustChangePassword === true, '2. login returns mustChangePassword = true');
  const teacherToken = loginBody.token;

  const me = await reqJson('GET', `${base}/auth/me`, null, teacherToken);
  assert(me.status === 200, '3. GET /auth/me is allowed during forced change');

  const blocked = await reqJson('GET', `${base}/users/${created.id}`, null, teacherToken);
  const blockedBody = await blocked.json();
  assert(
    blocked.status === 403 && blockedBody.code === 'PASSWORD_CHANGE_REQUIRED',
    '4. protected route returns 403 PASSWORD_CHANGE_REQUIRED'
  );

  const adminOwn = await reqJson('GET', `${base}/users/${admin.id}`, null, adminToken);
  assert(adminOwn.status === 200, '5. normal user is not over-blocked');

  const change = await reqJson(
    'PUT',
    `${base}/users/${created.id}`,
    { currentPassword: 'TempPass@123', newPassword: 'NewSecure@123' },
    teacherToken
  );
  const changeBody = await change.json();
  assert(
    change.status === 200 && changeBody.mustChangePassword === false,
    '6. self password change clears mustChangePassword'
  );

  const afterChange = await reqJson('GET', `${base}/users/${created.id}`, null, teacherToken);
  assert(afterChange.status === 200, '7. protected route is accessible after the change');

  const relogin = await reqJson('POST', `${base}/auth/login`, { username: 'T1111111111@kg.alittihad', password: 'NewSecure@123' });
  const reloginBody = await relogin.json();
  assert(
    relogin.status === 200 && reloginBody.user.mustChangePassword === false,
    '8. subsequent login returns mustChangePassword = false'
  );

  const oldLogin = await reqJson('POST', `${base}/auth/login`, { username: 'T1111111111@kg.alittihad', password: 'TempPass@123' });
  assert(oldLogin.status === 401, '9. old temporary password is invalid after change');

  const created2 = await userService.createUser(
    {
      nationalId: '2222222222',
      fullName: 'Secretary Temp',
      phone: '0590000002',
      roleType: 'secretary'
    },
    'ResetPass@123'
  );
  await User.update({ mustChangePassword: false }, { where: { id: created2.id } });
  const beforeReset = await User.findByPk(created2.id);
  assert(beforeReset.mustChangePassword === false, '10. active user starts with mustChangePassword = false');
  const reset = await reqJson('POST', `${base}/users/${created2.id}/reset-password`, {}, adminToken);
  const resetBody = await reset.json();
  assert(
    reset.status === 200 && resetBody.tempPassword && resetBody.user.mustChangePassword === true,
    '11. admin reset issues temp password and re-flags mustChangePassword'
  );

  const login2 = await reqJson('POST', `${base}/auth/login`, { username: 'S2222222222@kg.alittihad', password: resetBody.tempPassword });
  const login2Body = await login2.json();
  const blocked2 = await reqJson('GET', `${base}/users/${created2.id}`, null, login2Body.token);
  const blocked2Body = await blocked2.json();
  assert(
    blocked2.status === 403 && blocked2Body.code === 'PASSWORD_CHANGE_REQUIRED',
    '12. reset user is forced to change password again'
  );
}

run()
  .catch((err) => {
    console.error('UNEXPECTED ERROR:', err && err.message ? err.message : err);
    summary.failed += 1;
  })
  .finally(async () => {
    try {
      if (server) server.close();
    } catch (e) {}
    try {
      await sequelize.close();
    } catch (e) {}
    try {
      fs.rmSync(`${REPO_DB}-wal`, { force: true });
      fs.rmSync(`${REPO_DB}-shm`, { force: true });
      if (dbExisted) fs.copyFileSync(BACKUP_DB, REPO_DB);
      else fs.rmSync(REPO_DB, { force: true });
      fs.rmSync(BACKUP_DIR, { recursive: true, force: true });
    } catch (e) {
      console.error('CLEANUP ERROR:', e.message);
      summary.failed += 1;
    }
    console.log(`\nSummary: ${summary.passed} Passed, ${summary.failed} Failed`);
    process.exit(summary.failed === 0 ? 0 : 1);
  });
