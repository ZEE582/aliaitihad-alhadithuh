const {
  sequelize,
  User,
  Person,
  Child,
  Guardian,
  Teacher,
  ClassRoom,
  Section,
  Child_Guardian,
  RelationType
} = require('../models');
const passwordService = require('../services/PasswordService');
const authService = require('../services/AuthService');

const CREDENTIALS = {
  admin: { username: 'admin', email: 'admin@kg.test', password: 'AdminPass1' },
  secretary: { username: 'S9001@kg.alittihad', email: 'S9001@kg.alittihad', password: 'Secretary1' },
  teacherA: { username: 'T1001@kg.alittihad', email: 'T1001@kg.alittihad', password: 'TeacherA1' },
  teacherB: { username: 'T1002@kg.alittihad', email: 'T1002@kg.alittihad', password: 'TeacherB1' },
  parentA: { username: '7001@kg.alittihad', email: '7001@kg.alittihad', password: 'ParentA12' },
  parentB: { username: '7002@kg.alittihad', email: '7002@kg.alittihad', password: 'ParentB12' }
};

function nameParts(fullName) {
  const parts = String(fullName).trim().split(/\s+/).filter(Boolean);
  return { first: parts[0] || fullName, rest: parts.slice(1).join(' ') || parts[0] || fullName };
}

async function createUserRow(roleKey, roleType, fullName, phone, transaction, mustChangePassword) {
  const c = CREDENTIALS[roleKey];
  const password = await passwordService.hash(c.password);
  return User.create(
    {
      username: c.username,
      email: c.email,
      password,
      roleType,
      fullName,
      phone,
      mustChangePassword: mustChangePassword === true
    },
    { transaction }
  );
}

async function createTeacher(roleKey, fullName, phone, nationalId) {
  return sequelize.transaction(async (transaction) => {
    const user = await createUserRow(roleKey, 'teacher', fullName, phone, transaction, false);
    const person = await Person.create({ Name: fullName }, { transaction });
    const { first, rest } = nameParts(fullName);
    const teacher = await Teacher.create(
      {
        PersonID: person.PersonID,
        userId: user.id,
        F_name: first,
        S_name: '',
        Th_name: '',
        L_name: rest,
        T_Number: nationalId,
        Role: 'Teacher'
      },
      { transaction }
    );
    return { user, person, teacher };
  });
}

async function createParent(roleKey, fullName, phone) {
  return sequelize.transaction(async (transaction) => {
    const user = await createUserRow(roleKey, 'parent', fullName, phone, transaction, false);
    const { first, rest } = nameParts(fullName);
    const guardian = await Guardian.create(
      {
        userId: user.id,
        G_F_name: first,
        G_L_name: rest,
        G_phone: phone
      },
      { transaction }
    );
    return { user, guardian };
  });
}

async function createChild(fullName, gender, classID, sectionId) {
  return sequelize.transaction(async (transaction) => {
    const person = await Person.create({ Name: fullName }, { transaction });
    const child = await Child.create(
      {
        PersonID: person.PersonID,
        F_name: fullName,
        L_name: 'Family',
        gender,
        birth_date: '2021-01-01',
        classID: classID || null,
        section_id: sectionId || null
      },
      { transaction }
    );
    return { person, child };
  });
}

async function getRelationType(name) {
  let relationType = await RelationType.findOne({ where: { relation_type: name } });
  if (!relationType) relationType = await RelationType.create({ relation_type: name });
  return relationType;
}

async function linkChildGuardian(childPersonId, gid, relationTypeId) {
  return Child_Guardian.create({
    child_PersonID: childPersonId,
    GID: gid,
    RelationTypeID: relationTypeId
  });
}

async function seed() {
  const out = { ids: {}, creds: {}, tokens: {} };

  const admin = await createUserRow('admin', 'admin', 'Admin One', '0590000001', null, false);
  const secretary = await createUserRow('secretary', 'secretary', 'Sec One', '0590000002', null, false);

  const teacherA = await createTeacher('teacherA', 'Teach One', '0591000001', '1001');
  const teacherB = await createTeacher('teacherB', 'Teach Two', '0591000002', '1002');

  const parentA = await createParent('parentA', 'Parent Ay', '0592000001');
  const parentB = await createParent('parentB', 'Parent Bee', '0592000002');

  const classRoom = await ClassRoom.create({ className: 'KG-One' });

  const section1 = await Section.create({
    SectionName: 'Sunshine',
    Name_level: 'Level-One',
    Level: 'Level 1',
    Capacity: 20,
    classID: classRoom.classID,
    assigned_teacher_id: teacherA.person.PersonID
  });

  const section2 = await Section.create({
    SectionName: 'Rainbow',
    Name_level: 'Level-Two',
    Level: 'Level 2',
    Capacity: 20,
    classID: classRoom.classID,
    assigned_teacher_id: teacherB.person.PersonID
  });

  const childA = await createChild('Child Ay', 'Male', classRoom.classID, section1.section_id);
  const childB = await createChild('Child Bee', 'Female', classRoom.classID, section2.section_id);
  const childC = await createChild('Child See', 'Male', null, null);

  const relationType = await getRelationType('Parent');
  await linkChildGuardian(childA.person.PersonID, parentA.guardian.GID, relationType.RelationTypeID);
  await linkChildGuardian(childB.person.PersonID, parentB.guardian.GID, relationType.RelationTypeID);

  out.ids = {
    admin: admin.id,
    secretary: secretary.id,
    teacherA: { userId: teacherA.user.id, personId: teacherA.person.PersonID },
    teacherB: { userId: teacherB.user.id, personId: teacherB.person.PersonID },
    parentA: { userId: parentA.user.id, guardianId: parentA.guardian.GID },
    parentB: { userId: parentB.user.id, guardianId: parentB.guardian.GID },
    classRoom: classRoom.classID,
    section1: section1.section_id,
    section2: section2.section_id,
    childA: childA.person.PersonID,
    childB: childB.person.PersonID,
    childC: childC.person.PersonID,
    relationType: relationType.RelationTypeID
  };

  out.creds = {
    admin: { ...CREDENTIALS.admin },
    secretary: { ...CREDENTIALS.secretary },
    teacherA: { ...CREDENTIALS.teacherA },
    teacherB: { ...CREDENTIALS.teacherB },
    parentA: { ...CREDENTIALS.parentA },
    parentB: { ...CREDENTIALS.parentB }
  };

  out.tokens = {
    admin: authService.generateToken(admin),
    secretary: authService.generateToken(secretary),
    teacherA: authService.generateToken(teacherA.user),
    teacherB: authService.generateToken(teacherB.user),
    parentA: authService.generateToken(parentA.user),
    parentB: authService.generateToken(parentB.user)
  };

  return out;
}

module.exports = seed;
module.exports.CREDENTIALS = CREDENTIALS;
