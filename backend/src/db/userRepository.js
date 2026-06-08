const { initDb, saveDb } = require('./connection');

function parseRow(row) {
  if (!row) return null;
  return {
    ...row,
  };
}

async function getUserByEmail(email) {
  const db = await initDb();
  const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
  stmt.bind([email]);
  const row = stmt.step() ? stmt.getAsObject() : null;
  stmt.free();
  return parseRow(row);
}

async function getUserById(id) {
  const db = await initDb();
  const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
  stmt.bind([id]);
  const row = stmt.step() ? stmt.getAsObject() : null;
  stmt.free();
  return parseRow(row);
}

async function createUser({ name, email, passwordHash }) {
  const db = await initDb();
  const now = new Date().toISOString();
  const stmt = db.prepare(`INSERT INTO users (name, email, password_hash, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?)`);
  stmt.run([name, email, passwordHash, now, now]);
  stmt.free();

  const lastIdStmt = db.prepare('SELECT last_insert_rowid() AS id');
  const insertedId = lastIdStmt.step() ? lastIdStmt.getAsObject().id : null;
  lastIdStmt.free();

  saveDb(db);
  return insertedId ? getUserById(insertedId) : null;
}

module.exports = {
  getUserByEmail,
  getUserById,
  createUser,
};
