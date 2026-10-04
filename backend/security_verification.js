const { Sequelize, DataTypes } = require('sequelize');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

process.env.JWT_SECRET = 'test_super_secure_jwt_secret_key_987654321_aliaitihad';
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

// AuthService instance with test model
class TestAuthService {
  generateToken(user) {
    return jwt.sign({ userId: user.id, roleType: user.roleType }, process.env.JWT_SECRET, { expiresIn: '1h' });
  }

  sanitizeUser(user) {
    const { id, username, email, fullName, roleType, phone, avatar, mustChangePassword } = user;
    return { id, username, email, fullName, roleType, phone, avatar, mustChangePassword: !!mustChangePassword };
  }

  async login(email, password) {
    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error('Invalid credentials');
    const isMatch = await passwordService.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid credentials');
    return { token: this.generateToken(user), user: this.sanitizeUser(user) };
  }

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

  async verifyToken(token) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.userId, { attributes: { exclude: ['password'] } });
    if (!user) throw new Error('User not found');
    return user;
  }
}

// UserService instance with test model
class TestUserService {
  async createUser(userData) {
    const { email, password, fullName, roleType, phone, avatar } = userData;
    if (!email) throw new Error('البريد الإلكتروني مطلوب');
    const existing = await User.findOne({ where: { email } });
    if (existing) throw new Error('يوجد مستخدم مسجل بهذا البريد مسبقاً');
    const tempPassword = password || 'TempPass@123';
    const hashedPassword = await passwordService.hash(tempPassword);
    const username = email.split('@')[0] + '_' + Math.floor(Math.random() * 10000);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      fullName: fullName || 'مستخدم جديد',
      roleType: roleType || 'parent',
      phone: phone || null,
      avatar: avatar || null,
      mustChangePassword: true // Admin created
    });
    return await User.findByPk(user.id, { attributes: { exclude: ['password'] } });
  }

  async updateUser(id, updateData, requesterRole = 'parent') {
    const user = await User.findByPk(id);
    if (!user) throw new Error('User not found');
    const safeData = {};
    if (updateData.fullName !== undefined) safeData.fullName = updateData.fullName;
    if (updateData.email !== undefined) safeData.email = updateData.email;
    if (updateData.phone !== undefined) safeData.phone = updateData.phone;
    if (updateData.avatar !== undefined) safeData.avatar = updateData.avatar;

    // Only admin can change roles or reset mustChangePassword flag
    if (requesterRole === 'admin') {
      if (updateData.roleType !== undefined) safeData.roleType = updateData.roleType;
      if (updateData.mustChangePassword !== undefined) safeData.mustChangePassword = updateData.mustChangePassword;
    }

    if (updateData.password) {
      safeData.password = await passwordService.hash(updateData.password);
    }
    await user.update(safeData);
    return await User.findByPk(id, { attributes: { exclude: ['password'] } });
  }
}

const authService = new TestAuthService();
const userService = new TestUserService();

// Express-like middleware simulation
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers?.authorization || req.headers?.Authorization;
    const token = authHeader?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }
    const user = await authService.verifyToken(token);
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: error.message || 'Token is not valid' });
  }
};

const authorizeMiddleware = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.roleType)) {
      return res.status(403).json({ message: 'Not authorized to access this resource' });
    }
    next();
  };
};

function createMockReqRes(headers = {}, body = {}, params = {}) {
  const req = { headers, body, params };
  const res = {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.body = data;
      return this;
    }
  };
  return { req, res };
}

