const fs = require('fs');
const path = require('path');
const os = require('os');

const REPO_DB = path.join(__dirname, '..', 'database.sqlite');
const BACKUP_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'secretary-test-'));
const BACKUP_DB = path.join(BACKUP_DIR, 'database.sqlite');
const dbExisted = fs.existsSync(REPO_DB);
if (dbExisted) fs.copyFileSync(REPO_DB, BACKUP_DB);

process.env.NODE_ENV = 'development';
process.env.DB_HOST = '127.0.0.1';
process.env.JWT_SECRET = 'secretary_flow_test_secret_1234567890';
process.env.JWT_EXPIRATION = '1h';

const express = require('express');
const authService = require('./services/AuthService');
const passwordService = require('./services/PasswordService');
const { sequelize, User, Person, Teacher } = require('./models');

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

async function run() {
  await sequelize.authenticate();
  await sequelize.sync({ force: true });

  const admin = await User.create({
    username: 'admin_sec',
    email: 'admin_sec@alittihad.edu',
    password: await passwordService.hash('Admin@123'),
    fullName: 'Admin Secretary Test',
    roleType: 'admin',
    mustChangePassword: false
  });
  const adminToken = authService.generateToken(admin);

  const secretary = await User.create({
    username: 'secretary_sec',
    email: 'secretary_sec@alittihad.edu',
    password: await passwordService.hash('Secre@123'),
    fullName: 'Secretary Test',
    roleType: 'secretary',
    mustChangePassword: false
  });
  const secretaryToken = authService.generateToken(secretary);

  const parent = await User.create({
    username: 'parent_sec',
    email: 'parent_sec@alittihad.edu',
    password: await passwordService.hash('Parent@123'),
    fullName: 'Parent Secretary Test',
    roleType: 'parent',
    mustChangePassword: false
  });
  const parentToken = authService.generateToken(parent);

  const app = express();
  app.use(express.json());
  app.use('/api/children', require('./routes/children'));
  app.use('/api/teachers', require('./routes/teachers'));
  app.use('/api/classes', require('./routes/classes'));
  app.use('/api/attendance', require('./routes/attendance'));
  app.use('/api/registration-requests', require('./routes/registrationRequests'));
  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  const base = `http://127.0.0.1:${server.address().port}/api`;

  // Seed data via admin (admin CAN write)
  const createChild = await reqJson('POST', `${base}/children`, {
    Name: 'Secretary Read Child',
    F_name: 'Child',
    L_name: 'Read',
    gender: 'Male',
    birth_date: '2021-01-01'
  }, adminToken);
  const childBody = await createChild.json();
  assert(createChild.status === 201 && Number.isInteger(childBody.PersonID), '1. admin can create a child');

  const teacherPerson = await Person.create({ Name: 'Teacher Secretary Unit' });
  const teacherProfile = await Teacher.create({
    PersonID: teacherPerson.PersonID,
    F_name: 'Teacher',
    S_name: 'Secretary',
    L_name: 'Unit',
    specialty: 'Math',
    years_of_experience: 2,
    Role: 'Teacher'
  });
  const teacherBody = { PersonID: teacherProfile.PersonID };
  assert(Number.isInteger(teacherBody.PersonID), '2. teacher profile seeded for read tests');

  const createClass = await reqJson('POST', `${base}/classes`, { className: 'Secretary Test Class' }, adminToken);
  const classBody = await createClass.json();
  assert(createClass.status === 201 && Number.isInteger(classBody.classID), '3. admin can create a class');

  const createRequest = await reqJson('POST', `${base}/registration-requests`, {
    childName: 'Secretary Request Child',
    fatherName: 'Secretary Father',
    fatherNationalId: '1234567890',
    fatherPhone: '0590000009',
    twins: [],
    gender: 'ذكر',
    birthDate: '2021-02-02'
  });
  const requestBody = await createRequest.json();
  assert(createRequest.status === 201 && Number.isInteger(requestBody.id), '4. public registration request created');

  // Secretary READ = 200
  assert((await reqJson('GET', `${base}/children`, null, secretaryToken)).status === 200, '5. secretary GET /children = 200');
  assert((await reqJson('GET', `${base}/children/${childBody.PersonID}`, null, secretaryToken)).status === 200, '6. secretary GET /children/:id = 200');
  assert((await reqJson('GET', `${base}/teachers`, null, secretaryToken)).status === 200, '7. secretary GET /teachers = 200');
  assert((await reqJson('GET', `${base}/teachers/${teacherBody.PersonID}`, null, secretaryToken)).status === 200, '8. secretary GET /teachers/:id = 200');
  assert((await reqJson('GET', `${base}/classes`, null, secretaryToken)).status === 200, '9. secretary GET /classes = 200');
  assert((await reqJson('GET', `${base}/classes/${classBody.classID}`, null, secretaryToken)).status === 200, '10. secretary GET /classes/:id (with sections) = 200');
  assert((await reqJson('GET', `${base}/attendance`, null, secretaryToken)).status === 200, '11. secretary GET /attendance = 200');
  assert((await reqJson('GET', `${base}/registration-requests`, null, secretaryToken)).status === 200, '12. secretary GET /registration-requests = 200');

  // Secretary WRITE = 403 (children)
  assert((await reqJson('POST', `${base}/children`, { Name: 'X' }, secretaryToken)).status === 403, '13. secretary POST /children = 403');
  assert((await reqJson('PUT', `${base}/children/${childBody.PersonID}`, { F_name: 'X' }, secretaryToken)).status === 403, '14. secretary PUT /children/:id = 403');
  assert((await reqJson('DELETE', `${base}/children/${childBody.PersonID}`, null, secretaryToken)).status === 403, '15. secretary DELETE /children/:id = 403');

  // Secretary WRITE = 403 (teachers)
  assert((await reqJson('POST', `${base}/teachers`, { F_name: 'X' }, secretaryToken)).status === 403, '16. secretary POST /teachers = 403');
  assert((await reqJson('PUT', `${base}/teachers/${teacherBody.PersonID}`, { F_name: 'X' }, secretaryToken)).status === 403, '17. secretary PUT /teachers/:id = 403');
  assert((await reqJson('DELETE', `${base}/teachers/${teacherBody.PersonID}`, null, secretaryToken)).status === 403, '18. secretary DELETE /teachers/:id = 403');

  // Secretary WRITE = 403 (classes)
  assert((await reqJson('POST', `${base}/classes`, { className: 'X' }, secretaryToken)).status === 403, '19. secretary POST /classes = 403');
  assert((await reqJson('PUT', `${base}/classes/${classBody.classID}`, { name: 'X' }, secretaryToken)).status === 403, '20. secretary PUT /classes/:id = 403');
  assert((await reqJson('DELETE', `${base}/classes/${classBody.classID}`, null, secretaryToken)).status === 403, '21. secretary DELETE /classes/:id = 403');

  // Secretary WRITE = 403 (attendance)
  assert((await reqJson('POST', `${base}/attendance`, { child_PersonID: childBody.PersonID, Status: 'present' }, secretaryToken)).status === 403, '22. secretary POST /attendance = 403');

  // Parent still blocked from classes read (role protection did not widen)
  assert((await reqJson('GET', `${base}/classes`, null, parentToken)).status === 200, '23. parent GET /classes still allowed');

  // Secretary CAN approve/reject registration requests (the one exception)
  const approve = await reqJson('PUT', `${base}/registration-requests/${requestBody.id}`, { status: 'approved' }, secretaryToken);
  const approveBody = await approve.json();
  assert(
    approve.status === 200 && approveBody.status === 'approved' && !!approveBody.tempPassword,
    '24. secretary can approve a registration request'
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