const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Guardian = sequelize.define('Guardian', {
  GID: {
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
  G_F_name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  G_S_name: {
    type: DataTypes.STRING(50)
  },
  G_Th_name: {
    type: DataTypes.STRING(50)
  },
  G_L_name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  G_phone: {
    type: DataTypes.STRING(20)
  },
  emergency_number: {
    type: DataTypes.STRING(20)
  },
  W_phone: {
    type: DataTypes.STRING(20)
  },
  work: {
    type: DataTypes.STRING(100)
  },
  W_place: {
    type: DataTypes.STRING(100)
  },
  educational_level: {
    type: DataTypes.STRING(50)
  }
}, {
  timestamps: true,
  tableName: 'Guardians'
});

module.exports = Guardian;
