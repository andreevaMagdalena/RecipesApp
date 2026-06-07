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
              <button className="secondary-button" onClick={() => onView(recipe.id)} aria-label={`View ${recipe.title}`} title="View">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button className="secondary-button" onClick={() => onEdit(recipe)} aria-label={`Edit ${recipe.title}`} title="Edit">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path d="M3 21v-3.75L14.81 5.44a2 2 0 012.83 0l1.92 1.92a2 2 0 010 2.83L7.75 21H3z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M14 6l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button className="danger-button" onClick={() => onDelete(recipe.id)} aria-label={`Delete ${recipe.title}`} title="Delete">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </article>
        ))}
      </div>
    </main>
  )
}
