const mysql = require('mysql2/promise');
require('dotenv').config({ path: __dirname + '/../.env' });

const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'my_pass',
  database: process.env.DB_NAME || 'my_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = db;