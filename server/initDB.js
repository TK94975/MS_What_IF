const mysql = require('mysql2/promise');
require('dotenv').config();

(async () => {
  try {
    // Create a connection to the MySQL server
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'your_password',
      multipleStatements: true,
    });

    // Create the database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);

    // Use the database
    await connection.query(`USE \`${process.env.DB_NAME}\`;`);

    // Create the users table
    const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) NOT NULL UNIQUE,
      email VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      first_name VARCHAR(50),
      last_name VARCHAR(50),
      role ENUM('user', 'admin') DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );`;

    await connection.query(createUsersTable);

    console.log('Database and users table created (if they did not exist already).');

    // Insert two dummy users without password hashing
    const insertUsers = `
    INSERT INTO users (username, email, password, first_name, last_name, role)
    VALUES (?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?);
    `;

    await connection.execute(insertUsers, [
      'spongebob', 'sponge@bob.com', 'password123', 'Sponge', 'Bob', 'user',
      'teimur', 'teimur@albany.com', 'password456', 'Teimur', 'Khan', 'user',
    ]);

    console.log('Inserted two dummy users into the users table.');

    // Close the connection
    await connection.end();
  } catch (error) {
    console.error('Error creating database or tables:', error);
    process.exit(1);
  }
})();
