const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ClassRoom = sequelize.define('ClassRoom', {
  classID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  className: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  }
}, {
  timestamps: true,
  tableName: 'ClassRooms'
});

module.exports = ClassRoom;
