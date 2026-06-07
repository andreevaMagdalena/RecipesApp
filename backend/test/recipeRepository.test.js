const path = require('path');
process.env.DATABASE_PATH = path.join(__dirname, '..', 'data', 'test-recipes.sqlite3');
const { run: migrate } = require('../scripts/migrate');
const repo = require('../src/db/recipeRepository');
const { expect } = require('chai');

describe('recipeRepository', function() {
  before(async function() {
    await migrate();
  });
  it('creates and retrieves a recipe', async function() {
    const created = await repo.createRecipe({ title: 'Test Pancakes', description: 'Delicious' });
    expect(created).to.have.property('id');
    const fetched = await repo.getRecipeById(created.id);
    expect(fetched.title).to.equal('Test Pancakes');
  });

  it('lists recipes', async function() {
    const all = await repo.getAllRecipes();
    expect(all).to.be.an('array');
    expect(all.length).to.be.greaterThan(0);
  });
});
