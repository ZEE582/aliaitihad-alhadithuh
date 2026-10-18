const jwt = require('jsonwebtoken');
const authService = require('../services/AuthService');

const revokedTokens = new Map();

const revokeToken = (token) => {
  if (!token) return;
  const decoded = jwt.decode(token);
  const exp = decoded && decoded.exp ? decoded.exp * 1000 : Date.now();
  revokedTokens.set(token, exp);
  const now = Date.now();
  revokedTokens.forEach((expAt, entry) => {
    if (expAt <= now) revokedTokens.delete(entry);
  });
};

const isRevoked = (token) => {
  const exp = revokedTokens.get(token);
  if (exp === undefined) return false;
  if (exp <= Date.now()) {
    revokedTokens.delete(token);
    return false;
  }
  return true;
};

const isPasswordChangeAllowed = (req) => {
  const url = (req.originalUrl || '').split('?')[0];
  const method = req.method;

  if (method === 'GET' && url === '/api/auth/me') return true;
  if (method === 'POST' && url === '/api/auth/logout') return true;

  if (method === 'PUT' && /^\/api\/users\/\d+$/.test(url)) {
    return parseInt(url.split('/').pop(), 10) === req.user.id;
  }

  return false;
};

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }

    if (isRevoked(token)) {
      return res.status(401).json({ message: 'Token has been revoked' });
    }

    const user = await authService.verifyToken(token);
    req.user = user;
    req.token = token;

    if (user.mustChangePassword && !isPasswordChangeAllowed(req)) {
      return res.status(403).json({
        code: 'PASSWORD_CHANGE_REQUIRED',
        message: 'Password change required before accessing this resource'
      });
    }

    next();
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.roleType)) {
      return res.status(403).json({ message: 'Not authorized to access this resource' });
    }
    next();
  };
};

module.exports = { auth, authorize, revokeToken, isRevoked };
