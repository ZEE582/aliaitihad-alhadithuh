const express = require('express');
const { Note, Person, sequelize } = require('../models');
const { auth, authorize } = require('../middleware/auth');
const { Op } = require('sequelize');

const router = express.Router();

// Get all notes
router.get('/', auth, async (req, res) => {
  try {
    const { category, senderId, receiverId } = req.query;
    let where = {};

    if (category) where.NoteCategory = category;
    if (senderId) where.SenderID = senderId;
    if (receiverId) where.ReceiverID = receiverId;

    const notes = await Note.findAll({
      where,
      include: [
        {
          model: Person,
          as: 'sender',
          attributes: ['PersonID', 'Name']
        },
        {
          model: Person,
          as: 'receiver',
          attributes: ['PersonID', 'Name']
        }
      ],
      order: [['NoteDate', 'DESC']]
    });

    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch notes', error: error.message });
  }
});

// Get note by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findByPk(req.params.id, {
      include: [
        {
          model: Person,
          as: 'sender',
          attributes: ['PersonID', 'Name']
        },
        {
          model: Person,
          as: 'receiver',
          attributes: ['PersonID', 'Name']
        }
      ]
    });
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json(note);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch note', error: error.message });
  }
});

// Create new note
router.post('/', auth, async (req, res) => {
  try {
    const { NoteCategory, category, NoteText, text, note, SenderID, ReceiverID, NoteDate } = req.body;
    
    const noteRecord = await Note.create({
      NoteCategory: NoteCategory || category || 'General',
      NoteText: NoteText || text || note || '',
      SenderID: SenderID || req.user.id,
      ReceiverID: ReceiverID || SenderID || req.user.id,
      NoteDate: NoteDate || new Date()
    });
    
    const newNote = await Note.findByPk(noteRecord.NoteID, {
      include: [
        {
          model: Person,
          as: 'sender',
          attributes: ['PersonID', 'Name']
        },
        {
          model: Person,
          as: 'receiver',
          attributes: ['PersonID', 'Name']
        }
      ]
    });
    
    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create note', error: error.message });
  }
});

// Update note
router.put('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findByPk(req.params.id);
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    const { NoteCategory, category, NoteText, text, NoteDate } = req.body;
    await note.update({
      NoteCategory: NoteCategory || category || note.NoteCategory,
      NoteText: NoteText || text || note.NoteText,
      NoteDate: NoteDate || note.NoteDate
    });
    
    const updatedNote = await Note.findByPk(req.params.id, {
      include: [
        {
          model: Person,
          as: 'sender',
          attributes: ['PersonID', 'Name']
        },
        {
          model: Person,
          as: 'receiver',
          attributes: ['PersonID', 'Name']
        }
      ]
    });

    res.json(updatedNote);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update note', error: error.message });
  }
});

// Delete note
router.delete('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findByPk(req.params.id);
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    await note.destroy();
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete note', error: error.message });
  }
});

module.exports = router;
