'use strict';

const path = require('path');
const fs = require('fs');
const http = require('http');
const { io: ioClient } = require('socket.io-client');
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

// Clean before requiring anything so the singleton boots with a fresh DB.
cleanDb();

const { app, server, io } = require('../server/index');
const { closeDatabase } = require('../server/models/database');

// ── Shared state ─────────────────────────────────────────────────────────────
let serverPort;
let serverUrl;
let user1Token;
let user1;
let user2Token;
let user2;

// Socket instances to be cleaned up in afterAll
const sockets = [];

/** Helper: create a socket.io client connected with a given auth token. */
function createSocket(token) {
  const socket = ioClient(serverUrl, {
    transports: ['websocket'],
    autoConnect: false,
    auth: { token },
  });
  sockets.push(socket);
  return socket;
}

/** Helper: wait for a socket to connect, with a timeout. */
function waitForConnect(socket, timeoutMs = 5000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Socket connect timeout')), timeoutMs);
    socket.once('connect', () => {
      clearTimeout(timer);
      resolve();
    });
    socket.once('connect_error', (err) => {
      clearTimeout(timer);
      reject(err);
    });
    socket.connect();
  });
}

/** Helper: wait for a specific event on a socket, with a timeout. */
function waitForEvent(socket, event, timeoutMs = 5000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Timeout waiting for "${event}"`)), timeoutMs);
    socket.once(event, (data) => {
      clearTimeout(timer);
      resolve(data);
    });
  });
}

// ── Lifecycle ────────────────────────────────────────────────────────────────

beforeAll(async () => {
  // Start the server on a dynamic port (port 0 lets the OS pick one).
  await new Promise((resolve) => {
    // The server from index.js is already listening, so close it first and
    // re-listen on port 0 for a dynamic assignment.
    server.close(() => {
      server.listen(0, () => {
        serverPort = server.address().port;
        serverUrl = `http://localhost:${serverPort}`;
        resolve();
      });
    });
  });

  // Register two users via the HTTP API.
  const res1 = await request(app)
    .post('/api/auth/register')
    .send({ username: 'sockuser1', password: 'pass1234', displayName: 'Socket User 1' });
  expect(res1.status).toBe(201);
  user1Token = res1.body.token;
  user1 = res1.body.user;

  const res2 = await request(app)
    .post('/api/auth/register')
    .send({ username: 'sockuser2', password: 'pass1234', displayName: 'Socket User 2' });
  expect(res2.status).toBe(201);
  user2Token = res2.body.token;
  user2 = res2.body.user;

  // Make them contacts of each other so presence events propagate.
  await request(app)
    .post('/api/contacts')
    .set('Authorization', `Bearer ${user1Token}`)
    .send({ username: 'sockuser2' });

  await request(app)
    .post('/api/contacts')
    .set('Authorization', `Bearer ${user2Token}`)
    .send({ username: 'sockuser1' });
});

afterAll(async () => {
  // Disconnect all sockets created during tests and wait for them to fully close.
  for (const s of sockets) {
    if (s.connected) s.disconnect();
  }

  // Allow time for disconnect events to propagate before closing DB.
  await new Promise((resolve) => setTimeout(resolve, 500));

  await new Promise((resolve, reject) => {
    server.close((err) => (err ? reject(err) : resolve()));
  });

  try { closeDatabase(); } catch (_) { /* ignore */ }

  cleanDb();
});

// ─────────────────────────────────────────────────────────────────────────────
// CONNECTION
// ─────────────────────────────────────────────────────────────────────────────
describe('Socket.IO connection', () => {
  test('connects successfully with a valid token', async () => {
    const socket = createSocket(user1Token);
    await waitForConnect(socket);
    expect(socket.connected).toBe(true);
    socket.disconnect();
  });

  test('rejects connection without a token', async () => {
    const socket = ioClient(serverUrl, {
      transports: ['websocket'],
      autoConnect: false,
      auth: {},
    });
    sockets.push(socket);

    await expect(waitForConnect(socket)).rejects.toThrow();
    socket.disconnect();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// PRESENCE
// ─────────────────────────────────────────────────────────────────────────────
describe('Presence', () => {
  test('receives presence:snapshot on connect', async () => {
    const socket = createSocket(user1Token);
    const snapshotPromise = waitForEvent(socket, 'presence:snapshot');
    await waitForConnect(socket);

    const snapshot = await snapshotPromise;
    expect(snapshot).toHaveProperty('onlineUserIds');
    expect(Array.isArray(snapshot.onlineUserIds)).toBe(true);

    socket.disconnect();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// MESSAGING
// ─────────────────────────────────────────────────────────────────────────────
describe('Messaging via Socket.IO', () => {
  let socket1;
  let socket2;

  beforeAll(async () => {
    socket1 = createSocket(user1Token);
    socket2 = createSocket(user2Token);

    await Promise.all([
      waitForConnect(socket1),
      waitForConnect(socket2),
    ]);
  });

  afterAll(() => {
    if (socket1 && socket1.connected) socket1.disconnect();
    if (socket2 && socket2.connected) socket2.disconnect();
  });

  test('message:send from user1 is received by user2 via message:receive', async () => {
    const receivePromise = waitForEvent(socket2, 'message:receive');

    socket1.emit('message:send', { to: user2.id, content: 'Hello from user1' }, () => {});

    const received = await receivePromise;
    expect(received).toHaveProperty('message');
    expect(received.message.content).toBe('Hello from user1');
    expect(received.message.sender_id).toBe(user1.id);
    expect(received.message.receiver_id).toBe(user2.id);
  });

  test('message:send returns the saved message in ack callback', async () => {
    const ackData = await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('Ack timeout')), 5000);
      socket1.emit('message:send', { to: user2.id, content: 'Ack test' }, (data) => {
        clearTimeout(timer);
        resolve(data);
      });
    });

    expect(ackData).toHaveProperty('message');
    expect(ackData.message.content).toBe('Ack test');
    expect(ackData.message).toHaveProperty('id');
    expect(ackData.message.sender_id).toBe(user1.id);
    expect(ackData.message.receiver_id).toBe(user2.id);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// TYPING INDICATORS
// ─────────────────────────────────────────────────────────────────────────────
describe('Typing indicators', () => {
  let socket1;
  let socket2;

  beforeAll(async () => {
    socket1 = createSocket(user1Token);
    socket2 = createSocket(user2Token);

    await Promise.all([
      waitForConnect(socket1),
      waitForConnect(socket2),
    ]);
  });

  afterAll(() => {
    if (socket1 && socket1.connected) socket1.disconnect();
    if (socket2 && socket2.connected) socket2.disconnect();
  });

  test('typing:start from user1 is received by user2', async () => {
    const typingPromise = waitForEvent(socket2, 'typing:start');

    socket1.emit('typing:start', { to: user2.id });

    const data = await typingPromise;
    expect(data).toHaveProperty('from', user1.id);
  });

  test('typing:stop from user1 is received by user2', async () => {
    const typingPromise = waitForEvent(socket2, 'typing:stop');

    socket1.emit('typing:stop', { to: user2.id });

    const data = await typingPromise;
    expect(data).toHaveProperty('from', user1.id);
  });
});
