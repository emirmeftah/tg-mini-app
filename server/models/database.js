'use strict';

const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', '..', 'mir_messenger.db');

let db;

/**
 * Initialize the database connection and create tables if they don't exist.
 * Returns the database instance.
 */
function getDatabase() {
  if (db) return db;

  db = new Database(DB_PATH);

  // Enable WAL mode for better concurrent read performance
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  createTables();

  return db;
}

/**
 * Create all required tables if they do not already exist.
 */
function createTables() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      display_name TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      avatar_color TEXT NOT NULL DEFAULT '#4FC3F7',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      is_online INTEGER NOT NULL DEFAULT 0,
      last_seen TEXT
    );

    CREATE TABLE IF NOT EXISTS contacts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      contact_user_id TEXT NOT NULL,
      added_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (contact_user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(user_id, contact_user_id)
    );

    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      sender_id TEXT NOT NULL,
      receiver_id TEXT NOT NULL,
      content TEXT NOT NULL,
      timestamp TEXT NOT NULL DEFAULT (datetime('now')),
      is_read INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS calls (
      id TEXT PRIMARY KEY,
      caller_id TEXT NOT NULL,
      receiver_id TEXT NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('audio', 'video')),
      status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'ended', 'missed', 'rejected')),
      started_at TEXT NOT NULL DEFAULT (datetime('now')),
      ended_at TEXT,
      FOREIGN KEY (caller_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_messages_sender_receiver
      ON messages(sender_id, receiver_id);

    CREATE INDEX IF NOT EXISTS idx_messages_timestamp
      ON messages(timestamp);

    CREATE INDEX IF NOT EXISTS idx_contacts_user_id
      ON contacts(user_id);

    CREATE INDEX IF NOT EXISTS idx_users_username
      ON users(username);
  `);
}

// ─── User helpers ───────────────────────────────────────────────────────────

function createUser({ id, username, displayName, passwordHash, avatarColor }) {
  const stmt = db.prepare(`
    INSERT INTO users (id, username, display_name, password_hash, avatar_color)
    VALUES (?, ?, ?, ?, ?)
  `);
  stmt.run(id, username, displayName, passwordHash, avatarColor);
  return getUserById(id);
}

function getUserById(id) {
  return db.prepare(`
    SELECT id, username, display_name, avatar_color, created_at, is_online, last_seen
    FROM users WHERE id = ?
  `).get(id);
}

function getUserByUsername(username) {
  return db.prepare(`SELECT * FROM users WHERE username = ?`).get(username);
}

function searchUsers(query, excludeUserId) {
  return db.prepare(`
    SELECT id, username, display_name, avatar_color, is_online, last_seen
    FROM users
    WHERE username LIKE ? AND id != ?
    LIMIT 20
  `).all(`%${query}%`, excludeUserId);
}

function setUserOnline(userId, isOnline) {
  if (!db) return;
  if (isOnline) {
    db.prepare(`UPDATE users SET is_online = 1 WHERE id = ?`).run(userId);
  } else {
    db.prepare(`UPDATE users SET is_online = 0, last_seen = datetime('now') WHERE id = ?`).run(userId);
  }
}

// ─── Contact helpers ────────────────────────────────────────────────────────

function addContact({ id, userId, contactUserId }) {
  const stmt = db.prepare(`
    INSERT INTO contacts (id, user_id, contact_user_id) VALUES (?, ?, ?)
  `);
  stmt.run(id, userId, contactUserId);
}

function removeContact(userId, contactUserId) {
  const result = db.prepare(`
    DELETE FROM contacts WHERE user_id = ? AND contact_user_id = ?
  `).run(userId, contactUserId);
  return result.changes > 0;
}

function getContacts(userId) {
  if (!db) return [];
  return db.prepare(`
    SELECT
      u.id, u.username, u.display_name, u.avatar_color, u.is_online, u.last_seen,
      c.added_at,
      (SELECT content FROM messages
       WHERE (sender_id = c.contact_user_id AND receiver_id = c.user_id)
          OR (sender_id = c.user_id AND receiver_id = c.contact_user_id)
       ORDER BY timestamp DESC LIMIT 1
      ) AS last_message,
      (SELECT timestamp FROM messages
       WHERE (sender_id = c.contact_user_id AND receiver_id = c.user_id)
          OR (sender_id = c.user_id AND receiver_id = c.contact_user_id)
       ORDER BY timestamp DESC LIMIT 1
      ) AS last_message_time,
      (SELECT COUNT(*) FROM messages
       WHERE sender_id = c.contact_user_id AND receiver_id = c.user_id AND is_read = 0
      ) AS unread_count
    FROM contacts c
    JOIN users u ON u.id = c.contact_user_id
    WHERE c.user_id = ?
    ORDER BY last_message_time DESC NULLS LAST
  `).all(userId);
}

function isContact(userId, contactUserId) {
  return !!db.prepare(`
    SELECT 1 FROM contacts WHERE user_id = ? AND contact_user_id = ?
  `).get(userId, contactUserId);
}

// ─── Message helpers ────────────────────────────────────────────────────────

function createMessage({ id, senderId, receiverId, content }) {
  const stmt = db.prepare(`
    INSERT INTO messages (id, sender_id, receiver_id, content)
    VALUES (?, ?, ?, ?)
  `);
  stmt.run(id, senderId, receiverId, content);
  return db.prepare(`SELECT * FROM messages WHERE id = ?`).get(id);
}

function getMessages(userId, contactUserId, limit = 50, before = null) {
  if (before) {
    return db.prepare(`
      SELECT * FROM messages
      WHERE ((sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?))
        AND timestamp < ?
      ORDER BY timestamp DESC
      LIMIT ?
    `).all(userId, contactUserId, contactUserId, userId, before, limit).reverse();
  }
  return db.prepare(`
    SELECT * FROM messages
    WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
    ORDER BY timestamp DESC
    LIMIT ?
  `).all(userId, contactUserId, contactUserId, userId, limit).reverse();
}

function markMessagesAsRead(senderId, receiverId) {
  return db.prepare(`
    UPDATE messages SET is_read = 1
    WHERE sender_id = ? AND receiver_id = ? AND is_read = 0
  `).run(senderId, receiverId);
}

// ─── Call helpers ────────────────────────────────────────────────────────────

function createCall({ id, callerId, receiverId, type }) {
  const stmt = db.prepare(`
    INSERT INTO calls (id, caller_id, receiver_id, type) VALUES (?, ?, ?, ?)
  `);
  stmt.run(id, callerId, receiverId, type);
  return db.prepare(`SELECT * FROM calls WHERE id = ?`).get(id);
}

function endCall(callId, status = 'ended') {
  db.prepare(`
    UPDATE calls SET status = ?, ended_at = datetime('now') WHERE id = ?
  `).run(status, callId);
}

/**
 * Close the database connection (useful for tests / graceful shutdown).
 */
function closeDatabase() {
  if (db) {
    db.close();
    db = null;
  }
}

module.exports = {
  getDatabase,
  closeDatabase,
  // Users
  createUser,
  getUserById,
  getUserByUsername,
  searchUsers,
  setUserOnline,
  // Contacts
  addContact,
  removeContact,
  getContacts,
  isContact,
  // Messages
  createMessage,
  getMessages,
  markMessagesAsRead,
  // Calls
  createCall,
  endCall,
};
