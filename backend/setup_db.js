const path = require('path');
const mysql2 = require('mysql2/promise');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function setup() {
  const connection = await mysql2.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
  });

  await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'kindergarten_db'}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
  );
  console.log(`✅ Database "${process.env.DB_NAME || 'kindergarten_db'}" created/verified successfully!`);
  await connection.end();
}

setup().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
