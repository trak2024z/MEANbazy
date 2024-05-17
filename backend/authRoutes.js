const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const pool = require('./db');

// Walidacja danych wejściowych
const validateUserInput = (username, password, email = null) => {
  if (!username || !password || (email && !email.includes('@'))) {
    return { valid: false, message: 'Invalid input data. Make sure all fields are correctly filled.' };
  }
  return { valid: true };
};

// Rejestracja nowego użytkownika
router.post('/register', async (req, res) => {
  const { username, password, email } = req.body;
  const validation = validateUserInput(username, password, email);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.message });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const result = await pool.query(
      'INSERT INTO users (username, password_hash, email) VALUES ($1, $2, $3) RETURNING id, username',
      [username, passwordHash, email]
    );
    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error during user registration.' });
  }
});

// Logowanie użytkownika
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const validation = validateUserInput(username, password);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.message });
  }

  try {
    const result = await pool.query('SELECT id, username, password_hash FROM users WHERE username = $1', [username]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const isValidPassword = await bcrypt.compare(password, result.rows[0].password_hash);
    if (!isValidPassword) {
      return res.status(403).json({ error: 'Invalid password.' });
    }

    const user = { userId: result.rows[0].id, username: result.rows[0].username };
    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.status(200).json({ auth: true, token, username: result.rows[0].username });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error during user login.' });
  }
});

module.exports = router;