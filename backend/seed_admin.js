const { User, sequelize } = require('./models');
const passwordService = require('./services/PasswordService');

async function seedAdmin() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to database');

    const adminUsername = 'admin';
    const adminEmail = 'admin@aliaitihad.edu';
    const adminPasswordPlain = 'Admin@1234';

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
    console.log('Password:', adminPasswordPlain);
    console.log('Role:    ', newAdmin.roleType);
    console.log('---------------------------------');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error creating admin:', err.message);
    process.exit(1);
  }
}

seedAdmin();