const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Child = sequelize.define('Child', {
  PersonID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'Persons',
      key: 'PersonID'
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
  gender: {
    type: DataTypes.ENUM('Male', 'Female', 'Other'),
    allowNull: false
  },
  birth_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  birthplace: {
    type: DataTypes.STRING(100)
  },
  address: {
    type: DataTypes.STRING(255)
  },
  education_stage: {
    type: DataTypes.STRING(50)
  },
  num_of_brothers: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: { min: 0 }
  },
  status_of_parents: {
    type: DataTypes.STRING(50)
  },
  child_order: {
    type: DataTypes.INTEGER,
    validate: { min: 1 }
  },
  classID: {
    type: DataTypes.INTEGER,
    references: {
      model: 'ClassRooms',
      key: 'classID'
    }
  },
  section_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Sections',
      key: 'section_id'
    }
  }
}, {
  timestamps: true,
  tableName: 'Children'
});

module.exports = Child;
