const path = require('path');
const { Sequelize } = require('sequelize');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const isDevelopment = process.env.NODE_ENV === 'development';
const useSQLite = isDevelopment && (!process.env.DB_HOST || process.env.DB_HOST === '127.0.0.1');

let sequelize;

if (useSQLite) {
  const sqlitePath = path.join(__dirname, '../../database.sqlite');
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: sqlitePath,
    logging: isDevelopment ? console.log : false,
  });
  console.log('Using SQLite database for development');
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME || 'kindergarten_db',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
      host: process.env.DB_HOST || '127.0.0.1',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
      dialect: 'mysql',
      logging: isDevelopment ? console.log : false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      dialectOptions: process.env.DB_SSL === 'true' ? {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      } : {}
    }
  );
}

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
