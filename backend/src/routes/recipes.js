const express = require('express');
const repo = require('../db/recipeRepository');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const items = await repo.getAllRecipes();
    res.json(items);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const item = await repo.getRecipeById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const created = await repo.createRecipe(req.body || {});
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const updated = await repo.updateRecipe(req.params.id, req.body || {});
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const ok = await repo.deleteRecipe(req.params.id);
    res.json({ success: ok });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
