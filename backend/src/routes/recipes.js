const express = require('express');
const repo = require('../db/recipeRepository');

const router = express.Router();

router.get('/', (req, res) => {
  const items = repo.getAllRecipes();
  res.json(items);
});

router.get('/:id', (req, res) => {
  const item = repo.getRecipeById(req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
});

router.post('/', (req, res) => {
  const created = repo.createRecipe(req.body || {});
  res.status(201).json(created);
});

router.put('/:id', (req, res) => {
  const updated = repo.updateRecipe(req.params.id, req.body || {});
  res.json(updated);
});

router.delete('/:id', (req, res) => {
  const ok = repo.deleteRecipe(req.params.id);
  res.json({ success: ok });
});

module.exports = router;
