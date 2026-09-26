const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Teacher = sequelize.define('Teacher', {
  PersonID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'Persons',
      key: 'PersonID'
    }
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
  T_Number: {
    type: DataTypes.STRING(30)
  },
  specialty: {
    type: DataTypes.STRING(100)
  },
  years_of_experience: {
    type: DataTypes.INTEGER,
    validate: { min: 0 }
  },
  Role: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  subject_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Subjects',
      key: 'SubjectID'
    }
  }
}, {
  timestamps: true,
  tableName: 'Teachers'
});

module.exports = Teacher;
