# MIR Messenger

A lightweight real-time messenger application with chat, contacts, and calling functionality.

## Features

- **No phone number required** - Register with just a username and password
- **Real-time chat** - Instant messaging powered by WebSocket (Socket.IO)
- **Contacts management** - Search and add users to your contact list
- **Voice & video calls** - WebRTC-powered audio and video calling
- **Typing indicators** - See when contacts are typing
- **Online status** - Real-time online/offline presence
- **Mobile responsive** - Works great on desktop and mobile

## Tech Stack

- **Backend**: Node.js, Express, Socket.IO, SQLite (better-sqlite3)
- **Frontend**: Vanilla JavaScript SPA (no framework dependencies)
- **Calls**: WebRTC for peer-to-peer audio/video
- **Auth**: Token-based authentication (no external services needed)

## Getting Started

### Install dependencies

```bash
npm install
```

### Run the server

```bash
npm start
```

The application will be available at `http://localhost:3000`.

### Run tests

```bash
npm test
```

## Project Structure

```
server/
  index.js          - Main server entry point
  socket.js         - WebSocket event handlers
  routes/
    auth.js         - Authentication endpoints
    users.js        - User search and profile
    contacts.js     - Contact management
    messages.js     - Message history
  models/
    database.js     - SQLite database setup and queries
  middleware/
    auth.js         - Token authentication middleware
public/
  index.html        - Main HTML shell
  css/styles.css    - Application styles
  js/app.js         - Frontend SPA logic
tests/
  api.test.js       - Backend API tests
  socket.test.js    - WebSocket event tests
```

## Architecture

The application uses a three-agent development approach:
- **Agent 1 (Backend)**: REST API, WebSocket server, database, authentication
- **Agent 2 (Frontend)**: SPA interface, WebRTC integration, responsive design
- **Agent 3 (Testing)**: API tests, WebSocket tests, integration tests
