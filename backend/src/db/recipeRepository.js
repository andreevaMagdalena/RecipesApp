const { initDb, saveDb } = require('./connection');

function parseRow(row) {
  if (!row) return null;
  try {
    return {
      ...row,
      ingredients: row.ingredients ? JSON.parse(row.ingredients) : [],
      instructions: row.instructions ? JSON.parse(row.instructions) : []
    };
  } catch (e) {
    return row;
  }
}

async function getAllRecipes() {
  const db = await initDb();
  const stmt = db.prepare('SELECT * FROM recipes ORDER BY created_at DESC');
  const rows = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  stmt.free();
  return rows.map(parseRow);
}

async function getRecipeById(id) {
  const db = await initDb();
  const stmt = db.prepare('SELECT * FROM recipes WHERE id = ?');
  stmt.bind([id]);
  const row = stmt.step() ? stmt.getAsObject() : null;
  stmt.free();
  return parseRow(row);
}

async function createRecipe(data) {
  const db = await initDb();
  const stmt = db.prepare(`INSERT INTO recipes (title, description, ingredients, instructions, image_url, prep_time, cook_time, servings, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

  const now = new Date().toISOString();
  stmt.run([
    data.title || null,
    data.description || null,
    data.ingredients ? JSON.stringify(data.ingredients) : JSON.stringify([]),
    data.instructions ? JSON.stringify(data.instructions) : JSON.stringify([]),
    data.image_url || null,
    data.prep_time || null,
    data.cook_time || null,
    data.servings || null,
    now,
    now
  ]);
  stmt.free();

  const lastIdStmt = db.prepare('SELECT last_insert_rowid() AS id');
  const insertedId = lastIdStmt.step() ? lastIdStmt.getAsObject().id : null;
  lastIdStmt.free();

  saveDb(db);
  return insertedId ? getRecipeById(insertedId) : null;
}

async function updateRecipe(id, data) {
  const db = await initDb();
  const now = new Date().toISOString();
  const stmt = db.prepare(`UPDATE recipes SET
    title = ?,
    description = ?,
    ingredients = ?,
    instructions = ?,
    image_url = ?,
    prep_time = ?,
    cook_time = ?,
    servings = ?,
    updated_at = ?
    WHERE id = ?`);

  stmt.run([
    data.title || null,
    data.description || null,
    data.ingredients ? JSON.stringify(data.ingredients) : JSON.stringify([]),
    data.instructions ? JSON.stringify(data.instructions) : JSON.stringify([]),
    data.image_url || null,
    data.prep_time || null,
    data.cook_time || null,
    data.servings || null,
    now,
    id
  ]);

  saveDb(db);
  return getRecipeById(id);
}

async function deleteRecipe(id) {
  const db = await initDb();
  const stmt = db.prepare('DELETE FROM recipes WHERE id = ?');
  const info = stmt.run([id]);
  saveDb(db);
  return info.changes > 0;
}

module.exports = {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe
};
