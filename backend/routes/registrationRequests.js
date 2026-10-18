const express = require('express');
const { Op } = require('sequelize');
const { RegistrationRequest, Child, Child_Guardian, User, Guardian, RelationType, Person, sequelize } = require('../models');
const { generateTempPassword } = require('../utils/passwordGenerator');
const passwordService = require('../services/PasswordService');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

const DATA_WHITELIST = [
  'gender', 'birthDate', 'birthPlace', 'enrollDate', 'address', 'homePhone',
  'siblingsCount', 'childOrder', 'fatherJob', 'fatherWorkplace', 'motherJob',
  'motherWorkplace', 'parentsStatus', 'travelingParent', 'deceasedParent',
  'parentsRelation', 'healthConditions', 'otherCondition', 'hadSurgery',
  'surgeryDetails', 'takesMedicine', 'medicineDetails', 'vaccinated',
  'specialNeeds', 'specialNeedsSupervisor', 'familyHasSpecialNeeds',
  'familySpecialNeedsCount', 'familySpecialNeedsType', 'bedwetting',
  'eatsBreakfast', 'sleepsNormally', 'nervous', 'introvertShy',
  'aggressive', 'stuttering', 'notes'
];

// Helper validation functions
function validateString(val, maxLen = 500) {
  if (val === undefined || val === null) return true;
  if (typeof val !== 'string') return false;
  return val.length <= maxLen;
}

function validateArray(arr, maxItems = 20, itemMaxLen = 100) {
  if (arr === undefined || arr === null) return true;
  if (!Array.isArray(arr)) return false;
  if (arr.length > maxItems) return false;
  return arr.every(item => typeof item === 'string' && item.length <= itemMaxLen);
}

