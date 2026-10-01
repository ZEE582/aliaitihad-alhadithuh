const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Person = sequelize.define('Person', {
  PersonID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Name: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  timestamps: true,
  tableName: 'Persons'
});

module.exports = Person;