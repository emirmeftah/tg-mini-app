'use strict';

const express = require('express');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { createUser, getUserByUsername } = require('../models/database');
const { setToken } = require('../middleware/auth');

const router = express.Router();

// A small palette of avatar colours so every new user gets a distinct look.
const AVATAR_COLORS = [
  '#4FC3F7', '#81C784', '#FF8A65', '#BA68C8',
  '#FFD54F', '#4DD0E1', '#A1887F', '#E57373',
  '#7986CB', '#AED581', '#F06292', '#FFB74D',
];

function randomAvatarColor() {
  return AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
}

/**
 * Sanitise a user row for the client – never expose the password hash.
 */
function safeUser(user) {
  if (!user) return null;
  const { password_hash, ...safe } = user;
  return safe;
}

// ──────────────────────────────────────────────────────────────────────────────
// POST /api/auth/register
// Body: { username, password, displayName }
// ──────────────────────────────────────────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { username, password, displayName } = req.body;

    // ── Validation ──────────────────────────────────────────────────────
    if (!username || !password || !displayName) {
      return res.status(400).json({ error: 'username, password, and displayName are required' });
    }

    if (typeof username !== 'string' || username.length < 3 || username.length > 30) {
      return res.status(400).json({ error: 'Username must be between 3 and 30 characters' });
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return res.status(400).json({ error: 'Username may only contain letters, numbers, and underscores' });
    }

    if (typeof password !== 'string' || password.length < 4) {
      return res.status(400).json({ error: 'Password must be at least 4 characters' });
    }

    if (typeof displayName !== 'string' || displayName.trim().length === 0) {
      return res.status(400).json({ error: 'Display name must not be empty' });
    }

    // ── Check uniqueness ────────────────────────────────────────────────
    const existing = getUserByUsername(username.toLowerCase());
    if (existing) {
      return res.status(409).json({ error: 'Username is already taken' });
    }

    // ── Create user ─────────────────────────────────────────────────────
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = createUser({
      id: uuidv4(),
      username: username.toLowerCase(),
      displayName: displayName.trim(),
      passwordHash,
      avatarColor: randomAvatarColor(),
    });

    // ── Issue token ─────────────────────────────────────────────────────
    const token = uuidv4();
    setToken(token, user.id);

    return res.status(201).json({ token, user: safeUser(user) });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ──────────────────────────────────────────────────────────────────────────────
// POST /api/auth/login
// Body: { username, password }
// ──────────────────────────────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'username and password are required' });
    }

    const user = getUserByUsername(username.toLowerCase());
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = uuidv4();
    setToken(token, user.id);

    return res.json({ token, user: safeUser(user) });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
