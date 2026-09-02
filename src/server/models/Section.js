const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Section = sequelize.define('Section', {
  SectionID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  SectionName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  Name_level: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  Capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  classID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'ClassRooms',
      key: 'classID'
    }
  },
  assigned_teacher_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Teachers',
      key: 'TID'
    }
  }
}, {
  timestamps: true,
  tableName: 'Sections'
});

module.exports = Section;
