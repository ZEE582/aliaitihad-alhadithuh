const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RegistrationRequest = sequelize.define('RegistrationRequest', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  childName: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  fatherName: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  fatherNationalId: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  fatherEmail: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  twins: {
    type: DataTypes.JSON,
    allowNull: true
  },
  motherName: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  fatherPhone: {
    type: DataTypes.STRING(30),
    allowNull: true
  },
  motherPhone: {
    type: DataTypes.STRING(30),
    allowNull: true
  },
  emergencyContact: {
    type: DataTypes.STRING(30),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending',
    allowNull: false
  },
  data: {
    type: DataTypes.JSON,
    allowNull: true
  }
}, {
  tableName: 'RegistrationRequests',
  timestamps: true
});

module.exports = RegistrationRequest;
