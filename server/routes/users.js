const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Database connection

// GET /users - Fetch all users
router.get('/', async (req, res, next) => {
  try {
    const [rows] = await db.query(
      'SELECT id, username, email, first_name, last_name, role, created_at FROM users'
    );
    res.json(rows);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /users - Insert a new user
router.post('/', async (req, res, next) => {
  try {
    const { username, email, password, first_name, last_name, role } = req.body;

    // Input validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required.' });
    }

    // Check if the username or email already exists
    const [existingUser] = await db.query(
      'SELECT id FROM users WHERE username = ? OR email = ?',
      [username, email]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({ error: 'Username or email already exists.' });
    }

    // Insert the new user into the database without password hashing
    const [result] = await db.query(
      'INSERT INTO users (username, email, password, first_name, last_name, role) VALUES (?, ?, ?, ?, ?, ?)',
      [username, email, password, first_name || null, last_name || null, role || 'user']
    );

    // Respond with the newly created user ID
    res.status(201).json({ message: 'User created successfully.', userId: result.insertId });
  } catch (err) {
    console.error('Error inserting user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
