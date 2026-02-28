'use strict';

/**
 * MIR Messenger — pkg entry-point.
 *
 * When the application is packaged with pkg the entire source tree is embedded
 * inside a virtual snapshot filesystem.  Native addons (*.node) and writable
 * files (the SQLite database) cannot live inside that snapshot, so this
 * launcher resolves all paths correctly for both the packaged and the normal
 * (development) execution modes.
 *
 * It also opens the user's default browser automatically.
 */

const path = require('path');
const { execSync } = require('child_process');

// ── Detect pkg environment ─────────────────────────────────────────────────
// When running inside a pkg executable, process.pkg is defined and __dirname
// points to a virtual snapshot path (e.g. /snapshot/mir-messenger/...).
const isPkg = typeof process.pkg !== 'undefined';

if (isPkg) {
  // The real directory where the .exe is located.
  const exeDir = path.dirname(process.execPath);

  // Set the DB path to live next to the executable so it's writable.
  process.env.MIR_DB_PATH = path.join(exeDir, 'mir_messenger.db');

  // Set the public directory — pkg packs it into the snapshot but Express
  // needs to serve it, so we keep it inside the snapshot (read-only is fine).
  process.env.MIR_PUBLIC_DIR = path.join(__dirname, '..', 'public');
}

// ── Start the server ───────────────────────────────────────────────────────
require('./server/index');

// ── Open browser automatically ─────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
const url = `http://localhost:${PORT}`;

setTimeout(() => {
  try {
    // Windows
    if (process.platform === 'win32') {
      execSync(`start "" "${url}"`, { stdio: 'ignore' });
    }
    // macOS
    else if (process.platform === 'darwin') {
      execSync(`open "${url}"`, { stdio: 'ignore' });
    }
    // Linux
    else {
      execSync(`xdg-open "${url}"`, { stdio: 'ignore' });
    }
  } catch (_) {
    // If browser open fails, just print the URL — the user can open it manually.
    console.log(`Open your browser at: ${url}`);
  }
}, 1000);
