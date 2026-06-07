const path = require('path');
const fs = require('fs');
const initSqlJs = require('sql.js');

const DB_PATH = process.env.DATABASE_PATH || path.join(__dirname, '..', '..', 'data', 'recipes.sqlite3');
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

let db;

async function initDb() {
  if (db) return db;
  const SQL = await initSqlJs({
    locateFile: file => path.join(__dirname, '..', '..', 'node_modules', 'sql.js', 'dist', file)
  });

  if (fs.existsSync(DB_PATH)) {
    const filebuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(filebuffer);
  } else {
    db = new SQL.Database();
    saveDb(db);
  }

  return db;
}

function saveDb(dbInstance) {
  const data = dbInstance.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(DB_PATH, buffer);
}

module.exports = { initDb, saveDb, DB_PATH };
