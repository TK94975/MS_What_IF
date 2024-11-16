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
      email VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      major ENUM('cs', 'ece'),
      concentration ENUM('ai', 'systems', 'theory', 'none'),
      role ENUM('user', 'admin') DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );`;

    await connection.query(createUsersTable);

    console.log('Database and users table created (if they did not exist already).');

    // Insert two dummy users without password hashing
    /*const insertUsers = `
    INSERT INTO users (username, email, password, first_name, last_name, role)
    VALUES (?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?);
    `;

    await connection.execute(insertUsers, [
      'spongebob', 'sponge@bob.com', 'password123', 'Sponge', 'Bob', 'user',
      'teimur', 'teimur@albany.com', 'password456', 'Teimur', 'Khan', 'user',
    ]);

    console.log('Inserted two dummy users into the users table.');*/


    // **Create the courses table**
    const createCoursesTable = `
    CREATE TABLE IF NOT EXISTS courses (
      id INT AUTO_INCREMENT PRIMARY KEY,
      department VARCHAR(20) NOT NULL,
      number INT NOT NULL,
      title VARCHAR(100) NOT NULL,
      description TEXT,
      credits INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );`;

    await connection.query(createCoursesTable);

    console.log('Courses table created (if it did not exist already).');

    const createPreReqTable = `
    CREATE TABLE IF NOT EXISTS course_prerequisites (
      course_id INT NOT NULL,
      prereq_course_id INT NOT NULL,
      grade VARCHAR(5),
      PRIMARY KEY (course_id, prereq_course_id),
      FOREIGN KEY (course_id) REFERENCES courses(id),
      FOREIGN KEY (prereq_course_id) REFERENCES courses(id)
    );`;

    await connection.query(createPreReqTable);

    console.log('Pre Requisites table created (if it did not exist already).');

    // Close the connection
    await connection.end();
  } catch (error) {
    console.error('Error creating database or tables:', error);
    process.exit(1);
  }
})();
