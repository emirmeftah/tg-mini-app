'use strict';

const path = require('path');
const fs = require('fs');
const request = require('supertest');

// ── DB file paths (must match server/models/database.js) ──────────────────────
const DB_DIR = path.join(__dirname, '..');
const DB_PATH = path.join(DB_DIR, 'mir_messenger.db');
const DB_WAL = DB_PATH + '-wal';
const DB_SHM = DB_PATH + '-shm';

/** Remove the SQLite database and its WAL/SHM side-files if they exist. */
function cleanDb() {
  [DB_PATH, DB_WAL, DB_SHM].forEach((f) => {
    try { fs.unlinkSync(f); } catch (_) { /* ignore */ }
  });
}

// ── Clean the DB *before* requiring any server module so the singleton
//    starts with a fresh file. ────────────────────────────────────────────────
cleanDb();

const { app, server } = require('../server/index');
const { closeDatabase } = require('../server/models/database');

// ── Shared state populated during tests ──────────────────────────────────────
let user1Token;
let user1;
let user2Token;
let user2;

// ── Lifecycle ────────────────────────────────────────────────────────────────

afterAll(async () => {
  try { closeDatabase(); } catch (_) { /* ignore */ }
  await new Promise((resolve, reject) => {
    server.close((err) => (err ? reject(err) : resolve()));
  });
  cleanDb();
});

// ─────────────────────────────────────────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────────────────────────────────────────
describe('Auth - POST /api/auth/register', () => {
  test('registers a new user and returns 201 with token and user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'testuser', password: 'test1234', displayName: 'Test User' })
      .expect(201);

    expect(res.body).toHaveProperty('token');
    expect(typeof res.body.token).toBe('string');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toMatchObject({
      username: 'testuser',
      display_name: 'Test User',
    });
    expect(res.body.user).not.toHaveProperty('password_hash');

    // Store for later tests
    user1Token = res.body.token;
    user1 = res.body.user;
  });

  test('rejects duplicate username with 409', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'testuser', password: 'other123', displayName: 'Another' })
      .expect(409);

    expect(res.body).toHaveProperty('error');
  });

  test('rejects short password with 400', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'shortpw', password: 'ab', displayName: 'Short PW' })
      .expect(400);

    expect(res.body).toHaveProperty('error');
  });

  test('rejects missing fields with 400', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'onlyuser' })
      .expect(400);

    expect(res.body).toHaveProperty('error');
  });
});

describe('Auth - POST /api/auth/login', () => {
  test('logs in with correct credentials and returns 200 with token and user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testuser', password: 'test1234' })
      .expect(200);

    expect(res.body).toHaveProperty('token');
    expect(typeof res.body.token).toBe('string');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user.username).toBe('testuser');
    expect(res.body.user).not.toHaveProperty('password_hash');
  });

  test('rejects wrong password with 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testuser', password: 'wrongpwd' })
      .expect(401);

    expect(res.body).toHaveProperty('error');
  });

  test('rejects unknown username with 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'nonexistent', password: 'whatever' })
      .expect(401);

    expect(res.body).toHaveProperty('error');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// USERS
// ─────────────────────────────────────────────────────────────────────────────
describe('Users - GET /api/users/profile', () => {
  test('returns the authenticated user profile with 200', async () => {
    const res = await request(app)
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${user1Token}`)
      .expect(200);

    expect(res.body).toHaveProperty('user');
    expect(res.body.user.username).toBe('testuser');
    expect(res.body.user.id).toBe(user1.id);
  });

  test('returns 401 when no token is provided', async () => {
    await request(app)
      .get('/api/users/profile')
      .expect(401);
  });
});

describe('Users - GET /api/users/search', () => {
  test('searches users by query and returns 200 with array', async () => {
    const res = await request(app)
      .get('/api/users/search')
      .query({ q: 'test' })
      .set('Authorization', `Bearer ${user1Token}`)
      .expect(200);

    expect(res.body).toHaveProperty('users');
    expect(Array.isArray(res.body.users)).toBe(true);
    // "testuser" is the authenticated user, so they should be excluded from results
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// CONTACTS
// ─────────────────────────────────────────────────────────────────────────────
describe('Contacts', () => {
  // Register a second user for contact tests
  beforeAll(async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'testuser2', password: 'test1234', displayName: 'Test User 2' })
      .expect(201);

    user2Token = res.body.token;
    user2 = res.body.user;
  });

  test('POST /api/contacts - adds a contact and returns 201', async () => {
    const res = await request(app)
      .post('/api/contacts')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({ username: 'testuser2' })
      .expect(201);

    expect(res.body).toHaveProperty('contact');
    expect(res.body.contact.username).toBe('testuser2');
  });

  test('POST /api/contacts - rejects duplicate contact with 409', async () => {
    const res = await request(app)
      .post('/api/contacts')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({ username: 'testuser2' })
      .expect(409);

    expect(res.body).toHaveProperty('error');
  });

  test('POST /api/contacts - rejects adding self with 400', async () => {
    const res = await request(app)
      .post('/api/contacts')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({ username: 'testuser' })
      .expect(400);

    expect(res.body).toHaveProperty('error');
  });

  test('GET /api/contacts - returns contacts array including testuser2', async () => {
    const res = await request(app)
      .get('/api/contacts')
      .set('Authorization', `Bearer ${user1Token}`)
      .expect(200);

    expect(res.body).toHaveProperty('contacts');
    expect(Array.isArray(res.body.contacts)).toBe(true);
    expect(res.body.contacts.length).toBeGreaterThanOrEqual(1);

    const contactUsernames = res.body.contacts.map((c) => c.username);
    expect(contactUsernames).toContain('testuser2');
  });

  test('DELETE /api/contacts/:id - removes the contact and returns 200', async () => {
    const res = await request(app)
      .delete(`/api/contacts/${user2.id}`)
      .set('Authorization', `Bearer ${user1Token}`)
      .expect(200);

    expect(res.body).toHaveProperty('message');
  });

  test('DELETE /api/contacts/:id - returns 404 when contact already removed', async () => {
    await request(app)
      .delete(`/api/contacts/${user2.id}`)
      .set('Authorization', `Bearer ${user1Token}`)
      .expect(404);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// MESSAGES
// ─────────────────────────────────────────────────────────────────────────────
describe('Messages', () => {
  // Re-add testuser2 as contact before message tests
  beforeAll(async () => {
    await request(app)
      .post('/api/contacts')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({ username: 'testuser2' })
      .expect(201);
  });

  test('GET /api/messages/:contactUserId - returns 200 with empty array initially', async () => {
    const res = await request(app)
      .get(`/api/messages/${user2.id}`)
      .set('Authorization', `Bearer ${user1Token}`)
      .expect(200);

    expect(res.body).toHaveProperty('messages');
    expect(Array.isArray(res.body.messages)).toBe(true);
    expect(res.body.messages.length).toBe(0);
  });
});
