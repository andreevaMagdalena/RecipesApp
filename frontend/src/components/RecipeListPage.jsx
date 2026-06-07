import React from 'react'

export default function RecipeListPage({ recipes, onView, onEdit, onDelete }) {
  return (
    <main>
      <section className="section-heading">
        <div>
          <h2>All Recipes</h2>
        </div>
      </section>

      <div className="grid">
        {recipes.length === 0 ? (
          <div className="empty-state">
            <h3>No recipes yet</h3>
            <p>Start by adding your first recipe to the collection.</p>
          </div>
        ) : recipes.map(recipe => (
          <article key={recipe.id} className="card">
            {recipe.image_url ? (
              <button
                className="card-image-wrap link-button"
                onClick={() => onView(recipe.id)}
                aria-label={`View ${recipe.title}`}
              >
                <img className="card-image" src={recipe.image_url} alt={recipe.title} />
              </button>
            ) : null}
            <div className="card-content">
              <h3>{recipe.title}</h3>
              <p className="card-description">{recipe.description || 'No description provided.'}</p>
              <div className="meta-row">
                <span>{recipe.servings ? `${recipe.servings} servings` : 'Servings: -'}</span>
                <span>{recipe.cook_time ? recipe.cook_time : 'Cook: -'}</span>
              </div>
            </div>
            <div className="card-actions">
              <button className="secondary-button" onClick={() => onView(recipe.id)}>View</button>
              <button className="secondary-button" onClick={() => onEdit(recipe)}>Edit</button>
              <button className="danger-button" onClick={() => onDelete(recipe.id)}>Delete</button>
            </div>
          </article>
        ))}
      </div>
    </main>
  )
}