// 1. POST / (Public)
router.post('/', async (req, res) => {
  try {
    const { childName, fatherName, motherName, fatherPhone, motherPhone, emergencyContact, fatherNationalId, fatherEmail, twins } = req.body || {};

    // Validate childName
    if (!childName || typeof childName !== 'string' || !childName.trim()) {
      return res.status(400).json({ message: 'Child name is required' });
    }

    // Validate top-level string fields
    const topLevelFields = { childName, fatherName, motherName, fatherPhone, motherPhone, emergencyContact, fatherNationalId, fatherEmail };
    for (const [key, val] of Object.entries(topLevelFields)) {
      if (!validateString(val, key === 'fatherEmail' ? 100 : 500)) {
        return res.status(400).json({ message: `Invalid value for ${key}` });
      }
    }

    if (twins !== undefined && twins !== null && !validateArray(twins, 10, 100)) {
      return res.status(400).json({ message: 'Invalid value for twins' });
    }

    // Extract & validate data whitelist payload
    const dataPayload = {};
    for (const key of DATA_WHITELIST) {
      if (req.body && req.body[key] !== undefined) {
        let val = req.body[key];
        if (key === 'healthConditions' || key === 'specialNeeds') {
          if (!validateArray(val, 20, 100)) {
            return res.status(400).json({ message: `Invalid array payload for ${key}` });
          }
        } else {
          if (typeof val === 'number') {
            val = String(val);
          }
          if (!validateString(val, 500)) {
            return res.status(400).json({ message: `Invalid text payload for ${key}` });
          }
        }
        dataPayload[key] = val;
      }
    }

    // Create record with server-enforced 'pending' status
    const created = await RegistrationRequest.create({
      childName: childName.trim(),
      fatherName: fatherName ? fatherName.trim() : null,
      fatherNationalId: fatherNationalId ? String(fatherNationalId).trim() : null,
      fatherEmail: fatherEmail ? String(fatherEmail).trim() : null,
      twins: Array.isArray(twins) ? twins.map(t => String(t).trim()) : null,
      motherName: motherName ? motherName.trim() : null,
      fatherPhone: fatherPhone ? fatherPhone.trim() : null,
      motherPhone: motherPhone ? motherPhone.trim() : null,
      emergencyContact: emergencyContact ? emergencyContact.trim() : null,
      status: 'pending',
      data: dataPayload
    });

    return res.status(201).json({
      id: created.id,
      status: created.status
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

// 2. GET / (Admin & secretary)
router.get('/', auth, authorize('admin', 'secretary'), async (req, res) => {
  try {
    const records = await RegistrationRequest.findAll({
      order: [['createdAt', 'DESC']]
    });

    const response = records.map(record => {
      const plain = record.get({ plain: true });
      const { data, createdAt, ...rest } = plain;
      return {
        ...rest,
        ...(data || {}),
        submittedAt: createdAt
      };
    });

    return res.json(response);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

// Creates or reuses the parent account, guardian and child links on approval.
// Creates child records for the request's main child and siblings/twins when
// they are not yet materialized. All writes happen in one transaction so
// nothing is persisted if any step fails.
async function approveRegistration(record, mainChildId, twinNames) {
  const transaction = await sequelize.transaction();
  try {
    const parentName = record.fatherName || record.motherName || 'ولي أمر';
    const parentPhone = record.fatherPhone || record.motherPhone || null;
    const nationalId = record.fatherNationalId ? String(record.fatherNationalId).trim() : '';

    let username;
    let tempPassword;
    if (nationalId) {
      username = `${nationalId}@kg.alittihad`;
      tempPassword = nationalId;
    } else {
      const phoneDigits = (parentPhone || '').replace(/\D/g, '');
      username = phoneDigits ? `parent${phoneDigits}` : `parent_${record.id}`;
      tempPassword = generateTempPassword();
    }
    const email = nationalId ? username : `${username}@estudy.local`;

    let user = await User.findOne({
      where: { [Op.or]: [{ username }, { email }] },
      transaction
    });

    if (!user && !nationalId) {
      const phones = [record.fatherPhone, record.motherPhone].filter(Boolean);
      if (phones.length) {
        const guardianByPhone = await Guardian.findOne({
          where: { G_phone: { [Op.in]: phones } },
          transaction
        });
        if (guardianByPhone && guardianByPhone.userId) {
          user = await User.findByPk(guardianByPhone.userId, { transaction });
        }
      }
    }

    let reused = false;
    if (!user) {
      user = await User.create({
        username,
        email,
        password: await passwordService.hash(tempPassword),
        fullName: parentName,
        phone: parentPhone,
        roleType: 'parent',
        mustChangePassword: true
      }, { transaction });
    } else {
      reused = true;
    }

    let guardian = await Guardian.findOne({ where: { userId: user.id }, transaction });
    if (!guardian) {
      const parts = (user.fullName || parentName || '').trim().split(/\s+/).filter(Boolean);
      guardian = await Guardian.create({
        userId: user.id,
        G_F_name: parts[0] || parentName || 'ولي أمر',
        G_L_name: parts.slice(1).join(' ') || parts[0] || 'ولي أمر',
        G_phone: user.phone
      }, { transaction });
    }

    let relationType = await RelationType.findOne({ where: { relation_type: 'Parent' }, transaction });
    if (!relationType) {
      relationType = await RelationType.create({ relation_type: 'Parent' }, { transaction });
    }

    const childIds = [];

    if (mainChildId) {
      childIds.push(mainChildId);
    }

    const linkedRows = await Child_Guardian.findAll({
      where: { GID: guardian.GID },
      attributes: ['child_PersonID'],
      transaction
    });
    const linkedIds = linkedRows.map(l => l.child_PersonID);
    const linkedPersons = linkedIds.length
      ? await Person.findAll({ where: { PersonID: { [Op.in]: linkedIds } }, attributes: ['PersonID', 'Name'], transaction })
      : [];
    const linkedNameSet = new Set(linkedPersons.map(p => String(p.Name || '').trim()).filter(Boolean));

    const parseJson = (value) => {
      if (value == null) return null;
      if (typeof value === 'string') {
        try {
          return JSON.parse(value);
        } catch (e) {
          return null;
        }
      }
      return value;
    };

    const data = parseJson(record.data) || {};
    const rawGender = data.gender;
    const gender = rawGender === 'أنثى' || rawGender === 'Female' ? 'Female' : 'Male';
    const birthDate = data.birthDate && /^\d{4}-\d{2}-\d{2}/.test(String(data.birthDate)) ? String(data.birthDate).slice(0, 10) : '2021-01-01';

    const createChildFor = async (name) => {
      const person = await Person.create({ Name: name }, { transaction });
      const child = await Child.create({
        PersonID: person.PersonID,
        F_name: name,
        L_name: 'Family',
        gender,
        birth_date: birthDate
      }, { transaction });
      return child.PersonID;
    };

    const ensureChildLinked = async (name) => {
      const trimmed = String(name || '').trim();
      if (!trimmed || linkedNameSet.has(trimmed)) return;
      linkedNameSet.add(trimmed);
      childIds.push(await createChildFor(trimmed));
    };

    if (!mainChildId) {
      await ensureChildLinked(record.childName);
    }

    const storedTwinsRaw = parseJson(record.twins);
    const storedTwins = Array.isArray(storedTwinsRaw) ? storedTwinsRaw : [];
    const requestedTwins = Array.isArray(twinNames) ? twinNames : [];
    const allTwins = [...storedTwins, ...requestedTwins]
      .map((t) => {
        if (typeof t === 'string') return t.trim();
        if (t && typeof t.name === 'string') return t.name.trim();
        return '';
      })
      .filter(Boolean);

    for (const twinName of allTwins) {
      await ensureChildLinked(twinName);
    }

    for (const childId of childIds) {
      const existingLink = await Child_Guardian.findOne({
        where: { GID: guardian.GID, child_PersonID: childId },
        transaction
      });
      if (!existingLink) {
        await Child_Guardian.create({
          GID: guardian.GID,
          child_PersonID: childId,
          RelationTypeID: relationType.RelationTypeID
        }, { transaction });
      }
    }

    await record.update({ status: 'approved' }, { transaction });
    await transaction.commit();

    return { username: user.username, tempPassword: reused ? null : tempPassword };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

// 3. PUT /:id (Admin & secretary)
router.put('/:id', auth, authorize('admin', 'secretary'), async (req, res) => {
  try {
    const { status } = req.body || {};
    const allowedStatuses = ['pending', 'approved', 'rejected'];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const record = await RegistrationRequest.findByPk(req.params.id);
    if (!record) {
      return res.status(404).json({ message: 'Registration request not found' });
    }

    if (status !== 'approved') {
      await record.update({ status });
      return res.json({ id: record.id, status: record.status });
    }

    const childId = req.body.childId;
    if (childId) {
      const mainChild = await Child.findByPk(childId);
      if (!mainChild) {
        return res.status(400).json({ message: 'Child not found' });
      }
    }

    const twinNames = req.body.twinNames;
    if (twinNames !== undefined && (!Array.isArray(twinNames) || !twinNames.every(t => t === null || typeof t === 'string') || twinNames.length > 10)) {
      return res.status(400).json({ message: 'Invalid twin names' });
    }

    const { username, tempPassword } = await approveRegistration(record, childId || null, twinNames || []);

    return res.json({ id: record.id, status: record.status, username, tempPassword });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
