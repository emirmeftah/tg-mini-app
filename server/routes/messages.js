'use strict';

const express = require('express');
const { getMessages } = require('../models/database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// All routes in this file require authentication.
router.use(authMiddleware);

// ──────────────────────────────────────────────────────────────────────────────
// GET /api/messages/:contactUserId
// Retrieve message history between the authenticated user and the given contact.
//
// Optional query params:
//   limit  – number of messages to return (default 50, max 200)
//   before – ISO timestamp; only return messages older than this value
// ──────────────────────────────────────────────────────────────────────────────
router.get('/:contactUserId', (req, res) => {
  try {
    const { contactUserId } = req.params;

    let limit = parseInt(req.query.limit, 10);
    if (isNaN(limit) || limit < 1) limit = 50;
    if (limit > 200) limit = 200;

    const before = req.query.before || null;

    const messages = getMessages(req.userId, contactUserId, limit, before);
    return res.json({ messages });
  } catch (err) {
    console.error('Get messages error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
