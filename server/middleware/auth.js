'use strict';

/**
 * In-memory token store.
 * Maps token (string) → userId (string).
 *
 * For a production app this would be replaced by JWT or a persistent session
 * store, but for this lightweight messenger an in-memory map is sufficient.
 */
const tokens = new Map();

/**
 * Store a token for a user. Returns the token for convenience.
 */
function setToken(token, userId) {
  tokens.set(token, userId);
  return token;
}

/**
 * Remove a token (logout).
 */
function removeToken(token) {
  tokens.delete(token);
}

/**
 * Resolve a token to its associated userId, or null if invalid / expired.
 */
function getUserIdFromToken(token) {
  return tokens.get(token) || null;
}

/**
 * Express middleware that verifies the Authorization header.
 *
 * Expects:  Authorization: Bearer <token>
 *
 * On success, attaches `req.userId` and calls next().
 * On failure, responds with 401.
 */
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header is required' });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Authorization header must be: Bearer <token>' });
  }

  const token = parts[1];
  const userId = getUserIdFromToken(token);

  if (!userId) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  req.userId = userId;
  next();
}

module.exports = {
  tokens,
  setToken,
  removeToken,
  getUserIdFromToken,
  authMiddleware,
};
