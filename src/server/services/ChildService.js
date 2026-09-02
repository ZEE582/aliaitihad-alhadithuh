const { Child, User, Class } = require('../models');

class ChildService {
  async getAllChildren(userRole, userId) {
    let where = {};
    
    if (userRole === 'parent') {
      where.parentId = userId;
    }

    return await Child.findAll({
      where,
      include: [
        {
          model: User,
          as: 'parent',
          attributes: ['id', 'fullName', 'email', 'phone']
        },
        {
          model: Class,
          as: 'class',
          attributes: ['id', 'name', 'level']
        }
      ]
    });
  }

  async getChildById(id, userRole, userId) {
    const child = await Child.findByPk(id, {
      include: [
        {
          model: User,
          as: 'parent',
          attributes: ['id', 'fullName', 'email', 'phone']
        },
        {
          model: Class,
          as: 'class',
          attributes: ['id', 'name', 'level']
        }
      ]
    });

    if (!child) {
      throw new Error('Child not found');
    }

    if (userRole === 'parent' && child.parentId !== userId) {
      throw new Error('Not authorized');
    }

    return child;
  }

  async createChild(childData) {
    const child = await Child.create(childData);
    
    return await Child.findByPk(child.id, {
      include: [
        {
          model: User,
          as: 'parent',
          attributes: ['id', 'fullName', 'email', 'phone']
        },
        {
          model: Class,
          as: 'class',
          attributes: ['id', 'name', 'level']
        }
      ]
    });
  }

  async updateChild(id, updateData) {
    const child = await Child.findByPk(id);

    if (!child) {
      throw new Error('Child not found');
    }

    await child.update(updateData);
    
    return await Child.findByPk(id, {
      include: [
        {
          model: User,
          as: 'parent',
          attributes: ['id', 'fullName', 'email', 'phone']
        },
        {
          model: Class,
          as: 'class',
          attributes: ['id', 'name', 'level']
        }
      ]
    });
  }

  async deleteChild(id) {
    const child = await Child.findByPk(id);

    if (!child) {
      throw new Error('Child not found');
    }

    await child.destroy();
    return { message: 'Child deleted successfully' };
  }
}

module.exports = new ChildService();