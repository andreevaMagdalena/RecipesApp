const express = require('express');
const { getUserByEmail, createUser } = require('../db/userRepository');
const { hashPassword, verifyPassword, generateToken } = require('../services/authService');

const router = express.Router();

function isValidEmail(email) {
  return typeof email === 'string' && email.trim().length > 0 && email.includes('@');
}

router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !isValidEmail(email) || !password || password.length < 8) {
    return res.status(400).json({ error: 'Name, valid email and password (min 8 chars) are required.' });
  }

  const existingUser = await getUserByEmail(email.toLowerCase().trim());
  if (existingUser) {
    return res.status(409).json({ error: 'Email already in use.' });
  }

  const passwordHash = await hashPassword(password);
  const user = await createUser({ name: name.trim(), email: email.toLowerCase().trim(), passwordHash });
  const token = generateToken(user);

  return res.status(201).json({
    user: { id: user.id, name: user.name, email: user.email },
    token,
  });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!isValidEmail(email) || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const user = await getUserByEmail(email.toLowerCase().trim());
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const isValid = await verifyPassword(password, user.password_hash);
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const token = generateToken(user);
  return res.json({
    user: { id: user.id, name: user.name, email: user.email },
    token,
  });
});

module.exports = router;
