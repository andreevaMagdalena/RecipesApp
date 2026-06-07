CREATE TABLE IF NOT EXISTS meta_migrations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  applied_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS recipes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  ingredients TEXT,
  instructions TEXT,
  image_url TEXT,
  prep_time TEXT,
  cook_time TEXT,
  servings INTEGER,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
