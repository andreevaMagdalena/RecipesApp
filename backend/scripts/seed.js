const { initDb, saveDb } = require('../src/db/connection');

async function seed() {
  const db = await initDb();
  const now = new Date().toISOString();
  const stmt = db.prepare(`INSERT INTO recipes (title, description, ingredients, instructions, image_url, prep_time, cook_time, servings, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

  const sample = [
    'Spaghetti Aglio e Olio',
    'Simple pasta with garlic, olive oil, and chili flakes.',
    JSON.stringify(['spaghetti', 'garlic', 'olive oil', 'chili flakes', 'parsley', 'salt']),
    JSON.stringify(['Boil pasta', 'Sauté garlic', 'Toss pasta with oil and garlic', 'Serve']),
    null,
    '10m',
    '12m',
    2,
    now,
    now
  ];

  stmt.run(sample);
  saveDb(db);
  console.log('Seeded sample recipe.');
}

seed();
