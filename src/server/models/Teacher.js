const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Teacher = sequelize.define('Teacher', {
  TID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    unique: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  F_name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  S_name: {
    type: DataTypes.STRING(50)
  },
  Th_name: {
    type: DataTypes.STRING(50)
  },
  L_name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  Role: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  specialty: {
    type: DataTypes.STRING(100)
  },
  years_of_experience: {
    type: DataTypes.INTEGER,
    validate: {
      min: 0
    }
  }
}, {
  timestamps: true,
  tableName: 'Teachers'
});

module.exports = Teacher;
