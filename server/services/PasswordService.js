const bcrypt = require('bcryptjs');

class PasswordService {
  constructor() {
    this.saltRounds = 10;
  }

  async hash(password) {
    const salt = await bcrypt.genSalt(this.saltRounds);
    return await bcrypt.hash(password, salt);
  }

  async compare(candidatePassword, hashedPassword) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }
}

module.exports = new PasswordService();
