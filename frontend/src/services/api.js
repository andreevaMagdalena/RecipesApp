const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api'

export async function getAllRecipes() {
  const res = await fetch(`${BASE}/recipes`)
  return res.json()
}

export async function deleteRecipe(id) {
  const res = await fetch(`${BASE}/recipes/${id}`, { method: 'DELETE' })
  return res.json()
}
