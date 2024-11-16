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

// POST /users - Insert a new user (not admin)
router.post('/signup', async (req, res, next) => {
  try {
    const {email, password, major, concentration} = req.body;
    const user = 'user';

    // Input validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required.' });
    }

    // Check if the username or email already exists
    const [existingUser] = await db.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({ error: 'Username or email already exists.' });
    }

    // Insert the new user into the database without password hashing
    const [result] = await db.query(
      'INSERT INTO users (email, password, major, concentration, role) VALUES (?,?,?,?,?)',
      [email, password, major, concentration, user]
    );

    const [newUser] = await db.query(
      'SELECT * FROM users WHERE email = ? AND password = ?',
      [email, password]
    );

    // Respond with the newly created user ID
    res.status(201).json([newUser[0]]);
  } catch (err) {
    console.error('Error inserting user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/signin', async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const [existingUser] = await db.query(
    'SELECT * FROM users WHERE email = ? AND password = ?',
    [email, password]
  );

  if (existingUser.length === 0) {
    return res.status(401).json({error: 'User not found'});
  }

  return res.status(200).json([existingUser[0]]);

})

module.exports = router;
