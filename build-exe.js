#!/usr/bin/env node
'use strict';

/**
 * Build script for MIR Messenger Windows .exe
 *
 * This script:
 * 1. Uses @yao-pkg/pkg to compile the Node.js app into a Windows .exe
 * 2. Copies the better-sqlite3 native addon next to the .exe
 * 3. Copies the public/ directory next to the .exe
 * 4. Produces a ready-to-distribute dist/ folder
 *
 * Usage:  npm run build:exe
 * Output: dist/MIR-Messenger.exe  (+ supporting files)
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const DIST = path.join(ROOT, 'dist');

// ── Helpers ────────────────────────────────────────────────────────────────

function run(cmd) {
  console.log(`> ${cmd}`);
  execSync(cmd, { cwd: ROOT, stdio: 'inherit' });
}

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

// ── Clean dist ─────────────────────────────────────────────────────────────
console.log('\n=== MIR Messenger .exe build ===\n');

if (fs.existsSync(DIST)) {
  fs.rmSync(DIST, { recursive: true });
}
fs.mkdirSync(DIST, { recursive: true });

// ── Step 1: Build the .exe with pkg ────────────────────────────────────────
console.log('[1/3] Compiling .exe with pkg...');
run(
  `npx @yao-pkg/pkg launcher.js ` +
  `--targets node18-win-x64 ` +
  `--output "${path.join(DIST, 'MIR-Messenger.exe')}" ` +
  `--public ` +
  `--public-packages "*" ` +
  `--compress GZip`
);

// ── Step 2: Copy better-sqlite3 native addon ───────────────────────────────
console.log('[2/3] Copying native SQLite3 addon...');

// pkg cannot embed native .node files — they must be placed alongside the exe.
// We need the Windows version. If cross-compiling from Linux, the user needs
// the Windows-built .node file.  For local builds on Windows, use the local one.
const localBinding = path.join(
  ROOT, 'node_modules', 'better-sqlite3', 'build', 'Release', 'better_sqlite3.node'
);
const destBinding = path.join(
  DIST, 'node_modules', 'better-sqlite3', 'build', 'Release', 'better_sqlite3.node'
);

if (fs.existsSync(localBinding)) {
  fs.mkdirSync(path.dirname(destBinding), { recursive: true });
  fs.copyFileSync(localBinding, destBinding);
  console.log('   Copied better_sqlite3.node');
} else {
  console.warn('   WARNING: better_sqlite3.node not found locally.');
  console.warn('   If cross-compiling from Linux for Windows, you will need to provide');
  console.warn('   a Windows-compiled better_sqlite3.node in dist/node_modules/...');
}

// ── Step 3: Copy public assets ─────────────────────────────────────────────
console.log('[3/3] Copying public/ assets...');
copyRecursive(path.join(ROOT, 'public'), path.join(DIST, 'public'));

// ── Done ───────────────────────────────────────────────────────────────────
console.log('\n=== Build complete! ===');
console.log(`Output: ${DIST}/`);
console.log('');
console.log('Contents:');
function listFiles(dir, prefix) {
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    const rel = prefix ? `${prefix}/${entry}` : entry;
    if (fs.statSync(full).isDirectory()) {
      listFiles(full, rel);
    } else {
      const size = (fs.statSync(full).size / 1024 / 1024).toFixed(1);
      console.log(`  ${rel}  (${size} MB)`);
    }
  }
}
listFiles(DIST, '');

console.log('');
console.log('NOTE: If you built on Linux but need a Windows .exe, the native');
console.log('better_sqlite3.node included is for Linux. To get a working Windows');
console.log('build, run "npm run build:exe" on a Windows machine, or replace');
console.log('dist/node_modules/better-sqlite3/build/Release/better_sqlite3.node');
console.log('with the Windows-compiled version from:');
console.log('  npm install better-sqlite3 (on Windows)');
