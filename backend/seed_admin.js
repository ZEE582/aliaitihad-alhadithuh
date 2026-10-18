const path = require('path');
const { User, sequelize } = require('./models');
const passwordService = require('./services/PasswordService');

try {
  require('dotenv').config({ path: path.join(__dirname, '.env') });
} catch (e) {
  // dotenv not installed - read from process.env directly
}

async function seedAdmin() {
  try {
    const adminPasswordPlain = process.env.ADMIN_PASSWORD;

    if (!adminPasswordPlain) {
      console.error('❌ ADMIN_PASSWORD environment variable is required');
      console.error('Set it in backend/.env (see backend/.env.example) and try again.');
      process.exit(1);
    }

    await sequelize.authenticate();
    console.log('✅ Connected to database');

    const adminUsername = 'admin';
    const adminEmail = 'admin@aliaitihad.edu';

    const existingUser = await User.findOne({
      where: { username: adminUsername }
    });

    if (existingUser) {
      console.log('ℹ️ Admin user already exists:', existingUser.username);
      process.exit(0);
    }

    const hashedPassword = await passwordService.hash(adminPasswordPlain);

    const newAdmin = await User.create({
      username: adminUsername,
      email: adminEmail,
      password: hashedPassword,
      fullName: 'System Administrator',
      roleType: 'admin',
      phone: '0590000000'
    });

    console.log('🎉 Admin created successfully!');
    console.log('---------------------------------');
    console.log('Username:', newAdmin.username);
    console.log('Email:   ', newAdmin.email);
    console.log('Password: (from ADMIN_PASSWORD env)');
    console.log('Role:    ', newAdmin.roleType);
    console.log('---------------------------------');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error creating admin:', err.message);
    process.exit(1);
  }
}

seedAdmin();