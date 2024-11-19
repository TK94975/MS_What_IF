const mysql = require('mysql2/promise');
require('dotenv').config();


(async () => {
try {
    // Create a connection to the MySQL server
    const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'your_password',
    database: process.env.DB_NAME || 'what_if_ms',
    multipleStatements: true,
    });

    await connection.query(
        'INSERT INTO users (email, password, major, concentration, role) VALUES (?, ?, ?, ?, ?)',
        ['mlkerr@albany.edu', '$2b$10$Xz91xMkewlylc7oD.7udSu37MeBD0hYib59JSqSQUFlATFYFE7ro2', 'CSI', 'Old Computer Science', 'user']
      );

    console.log("Added test user");

    // Insert test data into user_courses
    const queries = [
    ['1', '9', 'Spring', '2023', 'A'],
    ['1', '29', 'Fall', '2023', 'A-'],
    ['1', '4', 'Fall', '2023', 'B+'],
    ['1', '25', 'Fall', '2023', 'B'],
    ['1', '6', 'Spring', '2024', 'B-'],
    ['1', '11', 'Spring', '2024', 'C+'],
    ['1', '19', 'Spring', '2024', 'C'],
    ['1', '21', 'Spring', '2024', 'D'],
    ];

    for (const query of queries) {
    await connection.query(
        'INSERT INTO user_courses (user_id, course_id, semester, year, grade) VALUES (?, ?, ?, ?, ?)',
        query
    );
    }

    console.log("Added test user classes");

    // Close the connection
    await connection.end();
} catch (error) {
    console.error("Error adding test user data:", error.message);
    process.exit(1);
}
})();