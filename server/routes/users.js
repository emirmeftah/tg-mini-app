'use strict';

const express = require('express');
const { getUserById, searchUsers } = require('../models/database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// All routes in this file require authentication.
router.use(authMiddleware);

// ──────────────────────────────────────────────────────────────────────────────
// GET /api/users/profile
// Returns the authenticated user's own profile.
// ──────────────────────────────────────────────────────────────────────────────
router.get('/profile', (req, res) => {
  try {
    const user = getUserById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json({ user });
  } catch (err) {
    console.error('Get profile error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ──────────────────────────────────────────────────────────────────────────────
// GET /api/users/search?q=query
// Search users by username. Excludes the current user from results.
// ──────────────────────────────────────────────────────────────────────────────
router.get('/search', (req, res) => {
  try {
    const query = (req.query.q || '').trim();
    if (query.length === 0) {
      return res.json({ users: [] });
    }

    const users = searchUsers(query.toLowerCase(), req.userId);
    return res.json({ users });
  } catch (err) {
    console.error('Search users error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
