# Backend Test Suite

This backend README documents the unit tests for the RecipesApp backend.

## Location

- Test files are located in `backend/test/`
- The main test suite for repository CRUD operations is `backend/test/recipeRepository.test.js`

## Test coverage

The current tests cover:

- Recipe CRUD operations
  - Create recipes with full and minimal data
  - Read recipes by ID
  - List all recipes
  - Update recipe fields, including ingredients and instructions arrays
  - Delete recipes and handle deletion of non-existent recipes
- User repository operations
  - Create unique users
  - Read users by ID and by email
  - Handle missing users cleanly
- Integration scenarios
  - Creating and retrieving related recipe/user entities
  - Maintaining data integrity across create/update/delete operations
  - Concurrent test execution using `Promise.all`

## Run tests

From the `backend/` directory:

```bash
npm install
npm test
```

The `npm test` command runs Mocha with the repository tests and exits when complete.

## Notes

- Tests use the SQLite test database at `backend/data/test-recipes.sqlite3`.
- The backend script `backend/scripts/migrate.js` is run before tests to ensure migrations are applied.
- The suite is written in Mocha with Chai assertions.

## Adding tests

To add a new test, update or add `.test.js` files under `backend/test/`.

- Use `describe()` blocks to group related test cases.
- Use `it()` blocks for individual assertions.
- Keep test data unique when necessary to avoid SQLite unique constraint conflicts.
- Verify each CRUD action and its expected result.
