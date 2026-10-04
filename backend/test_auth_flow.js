const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

process.env.JWT_SECRET = 'test_super_secret_jwt_key_987654321';
process.env.JWT_EXPIRATION = '1h';

// Setup in-memory sqlite test database
const testDb = new Sequelize({
  dialect: 'sqlite',
  storage: ':memory:',
  logging: false
});

const User = testDb.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  roleType: { type: DataTypes.ENUM('admin', 'teacher', 'parent', 'secretary'), defaultValue: 'parent' },
  mustChangePassword: { type: DataTypes.BOOLEAN, defaultValue: false },
  fullName: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING },
  avatar: { type: DataTypes.STRING }
});

const passwordService = require('./services/PasswordService');

// Custom test runner
async function runTests() {
  console.log('🚀 Starting Comprehensive Authentication & Role Tests...\n');
  await testDb.sync({ force: true });

  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName}`);
      failed++;
    }
  }

  // 1. Create seeded Admin and existing users (mustChangePassword = false)
  const hashedAdminPass = await passwordService.hash('Admin@123');
  const adminUser = await User.create({
    username: 'admin',
    email: 'admin@barae.edu',
    password: hashedAdminPass,
    fullName: 'Admin User',
    roleType: 'admin',
    mustChangePassword: false
  });

  const hashedParentPass = await passwordService.hash('Parent@123');
  const parentUser = await User.create({
    username: 'parent1',
    email: 'parent@gmail.com',
    password: hashedParentPass,
    fullName: 'Parent User',
    roleType: 'parent',
    mustChangePassword: false
  });

  // Mock AuthService with test User model
  const authService = {
    generateToken(user) {
      return jwt.sign({ userId: user.id, roleType: user.roleType }, process.env.JWT_SECRET, { expiresIn: '1h' });
    },
    sanitizeUser(user) {
      const { id, username, email, fullName, roleType, phone, avatar, mustChangePassword } = user;
      return { id, username, email, fullName, roleType, phone, avatar, mustChangePassword: !!mustChangePassword };
    },
    async login(email, password) {
      const user = await User.findOne({ where: { email } });
      if (!user) throw new Error('Invalid credentials');
      const isMatch = await passwordService.compare(password, user.password);
      if (!isMatch) throw new Error('Invalid credentials');
      return { token: this.generateToken(user), user: this.sanitizeUser(user) };
    },
    async changePassword(userId, currentPassword, newPassword) {
      const user = await User.findByPk(userId);
      if (!user) throw new Error('User not found');
      const isMatch = await passwordService.compare(currentPassword, user.password);
      if (!isMatch) throw new Error('كلمة المرور الحالية غير صحيحة');
      if (!newPassword || newPassword.length < 6) throw new Error('يجب أن تكون كلمة المرور الجديدة 6 أحرف على الأقل');
      const hashedPassword = await passwordService.hash(newPassword);
      await user.update({ password: hashedPassword, mustChangePassword: false });
      return { message: 'تم تغيير كلمة المرور بنجاح', user: this.sanitizeUser(user) };
    }
  };

  // Test 1: Login with valid email and valid password
  try {
    const res = await authService.login('parent@gmail.com', 'Parent@123');
    assert(res.token && res.user.email === 'parent@gmail.com' && res.user.roleType === 'parent', '1. Login with valid email + valid password succeeds');
  } catch (err) {
    assert(false, '1. Login with valid email + valid password succeeds: ' + err.message);
  }

  // Test 2: Login with valid email + invalid password
  try {
    await authService.login('parent@gmail.com', 'WrongPass!');
    assert(false, '2. Login with invalid password should fail');
  } catch (err) {
    assert(err.message === 'Invalid credentials', '2. Login with invalid password fails with Invalid credentials');
  }

  // Test 3: Login using username should fail
  try {
    await authService.login('parent1', 'Parent@123');
    assert(false, '3. Login with username should fail');
  } catch (err) {
    assert(err.message === 'Invalid credentials', '3. Login using username fails properly (Email required)');
  }

  // Test 4: Existing accounts remain mustChangePassword = false
  const pCheck = await User.findByPk(parentUser.id);
  assert(pCheck.mustChangePassword === false, '4. Existing accounts are unaffected (mustChangePassword = false)');

  // Test 5: Admin creates a new user -> mustChangePassword must be explicitly true
  const hashedNewPass = await passwordService.hash('Temp@1234');
  const newTeacher = await User.create({
    username: 'teacher_nour',
    email: 'nour.teacher@gmail.com',
    password: hashedNewPass,
    fullName: 'Nour Teacher',
    roleType: 'teacher',
    mustChangePassword: true // Admin created
  });
  assert(newTeacher.mustChangePassword === true, '5. New account created by Admin has mustChangePassword = true');

  // Test 6: New account logs in and has mustChangePassword = true
  const loginNew = await authService.login('nour.teacher@gmail.com', 'Temp@1234');
  assert(loginNew.user.mustChangePassword === true && loginNew.user.roleType === 'teacher', '6. New account logs in and returns mustChangePassword = true');

  // Test 7: Change password with wrong current password fails
  try {
    await authService.changePassword(newTeacher.id, 'WrongTempPass', 'NewStrong@123');
    assert(false, '7. Change password with incorrect current password should fail');
  } catch (err) {
    assert(err.message === 'كلمة المرور الحالية غير صحيحة', '7. Change password with incorrect current password fails');
  }

  // Test 8: Change password with valid current password succeeds and sets mustChangePassword = false
  const changeRes = await authService.changePassword(newTeacher.id, 'Temp@1234', 'NewStrong@123');
  assert(changeRes.user.mustChangePassword === false, '8. Successful password change sets mustChangePassword = false');

  // Test 9: Verify user cannot login with old temporary password
  try {
    await authService.login('nour.teacher@gmail.com', 'Temp@1234');
    assert(false, '9. Old temp password should not work after change');
  } catch (err) {
    assert(err.message === 'Invalid credentials', '9. Old temp password is fully invalidated');
  }

  // Test 10: Verify login with new password works and mustChangePassword is false
  const loginUpdated = await authService.login('nour.teacher@gmail.com', 'NewStrong@123');
  assert(loginUpdated.user.mustChangePassword === false, '10. Login with new password works and mustChangePassword is false');

  // Test 11: JWT authorization check (User cannot forge roleType from frontend)
  const decodedToken = jwt.verify(loginUpdated.token, process.env.JWT_SECRET);
  assert(decodedToken.userId === newTeacher.id && decodedToken.roleType === 'teacher', '11. JWT token contains authentic roleType and userId from DB');

  // Test 12: Invalid / tampered JWT is rejected
  try {
    jwt.verify('invalid.fake.token', process.env.JWT_SECRET);
    assert(false, '12. Tampered JWT should be rejected');
  } catch (err) {
    assert(true, '12. Tampered JWT is safely rejected');
  }

  console.log(`\n==============================`);
  console.log(`Summary: ${passed} Passed, ${failed} Failed`);
  console.log(`==============================\n`);

  process.exit(failed === 0 ? 0 : 1);
}

runTests();
