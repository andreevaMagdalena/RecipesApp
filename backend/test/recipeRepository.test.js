const path = require('path');
process.env.DATABASE_PATH = path.join(__dirname, '..', 'data', 'test-recipes.sqlite3');
const { run: migrate } = require('../scripts/migrate');
const recipeRepo = require('../src/db/recipeRepository');
const userRepo = require('../src/db/userRepository');
const { expect } = require('chai');

describe('CRUD Operations', function() {
  before(async function() {
    await migrate();
  });

  describe('Recipe CRUD', function() {
    let recipeId;
    let testCounter = 0;

    // CREATE
    it('should create a recipe with all fields', async function() {
      const recipeData = {
        title: `Chocolate Chip Cookies ${++testCounter}`,
        description: 'Classic homemade cookies',
        ingredients: ['flour', 'butter', 'chocolate chips'],
        instructions: ['Mix ingredients', 'Bake at 350F'],
        image_url: 'https://example.com/cookie.jpg',
        prep_time: 15,
        cook_time: 12,
        servings: 24
      };

      const created = await recipeRepo.createRecipe(recipeData);
      expect(created).to.exist;
      expect(created).to.have.property('id');
      expect(created.title).to.include('Chocolate Chip Cookies');
      expect(created.description).to.equal('Classic homemade cookies');
      expect(Number(created.prep_time)).to.equal(15);
      expect(Number(created.cook_time)).to.equal(12);
      expect(Number(created.servings)).to.equal(24);
      expect(created.ingredients).to.be.an('array');
      expect(created.ingredients).to.include('flour');
      expect(created.instructions).to.be.an('array');
      
      recipeId = created.id;
    });

    it('should create a recipe with minimal fields', async function() {
      const recipeData = {
        title: `Simple Salad ${++testCounter}`
      };

      const created = await recipeRepo.createRecipe(recipeData);
      expect(created).to.exist;
      expect(created.id).to.exist;
      expect(created.title).to.include('Simple Salad');
      expect(created.ingredients).to.be.an('array');
      expect(created.instructions).to.be.an('array');
    });

    // READ
    it('should retrieve a recipe by id', async function() {
      const fetched = await recipeRepo.getRecipeById(recipeId);
      expect(fetched).to.exist;
      expect(fetched.id).to.equal(recipeId);
      expect(fetched.title).to.include('Chocolate Chip Cookies');
    });

    it('should return null for non-existent recipe id', async function() {
      const fetched = await recipeRepo.getRecipeById(99999);
      expect(fetched).to.be.null;
    });

    it('should retrieve all recipes', async function() {
      const all = await recipeRepo.getAllRecipes();
      expect(all).to.be.an('array');
      expect(all.length).to.be.greaterThan(0);
      const firstRecipe = all[0];
      expect(firstRecipe).to.have.all.keys('id', 'title', 'description', 'ingredients', 'instructions', 'image_url', 'prep_time', 'cook_time', 'servings', 'created_at', 'updated_at');
    });

    // UPDATE
    it('should update a recipe with all fields', async function() {
      const updateData = {
        title: `Updated Cookies ${testCounter}`,
        description: 'Updated description',
        ingredients: ['new flour', 'new butter'],
        instructions: ['new step 1', 'new step 2'],
        prep_time: 20,
        cook_time: 15,
        servings: 36,
        image_url: 'https://example.com/updated.jpg'
      };

      const updated = await recipeRepo.updateRecipe(recipeId, updateData);
      expect(updated).to.exist;
      expect(updated.title).to.include('Updated Cookies');
      expect(updated.description).to.equal('Updated description');
      expect(Number(updated.prep_time)).to.equal(20);
      expect(Number(updated.cook_time)).to.equal(15);
      expect(Number(updated.servings)).to.equal(36);
      expect(updated.ingredients).to.be.an('array');
      expect(updated.instructions).to.be.an('array');
    });

    it('should update ingredients and instructions arrays', async function() {
      const updateData = {
        title: `Final Cookies ${testCounter}`,
        ingredients: ['ingredient 1', 'ingredient 2', 'ingredient 3'],
        instructions: ['step 1', 'step 2', 'step 3', 'step 4'],
        description: 'Final recipe'
      };

      const updated = await recipeRepo.updateRecipe(recipeId, updateData);
      expect(updated.ingredients).to.deep.equal(['ingredient 1', 'ingredient 2', 'ingredient 3']);
      expect(updated.instructions).to.deep.equal(['step 1', 'step 2', 'step 3', 'step 4']);
    });

    // DELETE
    it('should delete a recipe', async function() {
      // Create a new recipe specifically for deletion
      const createResult = await recipeRepo.createRecipe({ 
        title: `Recipe to Delete - ${Math.random()}`
      });
      expect(createResult).to.exist;
      expect(createResult.id).to.exist;
      
      const idToDelete = createResult.id;

      // Verify it was created and exists
      const beforeDelete = await recipeRepo.getRecipeById(idToDelete);
      expect(beforeDelete).to.not.be.null;
      expect(beforeDelete.id).to.equal(idToDelete);

      // Delete it
      await recipeRepo.deleteRecipe(idToDelete);
      
      // Verify the recipe no longer exists
      const afterDelete = await recipeRepo.getRecipeById(idToDelete);
      expect(afterDelete).to.be.null;
    });

    it('should return false when deleting non-existent recipe', async function() {
      const result = await recipeRepo.deleteRecipe(99999);
      expect(result).to.be.false;
    });
  });

  describe('User CRUD', function() {
    let userId;
    let testCounter = 0;
    const timestamp = Date.now();

    // CREATE
    it('should create a user', async function() {
      const userData = {
        name: 'John Doe',
        email: `john${timestamp}@example.com`,
        passwordHash: 'hashedpassword123'
      };

      const created = await userRepo.createUser(userData);
      expect(created).to.exist;
      expect(created).to.have.property('id');
      expect(created.name).to.equal('John Doe');
      expect(created.email).to.include('john');
      expect(created.password_hash).to.equal('hashedpassword123');

      userId = created.id;
    });

    it('should create multiple users with different emails', async function() {
      const timestamp = Date.now();
      const users = [];
      for (let i = 1; i <= 3; i++) {
        const user = await userRepo.createUser({
          name: `User ${i}`,
          email: `user${timestamp}${i}@example.com`,
          passwordHash: `hash${i}`
        });
        users.push(user);
      }

      expect(users).to.have.lengthOf(3);
      users.forEach((user, index) => {
        expect(user.id).to.exist;
        expect(user.email).to.include('user');
        expect(user.email).to.include('example.com');
      });
    });

    // READ
    it('should retrieve a user by id', async function() {
      const fetched = await userRepo.getUserById(userId);
      expect(fetched).to.exist;
      expect(fetched.id).to.equal(userId);
      expect(fetched.name).to.equal('John Doe');
    });

    it('should return null for non-existent user id', async function() {
      const fetched = await userRepo.getUserById(99999);
      expect(fetched).to.be.null;
    });

    it('should retrieve a user by email', async function() {
      const createdEmail = `testuser${timestamp}${++testCounter}@example.com`;
      const created = await userRepo.createUser({
        name: 'Test User',
        email: createdEmail,
        passwordHash: 'testhash'
      });

      const fetched = await userRepo.getUserByEmail(createdEmail);
      expect(fetched).to.exist;
      expect(fetched.id).to.equal(created.id);
      expect(fetched.email).to.equal(createdEmail);
    });

    it('should return null for non-existent email', async function() {
      const fetched = await userRepo.getUserByEmail(`nonexistent${timestamp}${++testCounter}@example.com`);
      expect(fetched).to.be.null;
    });
  });

  describe('Integration Tests', function() {
    let testCounter = 0;
    const timestamp = Date.now();

    it('should handle recipe and user relationship', async function() {
      const user = await userRepo.createUser({
        name: 'Jane Smith',
        email: `jane${timestamp}${++testCounter}@example.com`,
        passwordHash: 'hash123'
      });

      const recipe = await recipeRepo.createRecipe({
        title: `Pasta Carbonara ${++testCounter}`,
        description: 'Italian classic'
      });

      expect(user.id).to.exist;
      expect(recipe.id).to.exist;

      // Verify both can be retrieved
      const fetchedUser = await userRepo.getUserById(user.id);
      const fetchedRecipe = await recipeRepo.getRecipeById(recipe.id);

      expect(fetchedUser.email).to.include('jane');
      expect(fetchedRecipe.title).to.include('Pasta Carbonara');
    });

    it('should maintain data integrity across CRUD operations', async function() {
      const initialRecipes = await recipeRepo.getAllRecipes();
      const initialCount = initialRecipes.length;

      const recipe1 = await recipeRepo.createRecipe({ title: `Integration Recipe 1 ${++testCounter}` });
      const recipe2 = await recipeRepo.createRecipe({ title: `Integration Recipe 2 ${++testCounter}` });
      
      let currentCount = (await recipeRepo.getAllRecipes()).length;
      expect(currentCount).to.equal(initialCount + 2);

      await recipeRepo.deleteRecipe(recipe1.id);
      currentCount = (await recipeRepo.getAllRecipes()).length;
      expect(currentCount).to.equal(initialCount + 1);

      const updated = await recipeRepo.updateRecipe(recipe2.id, { 
        title: `Updated Integration Recipe ${testCounter}`,
        description: 'Updated',
        ingredients: ['item1'],
        instructions: ['step1']
      });
      const fetched = await recipeRepo.getRecipeById(recipe2.id);
      expect(fetched.title).to.include('Updated Integration Recipe');
    });

    it('should handle concurrent operations', async function() {
      const recipes = await Promise.all([
        recipeRepo.createRecipe({ title: `Concurrent Recipe 1 ${++testCounter}` }),
        recipeRepo.createRecipe({ title: `Concurrent Recipe 2 ${++testCounter}` }),
        recipeRepo.createRecipe({ title: `Concurrent Recipe 3 ${++testCounter}` })
      ]);

      expect(recipes).to.have.lengthOf(3);
      recipes.forEach(r => {
        expect(r.id).to.exist;
        expect(r.title).to.include('Concurrent Recipe');
      });

      const users = await Promise.all([
        userRepo.createUser({ name: 'User A', email: `usera${timestamp}${++testCounter}@example.com`, passwordHash: 'hash' }),
        userRepo.createUser({ name: 'User B', email: `userb${timestamp}${++testCounter}@example.com`, passwordHash: 'hash' })
      ]);

      expect(users).to.have.lengthOf(2);
      users.forEach(u => {
        expect(u.id).to.exist;
        expect(u.name).to.match(/User [AB]/);
      });
    });
  });
});
