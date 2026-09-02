const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const errorHandler = require('./middleware/errorHandler');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection & Sync
sequelize.sync({ alter: true })
  .then(() => console.log('MySQL database connected and synchronized successfully'))
  .catch((err) => console.error('MySQL connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/children', require('./routes/children'));
app.use('/api/parents', require('./routes/parents'));
app.use('/api/teachers', require('./routes/teachers'));
app.use('/api/classes', require('./routes/classes'));
app.use('/api/subjects', require('./routes/subjects'));
app.use('/api/sessions', require('./routes/sessions'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/notes', require('./routes/notes'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/reports', require('./routes/reports'));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 26043;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
