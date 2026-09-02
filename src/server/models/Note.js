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
  ToRole: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  FromRole: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  ToGID: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Guardians',
      key: 'GID'
    }
  },
  FromGID: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Guardians',
      key: 'GID'
    }
  },
  ToTID: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Teachers',
      key: 'TID'
    }
  },
  FromTID: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Teachers',
      key: 'TID'
    }
  }
}, {
  timestamps: true,
  tableName: 'Notes',
  validate: {
    oneRecipient() {
      if (this.ToGID && this.ToTID) {
        throw new Error('Note can only have one recipient (Guardian or Teacher)');
      }
      if (!this.ToGID && !this.ToTID) {
        throw new Error('Note must have one recipient (Guardian or Teacher)');
      }
    },
    oneSender() {
      if (this.FromGID && this.FromTID) {
        throw new Error('Note can only have one sender (Guardian or Teacher)');
      }
      if (!this.FromGID && !this.FromTID) {
        throw new Error('Note must have one sender (Guardian or Teacher)');
      }
    }
  }
});

module.exports = Note;
