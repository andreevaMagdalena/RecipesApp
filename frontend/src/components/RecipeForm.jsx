import React, { useEffect, useState } from 'react'

const defaultRecipe = {
  title: '',
  description: '',
  image_url: '',
  ingredients: [''],
  instructions: [''],
  prep_time: '',
  cook_time: '',
  servings: ''
}

export default function RecipeForm({ mode, initialRecipe, onCancel, onSave }) {
  const [formData, setFormData] = useState(defaultRecipe)

  useEffect(() => {
    if (mode === 'edit' && initialRecipe) {
      setFormData({
        title: initialRecipe.title || '',
        description: initialRecipe.description || '',
        image_url: initialRecipe.image_url || '',
        ingredients: initialRecipe.ingredients || [''],
        instructions: initialRecipe.instructions || [''],
        prep_time: initialRecipe.prep_time || '',
        cook_time: initialRecipe.cook_time || '',
        servings: initialRecipe.servings || ''
      })
    } else {
      setFormData(defaultRecipe)
    }
  }, [mode, initialRecipe])

  function handleChange(field, value) {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  function handleListChange(field, index, value) {
    setFormData(prev => {
      const list = [...prev[field]]
      list[index] = value
      return { ...prev, [field]: list }
    })
  }

  function addListEntry(field) {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }))
  }

  function removeListEntry(field, index) {
    setFormData(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      image_url: formData.image_url.trim() || null,
      ingredients: formData.ingredients.filter(Boolean).map(item => item.trim()),
      instructions: formData.instructions.filter(Boolean).map(item => item.trim()),
      prep_time: formData.prep_time.trim(),
      cook_time: formData.cook_time.trim(),
      servings: formData.servings ? Number(formData.servings) : null
    }
    onSave(payload)
  }

  return (
    <main>
      <button className="link-button" onClick={onCancel}>← Back</button>
      <section className="form-panel">
        <div>
          <p className="eyebrow">{mode === 'edit' ? 'Edit recipe' : 'New recipe'}</p>
          <h2>{mode === 'edit' ? 'Update your recipe' : 'Add a new recipe'}</h2>
          <p className="subtitle">Enter recipe details so you can find and manage it later.</p>
        </div>

        <form className="recipe-form" onSubmit={handleSubmit}>
          <label>
            Recipe title
            <input value={formData.title} onChange={e => handleChange('title', e.target.value)} required />
          </label>

          <label>
            Description
            <textarea value={formData.description} onChange={e => handleChange('description', e.target.value)} rows={3} />
          </label>

          <label>
            Image URL
            <input value={formData.image_url} onChange={e => handleChange('image_url', e.target.value)} placeholder="https://example.com/photo.jpg" />
          </label>

          <div className="field-group">
            <label>
              Prep time
              <input value={formData.prep_time} onChange={e => handleChange('prep_time', e.target.value)} placeholder="e.g. 15m" />
            </label>
            <label>
              Cook time
              <input value={formData.cook_time} onChange={e => handleChange('cook_time', e.target.value)} placeholder="e.g. 30m" />
            </label>
            <label>
              Servings
              <input value={formData.servings} onChange={e => handleChange('servings', e.target.value)} type="number" min="1" />
            </label>
          </div>

          <div className="list-field">
            <div className="list-field-header">
              <span>Ingredients</span>
              <button type="button" className="text-button" onClick={() => addListEntry('ingredients')}>Add item</button>
            </div>
            {formData.ingredients.map((ingredient, index) => (
              <div key={index} className="list-item-row">
                <input
                  value={ingredient}
                  onChange={e => handleListChange('ingredients', index, e.target.value)}
                  placeholder="Onion, garlic, tomato..."
                />
                <button type="button" className="icon-button" onClick={() => removeListEntry('ingredients', index)}>×</button>
              </div>
            ))}
          </div>

          <div className="list-field">
            <div className="list-field-header">
              <span>Instructions</span>
              <button type="button" className="text-button" onClick={() => addListEntry('instructions')}>Add step</button>
            </div>
            {formData.instructions.map((instruction, index) => (
              <div key={index} className="list-item-row">
                <input
                  value={instruction}
                  onChange={e => handleListChange('instructions', index, e.target.value)}
                  placeholder="Mix, fry, bake..."
                />
                <button type="button" className="icon-button" onClick={() => removeListEntry('instructions', index)}>×</button>
              </div>
            ))}
          </div>

          <div className="form-actions">
            <button type="button" className="secondary-button" onClick={onCancel}>Cancel</button>
            <button type="submit" className="primary-button">Save recipe</button>
          </div>
        </form>
      </section>
    </main>
  )
}
