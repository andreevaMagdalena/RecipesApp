import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getAllRecipes, getRecipeById, createRecipe, updateRecipe, deleteRecipe } from './services/api'
import RecipeListPage from './components/RecipeListPage'
import RecipeDetailPage from './components/RecipeDetailPage'
import RecipeForm from './components/RecipeForm'
import LoginPage from './components/LoginPage'
import SignUpPage from './components/SignUpPage'
import './styles.css'

const PAGE_LIST = 'list'
const PAGE_DETAIL = 'detail'
const PAGE_FORM = 'form'

export default function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const isLoginPage = location.pathname === '/login'
  const isSignupPage = location.pathname === '/signup'
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
          <h1>
            <button
              className="link-button app-logo"
              onClick={() => { setSelectedRecipe(null); setPage(PAGE_LIST); navigate('/') }}
              aria-label="Go to home"
            >
              <span className="logo-mark" aria-hidden="true">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="2" width="28" height="28" rx="14" fill="url(#logoGradient)"/>
                  <path d="M12 11v10M16 11v10M20 11v10" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M12 11c0-2 1.5-3 4-3s4 1 4 3" stroke="#fff" strokeWidth="2" strokeLinecap="round" fill="none"/>
                  <defs>
                    <linearGradient id="logoGradient" x1="2" y1="2" x2="30" y2="30" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#d9b39e"/>
                      <stop offset="1" stopColor="#b5886d"/>
                    </linearGradient>
                  </defs>
                </svg>
              </span>
              <span className="logo-text">Cook &amp; Share</span>
            </button>
          </h1>
        </div>
        <div className="header-actions">
          {!isLoginPage && !isSignupPage && (
            <button
              className="primary-button"
              onClick={() => { setFormMode('create'); setSelectedRecipe(null); setPage(PAGE_FORM) }}
              aria-label="Add recipe"
              title="Add recipe"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="M12 5v14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
          <button
            className="secondary-button"
            onClick={() => navigate('/login')}
            aria-label="Log in"
            title="Log in"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z" stroke="currentColor" strokeWidth="2" fill="none"/>
              <path d="M4 21c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
            </svg>
          </button>
        </div>
      </header>

      {error && <div className="alert alert-error">{error}</div>}
      {loading && <div className="alert alert-info">Loading…</div>}

      {!isLoginPage && !isSignupPage && page === PAGE_LIST && (
        <RecipeListPage
          recipes={recipes}
          onView={handleView}
          onDelete={handleDelete}
          onEdit={recipe => { setSelectedRecipe(recipe); setFormMode('edit'); setPage(PAGE_FORM) }}
        />
      )}

      {!isLoginPage && !isSignupPage && page === PAGE_DETAIL && selectedRecipe && (
        <RecipeDetailPage
          recipe={selectedRecipe}
          onBack={() => setPage(PAGE_LIST)}
          onEdit={() => { setFormMode('edit'); setPage(PAGE_FORM) }}
          onDelete={() => handleDelete(selectedRecipe.id)}
        />
      )}

      {!isLoginPage && !isSignupPage && page === PAGE_FORM && (
        <RecipeForm
          mode={formMode}
          initialRecipe={formMode === 'edit' ? selectedRecipe : null}
          onCancel={() => setPage(selectedRecipe ? PAGE_DETAIL : PAGE_LIST)}
          onSave={data => (formMode === 'edit' ? handleUpdate(selectedRecipe.id, data) : handleCreate(data))}
        />
      )}

      {isLoginPage && (
        <LoginPage onCancel={() => navigate('/')} onSignUp={() => navigate('/signup')} />
      )}

      {isSignupPage && (
        <SignUpPage onCancel={() => navigate('/')} />
      )}
    </div>
  )
}
