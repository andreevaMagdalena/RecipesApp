const { db } = require('../src/db/connection');

function seed() {
  const now = new Date().toISOString();
  const stmt = db.prepare(`INSERT INTO recipes (title, description, ingredients, instructions, image_url, prep_time, cook_time, servings, created_at, updated_at)
    VALUES (@title, @description, @ingredients, @instructions, @image_url, @prep_time, @cook_time, @servings, @created_at, @updated_at)`);

  const sample = {
    title: 'Spaghetti Aglio e Olio',
    description: 'Simple pasta with garlic, olive oil, and chili flakes.',
    ingredients: JSON.stringify(['spaghetti', 'garlic', 'olive oil', 'chili flakes', 'parsley', 'salt']),
    instructions: JSON.stringify(['Boil pasta', 'Sauté garlic', 'Toss pasta with oil and garlic', 'Serve']),
    image_url: null,
    prep_time: '10m',
    cook_time: '12m',
    servings: 2,
    created_at: now,
    updated_at: now
  };

  stmt.run(sample);
  console.log('Seeded sample recipe.');
}

seed();
