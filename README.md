# RecipesApp

A full-stack recipe management app with a Node.js/Express backend and a React/Vite frontend.

## Repository structure

- `backend/` - Express API server, SQLite database, migrations, and seed scripts
- `frontend/` - React app built with Vite

## Prerequisites

- Node.js installed (recommended 18+)
- npm available in your shell

## Backend

1. Open a terminal in `backend/`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Start the production server:
   ```bash
   npm start
   ```

### Backend scripts

- `npm run db:migrate` - run database migrations
- `npm run db:seed` - seed the SQLite database
- `npm run db:backup` - create a database backup
- `npm test` - run backend tests with Mocha

## Frontend

1. Open a terminal in `frontend/`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the dev server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```

## Notes

- The backend stores data in `backend/data/`
- The frontend expects the API to be available from the configured backend server

## License

This project is provided as-is.
