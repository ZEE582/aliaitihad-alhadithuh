const { Child, Person, ClassRoom, Section, Guardian, Child_Guardian, Teacher, sequelize } = require('../models');
const { Op } = require('sequelize');

class ChildService {
  async getAllChildren(userRole, userId) {
    let where = {};

    // Data segregation based on user role
    if (userRole === 'parent') {
      const guardian = await Guardian.findOne({ where: { userId } });
      if (!guardian) return [];
      const relations = await Child_Guardian.findAll({
        where: { GID: guardian.GID },
        attributes: ['child_PersonID']
      });
      const childIds = relations.map(r => r.child_PersonID);
      where.PersonID = { [Op.in]: childIds };
    } else if (userRole === 'teacher') {
      const teacher = await Teacher.findOne({ where: { userId } });
      if (teacher) {
        const section = await Section.findOne({ where: { assigned_teacher_id: teacher.PersonID } });
        if (section) {
          where.section_id = section.section_id;
        }
      }
    }

    return await Child.findAll({
      where,
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
        `${childData.F_name || childData.firstName || ''} ${childData.L_name || childData.lastName || ''}`.trim() || 'New Child';

      // 1. Create Person supertype
      const person = await Person.create({ Name: fullName }, { transaction });

      // 2. Prepare Child data
      const payload = {
        PersonID: person.PersonID,
        F_name: childData.F_name || childData.firstName || 'Child',
        S_name: childData.S_name || '',
        Th_name: childData.Th_name || '',
        L_name: childData.L_name || childData.lastName || 'Family',
        gender: (childData.gender === 'Female') ? 'Female' : 'Male',
        birth_date: childData.birth_date || childData.dateOfBirth || '2021-01-01',
        birthplace: childData.birthplace || '',
        address: childData.address || '',
        education_stage: childData.education_stage || 'Preparatory',
        num_of_brothers: childData.num_of_brothers || 0,
        status_of_parents: childData.status_of_parents || 'Together',
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