const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const { sequelize } = require('./models');
const { auth } = require('./middleware/auth');
const uploadsAccess = require('./middleware/uploadsAccess');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// Dynamic CORS configuration
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:3000,http://localhost:26044')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically (authenticated users only, owner-scoped)
app.use('/uploads', auth, uploadsAccess, express.static(path.join(__dirname, 'uploads')));

// Targeted Rate Limiter for Login Endpoint
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 login requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many login attempts from this IP, please try again after 15 minutes.' }
});

// Targeted Rate Limiter for Registration Requests Endpoint (POST only)
const registrationRequestLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 registration request submissions per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many registration request attempts from this IP, please try again after an hour.' }
});

// Database Connection
sequelize.authenticate()
  .then(() => {
    console.log('MySQL database connected successfully');

    const PORT = process.env.PORT || 26043;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MySQL connection error:', err);
    process.exit(1);
  });

// Routes
app.use('/api/auth/login', loginLimiter);
app.post('/api/registration-requests', registrationRequestLimiter);
app.use('/api/registration-requests', require('./routes/registrationRequests'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/children', require('./routes/children'));
app.use('/api/parents', require('./routes/parents'));
app.use('/api/teachers', require('./routes/teachers'));
app.use('/api/classes', require('./routes/classes'));
app.use('/api/sections', require('./routes/sections'));
app.use('/api/subjects', require('./routes/subjects'));
app.use('/api/sessions', require('./routes/sessions'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/notes', require('./routes/notes'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/upload', require('./routes/upload'));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error Handling Middleware
app.use(errorHandler);
