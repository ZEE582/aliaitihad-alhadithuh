const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Health_Medicine = sequelize.define('Health_Medicine', {
  CH_M_ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  illnesses: {
    type: DataTypes.TEXT
  },
  vaccinations: {
    type: DataTypes.TEXT
  },
  allergies: {
    type: DataTypes.TEXT
  }
}, {
  timestamps: true,
  tableName: 'Health_Medicines'
});

module.exports = Health_Medicine;
