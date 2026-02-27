'use strict';

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const {
  getContacts,
  addContact,
  removeContact,
  isContact,
  getUserByUsername,
  getUserById,
} = require('../models/database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// All routes in this file require authentication.
router.use(authMiddleware);

// ──────────────────────────────────────────────────────────────────────────────
// GET /api/contacts
// List the authenticated user's contacts (with last message & unread count).
// ──────────────────────────────────────────────────────────────────────────────
router.get('/', (req, res) => {
  try {
    const contacts = getContacts(req.userId);
    return res.json({ contacts });
  } catch (err) {
    console.error('Get contacts error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ──────────────────────────────────────────────────────────────────────────────
// POST /api/contacts
// Add a contact by username.  Body: { username }
// ──────────────────────────────────────────────────────────────────────────────
router.post('/', (req, res) => {
  try {
    const { username } = req.body;

    if (!username || typeof username !== 'string') {
      return res.status(400).json({ error: 'username is required' });
    }

    const contactUser = getUserByUsername(username.toLowerCase());
    if (!contactUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (contactUser.id === req.userId) {
      return res.status(400).json({ error: 'You cannot add yourself as a contact' });
    }

    if (isContact(req.userId, contactUser.id)) {
      return res.status(409).json({ error: 'Contact already exists' });
    }

    // Add the contact (one-directional; both parties add each other independently).
    addContact({
      id: uuidv4(),
      userId: req.userId,
      contactUserId: contactUser.id,
    });

    // Return the newly-added contact with display info.
    const contact = getUserById(contactUser.id);
    return res.status(201).json({ contact });
  } catch (err) {
    console.error('Add contact error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ──────────────────────────────────────────────────────────────────────────────
// DELETE /api/contacts/:contactUserId
// Remove a contact.
// ──────────────────────────────────────────────────────────────────────────────
router.delete('/:contactUserId', (req, res) => {
  try {
    const { contactUserId } = req.params;
    const removed = removeContact(req.userId, contactUserId);

    if (!removed) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    return res.json({ message: 'Contact removed' });
  } catch (err) {
    console.error('Remove contact error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
