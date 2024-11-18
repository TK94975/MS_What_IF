// server/importSchedule.js

const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const mysql = require('mysql2/promise');
require('dotenv').config();

(async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'your_password',
      database: process.env.DB_NAME || 'what_if_ms',
      multipleStatements: true,
    });

    
    const courseCodeToId = {};
    const [courses] = await connection.execute('SELECT id, department, number FROM courses');
    courses.forEach((course) => {
      const courseCode = `${course.department}${course.number}`;
      courseCodeToId[courseCode] = course.id;
    });

    
    const csvFilePath = path.join(__dirname, 'cleaned_course_schedule.csv');
    const rows = [];

    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (row) => {
        rows.push(row);
      })
      .on('end', async () => {
        console.log('CSV file successfully processed.');

        // Valid semesters
        const validSemesters = ['Spring', 'Summer', 'Fall', 'Winter'];

        // 4. Process each row and insert data
        for (const row of rows) {
          const department = (row['department'] || '').trim();
          const number = (row['course_number'] || '').trim();
          const semester = (row['semester'] || '').trim();
          const year = parseInt(row['year'], 10);

          // Validate data
          if (!department || !number || !semester || !year) {
            console.warn(`Incomplete data in row: ${JSON.stringify(row)}. Skipping.`);
            continue;
          }

          if (!validSemesters.includes(semester)) {
            console.warn(`Invalid semester '${semester}' for course ${department} ${number}. Skipping.`);
            continue;
          }

          if (isNaN(year) || year < 2000 || year > 2100) {
            console.warn(`Invalid year '${year}' for course ${department} ${number}. Skipping.`);
            continue;
          }

          const courseCode = `${department}${number}`;
          const courseId = courseCodeToId[courseCode];

          if (!courseId) {
            console.warn(`Course ${courseCode} not found in the database. Skipping.`);
            continue;
          }

          // Insert
          try {
            await connection.execute(
              'INSERT INTO course_offerings (course_id, semester, year) VALUES (?, ?, ?)',
              [courseId, semester, year]
            );
            console.log(`Inserted offering for course ${courseCode}: Semester=${semester}, Year=${year}`);
          } catch (err) {
            if (err.code === 'ER_DUP_ENTRY') {
              console.warn(`Offering for course ${courseCode} in ${semester} ${year} already exists. Skipping.`);
            } else {
              console.error(`Error inserting offering for course ${courseCode}:`, err.message);
            }
          }
        }

        console.log('Course offerings inserted into the database.');

        // Close the connection
        await connection.end();
      });
  } catch (error) {
    console.error('Error importing course offerings:', error);
    process.exit(1);
  }
})();
