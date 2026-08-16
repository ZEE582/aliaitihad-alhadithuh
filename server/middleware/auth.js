const authService = require('../services/AuthService');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }

    const user = await authService.verifyToken(token);
    req.user = user;
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

module.exports = { auth, authorize };
