const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'defaultdb',
  process.env.DB_USER || 'avnadmin',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'mysql-155bed1e-qwasdfghjkl174-ed52.c.aivencloud.com',
    port: process.env.DB_PORT || 26043,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: {
      ssl: { 
        require: true,
        rejectUnauthorized: false
      }
    }
  }
);

// Test connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL database connected successfully');
  } catch (error) {
    console.error('MySQL connection error:', error);
  }
};

testConnection();

module.exports = sequelize;