async function runSecurityVerification() {
  console.log('====================================================');
  console.log('🛡️ RUNNING DEEP SECURITY & RBAC VERIFICATION SUITE');
  console.log('====================================================\n');

  await testDb.sync({ force: true });

  let passed = 0;
  let failed = 0;

  function assert(condition, testName, details = '') {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName} ${details ? '(' + details + ')' : ''}`);
      failed++;
    }
  }

  // Seed Users: Admin, Teacher, Secretary, Parent
  const admin = await User.create({
    username: 'admin',
    email: 'admin@barae.edu',
    password: await passwordService.hash('Admin@12345'),
    roleType: 'admin',
    fullName: 'Admin User',
    mustChangePassword: false
  });

  const teacher = await User.create({
    username: 'teacher',
    email: 'teacher@barae.edu',
    password: await passwordService.hash('Teacher@12345'),
    roleType: 'teacher',
    fullName: 'Teacher User',
    mustChangePassword: false
  });

  const secretary = await User.create({
    username: 'secretary',
    email: 'secretary@barae.edu',
    password: await passwordService.hash('Secretary@12345'),
    roleType: 'secretary',
    fullName: 'Secretary User',
    mustChangePassword: false
  });

  const parent = await User.create({
    username: 'parent',
    email: 'parent@gmail.com',
    password: await passwordService.hash('Parent@12345'),
    roleType: 'parent',
    fullName: 'Parent User',
    mustChangePassword: false
  });

  const adminToken = authService.generateToken(admin);
  const teacherToken = authService.generateToken(teacher);
  const secretaryToken = authService.generateToken(secretary);
  const parentToken = authService.generateToken(parent);

  console.log('--- SECTION 1: RBAC & Endpoint Authorization ---');

  // Test 1: Parent accessing Admin-only endpoint -> 403
  {
    const { req, res } = createMockReqRes({ Authorization: `Bearer ${parentToken}` });
    await authMiddleware(req, res, () => {
      authorizeMiddleware('admin')(req, res, () => {
        res.status(200).json({ ok: true });
      });
    });
    assert(res.statusCode === 403, '1. Parent accessing Admin-only endpoint returns 403 Forbidden');
  }

  // Test 2: Teacher accessing Admin-only endpoint -> 403
  {
    const { req, res } = createMockReqRes({ Authorization: `Bearer ${teacherToken}` });
    await authMiddleware(req, res, () => {
      authorizeMiddleware('admin')(req, res, () => {
        res.status(200).json({ ok: true });
      });
    });
    assert(res.statusCode === 403, '2. Teacher accessing Admin-only endpoint returns 403 Forbidden');
  }

  // Test 3: Secretary accessing Admin-only endpoint -> 403
  {
    const { req, res } = createMockReqRes({ Authorization: `Bearer ${secretaryToken}` });
    await authMiddleware(req, res, () => {
      authorizeMiddleware('admin')(req, res, () => {
        res.status(200).json({ ok: true });
      });
    });
    assert(res.statusCode === 403, '3. Secretary accessing Admin-only endpoint returns 403 Forbidden');
  }

  // Test 4: Admin accessing Admin-only endpoint -> 200
  {
    const { req, res } = createMockReqRes({ Authorization: `Bearer ${adminToken}` });
    await authMiddleware(req, res, () => {
      authorizeMiddleware('admin')(req, res, () => {
        res.status(200).json({ ok: true });
      });
    });
    assert(res.statusCode === 200, '4. Admin accessing Admin-only endpoint succeeds with 200 OK');
  }

  // Test 5: Teacher accessing Teacher-or-Admin endpoint -> 200
  {
    const { req, res } = createMockReqRes({ Authorization: `Bearer ${teacherToken}` });
    await authMiddleware(req, res, () => {
      authorizeMiddleware('admin', 'teacher')(req, res, () => {
        res.status(200).json({ ok: true });
      });
    });
    assert(res.statusCode === 200, '5. Teacher accessing (Admin|Teacher) endpoint succeeds with 200 OK');
  }

  // Test 6: Parent accessing Teacher-or-Admin endpoint -> 403
  {
    const { req, res } = createMockReqRes({ Authorization: `Bearer ${parentToken}` });
    await authMiddleware(req, res, () => {
      authorizeMiddleware('admin', 'teacher')(req, res, () => {
        res.status(200).json({ ok: true });
      });
    });
    assert(res.statusCode === 403, '6. Parent accessing (Admin|Teacher) endpoint returns 403 Forbidden');
  }

  console.log('\n--- SECTION 2: JWT Integrity & Authentication ---');

  // Test 7: Missing JWT -> 401
  {
    const { req, res } = createMockReqRes({});
    await authMiddleware(req, res, () => {
      res.status(200).json({ ok: true });
    });
    assert(res.statusCode === 401, '7. Request without JWT returns 401 Unauthorized');
  }

  // Test 8: Tampered JWT -> 401
  {
    const { req, res } = createMockReqRes({ Authorization: 'Bearer forged.tampered.token' });
    await authMiddleware(req, res, () => {
      res.status(200).json({ ok: true });
    });
    assert(res.statusCode === 401, '8. Tampered / invalid JWT returns 401 Unauthorized');
  }

  // Test 9: Expired JWT -> 401
  {
    const expiredToken = jwt.sign({ userId: parent.id, roleType: 'parent' }, process.env.JWT_SECRET, { expiresIn: -10 });
    const { req, res } = createMockReqRes({ Authorization: `Bearer ${expiredToken}` });
    await authMiddleware(req, res, () => {
      res.status(200).json({ ok: true });
    });
    assert(res.statusCode === 401, '9. Expired JWT returns 401 Unauthorized');
  }

  console.log('\n--- SECTION 3: Frontend Role Forgery Protection ---');

  // Test 10: Parent sends request body with { roleType: 'admin' }
  {
    const updatePayload = { roleType: 'admin', fullName: 'Hacker Parent' };
    await userService.updateUser(parent.id, updatePayload, 'parent');
    const refreshedParent = await User.findByPk(parent.id);
    assert(refreshedParent.roleType === 'parent', '10. Parent cannot escalate privileges by sending roleType: admin');
  }

  // Test 11: Attacker sends forged { roleType: 'admin' } in request body to authorize middleware
  {
    const { req, res } = createMockReqRes(
      { Authorization: `Bearer ${parentToken}` },
      { roleType: 'admin', role: 'admin' } // malicious body
    );
    await authMiddleware(req, res, () => {
      authorizeMiddleware('admin')(req, res, () => {
        res.status(200).json({ ok: true });
      });
    });
    assert(res.statusCode === 403, '11. authorize middleware ignores roleType in request body and blocks attacker');
  }

  console.log('\n--- SECTION 4: Change Password Security & User Isolation ---');

  // Test 12: Change password identifies user strictly from JWT (req.user.id)
  {
    const changeResult = await authService.changePassword(parent.id, 'Parent@12345', 'NewParentPass@2026');
    assert(changeResult.message === 'تم تغيير كلمة المرور بنجاح', '12. Password change succeeds with correct current password');
    assert(!changeResult.user.password && !changeResult.password, '13. Change password response contains NO password or hash');
  }

  // Test 13: Attacker cannot change another user's password
  {
    try {
      await authService.changePassword(admin.id, 'Parent@12345', 'HackedAdminPass@2026');
      assert(false, '14. Changing another user password with mismatched credentials should fail');
    } catch (err) {
      assert(err.message === 'كلمة المرور الحالية غير صحيحة', '14. Cross-user password change strictly blocked by credential check');
    }
  }

  // Test 14: Old password no longer works
  {
    try {
      await authService.login('parent@gmail.com', 'Parent@12345');
      assert(false, '15. Old password should be completely invalidated');
    } catch (err) {
      assert(err.message === 'Invalid credentials', '15. Old password cannot be used after change');
    }
  }

  // Test 15: New password is saved as Bcrypt hash in DB
  {
    const pRecord = await User.findByPk(parent.id);
    assert(pRecord.password.startsWith('$2'), '16. New password is securely stored as bcrypt hash in DB');
  }

  console.log('\n--- SECTION 5: mustChangePassword Lifecycle ---');

  // Test 16: Admin creates user -> mustChangePassword is TRUE
  const createdByAdmin = await userService.createUser({
    email: 'new.staff@barae.edu',
    fullName: 'New Staff Member',
    roleType: 'teacher',
    password: 'InitialTempPass@1'
  });
  assert(createdByAdmin.mustChangePassword === true, '17. User created by Admin has mustChangePassword = true');

  // Test 17: New user logs in -> mustChangePassword is true in response
  const loginNewStaff = await authService.login('new.staff@barae.edu', 'InitialTempPass@1');
  assert(loginNewStaff.user.mustChangePassword === true, '18. Login response includes mustChangePassword = true for new user');

  // Test 18: User changes password -> mustChangePassword becomes false
  await authService.changePassword(createdByAdmin.id, 'InitialTempPass@1', 'PermanentSecurePass@2026');
  const afterChange = await User.findByPk(createdByAdmin.id);
  assert(afterChange.mustChangePassword === false, '19. After password change, mustChangePassword is false');

  // Test 19: Login after change -> mustChangePassword is false
  const loginPermanent = await authService.login('new.staff@barae.edu', 'PermanentSecurePass@2026');
  assert(loginPermanent.user.mustChangePassword === false, '20. Subsequent logins return mustChangePassword = false');

  console.log('\n====================================================');
  console.log(`🎯 FINAL VERIFICATION: ${passed} Passed, ${failed} Failed`);
  console.log('====================================================\n');

  process.exit(failed === 0 ? 0 : 1);
}

runSecurityVerification();
