const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const classSession = sequelize.define('classSession', {
  SessionID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  day: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  Period: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  Study_class_number: {
    type: DataTypes.STRING(50)
  },
  SubjectID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Subjects',
      key: 'SubjectID'
    }
  },
  section_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Sections',
      key: 'section_id'
    }
  }
}, {
  timestamps: true,
  tableName: 'classSessions'
});

module.exports = classSession;