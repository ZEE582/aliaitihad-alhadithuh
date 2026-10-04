const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ClassRoom_ClassSession = sequelize.define('ClassRoom_ClassSession', {
  classID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'ClassRooms',
      key: 'classID'
    }
  },
  SessionID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'classSessions',
      key: 'SessionID'
    }
  }
}, {
  timestamps: true,
  tableName: 'ClassRoom_ClassSessions'
});

module.exports = ClassRoom_ClassSession;
