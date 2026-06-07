const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api'

async function handleResponse(res) {
  if (!res.ok) {
    const body = await res.text()
    throw new Error(body || 'API error')
  }
  return res.json()
}

export async function getAllRecipes() {
  const res = await fetch(`${BASE}/recipes`)
  return handleResponse(res)
}

export async function getRecipeById(id) {
  const res = await fetch(`${BASE}/recipes/${id}`)
  return handleResponse(res)
}

export async function createRecipe(data) {
  const res = await fetch(`${BASE}/recipes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return handleResponse(res)
}

export async function updateRecipe(id, data) {
  const res = await fetch(`${BASE}/recipes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return handleResponse(res)
}

export async function deleteRecipe(id) {
  const res = await fetch(`${BASE}/recipes/${id}`, { method: 'DELETE' })
  return handleResponse(res)
}
