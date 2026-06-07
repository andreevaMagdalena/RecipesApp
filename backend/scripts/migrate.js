const fs = require('fs');
const path = require('path');
const { initDb, saveDb } = require('../src/db/connection');

const migrationsDir = path.join(__dirname, '..', 'migrations');

function ensureMeta(db) {
  db.exec(`CREATE TABLE IF NOT EXISTS meta_migrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    applied_at TEXT NOT NULL
  );`);
}

function getApplied(db) {
  const stmt = db.prepare('SELECT name FROM meta_migrations');
  const rows = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  stmt.free();
  return new Set(rows.map(r => r.name));
}

function applyMigration(db, filename) {
  const file = path.join(migrationsDir, filename);
  const sql = fs.readFileSync(file, 'utf8');
  try {
    db.exec(sql);
    const stmt = db.prepare('INSERT INTO meta_migrations (name, applied_at) VALUES (?, ?)');
    stmt.run([filename, new Date().toISOString()]);
    console.log('Applied', filename);
  } catch (e) {
    console.error('Failed to apply', filename, e);
    process.exit(1);
  }
}

async function run() {
  const db = await initDb();
  ensureMeta(db);
  const applied = getApplied(db);
  const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();
  for (const f of files) {
    if (!applied.has(f)) applyMigration(db, f);
    else console.log('Skipping', f);
  }
  saveDb(db);
}

if (require.main === module) {
  run();
}

module.exports = { run };
