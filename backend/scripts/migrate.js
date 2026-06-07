const fs = require('fs');
const path = require('path');
const { db } = require('../src/db/connection');

const migrationsDir = path.join(__dirname, '..', 'migrations');

function ensureMeta() {
  db.exec(`CREATE TABLE IF NOT EXISTS meta_migrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    applied_at TEXT NOT NULL
  );`);
}

function getApplied() {
  const rows = db.prepare('SELECT name FROM meta_migrations').all();
  return new Set(rows.map(r => r.name));
}

function applyMigration(filename) {
  const file = path.join(migrationsDir, filename);
  const sql = fs.readFileSync(file, 'utf8');
  db.exec('BEGIN');
  try {
    db.exec(sql);
    const stmt = db.prepare('INSERT INTO meta_migrations (name, applied_at) VALUES (?, ?)');
    stmt.run(filename, new Date().toISOString());
    db.exec('COMMIT');
    console.log('Applied', filename);
  } catch (e) {
    db.exec('ROLLBACK');
    console.error('Failed to apply', filename, e);
    process.exit(1);
  }
}

function run() {
  ensureMeta();
  const applied = getApplied();
  const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();
  for (const f of files) {
    if (!applied.has(f)) applyMigration(f);
    else console.log('Skipping', f);
  }
}

run();
