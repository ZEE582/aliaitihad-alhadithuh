const fs = require('fs');
const path = require('path');
const os = require('os');

const REPO_DB = path.join(__dirname, '..', 'database.sqlite');
const BACKUP_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'teacher-privacy-'));
const BACKUP_DB = path.join(BACKUP_DIR, 'database.sqlite');
const dbExisted = fs.existsSync(REPO_DB);

process.env.NODE_ENV = 'development';
process.env.DB_HOST = '127.0.0.1';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'teacher-privacy-test-secret';
process.env.JWT_EXPIRATION = '1d';

if (dbExisted) fs.copyFileSync(REPO_DB, BACKUP_DB);

const express = require('express');
const {
  sequelize,
  User,
  Person,
  Guardian,
  Teacher,
  ClassRoom,
  Section,
  Subject,
  Child,
  Child_Guardian,
  RelationType,
  Message
} = require('./models');
const authService = require('./services/AuthService');
const passwordService = require('./services/PasswordService');

let server;

const summary = { passed: 0, failed: 0 };

const assert = (condition, label) => {
  if (condition) {
    summary.passed += 1;
    console.log(`PASS: ${label}`);
  } else {
    summary.failed += 1;
    console.log(`FAIL: ${label}`);
  }
};

const reqJson = (method, url, token) =>
  fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });

