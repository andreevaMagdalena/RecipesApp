import React, { useEffect, useState } from 'react'
import { getAllRecipes, getRecipeById, createRecipe, updateRecipe, deleteRecipe } from './services/api'
import RecipeListPage from './components/RecipeListPage'
import RecipeDetailPage from './components/RecipeDetailPage'
import RecipeForm from './components/RecipeForm'
import './styles.css'

const PAGE_LIST = 'list'
const PAGE_DETAIL = 'detail'
const PAGE_FORM = 'form'

export default function App() {
  const [recipes, setRecipes] = useState([])
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [page, setPage] = useState(PAGE_LIST)
  const [formMode, setFormMode] = useState('create')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function refreshRecipes() {
    setLoading(true)
    setError('')
    try {
      const list = await getAllRecipes()
      setRecipes(list)
    } catch (err) {
      setError('Unable to load recipes. Please check your backend.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshRecipes()
  }, [])

  async function handleView(recipeId) {
    setLoading(true)
    setError('')
    try {
      const recipe = await getRecipeById(recipeId)
      setSelectedRecipe(recipe)
      setPage(PAGE_DETAIL)
    } catch (err) {
      setError('Recipe not found.')
    } finally {
      setLoading(false)
    }
  }

  async function handleCreate(data) {
    setLoading(true)
    setError('')
    try {
      const recipe = await createRecipe(data)
      setSelectedRecipe(recipe)
      setPage(PAGE_DETAIL)
      await refreshRecipes()
    } catch (err) {
      setError('Unable to create recipe.')
    } finally {
      setLoading(false)
    }
  }

  async function handleUpdate(id, data) {
    setLoading(true)
    setError('')
    try {
      const recipe = await updateRecipe(id, data)
      setSelectedRecipe(recipe)
      setPage(PAGE_DETAIL)
      await refreshRecipes()
    } catch (err) {
      setError('Unable to save recipe.')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm('Delete this recipe?')
    if (!confirmed) return
    setLoading(true)
    setError('')
    try {
      await deleteRecipe(id)
      setPage(PAGE_LIST)
      setSelectedRecipe(null)
      await refreshRecipes()
    } catch (err) {
      setError('Unable to delete recipe.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Recipe Manager</p>
          <h1>My Recipe Collection</h1>
          <p className="subtitle">Browse, add, edit, and manage your recipes from one clean interface.</p>
        </div>
        <div className="header-actions">
          <button className="primary-button" onClick={() => { setFormMode('create'); setSelectedRecipe(null); setPage(PAGE_FORM) }}>
            Add Recipe
          </button>
        </div>
      </header>

      {error && <div className="alert alert-error">{error}</div>}
      {loading && <div className="alert alert-info">Loading…</div>}

      {page === PAGE_LIST && (
        <RecipeListPage
          recipes={recipes}
          onView={handleView}
          onDelete={handleDelete}
          onEdit={recipe => { setSelectedRecipe(recipe); setFormMode('edit'); setPage(PAGE_FORM) }}
        />
      )}

      {page === PAGE_DETAIL && selectedRecipe && (
        <RecipeDetailPage
          recipe={selectedRecipe}
          onBack={() => setPage(PAGE_LIST)}
          onEdit={() => { setFormMode('edit'); setPage(PAGE_FORM) }}
          onDelete={() => handleDelete(selectedRecipe.id)}
        />
      )}

      {page === PAGE_FORM && (
        <RecipeForm
          mode={formMode}
          initialRecipe={formMode === 'edit' ? selectedRecipe : null}
          onCancel={() => setPage(selectedRecipe ? PAGE_DETAIL : PAGE_LIST)}
          onSave={data => (formMode === 'edit' ? handleUpdate(selectedRecipe.id, data) : handleCreate(data))}
        />
      )}
    </div>
  )
}
