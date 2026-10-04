const sequelize = require('../config/database');
const User = require('./User');
const Person = require('./Person');
const Child = require('./Child');
const Guardian = require('./Parent');
const Teacher = require('./Teacher');
const ClassRoom = require('./Class');
const Section = require('./Section');
const Subject = require('./Subject');
const classSession = require('./Session');
const Attendance = require('./Attendance');
const TeacherAttendance = require('./TeacherAttendance');
const Note = require('./Note');
const Message = require('./Message');
const Report = require('./Report');
const RelationType = require('./RelationType');
const Health_Medicine = require('./Health_Medicine');
const ClassRoom_ClassSession = require('./ClassRoom_ClassSession');
const Child_Guardian = require('./Child_Guardian');
const Child_Health_Medicine = require('./Child_Health_Medicine');

// ---- Persons hierarchy (supertype: child & teacher, "is a") ----
Person.hasOne(Child, { foreignKey: 'PersonID', as: 'childProfile' });
Child.belongsTo(Person, { foreignKey: 'PersonID', as: 'person' });

Person.hasOne(Teacher, { foreignKey: 'PersonID', as: 'teacherProfile' });
Teacher.belongsTo(Person, { foreignKey: 'PersonID', as: 'person' });

// ---- ClassRoom - Section ("belongs_to" / "has_home") ----
ClassRoom.hasMany(Section, { foreignKey: 'classID', as: 'sections' });
Section.belongsTo(ClassRoom, { foreignKey: 'classID', as: 'classRoom' });

// Section - Teacher ("assigned_to": one teacher per section)
Section.belongsTo(Teacher, { foreignKey: 'assigned_teacher_id', as: 'assignedTeacher' });
Teacher.hasOne(Section, { foreignKey: 'assigned_teacher_id', as: 'assignedSection' });

// Teacher - Subject ("teaches": subject taught by many teachers, teacher teaches one)
Subject.hasMany(Teacher, { foreignKey: 'subject_id', as: 'teachers' });
Teacher.belongsTo(Subject, { foreignKey: 'subject_id', as: 'subject' });

// ---- Child associations ----
Child.belongsTo(ClassRoom, { foreignKey: 'classID', as: 'classRoom' });
ClassRoom.hasMany(Child, { foreignKey: 'classID', as: 'children' });

Child.belongsTo(Section, { foreignKey: 'section_id', as: 'section' });
Section.hasMany(Child, { foreignKey: 'section_id', as: 'children' });

// ---- classSession ----
classSession.belongsTo(Subject, { foreignKey: 'SubjectID', as: 'subject' });
Subject.hasMany(classSession, { foreignKey: 'SubjectID', as: 'sessions' });

classSession.belongsTo(Section, { foreignKey: 'section_id', as: 'section' });
Section.hasMany(classSession, { foreignKey: 'section_id', as: 'sessions' });

// ClassRoom - classSession (M:N junction "hosts")
ClassRoom.belongsToMany(classSession, {
  through: ClassRoom_ClassSession,
  foreignKey: 'classID',
  otherKey: 'SessionID',
  as: 'sessions'
});
classSession.belongsToMany(ClassRoom, {
  through: ClassRoom_ClassSession,
  foreignKey: 'SessionID',
  otherKey: 'classID',
  as: 'classRooms'
});

// ---- Attendance - Child (M:1) ----
Attendance.belongsTo(Child, { foreignKey: 'child_PersonID', as: 'child' });
Child.hasMany(Attendance, { foreignKey: 'child_PersonID', as: 'attendanceRecords' });

// Attendance - ClassRoom (M:1) "recorded_in"
Attendance.belongsTo(ClassRoom, { foreignKey: 'classID', as: 'classRoom' });
ClassRoom.hasMany(Attendance, { foreignKey: 'classID', as: 'attendanceRecords' });

// ---- TeacherAttendance - Teacher (M:1) ----
TeacherAttendance.belongsTo(Teacher, { foreignKey: 'TeacherID', as: 'teacher' });
Teacher.hasMany(TeacherAttendance, { foreignKey: 'TeacherID', as: 'attendanceRecords' });

// ---- Child - Guardian (M:N junction with RelationType) ----
Child.belongsToMany(Guardian, {
  through: Child_Guardian,
  foreignKey: 'child_PersonID',
  otherKey: 'GID',
  as: 'guardians'
});
Guardian.belongsToMany(Child, {
  through: Child_Guardian,
  foreignKey: 'GID',
  otherKey: 'child_PersonID',
  as: 'children'
});

Child_Guardian.belongsTo(RelationType, { foreignKey: 'RelationTypeID', as: 'relationType' });
RelationType.hasMany(Child_Guardian, { foreignKey: 'RelationTypeID', as: 'childGuardianRelations' });

// ---- Child - Health_Medicine (junction "HasH_R") ----
Child.hasOne(Child_Health_Medicine, { foreignKey: 'child_PersonID', as: 'healthRecord' });
Child_Health_Medicine.belongsTo(Child, { foreignKey: 'child_PersonID', as: 'child' });
Child_Health_Medicine.belongsTo(Health_Medicine, { foreignKey: 'CH_M_ID', as: 'healthMedicine' });
Health_Medicine.hasOne(Child_Health_Medicine, { foreignKey: 'CH_M_ID', as: 'childRelation' });

// ---- Notes (sender/receiver -> Persons) ----
Note.belongsTo(Person, { foreignKey: 'SenderID', as: 'sender' });
Note.belongsTo(Person, { foreignKey: 'ReceiverID', as: 'receiver' });
Person.hasMany(Note, { foreignKey: 'SenderID', as: 'sentNotes' });
Person.hasMany(Note, { foreignKey: 'ReceiverID', as: 'receivedNotes' });

// ---- Legacy User relationships (kept for authentication) ----
User.hasOne(Guardian, { foreignKey: 'userId', as: 'guardianProfile' });
User.hasOne(Teacher, { foreignKey: 'userId', as: 'teacherProfile' });
Guardian.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Teacher.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// ---- Legacy Message relationships (kept for messaging system) ----
Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
Message.belongsTo(User, { foreignKey: 'receiverId', as: 'receiver' });
Message.belongsTo(Message, { foreignKey: 'replyTo', as: 'replyToMessage' });
User.hasMany(Message, { foreignKey: 'senderId', as: 'sentMessages' });
User.hasMany(Message, { foreignKey: 'receiverId', as: 'receivedMessages' });

// ---- Legacy Report relationships (kept for reporting) ----
Report.belongsTo(Child, { foreignKey: 'childId', as: 'child' });
Report.belongsTo(ClassRoom, { foreignKey: 'classId', as: 'class' });
Report.belongsTo(User, { foreignKey: 'generatedBy', as: 'generator' });
Child.hasMany(Report, { foreignKey: 'childId', as: 'reports' });
ClassRoom.hasMany(Report, { foreignKey: 'classId', as: 'reports' });
User.hasMany(Report, { foreignKey: 'generatedBy', as: 'generatedReports' });

module.exports = {
  sequelize,
  User,
  Person,
  Child,
  Guardian,
  Teacher,
  ClassRoom,
  Class: ClassRoom,
  Section,
  Subject,
  classSession,
  Attendance,
  TeacherAttendance,
  Note,
  Message,
  Report,
  RelationType,
  Health_Medicine,
  ClassRoom_ClassSession,
  Child_Guardian,
  Child_Health_Medicine
};