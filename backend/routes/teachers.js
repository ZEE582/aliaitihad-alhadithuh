const express = require('express');
const { Teacher, Person, User, Subject, sequelize } = require('../models');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all teachers
router.get('/', auth, async (req, res) => {
  try {
    const teachers = await Teacher.findAll({
      include: [
        {
          model: Person,
          as: 'person',
          attributes: ['PersonID', 'Name']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'fullName', 'email', 'phone', 'roleType']
        },
        {
          model: Subject,
          as: 'subject'
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get teacher by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const teacher = await Teacher.findByPk(req.params.id, {
      include: [
        {
          model: Person,
          as: 'person',
          attributes: ['PersonID', 'Name']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'fullName', 'email', 'phone', 'roleType']
        },
        {
          model: Subject,
          as: 'subject'
        }
      ]
    });
    
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    res.json(teacher);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create teacher profile
router.post('/', auth, authorize('admin'), async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const fullName = `${req.body.F_name || ''} ${req.body.S_name || ''} ${req.body.L_name || ''}`.trim() || 'New Teacher';

    // 1. Create Person supertype
    const person = await Person.create({ Name: fullName }, { transaction });

    // 2. Create Teacher profile
    const teacher = await Teacher.create({
      PersonID: person.PersonID,
      userId: req.body.userId || null,
      F_name: req.body.F_name || 'Teacher',
      S_name: req.body.S_name || '',
      Th_name: req.body.Th_name || '',
      L_name: req.body.L_name || 'Teacher',
      T_Number: req.body.T_Number || 'TEA-' + Math.floor(Math.random() * 10000),
      specialty: req.body.specialty || 'General',
      years_of_experience: req.body.years_of_experience || 1,
      Role: req.body.Role || 'Teacher',
      subject_id: req.body.subject_id || null
    }, { transaction });

    await transaction.commit();

    const newTeacher = await Teacher.findByPk(teacher.PersonID, {
      include: [
        {
          model: Person,
          as: 'person',
          attributes: ['PersonID', 'Name']
        }
      ]
    });
    
    res.status(201).json(newTeacher);
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update teacher
router.put('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const teacher = await Teacher.findByPk(req.params.id);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    await teacher.update(req.body);
    res.json(teacher);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete teacher (admin only)
router.delete('/:id', auth, authorize('admin'), async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const teacher = await Teacher.findByPk(req.params.id, { transaction });
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    const personId = teacher.PersonID;
    await teacher.destroy({ transaction });
    await Person.destroy({ where: { PersonID: personId }, transaction });

    await transaction.commit();
    res.json({ message: 'Teacher deleted successfully' });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