async function run() {
  sequelize.options.logging = false;
  await sequelize.authenticate();
  await sequelize.sync({ force: true });

  const subjectA = await Subject.create({ Subject_name: 'Mathematics', level: 'L1', semester: 'S1' });
  const subjectB = await Subject.create({ Subject_name: 'Science', level: 'L1', semester: 'S1' });

  const hash = await passwordService.hash('Passw0rd!');

  const teacherAUser = await User.create({
    username: 'teacher_a', email: 'teacher_a@test.local', password: hash,
    fullName: 'Teacher A User', roleType: 'teacher', mustChangePassword: false
  });
  const teacherBUser = await User.create({
    username: 'teacher_b', email: 'teacher_b@test.local', password: hash,
    fullName: 'Teacher B User', roleType: 'teacher', mustChangePassword: false
  });
  const parentAUser = await User.create({
    username: 'parent_a', email: 'parent_a@test.local', password: hash,
    fullName: 'Parent A User', roleType: 'parent', mustChangePassword: false
  });
  const parentBUser = await User.create({
    username: 'parent_b', email: 'parent_b@test.local', password: hash,
    fullName: 'Parent B User', roleType: 'parent', mustChangePassword: false
  });
  const adminUser = await User.create({
    username: 'admin_x', email: 'admin_x@test.local', password: hash,
    fullName: 'Admin User', roleType: 'admin', mustChangePassword: false
  });
  const secretaryUser = await User.create({
    username: 'secretary_x', email: 'secretary_x@test.local', password: hash,
    fullName: 'Secretary User', roleType: 'secretary', mustChangePassword: false
  });

  const pTeacherA = await Person.create({ Name: 'Teacher A' });
  const pTeacherB = await Person.create({ Name: 'Teacher B' });
  const pChildA = await Person.create({ Name: 'Child A' });
  const pChildB = await Person.create({ Name: 'Child B' });

  await Teacher.create({
    PersonID: pTeacherA.PersonID, userId: teacherAUser.id,
    F_name: 'Alice', S_name: 'S', Th_name: 'T', L_name: 'Anderson',
    T_Number: 'T-AAA-111', specialty: 'Math Specialist', years_of_experience: 7,
    Role: 'Homeroom', subject_id: subjectA.SubjectID
  });
  await Teacher.create({
    PersonID: pTeacherB.PersonID, userId: teacherBUser.id,
    F_name: 'Bilal', S_name: 'S', Th_name: 'T', L_name: 'Baker',
    T_Number: 'T-BBB-222', specialty: 'Science Specialist', years_of_experience: 4,
    Role: 'Homeroom', subject_id: subjectB.SubjectID
  });

  const class1 = await ClassRoom.create({ className: 'Class One' });
  const class2 = await ClassRoom.create({ className: 'Class Two' });

  const secA = await Section.create({
    SectionName: 'Section A', Name_level: 'Level A', classID: class1.classID,
    assigned_teacher_id: pTeacherA.PersonID
  });
  const secB = await Section.create({
    SectionName: 'Section B', Name_level: 'Level B', classID: class2.classID,
    assigned_teacher_id: pTeacherB.PersonID
  });

  await Child.create({
    PersonID: pChildA.PersonID, F_name: 'Child', S_name: 'S', L_name: 'A',
    gender: 'Male', birth_date: '2015-01-01', section_id: secA.section_id
  });
  await Child.create({
    PersonID: pChildB.PersonID, F_name: 'Child', S_name: 'S', L_name: 'B',
    gender: 'Female', birth_date: '2016-02-02', section_id: secB.section_id
  });

  const guardianA = await Guardian.create({ userId: parentAUser.id, G_F_name: 'P', G_L_name: 'A' });
  const guardianB = await Guardian.create({ userId: parentBUser.id, G_F_name: 'P', G_L_name: 'B' });

  const relation = await RelationType.create({ relation_type: 'Father' });
  await Child_Guardian.create({ child_PersonID: pChildA.PersonID, GID: guardianA.GID, RelationTypeID: relation.RelationTypeID });
  await Child_Guardian.create({ child_PersonID: pChildB.PersonID, GID: guardianB.GID, RelationTypeID: relation.RelationTypeID });

  await Message.create({
    senderId: parentAUser.id, receiverId: teacherAUser.id, subject: 'Hello', content: 'Hi teacher'
  });

  const parentAToken = authService.generateToken(parentAUser);
  const parentBToken = authService.generateToken(parentBUser);
  const adminToken = authService.generateToken(adminUser);
  const secretaryToken = authService.generateToken(secretaryUser);

  const app = express();
  app.use(express.json());
  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/teachers', require('./routes/teachers'));
  app.use('/api/messages', require('./routes/messages'));
  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  const base = `http://127.0.0.1:${server.address().port}/api`;

  const parentAList = await reqJson('GET', `${base}/teachers`, parentAToken);
  const parentAListBody = await parentAList.json();
  assert(parentAList.status === 200, 'parent A GET /teachers returns 200');
  assert(Array.isArray(parentAListBody) && parentAListBody.length === 1, 'parent A sees exactly one teacher');
  const scopedTeacher = (Array.isArray(parentAListBody) && parentAListBody[0]) || {};
  assert(scopedTeacher.PersonID === pTeacherA.PersonID, 'parent A sees only their own section teacher');
  assert(!('userId' in scopedTeacher), 'scoped teacher omits userId');
  assert(!('T_Number' in scopedTeacher), 'scoped teacher omits T_Number');
  assert(!('specialty' in scopedTeacher), 'scoped teacher omits specialty');
  assert(!('years_of_experience' in scopedTeacher), 'scoped teacher omits years_of_experience');
  assert(!('Role' in scopedTeacher), 'scoped teacher omits Role');
  assert(!('user' in scopedTeacher), 'scoped teacher omits user account');
  assert(scopedTeacher.person && scopedTeacher.person.Name === 'Teacher A', 'scoped teacher includes person.Name');
  assert(scopedTeacher.subject && scopedTeacher.subject.Subject_name === 'Mathematics', 'scoped teacher includes subject.Subject_name');
  assert(!JSON.stringify(parentAListBody).includes('email'), 'parent teachers payload contains no email');
  assert(!JSON.stringify(parentAListBody).includes('T-AAA-111'), 'parent teachers payload contains no teacher number');

  const parentBList = await reqJson('GET', `${base}/teachers`, parentBToken);
  const parentBListBody = await parentBList.json();
  assert(parentBList.status === 200 && Array.isArray(parentBListBody) && parentBListBody.length === 1, 'parent B sees exactly one teacher');
  assert(parentBListBody[0] && parentBListBody[0].PersonID === pTeacherB.PersonID, 'parent B sees only their own section teacher');

  const blocked = await reqJson('GET', `${base}/teachers/${pTeacherB.PersonID}`, parentAToken);
  assert(blocked.status === 403, 'parent A is forbidden from another section teacher');

  const ownById = await reqJson('GET', `${base}/teachers/${pTeacherA.PersonID}`, parentAToken);
  const ownByIdBody = await ownById.json();
  assert(ownById.status === 200 && ownByIdBody.PersonID === pTeacherA.PersonID, 'parent A can read their own teacher by id');
  assert(!JSON.stringify(ownByIdBody).includes('email'), 'parent teacher detail contains no email');

  const adminList = await reqJson('GET', `${base}/teachers`, adminToken);
  const adminListBody = await adminList.json();
  assert(adminList.status === 200 && Array.isArray(adminListBody) && adminListBody.length === 2, 'admin sees all teachers');
  const adminScoped = adminListBody.find((t) => t.PersonID === pTeacherA.PersonID) || {};
  assert(adminScoped.user && typeof adminScoped.user.email === 'string', 'admin payload includes user account email');
  assert(adminScoped.T_Number === 'T-AAA-111', 'admin payload retains T_Number');

  const secretaryList = await reqJson('GET', `${base}/teachers`, secretaryToken);
  const secretaryListBody = await secretaryList.json();
  assert(secretaryList.status === 200 && Array.isArray(secretaryListBody) && secretaryListBody.length === 2, 'secretary sees all teachers');

  const msgs = await reqJson('GET', `${base}/messages`, parentAToken);
  const msgsBody = await msgs.json();
  assert(msgs.status === 200 && Array.isArray(msgsBody) && msgsBody.length >= 1, 'parent A can read their messages');
  assert(!JSON.stringify(msgsBody).includes('email'), 'messages payload contains no participant email');
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
