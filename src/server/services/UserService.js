const { User } = require('../models');
const passwordService = require('./PasswordService');

class UserService {
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

  async updateUser(id, updateData, requesterRole = 'parent') {
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
    if (updateData.password) {
      safeData.password = await passwordService.hash(updateData.password);
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

    await user.destroy();
    return { message: 'User deleted successfully' };
  }

  canUpdateUser(requesterId, requesterRole, targetUserId) {
    return requesterId === parseInt(targetUserId) || requesterRole === 'admin';
  }
}

module.exports = new UserService();
