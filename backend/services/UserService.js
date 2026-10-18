const { User, Person, Teacher, Section, sequelize } = require('../models');
const { Op } = require('sequelize');
const passwordService = require('./PasswordService');

const ROLE_PREFIX = { teacher: 'T', secretary: 'S' };

class UserService {
  async createUser(userData, tempPassword) {
    const { fullName, phone, roleType } = userData;
    const nationalId =
      userData.nationalId === undefined || userData.nationalId === null
        ? ''
        : String(userData.nationalId).trim();

    if (roleType === 'parent') {
      throw new Error('Parents are created from registration requests');
    }

    if (!ROLE_PREFIX[roleType]) {
      throw new Error('Invalid role type');
    }

    if (!nationalId || !fullName || !phone) {
      throw new Error('National ID, full name and phone are required');
    }

    if (!/^\d+$/.test(nationalId)) {
      throw new Error('National ID must be numeric');
    }

    if (!tempPassword || String(tempPassword).length < 8) {
      throw new Error('Password must be at least 8 characters');
    }

    const username = `${ROLE_PREFIX[roleType]}${nationalId}@kg.alittihad`;
    const email = username;

    const existingUser = await User.findOne({
      where: { [Op.or]: [{ email }, { username }] }
    });

    if (existingUser) {
      throw new Error('Username or email already exists');
    }

    const hashedPassword = await passwordService.hash(tempPassword);

    if (roleType === 'teacher') {
      const nameParts = String(fullName).trim().split(/\s+/).filter(Boolean);
      const F_name = nameParts[0] || fullName;
      const L_name = nameParts.slice(1).join(' ') || F_name;

      let createdId = null;

      await sequelize.transaction(async (transaction) => {
        const user = await User.create(
          {
            username,
            email,
            password: hashedPassword,
            fullName,
            roleType,
            phone,
            mustChangePassword: true
          },
          { transaction }
        );

        const person = await Person.create({ Name: fullName }, { transaction });

        await Teacher.create(
          {
            PersonID: person.PersonID,
            userId: user.id,
            F_name,
            S_name: '',
            Th_name: '',
            L_name,
            T_Number: nationalId,
            Role: 'Teacher'
          },
          { transaction }
        );

        createdId = user.id;
      });

      return await User.findByPk(createdId, {
        attributes: { exclude: ['password'] }
      });
    }

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      fullName,
      roleType,
      phone,
      mustChangePassword: true
    });

    return await User.findByPk(user.id, {
      attributes: { exclude: ['password'] }
    });
  }

  async getAllUsers() {
    return await User.findAll({
      attributes: { exclude: ['password'] }
    });
  }

  async getUserById(id) {
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async updateUser(id, updateData, requesterRole = 'parent', requesterId = null) {
    const user = await User.findByPk(id);

    if (!user) {
      throw new Error('User not found');
    }

    // Build safe payload
    const safeData = {};
    if (updateData.fullName !== undefined) safeData.fullName = updateData.fullName;
    if (updateData.email !== undefined) safeData.email = updateData.email;
    if (updateData.phone !== undefined) safeData.phone = updateData.phone;
    if (updateData.avatar !== undefined) safeData.avatar = updateData.avatar;

    // Only admin can change roles
    if (requesterRole === 'admin' && updateData.roleType !== undefined) {
      safeData.roleType = updateData.roleType;
    }

    // Hash password if updating
    const newPassword = updateData.password || updateData.newPassword;
    if (newPassword) {
      if (String(newPassword).length < 8) {
        throw new Error('Password must be at least 8 characters');
      }

      const isSelf = parseInt(id, 10) === requesterId;

      if (isSelf) {
        if (!updateData.currentPassword) {
          throw new Error('Current password is required');
        }

        const isMatch = await passwordService.compare(
          updateData.currentPassword,
          user.password
        );

        if (!isMatch) {
          throw new Error('Current password is incorrect');
        }
      }

      const isSameAsCurrent = await passwordService.compare(
        String(newPassword),
        user.password
      );

      if (isSameAsCurrent) {
        throw new Error('New password must be different from current password');
      }

      safeData.password = await passwordService.hash(newPassword);

      // Admin resetting someone else's password issues a temporary password.
      // Changing your own password clears the forced-change flag.
      const isAdminReset = requesterRole === 'admin' && parseInt(id, 10) !== requesterId;
      safeData.mustChangePassword = isAdminReset;
    } else if (requesterRole === 'admin' && updateData.mustChangePassword !== undefined) {
      safeData.mustChangePassword = updateData.mustChangePassword;
    }

    await user.update(safeData);

    return await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    });
  }

  async deleteUser(id) {
    const user = await User.findByPk(id);

    if (!user) {
      throw new Error('User not found');
    }

    await sequelize.transaction(async (transaction) => {
      if (user.roleType === 'teacher') {
        const teacher = await Teacher.findOne({ where: { userId: user.id }, transaction });

        if (teacher) {
          const assignedSection = await Section.findOne({
            where: { assigned_teacher_id: teacher.PersonID },
            transaction
          });

          if (assignedSection) {
            const error = new Error('Teacher is assigned to a section and cannot be deleted');
            error.status = 409;
            throw error;
          }

          const personId = teacher.PersonID;
          await teacher.destroy({ transaction });
          await Person.destroy({ where: { PersonID: personId }, transaction });
        }
      }

      await user.destroy({ transaction });
    });

    return { message: 'User deleted successfully' };
  }

  canUpdateUser(requesterId, requesterRole, targetUserId) {
    return requesterId === parseInt(targetUserId) || requesterRole === 'admin';
  }
}

module.exports = new UserService();
