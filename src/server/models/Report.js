const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Report = sequelize.define('Report', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('attendance', 'academic', 'behavioral', 'financial', 'general'),
    allowNull: false
  },
  childId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Children',
      key: 'PersonID'
    }
  },
  classId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'ClassRooms',
      key: 'classID'
    }
  },
  generatedBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  data: {
    type: DataTypes.JSON
  },
  periodStartDate: {
    type: DataTypes.DATE
  },
  periodEndDate: {
    type: DataTypes.DATE
  }
}, {
  timestamps: true
});

module.exports = Report;
