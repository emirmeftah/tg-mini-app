'use strict';

const { v4: uuidv4 } = require('uuid');
const { getUserIdFromToken } = require('./middleware/auth');
const {
  createMessage,
  markMessagesAsRead,
  setUserOnline,
  getUserById,
  getContacts,
  createCall,
  endCall,
} = require('./models/database');

/**
 * Map of userId → Set<Socket> (a user may have multiple tabs / devices).
 */
const onlineUsers = new Map();

/**
 * Return all socket instances for a given userId, or an empty array.
 */
function getSocketsForUser(userId) {
  return onlineUsers.get(userId) || new Set();
}

/**
 * Emit an event to every connected socket that belongs to userId.
 */
function emitToUser(userId, event, data) {
  const sockets = getSocketsForUser(userId);
  for (const socket of sockets) {
    socket.emit(event, data);
  }
}

/**
 * Notify all of a user's contacts about their online/offline status change.
 */
function broadcastPresence(userId, isOnline) {
  const contacts = getContacts(userId);
  for (const contact of contacts) {
    emitToUser(contact.id, isOnline ? 'user:online' : 'user:offline', { userId });
  }
}

/**
 * Initialize Socket.IO event handling on the given server.
 */
function initSocket(io) {
  // ── Authentication middleware ────────────────────────────────────────────
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    if (!token) {
      return next(new Error('Authentication token is required'));
    }

    const userId = getUserIdFromToken(token);
    if (!userId) {
      return next(new Error('Invalid or expired token'));
    }

    // Attach userId to the socket for later use.
    socket.userId = userId;
    next();
  });

  io.on('connection', (socket) => {
    const { userId } = socket;
    console.log(`Socket connected: user=${userId} socket=${socket.id}`);

    // ── Track online state ──────────────────────────────────────────────
    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
    }
    onlineUsers.get(userId).add(socket);

    // Mark user as online in DB and notify contacts (only on first socket).
    if (onlineUsers.get(userId).size === 1) {
      setUserOnline(userId, true);
      broadcastPresence(userId, true);
    }

    // Send the user a snapshot of which of their contacts are currently online.
    const contacts = getContacts(userId);
    const onlineContactIds = contacts
      .filter((c) => onlineUsers.has(c.id))
      .map((c) => c.id);
    socket.emit('presence:snapshot', { onlineUserIds: onlineContactIds });

    // ── Messaging ───────────────────────────────────────────────────────

    socket.on('message:send', (data, ack) => {
      try {
        const { to, content } = data || {};
        if (!to || !content || typeof content !== 'string' || content.trim().length === 0) {
          if (typeof ack === 'function') ack({ error: 'Invalid message data' });
          return;
        }

        const message = createMessage({
          id: uuidv4(),
          senderId: userId,
          receiverId: to,
          content: content.trim(),
        });

        // Deliver to recipient's connected sockets.
        emitToUser(to, 'message:receive', { message });

        // Also echo back to sender's other sockets for multi-device sync.
        for (const s of getSocketsForUser(userId)) {
          if (s.id !== socket.id) {
            s.emit('message:receive', { message });
          }
        }

        if (typeof ack === 'function') ack({ message });
      } catch (err) {
        console.error('message:send error:', err);
        if (typeof ack === 'function') ack({ error: 'Failed to send message' });
      }
    });

    socket.on('message:read', (data) => {
      try {
        const { from } = data || {};
        if (!from) return;

        markMessagesAsRead(from, userId);

        // Notify the sender that their messages have been read.
        emitToUser(from, 'message:read', { by: userId });
      } catch (err) {
        console.error('message:read error:', err);
      }
    });

    // ── WebRTC call signalling ──────────────────────────────────────────

    socket.on('call:offer', (data) => {
      try {
        const { to, offer, type } = data || {};
        if (!to || !offer || !type) return;

        const call = createCall({
          id: uuidv4(),
          callerId: userId,
          receiverId: to,
          type,
        });

        const caller = getUserById(userId);

        emitToUser(to, 'call:offer', {
          from: userId,
          offer,
          type,
          callId: call.id,
          caller,
        });
      } catch (err) {
        console.error('call:offer error:', err);
      }
    });

    socket.on('call:answer', (data) => {
      try {
        const { to, answer, callId } = data || {};
        if (!to || !answer) return;

        emitToUser(to, 'call:answer', {
          from: userId,
          answer,
          callId,
        });
      } catch (err) {
        console.error('call:answer error:', err);
      }
    });

    socket.on('call:ice-candidate', (data) => {
      try {
        const { to, candidate } = data || {};
        if (!to || !candidate) return;

        emitToUser(to, 'call:ice-candidate', {
          from: userId,
          candidate,
        });
      } catch (err) {
        console.error('call:ice-candidate error:', err);
      }
    });

    socket.on('call:reject', (data) => {
      try {
        const { to, callId } = data || {};
        if (!to) return;

        if (callId) endCall(callId, 'rejected');

        emitToUser(to, 'call:reject', { from: userId, callId });
      } catch (err) {
        console.error('call:reject error:', err);
      }
    });

    socket.on('call:end', (data) => {
      try {
        const { to, callId } = data || {};
        if (!to) return;

        if (callId) endCall(callId, 'ended');

        emitToUser(to, 'call:end', { from: userId, callId });
      } catch (err) {
        console.error('call:end error:', err);
      }
    });

    // ── Typing indicators ───────────────────────────────────────────────

    socket.on('typing:start', (data) => {
      const { to } = data || {};
      if (!to) return;
      emitToUser(to, 'typing:start', { from: userId });
    });

    socket.on('typing:stop', (data) => {
      const { to } = data || {};
      if (!to) return;
      emitToUser(to, 'typing:stop', { from: userId });
    });

    // ── Disconnect ──────────────────────────────────────────────────────

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: user=${userId} socket=${socket.id}`);

      const sockets = onlineUsers.get(userId);
      if (sockets) {
        sockets.delete(socket);
        if (sockets.size === 0) {
          onlineUsers.delete(userId);
          setUserOnline(userId, false);
          broadcastPresence(userId, false);
        }
      }
    });
  });
}

module.exports = { initSocket, onlineUsers };
