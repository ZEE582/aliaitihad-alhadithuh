const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { User, Teacher, Section, ClassRoom } = require('../models');
const passwordService = require('./PasswordService');

class AuthService {
  constructor() {
    if (!process.env.JWT_SECRET) {
      console.error('CRITICAL SECURITY ERROR: JWT_SECRET environment variable is not defined!');
      throw new Error('FATAL SECURITY ERROR: JWT_SECRET environment variable is missing in .env file.');
    }
    this.jwtSecret = process.env.JWT_SECRET;
    this.jwtExpiration = process.env.JWT_EXPIRATION || '1d';
  }

  async register(userData) {
    const { username, email, password, fullName, roleType, phone } = userData;

    const existingUser = await User.findOne({
      where: {
        [require('sequelize').Op.or]: [{ email }, { username }]
      }
    });

    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await passwordService.hash(password);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      fullName,
      roleType,
      phone
    });

    const token = this.generateToken(user);

    return {
      token,
      user: this.sanitizeUser(user)
    };
  }

  async login(username, password) {
    const user = await User.findOne({
      where: { [Op.or]: [{ username }, { email: username }] }
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isMatch = await passwordService.compare(password, user.password);

    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const token = this.generateToken(user);
    const classroom = await this.resolveClassroom(user);

    return {
      token,
      user: { ...this.sanitizeUser(user), classroom }
    };
  }

  async resolveClassroom(user) {
    if (!user || user.roleType !== 'teacher') return null;

    const teacher = await Teacher.findOne({ where: { userId: user.id } });
    if (!teacher) return null;

    const section = await Section.findOne({
      where: { assigned_teacher_id: teacher.PersonID },
      include: [{ model: ClassRoom, as: 'classRoom', attributes: ['className'] }]
    });
    if (!section) return null;

    const label = [section.SectionName, section.classRoom && section.classRoom.className]
      .filter(Boolean)
      .join(' — ');

    return label || null;
  }

  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, this.jwtSecret, { algorithms: ['HS256'] });
      const user = await User.findByPk(decoded.userId, {
        attributes: { exclude: ['password'] }
      });

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      throw new Error('Token is not valid');
    }
  }

  generateToken(user) {
    return jwt.sign(
      { userId: user.id, roleType: user.roleType },
      this.jwtSecret,
      { expiresIn: this.jwtExpiration, algorithm: 'HS256' }
    );
  }

  sanitizeUser(user) {
    const { id, username, email, fullName, roleType, phone, avatar, mustChangePassword } = user;
    return { id, username, email, fullName, roleType, phone, avatar, mustChangePassword };
  }
}

module.exports = new AuthService();
