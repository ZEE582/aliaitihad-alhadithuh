const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Child_Guardian = sequelize.define('Child_Guardian', {
  child_PersonID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'Children',
      key: 'PersonID'
    }
  },
  GID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'Guardians',
      key: 'GID'
    }
  },
  RelationTypeID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'RelationTypes',
      key: 'RelationTypeID'
    }
  }
}, {
  timestamps: true,
  tableName: 'Child_Guardians'
});

module.exports = Child_Guardian;
