const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Child_Health_Medicine = sequelize.define('Child_Health_Medicine', {
  child_PersonID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'Children',
      key: 'PersonID'
    }
  },
  CH_M_ID: {
    type: DataTypes.INTEGER,
    unique: true,
    allowNull: false,
    references: {
      model: 'Health_Medicines',
      key: 'CH_M_ID'
    }
  }
}, {
  timestamps: true,
  tableName: 'Child_Health_Medicines'
});

module.exports = Child_Health_Medicine;
