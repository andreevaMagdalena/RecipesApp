require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const recipesRouter = require('./routes/recipes');
const authRouter = require('./routes/auth');
const { run: runMigrations } = require('../scripts/migrate');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/recipes', recipesRouter);

app.get('/', (req, res) => res.json({ ok: true, message: 'Recipe API running' }));

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await runMigrations();
  } catch (err) {
    console.error('Database migration failed:', err);
    process.exit(1);
  }

  app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
}

startServer();
