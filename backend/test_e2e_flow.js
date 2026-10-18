const fs = require('fs');
const path = require('path');
const os = require('os');

const REPO_DB = path.join(__dirname, '..', 'database.sqlite');
const BACKUP_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'e2e-test-'));
const BACKUP_DB = path.join(BACKUP_DIR, 'database.sqlite');
const dbExisted = fs.existsSync(REPO_DB);
if (dbExisted) fs.copyFileSync(REPO_DB, BACKUP_DB);

process.env.NODE_ENV = 'development';
process.env.DB_HOST = '127.0.0.1';
process.env.JWT_SECRET = 'e2e_flow_test_secret_1234567890';
process.env.JWT_EXPIRATION = '1h';

const express = require('express');
const errorHandler = require('./middleware/errorHandler');
const passwordService = require('./services/PasswordService');
const { sequelize, User } = require('./models');

let server = null;
let summary = { passed: 0, failed: 0 };

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

const login = async (base, username, password) => {
  const res = await reqJson('POST', `${base}/auth/login`, { username, password });
  const data = await res.json();
  return { status: res.status, token: data.token, user: data.user };
};

async function run() {
  await sequelize.authenticate();
  await sequelize.sync({ force: true });

  const admin = await User.create({
    username: 'admin_e2e',
    email: 'admin_e2e@alittihad.edu',
    password: await passwordService.hash('Admin@123'),
    fullName: 'Admin E2E',
    roleType: 'admin',
    mustChangePassword: false
  });

  const secretary = await User.create({
    username: 'secretary_e2e',
    email: 'secretary_e2e@alittihad.edu',
    password: await passwordService.hash('Secre@123'),
    fullName: 'Secretary E2E',
    roleType: 'secretary',
    mustChangePassword: false
  });

  const app = express();
  app.use(express.json());
  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/users', require('./routes/users'));
  app.use('/api/children', require('./routes/children'));
  app.use('/api/registration-requests', require('./routes/registrationRequests'));
  app.use(errorHandler);
  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  const base = `http://127.0.0.1:${server.address().port}/api`;

  const REQ_A_NATIONAL = '9876543210';
  const REQ_A_NAME = 'E2E Child Alpha';

  const adminLogin = await login(base, admin.username, 'Admin@123');
  assert(adminLogin.status === 200 && !!adminLogin.token && adminLogin.user.mustChangePassword === false, '1. admin logs in with real credentials');

  const submitA = await reqJson('POST', `${base}/registration-requests`, {
    childName: REQ_A_NAME,
    fatherName: 'E2E Father Alpha',
    fatherNationalId: REQ_A_NATIONAL,
    fatherPhone: '0592222222',
    twins: [],
    gender: 'ذكر',
    birthDate: '2021-03-03'
  });
  const requestA = await submitA.json();
  assert(submitA.status === 201 && Number.isInteger(requestA.id), '2. public submits registration request A');

  const submitB = await reqJson('POST', `${base}/registration-requests`, {
    childName: 'E2E Child Beta',
    fatherName: 'E2E Father Beta',
    fatherPhone: '0591111111',
    twins: [],
    gender: 'أنثى',
    birthDate: '2021-04-04'
  });
  const requestB = await submitB.json();
  assert(submitB.status === 201 && Number.isInteger(requestB.id), '3. public submits registration request B');

  const listRes = await reqJson('GET', `${base}/registration-requests`, null, adminLogin.token);
  const listBody = await listRes.json();
  assert(listRes.status === 200 && Array.isArray(listBody) && listBody.length === 2, '4. admin lists the two pending requests');

  const approveA = await reqJson('PUT', `${base}/registration-requests/${requestA.id}`, { status: 'approved' }, adminLogin.token);
  const approveABody = await approveA.json();
  assert(
    approveA.status === 200 && approveABody.status === 'approved' &&
    approveABody.username === `${REQ_A_NATIONAL}@kg.alittihad` && approveABody.tempPassword === REQ_A_NATIONAL,
    '5. admin approval creates parent account with national id temp password'
  );

  const parentA = await User.findOne({ where: { username: `${REQ_A_NATIONAL}@kg.alittihad` } });
  assert(parentA && parentA.roleType === 'parent' && parentA.mustChangePassword === true, '6. approved parent stored as roleType=parent with mustChangePassword=true');

  const parentALogin = await login(base, parentA.username, REQ_A_NATIONAL);
  assert(parentALogin.status === 200 && parentALogin.user.mustChangePassword === true, '7. parent A logs in with temp password and is flagged for change');

  const blockedChildren = await reqJson('GET', `${base}/children`, null, parentALogin.token);
  const blockedBody = await blockedChildren.json();
  assert(
    blockedChildren.status === 403 && blockedBody && blockedBody.code === 'PASSWORD_CHANGE_REQUIRED',
    '8. parent A is blocked from /children until password change'
  );

  const blockedRequests = await reqJson('GET', `${base}/registration-requests`, null, parentALogin.token);
  assert(blockedRequests.status === 403, '9. parent A cannot list registration requests');

  const changeSelf = await reqJson('PUT', `${base}/users/${parentA.id}`, {
    currentPassword: REQ_A_NATIONAL,
    newPassword: 'NewParentAlpha@2026'
  }, parentALogin.token);
  const changeSelfBody = await changeSelf.json();
  assert(
    changeSelf.status === 200 && changeSelfBody.mustChangePassword === false &&
    (changeSelfBody.password === undefined || changeSelfBody.password === null) &&
    (changeSelfBody.tempPassword === undefined || changeSelfBody.tempPassword === null),
    '10. parent A changes own password, flag clears, no secret leaked in response'
  );

  const parentANewLogin = await login(base, parentA.username, 'NewParentAlpha@2026');
  assert(parentANewLogin.status === 200 && parentANewLogin.user.mustChangePassword === false, '11. parent A logs in with the new password');

  const oldLogin = await login(base, parentA.username, REQ_A_NATIONAL);
  assert(oldLogin.status === 401, '12. temp password is invalid after the change');

  const childrenRes = await reqJson('GET', `${base}/children`, null, parentANewLogin.token);
  const childrenBody = await childrenRes.json();
  assert(
    childrenRes.status === 200 && Array.isArray(childrenBody) &&
    childrenBody.some((c) => c.F_name === REQ_A_NAME || c.Name === REQ_A_NAME),
    '13. parent A sees the approved child after password change'
  );

  const selfRes = await reqJson('GET', `${base}/users/${parentA.id}`, null, parentANewLogin.token);
  assert(selfRes.status === 200, '14. parent A can read own profile');

  const resetRes = await reqJson('POST', `${base}/users/${parentA.id}/reset-password`, {}, adminLogin.token);
  const resetBody = await resetRes.json();
  assert(resetRes.status === 200 && !!resetBody.tempPassword && resetBody.user.mustChangePassword === true, '15. admin reset re-flags mustChangePassword=true');

  const parentAResetLogin = await login(base, parentA.username, resetBody.tempPassword);
  assert(parentAResetLogin.status === 200 && parentAResetLogin.user.mustChangePassword === true, '16. reset temp password logs in with forced change');

  const secretaryLogin = await login(base, secretary.username, 'Secre@123');
  assert(secretaryLogin.status === 200 && !!secretaryLogin.token, '17. secretary logs in with real credentials');

  const secList = await reqJson('GET', `${base}/registration-requests`, null, secretaryLogin.token);
  assert(secList.status === 200, '18. secretary can list registration requests');

  const approveB = await reqJson('PUT', `${base}/registration-requests/${requestB.id}`, { status: 'approved' }, secretaryLogin.token);
  const approveBBody = await approveB.json();
  assert(
    approveB.status === 200 && approveBBody.status === 'approved' &&
    approveBBody.username === 'parent0591111111' && !!approveBBody.tempPassword,
    '19. secretary approves request B and gets generated temp password'
  );

  const parentBLogin = await login(base, 'parent0591111111', approveBBody.tempPassword);
  assert(parentBLogin.status === 200 && parentBLogin.user.mustChangePassword === true, '20. parent B logs in with forced change flag');

  const blockedB = await reqJson('GET', `${base}/children`, null, parentBLogin.token);
  assert(blockedB.status === 403, '21. parent B is blocked from /children until password change');

  const changeSelfB = await reqJson('PUT', `${base}/users/${parentBLogin.user.id}`, {
    currentPassword: approveBBody.tempPassword,
    newPassword: 'NewParentBeta@2026'
  }, parentBLogin.token);
  const changeSelfBBody = await changeSelfB.json();
  assert(changeSelfB.status === 200 && changeSelfBBody.mustChangePassword === false, '22. parent B changes own password, flag clears');

  const parentBNewLogin = await login(base, 'parent0591111111', 'NewParentBeta@2026');
  const childrenBRes = await reqJson('GET', `${base}/children`, null, parentBNewLogin.token);
  const childrenBBody = await childrenBRes.json();
  assert(
    parentBNewLogin.status === 200 && childrenBRes.status === 200 && Array.isArray(childrenBBody) &&
    childrenBBody.some((c) => c.F_name === 'E2E Child Beta' || c.Name === 'E2E Child Beta'),
    '23. parent B sees the approved child after password change'
  );

  const listAfter = await reqJson('GET', `${base}/registration-requests`, null, adminLogin.token);
  const listAfterBody = await listAfter.json();
  assert(listAfter.status === 200 && listAfterBody.every((r) => r.status === 'approved'), '24. both requests end approved');
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