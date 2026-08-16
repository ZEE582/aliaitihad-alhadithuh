const { User } = require('../models');

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

  async updateUser(id, updateData) {
    const user = await User.findByPk(id);

    if (!user) {
      throw new Error('User not found');
    }

    await user.update(updateData);

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
