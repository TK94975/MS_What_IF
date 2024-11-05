const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
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

    const courseCodeToId = {}; // Map of course code to course ID

    // Read the CSV file
    const csvFilePath = path.join(__dirname, 'csi_course.csv');

    const courses = [];

    // Read the CSV file and collect course data
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (row) => {
        const department = row['ddd'];
        const number = row['number'];
        const title = row['title'];
        const credits = row['credits'];
        const description = row['description'];
        const prereq1 = row['prereq1']; 
        const prereq2 = row['prereq2'];

        const prereqs = [prereq1, prereq2].filter(Boolean);

        courses.push({
          department,
          number,
          title,
          credits,
          description,
          prereqs,
        });
      })
      .on('end', async () => {
        console.log('CSV file successfully processed.');

        // Insert courses into the database
        for (const course of courses) {
          const { department, number, title, credits, description } = course;

          // Insert course into the courses table
          const [result] = await connection.execute(
            'INSERT INTO courses (department, number, title, description, credits) VALUES (?, ?, ?, ?, ?)',
            [department, number, title, description, credits]
          );

          const courseId = result.insertId;
          const courseCode = `${department}${number}`;
          courseCodeToId[courseCode] = courseId;
        }

        console.log('Courses inserted into the database.');

        // Insert prerequisites into the database
        for (const course of courses) {
          const { department, number, prereqs } = course;
          const courseCode = `${department}${number}`;
          const courseId = courseCodeToId[courseCode];
          const grade = 'C-'

          for (const prereqCode of prereqs) {
            const prereqId = courseCodeToId[prereqCode];

            if (prereqId) {
              // Insert into course_prerequisites table
              await connection.execute(
                'INSERT INTO course_prerequisites (course_id, prereq_course_id, grade) VALUES (?, ?, ?)',
                [courseId, prereqId, grade]
              );
            } else {
              console.warn(`Prerequisite course ${prereqCode} not found for course ${courseCode}.`);
            }
          }
        }

        console.log('Prerequisites inserted into the database.');

        // Close the connection
        await connection.end();
      });
  } catch (error) {
    console.error('Error importing courses:', error);
    process.exit(1);
  }
})();
