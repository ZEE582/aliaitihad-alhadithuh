const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Subject = sequelize.define('Subject', {
  SubjectID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Subject_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  level: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  semester: {
    type: DataTypes.STRING(50),
    allowNull: false
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
  tableName: 'Subjects',
  indexes: [
    {
      unique: true,
      fields: ['Subject_name', 'level', 'semester']
    }
  ]
});

module.exports = Subject;
