const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TeacherAttendance = sequelize.define('TeacherAttendance', {
  AttendanceID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  Status: {
    type: DataTypes.ENUM('Present', 'Absent', 'Late', 'Excused'),
    allowNull: false
  },
  Excuse: {
    type: DataTypes.TEXT
  },
  ExcuseAttachment: {
    type: DataTypes.STRING(255)
  },
  TeacherID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Teachers',
      key: 'PersonID'
    }
  }
}, {
  timestamps: true,
  tableName: 'TeacherAttendances'
});

module.exports = TeacherAttendance;