const fs = require('fs');
const path = require('path');
const os = require('os');

const REPO_DB = path.join(__dirname, '..', 'database.sqlite');
const BACKUP_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'approve-test-'));
const BACKUP_DB = path.join(BACKUP_DIR, 'database.sqlite');
const dbExisted = fs.existsSync(REPO_DB);
if (dbExisted) fs.copyFileSync(REPO_DB, BACKUP_DB);

process.env.NODE_ENV = 'development';
process.env.DB_HOST = '127.0.0.1';
process.env.JWT_SECRET = 'approve_flow_test_secret_1234567890';
process.env.JWT_EXPIRATION = '1h';

const express = require('express');
const authService = require('./services/AuthService');
const passwordService = require('./services/PasswordService');
const {
  sequelize,
  User,
  Person,
  Child,
  Guardian,
  Child_Guardian,
  RegistrationRequest
} = require('./models');

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

const postJson = (url, body, token) =>
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify(body)
  });

const putJson = (url, body, token) =>
  fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify(body)
  });

async function guardianLinkCount(nationalId) {
  const user = await User.findOne({ where: { username: `${nationalId}@kg.alittihad` } });
  if (!user) return -1;
  const guardian = await Guardian.findOne({ where: { userId: user.id } });
  if (!guardian) return -1;
  return Child_Guardian.count({ where: { GID: guardian.GID } });
}

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
  const token = authService.generateToken(admin);

  const app = express();
  app.use(express.json());
  app.use('/api/registration-requests', require('./routes/registrationRequests'));
  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  const base = `http://127.0.0.1:${server.address().port}/api/registration-requests`;

  const singleNid = '1111000011';
  const singleName = 'طفل اختبار منفرد';
  const singlePost = await postJson(base, {
    childName: singleName,
    fatherName: 'أب اختبار منفرد',
    fatherNationalId: singleNid,
    fatherPhone: '0500000001',
    twins: [],
    gender: 'ذكر',
    birthDate: '2021-05-04'
  });
  const singleBody = await singlePost.json();
  assert(singlePost.status === 201 && Number.isInteger(singleBody.id), '1. single-child request created (201)');

  const singleApprove = await putJson(`${base}/${singleBody.id}`, { status: 'approved', twinNames: [] }, token);
  const singleApproved = await singleApprove.json();
  assert(
    singleApprove.status === 200 && singleApproved.status === 'approved' &&
      singleApproved.username === `${singleNid}@kg.alittihad` && singleApproved.tempPassword === singleNid,
    '2. single-child approval returns credentials'
  );
  assert(
    (await Child.count({ where: { F_name: singleName } })) === 1,
    '3. single-child approval creates exactly 1 Child row'
  );
  assert(
    (await Person.count({ where: { Name: singleName } })) === 1,
    '4. single-child approval creates exactly 1 Person row'
  );
  assert(
    (await guardianLinkCount(singleNid)) === 1,
    '5. single-child approval creates exactly 1 guardian link'
  );
  const singleParentUser = await User.findOne({ where: { username: `${singleNid}@kg.alittihad` } });
  assert(
    !!singleParentUser && singleParentUser.roleType === 'parent' && singleParentUser.mustChangePassword === true,
    '6. single-child approval creates parent account flagged mustChangePassword'
  );

  const twinNid = '2222000022';
  const twinName = 'طفل اختبار توأم';
  const twinSibling = 'توأم اختبار واحد';
  const twinPost = await postJson(base, {
    childName: twinName,
    fatherName: 'أب اختبار توأم',
    fatherNationalId: twinNid,
    fatherPhone: '0500000002',
    twins: [twinSibling],
    gender: 'أنثى',
    birthDate: '2021-06-10'
  });
  const twinBody = await twinPost.json();
  assert(twinPost.status === 201 && Number.isInteger(twinBody.id), '7. twin request created (201)');

  const twinApprove = await putJson(`${base}/${twinBody.id}`, { status: 'approved', twinNames: [twinSibling] }, token);
  const twinApproved = await twinApprove.json();
  assert(
    twinApprove.status === 200 && twinApproved.status === 'approved' &&
      twinApproved.username === `${twinNid}@kg.alittihad`,
    '8. twin approval returns parent credentials'
  );
  assert(
    (await Child.count({ where: { F_name: [twinName, twinSibling] } })) === 2,
    '9. twin approval creates exactly 2 Child rows'
  );
  assert(
    (await Child.count({ where: { F_name: twinName } })) === 1 &&
      (await Child.count({ where: { F_name: twinSibling } })) === 1,
    '10. twin approval creates no duplicate Child rows'
  );
  assert(
    (await guardianLinkCount(twinNid)) === 2,
    '11. twin approval creates exactly 2 guardian links'
  );
  assert(
    (await Child.count()) === 3,
    '12. total Child rows are exactly 3 (1 + 2), no duplication'
  );
  assert(
    (await RegistrationRequest.count({ where: { status: 'approved' } })) === 2,
    '13. both requests are approved'
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
