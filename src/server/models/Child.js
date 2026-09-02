const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Child = sequelize.define('Child', {
  child_N: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
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
  birth_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  birthplace: {
    type: DataTypes.STRING(100)
  },
  address: {
    type: DataTypes.STRING(255)
  },
  child_order: {
    type: DataTypes.INTEGER,
    validate: {
      min: 1
    }
  },
  education_stage: {
    type: DataTypes.STRING(50)
  },
  gender: {
    type: DataTypes.ENUM('Male', 'Female', 'Other'),
    allowNull: false
  },
  num_of_brothers: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  status_of_parents: {
    type: DataTypes.STRING(50)
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
      key: 'SectionID'
    }
  }
}, {
  timestamps: true,
  tableName: 'Children'
});

module.exports = Child;
