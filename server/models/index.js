const sequelize = require('../config/database');
const User = require('./User');
const Child = require('./Child');
const Guardian = require('./Parent');
const Teacher = require('./Teacher');
const ClassRoom = require('./Class');
const Section = require('./Section');
const Subject = require('./Subject');
const classSession = require('./Session');
const Attendance = require('./Attendance');
const Note = require('./Note');
const Message = require('./Message');
const Report = require('./Report');
const RelationType = require('./RelationType');
const Health_Medicine = require('./Health_Medicine');
const ClassRoom_ClassSession = require('./ClassRoom_ClassSession');
const Child_Guardian = require('./Child_Guardian');
const Child_Health_Medicine = require('./Child_Health_Medicine');

// Define relationships based on new schema

// ClassRoom - Section (1:1)
ClassRoom.hasOne(Section, { foreignKey: 'classID', as: 'section' });
Section.belongsTo(ClassRoom, { foreignKey: 'classID', as: 'classRoom' });

// Section - Teacher (1:1)
Section.belongsTo(Teacher, { foreignKey: 'assigned_teacher_id', as: 'assignedTeacher' });
Teacher.hasOne(Section, { foreignKey: 'assigned_teacher_id', as: 'assignedSection' });

// Subject - Teacher (1:M)
Subject.belongsTo(Teacher, { foreignKey: 'assigned_teacher_id', as: 'teacher' });
Teacher.hasMany(Subject, { foreignKey: 'assigned_teacher_id', as: 'subjects' });

// Child - ClassRoom (M:1)
Child.belongsTo(ClassRoom, { foreignKey: 'classID', as: 'classRoom' });
ClassRoom.hasMany(Child, { foreignKey: 'classID', as: 'children' });

// Child - Section (M:1)
Child.belongsTo(Section, { foreignKey: 'section_id', as: 'section' });
Section.hasMany(Child, { foreignKey: 'section_id', as: 'children' });

// classSession - Subject (M:1)
classSession.belongsTo(Subject, { foreignKey: 'SubjectID', as: 'subject' });
Subject.hasMany(classSession, { foreignKey: 'SubjectID', as: 'sessions' });

// classSession - Section (M:1)
classSession.belongsTo(Section, { foreignKey: 'section_id', as: 'section' });
Section.hasMany(classSession, { foreignKey: 'section_id', as: 'sessions' });

// ClassRoom - classSession (M:N junction)
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

// Attendance - Child (M:1)
Attendance.belongsTo(Child, { foreignKey: 'child_N', as: 'child' });
Child.hasMany(Attendance, { foreignKey: 'child_N', as: 'attendanceRecords' });

// Attendance - ClassRoom (M:1)
Attendance.belongsTo(ClassRoom, { foreignKey: 'classID', as: 'classRoom' });
ClassRoom.hasMany(Attendance, { foreignKey: 'classID', as: 'attendanceRecords' });

// Child - Guardian (M:N junction with RelationType)
Child.belongsToMany(Guardian, {
  through: Child_Guardian,
  foreignKey: 'child_N',
  otherKey: 'GID',
  as: 'guardians'
});
Guardian.belongsToMany(Child, {
  through: Child_Guardian,
  foreignKey: 'GID',
  otherKey: 'child_N',
  as: 'children'
});

// Child_Guardian - RelationType
Child_Guardian.belongsTo(RelationType, { foreignKey: 'RelationTypeID', as: 'relationType' });
RelationType.hasMany(Child_Guardian, { foreignKey: 'RelationTypeID', as: 'childGuardianRelations' });

// Child - Health_Medicine (1:1)
Child_Health_Medicine.belongsTo(Child, { foreignKey: 'child_N', as: 'child' });
Child_Health_Medicine.belongsTo(Health_Medicine, { foreignKey: 'CH_M_ID', as: 'healthMedicine' });
Child.hasOne(Child_Health_Medicine, { foreignKey: 'child_N', as: 'healthRecord' });
Health_Medicine.hasOne(Child_Health_Medicine, { foreignKey: 'CH_M_ID', as: 'childRelation' });

// Note - Guardian (bidirectional)
Note.belongsTo(Guardian, { foreignKey: 'ToGID', as: 'toGuardian' });
Note.belongsTo(Guardian, { foreignKey: 'FromGID', as: 'fromGuardian' });
Guardian.hasMany(Note, { foreignKey: 'ToGID', as: 'receivedNotes' });
Guardian.hasMany(Note, { foreignKey: 'FromGID', as: 'sentNotes' });

// Note - Teacher (bidirectional)
Note.belongsTo(Teacher, { foreignKey: 'ToTID', as: 'toTeacher' });
Note.belongsTo(Teacher, { foreignKey: 'FromTID', as: 'fromTeacher' });
Teacher.hasMany(Note, { foreignKey: 'ToTID', as: 'receivedNotes' });
Teacher.hasMany(Note, { foreignKey: 'FromTID', as: 'sentNotes' });

// Legacy User relationships (kept for authentication)
User.hasOne(Guardian, { foreignKey: 'userId', as: 'guardianProfile' });
User.hasOne(Teacher, { foreignKey: 'userId', as: 'teacherProfile' });
Guardian.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Teacher.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Legacy Message relationships (kept for messaging system)
Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
Message.belongsTo(User, { foreignKey: 'receiverId', as: 'receiver' });
Message.belongsTo(Message, { foreignKey: 'replyTo', as: 'replyToMessage' });
User.hasMany(Message, { foreignKey: 'senderId', as: 'sentMessages' });
User.hasMany(Message, { foreignKey: 'receiverId', as: 'receivedMessages' });

// Legacy Report relationships (kept for reporting)
Report.belongsTo(Child, { foreignKey: 'childId', as: 'child' });
Report.belongsTo(ClassRoom, { foreignKey: 'classId', as: 'class' });
Report.belongsTo(User, { foreignKey: 'generatedBy', as: 'generator' });
Child.hasMany(Report, { foreignKey: 'childId', as: 'reports' });
ClassRoom.hasMany(Report, { foreignKey: 'classId', as: 'reports' });
User.hasMany(Report, { foreignKey: 'generatedBy', as: 'generatedReports' });

module.exports = {
  sequelize,
  User,
  Child,
  Guardian,
  Teacher,
  ClassRoom,
  Section,
  Subject,
  classSession,
  Attendance,
  Note,
  Message,
  Report,
  RelationType,
  Health_Medicine,
  ClassRoom_ClassSession,
  Child_Guardian,
  Child_Health_Medicine
};
