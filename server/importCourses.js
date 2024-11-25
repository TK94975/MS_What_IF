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
        const department = row['ddd'].trim();
        const number = row['number'].trim();
        const title = row['title'].trim();
        const credits = row['credits'].trim();
        const description = row['description'].trim();
        const prereq1 = row['prereq1'].trim(); 
        const prereq2 = row['prereq2'].trim();

        const prereqs = [prereq1, prereq2].filter(Boolean);

        // Collect data for course concentrations
        const csiConcentration = row['csi_concentration'].trim();
        const eceConcentration = row['ece_concentration'].trim();
        const isConcentrationCore = row['isConcentrationCore'].trim();

        courses.push({
          department,
          number,
          title,
          credits,
          description,
          prereqs,
          csiConcentration,
          eceConcentration,
          isConcentrationCore,
        });
      })
      .on('end', async () => {
        console.log('CSV file successfully processed.');

        // Insert courses into the database
        for (const course of courses) {
          const { department, number, title, credits, description } = course;

          try {
            // Insert course into the courses table
            const [result] = await connection.execute(
              'INSERT INTO courses (department, number, title, description, credits) VALUES (?, ?, ?, ?, ?)',
              [department, number, title, description, credits]
            );

            const courseId = result.insertId;
            const courseCode = `${department}${number}`;
            courseCodeToId[courseCode] = courseId;
          } catch (err) {
            if (err.code === 'ER_DUP_ENTRY') {
              console.warn(`Course ${department} ${number} already exists. Skipping.`);
              // Optionally, retrieve the existing course ID
              const [rows] = await connection.execute(
                'SELECT id FROM courses WHERE department = ? AND number = ?',
                [department, number]
              );
              if (rows.length > 0) {
                const courseId = rows[0].id;
                const courseCode = `${department}${number}`;
                courseCodeToId[courseCode] = courseId;
              }
            } else {
              console.error(`Error inserting course ${department} ${number}:`, err.message);
              continue;
            }
          }
        }

        console.log('Courses inserted into the database.');

        // Insert prerequisites into the database
        for (const course of courses) {
          const { department, number, prereqs } = course;
          const courseCode = `${department}${number}`;
          const courseId = courseCodeToId[courseCode];
          const grade = 'C'; // Adjust grade as needed

          for (const prereqCode of prereqs) {
            const prereqId = courseCodeToId[prereqCode];

            if (prereqId) {
              try {
                // Insert into course_prerequisites table
                await connection.execute(
                  'INSERT INTO course_prerequisites (course_id, prereq_course_id, grade) VALUES (?, ?, ?)',
                  [courseId, prereqId, grade]
                );
              } catch (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                  console.warn(`Prerequisite relationship between course ${courseCode} and ${prereqCode} already exists. Skipping.`);
                } else {
                  console.error(`Error inserting prerequisite for course ${courseCode}:`, err.message);
                }
              }
            } else {
              console.warn(`Prerequisite course ${prereqCode} not found for course ${courseCode}.`);
            }
          }
        }

        console.log('Prerequisites inserted into the database.');

        // Insert concentrations into the database
        const validConcentrations = [
          'Artificial Intelligence and Machine Learning',
          'Systems',
          'Theoretical Computer Science',
          'Old Computer Science',
          'Signal Processing and Communications',
          'Electronic Circuits and Systems',
          'Control and Computer Systems',
          'Core',
          'none',
        ];

        for (const course of courses) {
          const { department, number, csiConcentration, eceConcentration, isConcentrationCore } = course;
          const courseCode = `${department}${number}`;
          const courseId = courseCodeToId[courseCode];

          if (!courseId) {
            console.warn(`Course ${courseCode} not found in the database.`);
            continue;
          }

          // Map 'Core' to 1, blank or other values to 0
          const isCore = isConcentrationCore === 'Core' ? true : false;
          //console.log(courseCode);
          //console.log(isCore)
          // Insert for CSI concentration
          if (csiConcentration && csiConcentration !== 'none') {
            if (!validConcentrations.includes(csiConcentration)) {
              console.warn(`Invalid CSI concentration '${csiConcentration}' for course ${courseCode}. Skipping.`);
            } else {
              try {
                await connection.execute(
                  'INSERT INTO course_concentrations (course_id, major, concentration, isConcentrationCore) VALUES (?, ?, ?, ?)',
                  [courseId, 'CSI', csiConcentration, isCore]
                );
                console.log(`Inserted concentration for course ${courseCode}: Major=CSI, Concentration=${csiConcentration}, isCore=${isCore}`);
              } catch (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                  console.warn(`Duplicate entry for course ${courseCode}, major CSI, concentration ${csiConcentration}. Skipping.`);
                } else {
                  console.error(`Error inserting concentration for course ${courseCode}:`, err.message);
                }
              }
            }
          }

          // Insert for ECE concentration
          if (eceConcentration && eceConcentration !== 'none') {
            if (!validConcentrations.includes(eceConcentration)) {
              console.warn(`Invalid ECE concentration '${eceConcentration}' for course ${courseCode}. Skipping.`);
            } else {
              try {
                await connection.execute(
                  'INSERT INTO course_concentrations (course_id, major, concentration, isConcentrationCore) VALUES (?, ?, ?, ?)',
                  [courseId, 'ECE', eceConcentration, isCore]
                );
                console.log(`Inserted concentration for course ${courseCode}: Major=ECE, Concentration=${eceConcentration}, isCore=${isCore}`);
              } catch (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                  console.warn(`Duplicate entry for course ${courseCode}, major ECE, concentration ${eceConcentration}. Skipping.`);
                } else {
                  console.error(`Error inserting concentration for course ${courseCode}:`, err.message);
                }
              }
            }
          }
        }

        console.log('Concentrations inserted into the database.');

        // Close the connection
        await connection.end();
      });
  } catch (error) {
    console.error('Error importing courses and concentrations:', error);
    process.exit(1);
  }
})();
