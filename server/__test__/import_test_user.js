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
        ['mlkerr@albany.edu', '$2b$10$Xz91xMkewlylc7oD.7udSu37MeBD0hYib59JSqSQUFlATFYFE7ro2', 'CSI', 'Old', 'user']
      );

    console.log("Added test user");

    // Insert test data into user_courses
    /*const queries = [
    ['1', '9', 'Spring', '2023', 'A', 'yes'],
    ['1', '29', 'Fall', '2023', 'A-', 'yes'],
    ['1', '4', 'Fall', '2023', 'B+', 'yes'],
    ['1', '25', 'Fall', '2023', 'B', , 'yes'],
    ['1', '6', 'Fall', '2024', 'B-', 'yes'],
    ['1', '11', 'Fall', '2024', 'C+', 'yes'],
    ['1', '19', 'Fall', '2024', 'C', 'yes'],
    ['1', '21', 'Fall', '2024', 'D', 'yes'],
    ['1', '60', 'Spring', '2024', null, 'no'],
    ['1', '20', 'Spring', '2024', null, 'no'],
    ['1', '37', 'Spring', '2024', null, 'no'],
    ];

    for (const query of queries) {
    await connection.query(
        'INSERT INTO user_courses (user_id, course_id, semester, year, grade, completed) VALUES (?, ?, ?, ?, ?, ?)',
        query
    );
    }

    console.log("Added test user classes");*/

    // Close the connection
    await connection.end();
} catch (error) {
    console.error("Error adding test user data:", error.message);
    process.exit(1);
}
})();