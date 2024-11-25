const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

require('dotenv').config(); // Load environment variables

const db = require('./config/db'); // Import the database connection

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const coursesRouter = require('./routes/courses');
const coursePrerequisitesRouter = require('./routes/course_prerequisites');
const courseConcentrationsRouter = require('./routes/course_concentrations');
const userCoursesRouter = require('./routes/user_courses');
const progressRouter = require('./routes/progress');

const app = express();
app.use(cors()); // Enable CORS

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Use routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/courses', coursesRouter);
app.use('/course_prerequisites', coursePrerequisitesRouter);
app.use('/course_concentrations', courseConcentrationsRouter);
app.use('/user_courses', userCoursesRouter);
app.use('/progress', progressRouter);
module.exports = app;
