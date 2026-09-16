const { Child, Person, ClassRoom, Section, sequelize } = require('../models');

class ChildService {
  async getAllChildren(userRole, userId) {
    return await Child.findAll({
      include: [
        {
          model: Person,
          as: 'person',
          attributes: ['PersonID', 'Name']
        },
        {
          model: ClassRoom,
          as: 'classRoom',
          attributes: ['classID', 'className']
        },
        {
          model: Section,
          as: 'section',
          attributes: ['section_id', 'SectionName', 'Name_level']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
  }

  async getChildById(id) {
    const child = await Child.findByPk(id, {
      include: [
        {
          model: Person,
          as: 'person',
          attributes: ['PersonID', 'Name']
        },
        {
          model: ClassRoom,
          as: 'classRoom',
          attributes: ['classID', 'className']
        },
        {
          model: Section,
          as: 'section',
          attributes: ['section_id', 'SectionName', 'Name_level']
        }
      ]
    });

    if (!child) {
      throw new Error('Child not found');
    }

    return child;
  }

  async createChild(childData) {
    const transaction = await sequelize.transaction();
    try {
      const fullName = childData.Name || 
        `${childData.F_name || childData.firstName || ''} ${childData.L_name || childData.lastName || ''}`.trim() || 'طفل جديد';

      // 1. Create Person supertype
      const person = await Person.create({ Name: fullName }, { transaction });

      // 2. Prepare Child data
      const payload = {
        PersonID: person.PersonID,
        F_name: childData.F_name || childData.firstName || 'طفل',
        S_name: childData.S_name || '',
        Th_name: childData.Th_name || '',
        L_name: childData.L_name || childData.lastName || 'عائلة',
        gender: (childData.gender === 'أنثى' || childData.gender === 'Female') ? 'Female' : 'Male',
        birth_date: childData.birth_date || childData.dateOfBirth || '2021-01-01',
        birthplace: childData.birthplace || '',
        address: childData.address || '',
        education_stage: childData.education_stage || 'تمهيدي',
        num_of_brothers: childData.num_of_brothers || 0,
        status_of_parents: childData.status_of_parents || 'معاً',
        child_order: childData.child_order || 1,
        classID: childData.classID || null,
        section_id: childData.section_id || null
      };

      const child = await Child.create(payload, { transaction });
      await transaction.commit();

      return await this.getChildById(child.PersonID);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async updateChild(id, updateData) {
    const transaction = await sequelize.transaction();
    try {
      const child = await Child.findByPk(id, { transaction });
      if (!child) {
        throw new Error('Child not found');
      }

      await child.update(updateData, { transaction });
      await transaction.commit();

      return await this.getChildById(id);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async deleteChild(id) {
    const transaction = await sequelize.transaction();
    try {
      const child = await Child.findByPk(id, { transaction });
      if (!child) {
        throw new Error('Child not found');
      }

      const personId = child.PersonID;
      await child.destroy({ transaction });
      await Person.destroy({ where: { PersonID: personId }, transaction });

      await transaction.commit();
      return { message: 'Child deleted successfully' };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

module.exports = new ChildService();