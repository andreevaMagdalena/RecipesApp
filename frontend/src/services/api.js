const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api'

function getAuthToken() {
  try {
    return localStorage.getItem('authToken')
  } catch {
    return null
  }
}

export function saveAuthToken(token, user) {
  try {
    localStorage.setItem('authToken', token)
    localStorage.setItem('authUser', JSON.stringify(user))
  } catch (err) {
    console.warn('Unable to save auth token', err)
  }
}

export function clearAuthToken() {
  try {
    localStorage.removeItem('authToken')
    localStorage.removeItem('authUser')
  } catch (err) {
    console.warn('Unable to clear auth token', err)
  }
}

function getHeaders(json = true) {
  const headers = {}
  if (json) headers['Content-Type'] = 'application/json'
  const token = getAuthToken()
  if (token) headers.Authorization = `Bearer ${token}`
  return headers
}

async function handleResponse(res) {
  if (!res.ok) {
    const body = await res.text()
    let message = body || 'API error'
    try {
      const json = JSON.parse(body)
      message = json.message || json.error || body
    } catch {
      /* ignore parse failures */
    }
    throw new Error(message)
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
    headers: getHeaders(),
    body: JSON.stringify(data)
  })
  return handleResponse(res)
}

export async function updateRecipe(id, data) {
  const res = await fetch(`${BASE}/recipes/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data)
  })
  return handleResponse(res)
}

export async function deleteRecipe(id) {
  const res = await fetch(`${BASE}/recipes/${id}`, {
    method: 'DELETE',
    headers: getHeaders(false)
  })
  return handleResponse(res)
}

export async function signUp({ name, email, password }) {
  const res = await fetch(`${BASE}/auth/signup`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ name, email, password })
  })
  return handleResponse(res)
}

export async function logIn({ email, password }) {
  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ email, password })
  })
  return handleResponse(res)
}
