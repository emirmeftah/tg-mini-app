'use strict';

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');

const { getDatabase } = require('./models/database');
const { initSocket } = require('./socket');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const contactRoutes = require('./routes/contacts');
const messageRoutes = require('./routes/messages');

// ── Initialize database ────────────────────────────────────────────────────
getDatabase();

// ── Express app ────────────────────────────────────────────────────────────
const app = express();
const server = http.createServer(app);

// ── Socket.IO ──────────────────────────────────────────────────────────────
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

initSocket(io);

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── API routes ─────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/messages', messageRoutes);

// ── Static files (SPA) ────────────────────────────────────────────────────
const publicDir = process.env.MIR_PUBLIC_DIR || path.join(__dirname, '..', 'public');
app.use(express.static(publicDir));

// Fallback: serve index.html for any unmatched route (SPA client-side routing).
app.get('*', (_req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

// ── Start server ───────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`MIR Messenger server running on http://localhost:${PORT}`);
});

// Export for tests
module.exports = { app, server, io };
