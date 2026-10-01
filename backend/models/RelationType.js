const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RelationType = sequelize.define('RelationType', {
  RelationTypeID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  relation_type: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  }
}, {
  timestamps: true,
  tableName: 'RelationTypes'
});

module.exports = RelationType;
