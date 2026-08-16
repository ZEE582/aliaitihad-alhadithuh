const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Attendance = sequelize.define('Attendance', {
  AttendanceID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  AttendanceDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  Status: {
    type: DataTypes.ENUM('Present', 'Absent', 'Late', 'Excused'),
    allowNull: false
  },
  Reason: {
    type: DataTypes.TEXT
  },
  child_N: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Children',
      key: 'child_N'
    }
  },
  classID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'ClassRooms',
      key: 'classID'
    }
  }
}, {
  timestamps: true,
  tableName: 'Attendances'
});

module.exports = Attendance;
