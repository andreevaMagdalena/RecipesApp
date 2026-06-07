const { db } = require('./connection');

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

function getAllRecipes() {
  const rows = db.prepare('SELECT * FROM recipes ORDER BY created_at DESC').all();
  return rows.map(parseRow);
}

function getRecipeById(id) {
  const row = db.prepare('SELECT * FROM recipes WHERE id = ?').get(id);
  return parseRow(row);
}

function createRecipe(data) {
  const stmt = db.prepare(`INSERT INTO recipes (title, description, ingredients, instructions, image_url, prep_time, cook_time, servings, created_at, updated_at)
    VALUES (@title, @description, @ingredients, @instructions, @image_url, @prep_time, @cook_time, @servings, @created_at, @updated_at)`);

  const now = new Date().toISOString();
  const info = stmt.run({
    title: data.title || null,
    description: data.description || null,
    ingredients: data.ingredients ? JSON.stringify(data.ingredients) : JSON.stringify([]),
    instructions: data.instructions ? JSON.stringify(data.instructions) : JSON.stringify([]),
    image_url: data.image_url || null,
    prep_time: data.prep_time || null,
    cook_time: data.cook_time || null,
    servings: data.servings || null,
    created_at: now,
    updated_at: now
  });

  return getRecipeById(info.lastInsertRowid);
}

function updateRecipe(id, data) {
  const now = new Date().toISOString();
  const stmt = db.prepare(`UPDATE recipes SET
    title = @title,
    description = @description,
    ingredients = @ingredients,
    instructions = @instructions,
    image_url = @image_url,
    prep_time = @prep_time,
    cook_time = @cook_time,
    servings = @servings,
    updated_at = @updated_at
    WHERE id = @id`);

  stmt.run({
    id,
    title: data.title || null,
    description: data.description || null,
    ingredients: data.ingredients ? JSON.stringify(data.ingredients) : JSON.stringify([]),
    instructions: data.instructions ? JSON.stringify(data.instructions) : JSON.stringify([]),
    image_url: data.image_url || null,
    prep_time: data.prep_time || null,
    cook_time: data.cook_time || null,
    servings: data.servings || null,
    updated_at: now
  });

  return getRecipeById(id);
}

function deleteRecipe(id) {
  const stmt = db.prepare('DELETE FROM recipes WHERE id = ?');
  const info = stmt.run(id);
  return info.changes > 0;
}

module.exports = {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe
};
