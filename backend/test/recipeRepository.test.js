process.env.DATABASE_PATH = ':memory:';
const { db } = require('../src/db/connection');
require('../scripts/migrate.js');
const repo = require('../src/db/recipeRepository');
const { expect } = require('chai');

describe('recipeRepository', function() {
  it('creates and retrieves a recipe', function() {
    const created = repo.createRecipe({ title: 'Test Pancakes', description: 'Delicious' });
    expect(created).to.have.property('id');
    const fetched = repo.getRecipeById(created.id);
    expect(fetched.title).to.equal('Test Pancakes');
  });

  it('lists recipes', function() {
    const all = repo.getAllRecipes();
    expect(all).to.be.an('array');
    expect(all.length).to.be.greaterThan(0);
  });
});
