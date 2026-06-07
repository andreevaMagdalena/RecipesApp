import React from 'react'

export default function RecipeDetailPage({ recipe, onBack, onEdit, onDelete }) {
  return (
    <main>
      <button className="link-button" onClick={onBack} aria-label="Back to recipes" title="Back to recipes">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <section className="detail-hero">
        {recipe.image_url ? (
          <div className="detail-image-wrap">
            <img className="detail-image" src={recipe.image_url} alt={recipe.title} />
          </div>
        ) : null}
        <div>
          <p className="eyebrow">Recipe details</p>
          <h2>{recipe.title}</h2>
          <p className="subtitle">{recipe.description || 'No description provided.'}</p>
        </div>
        <div className="detail-actions">
          <button className="secondary-button" onClick={onEdit} aria-label="Edit recipe" title="Edit">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M3 21v-3.75L14.81 5.44a2 2 0 012.83 0l1.92 1.92a2 2 0 010 2.83L7.75 21H3z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M14 6l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button className="danger-button" onClick={onDelete} aria-label="Delete recipe" title="Delete">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </section>

      <section className="detail-grid">
        <div className="detail-card">
          <h3>Ingredients</h3>
          {recipe.ingredients && recipe.ingredients.length > 0 ? (
            <ul>
              {recipe.ingredients.map((item, index) => <li key={index}>{item}</li>)}
            </ul>
          ) : (
            <p className="muted">No ingredients added.</p>
          )}
        </div>

        <div className="detail-card">
          <h3>Instructions</h3>
          {recipe.instructions && recipe.instructions.length > 0 ? (
            <ol>
              {recipe.instructions.map((step, index) => <li key={index}>{step}</li>)}
            </ol>
          ) : (
            <p className="muted">No instructions added.</p>
          )}
        </div>

        <div className="detail-card detail-meta">
          <h3>Quick facts</h3>
          <dl>
            <dt>Prep time</dt><dd>{recipe.prep_time || '—'}</dd>
            <dt>Cook time</dt><dd>{recipe.cook_time || '—'}</dd>
            <dt>Servings</dt><dd>{recipe.servings || '—'}</dd>
            <dt>Created</dt><dd>{new Date(recipe.created_at).toLocaleDateString()}</dd>
          </dl>
        </div>
      </section>
    </main>
  )
}
