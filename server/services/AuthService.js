const jwt = require('jsonwebtoken');
const { User } = require('../models');
const passwordService = require('./PasswordService');

class AuthService {
  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret_key_change_this_in_production';
    this.jwtExpiration = '7d';
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
    const user = await User.findOne({ where: { username } });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isMatch = await passwordService.compare(password, user.password);

    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const token = this.generateToken(user);

    return {
      token,
      user: this.sanitizeUser(user)
    };
  }

  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, this.jwtSecret);
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
      { expiresIn: this.jwtExpiration }
    );
  }

  sanitizeUser(user) {
    const { id, username, email, fullName, roleType, phone, avatar } = user;
    return { id, username, email, fullName, roleType, phone, avatar };
  }
}

module.exports = new AuthService();
