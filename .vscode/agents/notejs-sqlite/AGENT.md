# Recipe Manager Application

## Vision
Build a modern Recipe Manager that combines a REST API backend with a responsive frontend. The application should make it easy for users to manage their recipes through clear navigation, fast CRUD operations, and a polished user experience.

## Goals
- Provide a clean API for recipe management.
- Offer a responsive frontend with easy access to recipes, creation, editing, and details.
- Use a simple recipe model with core fields plus optional rich data.

## Core Functionality
- Create a new recipe
- Update/edit an existing recipe
- Delete a recipe
- Get all recipes
- Get a single recipe by ID

## Recipe Model
Each recipe includes:
- `ID`
- `Title`
- `Description`
- Optional fields: ingredients, preparation steps, image URL, creation date, etc.

## Frontend Experience
### Main Page
- Display all recipes in a list or card layout.
- Show Edit and Delete buttons for each recipe.
- Include a header with the application logo and an Add Recipe button.

### Recipe Details Page
- Show the recipe title, full description, and additional information if available.
- Provide a smooth transition from the main list to details.

## Navigation Flow
- Main page → list of all recipes
- Add Recipe button → create recipe form
- Edit button → edit recipe form
- Recipe click → recipe details page

## Expected Features
- Full CRUD operations
- Responsive design
- User-friendly UI
- Clean header and navigation
- Dedicated recipe details page
