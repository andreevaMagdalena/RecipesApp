import React from 'react'

export default function RecipeDetailPage({ recipe, onBack, onEdit, onDelete }) {
  return (
    <main>
      <button className="link-button" onClick={onBack}>← Back to recipes</button>
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
          <button className="secondary-button" onClick={onEdit}>Edit</button>
          <button className="danger-button" onClick={onDelete}>Delete</button>
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
