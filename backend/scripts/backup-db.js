const fs = require('fs');
const path = require('path');
const { DB_PATH } = require('../src/db/connection');

const backupsDir = path.join(__dirname, '..', 'backups');
if (!fs.existsSync(backupsDir)) fs.mkdirSync(backupsDir, { recursive: true });

if (!fs.existsSync(DB_PATH)) {
  console.error('Database file not found at', DB_PATH);
  process.exit(1);
}

const ts = new Date().toISOString().replace(/[:.]/g, '-');
const dest = path.join(backupsDir, `${ts}-recipes.sqlite3`);
fs.copyFileSync(DB_PATH, dest);
console.log('Backed up DB to', dest);

// Keep latest 5 backups
const files = fs.readdirSync(backupsDir).map(f => ({ f, p: path.join(backupsDir, f), m: fs.statSync(path.join(backupsDir, f)).mtimeMs })).sort((a,b)=>b.m-a.m);
for (let i=5;i<files.length;i++) fs.unlinkSync(files[i].p);
