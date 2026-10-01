const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Note = sequelize.define('Note', {
  NoteID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  NoteDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  NoteCategory: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  NoteText: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  SenderID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Persons',
      key: 'PersonID'
    }
  },
  ReceiverID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Persons',
      key: 'PersonID'
    }
  }
}, {
  timestamps: true,
  tableName: 'Notes'
});

module.exports = Note;
