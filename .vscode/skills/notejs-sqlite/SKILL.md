# Node.js + SQLite — Workspace Skill

Summary
- Purpose: Capture best-practices and a reproducible workflow for developing Node.js projects that use SQLite as the primary datastore.
- Scope: Workspace-scoped guidance for repositories based on Node.js + SQLite (developer-facing).

When to use
- Small-to-medium apps, local-first features, prototypes, CLI tools, or desktop apps using Electron.
- When you need a lightweight, file-based relational DB without a separate DB server.

Prerequisites
- Node.js LTS installed.
- SQLite CLI available for manual inspection (`sqlite3` or `sqlite` binary) and backups.
- Project uses a clear database access layer (e.g., `better-sqlite3`, `sqlite3`, or an ORM/Query builder like `knex`).

Principles
- Single responsibility: keep DB access in a small, well-tested module (`db/*`).
- Migrations: always use explicit, versioned migrations for schema changes.
- Backups: snapshot DB file before destructive migrations or releases.
- Transactions: wrap multi-statement operations in transactions to maintain consistency.
- Deterministic seeds: use repeatable seed scripts for local dev and CI.
- Tests: keep an isolated test DB file per test run (in-memory or temp file).

Step-by-step workflow
1. Develop locally against a development DB file (e.g., `data/dev.sqlite3`) kept out of source control.
2. Make schema changes via a migration script (not ad-hoc ALTERs).
   - Use a migration tool (recommended: `knex` migrations or `node-pg-migrate`-like tooling adapted for SQLite, or a simple versioned SQL folder + runner).
3. Write/adjust data-access functions in `src/db/*` and add/adjust unit tests.
4. Run migrations on a disposable copy of the DB, run the test suite, and fix any issues.
5. Commit code and migration files together.
6. On deploy/release, run migrations against the target DB and keep a pre-migration backup.

Decision points and branching logic
- Use in-memory DB for fast unit tests when the code supports it; use file-backed DB for integration tests that exercise file-based behaviors.
- If your app needs concurrent writers or heavy write load, consider moving to a server DB (Postgres) — SQLite works best for low-to-moderate concurrency.
- Choose `better-sqlite3` for synchronous, performant access and simpler transactions in Node; choose `sqlite3` for async callback/Promise patterns if desired.

Quality criteria / Completion checks
- All schema changes are contained in migration files with descriptive names.
- Tests cover DB access layer (happy path + edge cases) and pass in CI.
- DB file backups are produced before migrations in CI/CD or release scripts.
- No production secrets or copied DB files are committed to the repo.

Recommended repository layout
- /src
  - /db        — DB access layer, connection setup, and helpers
  - /migrations — Versioned SQL or JS migration files (e.g., `001-create-notes.sql`)
  - /seeds      — Repeatable seed scripts for dev & CI
- /data         — Default dev DB file (ignored in git)
- /test         — Tests that exercise DB APIs
- package.json  — scripts for migrate, backup, test

Example package.json scripts (recommended)
- "db:migrate": "node ./scripts/migrate.js"
- "db:backup": "node ./scripts/backup-db.js"
- "db:seed": "node ./scripts/seed.js"
- "test": "cross-env NODE_ENV=test mocha --exit"

Testing recommendations
- Use `NODE_ENV=test` and create an ephemeral DB (`:memory:` or temp file) for each test run.
- Seed deterministic data for integration tests.
- Run tests in CI with `npm ci && npm run db:migrate && npm test`.

Security & safety
- Validate and sanitize inputs used in SQL queries; prefer parameterized statements.
- Limit file permissions on DB files when running in production environments.
- Rotate any secrets used by higher-level app layers — SQLite itself does not manage credentials.

Build / Rebuild after changes (Essential: run these after any schema/code changes)
- Purpose: ensure schema + code remain in sync and that releases include migrations and backups.

Local dev quick steps
1. Install deps:

```
npm ci
```

2. Create or copy a dev DB (if starting from blank):

```
mkdir -p data
sqlite3 data/dev.sqlite3 "VACUUM;"
```

3. Run migrations:

```
npm run db:backup && npm run db:migrate
```

4. Run tests:

```
npm test
```

CI / Release steps (recommended)
- Before running migrations in CI/CD, snapshot the DB file (if present):

```
npm run db:backup
```

- Run migrations:

```
npm run db:migrate
```

- Run the test suite and any integration checks:

```
npm test
```

- If all good, deploy artifacts (server, Electron app bundle, etc.).

Migration tooling patterns (simple)
- Use a migrations folder with numbered files: `migrations/001-create-notes.sql`, `migrations/002-add-index.sql`.
- Add a small runner `scripts/migrate.js` that records applied migrations in a `meta_migrations` table and applies unapplied files in order.

Backup pattern (simple)
- `scripts/backup-db.js` copies the DB file to `backups/<timestamp>-dev.sqlite3` and keeps N latest backups.

Example prompts to run this skill
- "Run the Node.js + SQLite checklist for a breaking schema change"
- "Create migration file template for adding a new `tags` table"

Ambiguities / questions
- Should this skill reference a particular migration library (e.g., `knex`) or stay library-agnostic? If you prefer a specific stack, I can add exact commands and templates.

What this skill produces
- A compact, actionable checklist and workflow that developers in this workspace can follow when changing application code or schema involving Node.js + SQLite.
- Example scripts and commands to run after changes to keep DB + code in sync.

Next steps I can do for you
- Add `scripts/migrate.js` and `scripts/backup-db.js` templates in the repo.
- Add example `migrations/001-create-notes.sql` and a sample `src/db/connection.js` with `better-sqlite3` usage.

