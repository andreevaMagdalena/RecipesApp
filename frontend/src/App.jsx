import React, { useEffect, useState } from 'react'
import { getAllRecipes, deleteRecipe } from './services/api'

export default function App() {
  const [recipes, setRecipes] = useState([])

  useEffect(() => {
    getAllRecipes().then(setRecipes)
  }, [])

  return (
    <div style={{ padding: 20 }}>
      <h1>Recipe Manager</h1>
      <ul>
        {recipes.map(r => (
          <li key={r.id} style={{ marginBottom: 8 }}>
            <strong>{r.title}</strong> — {r.description}
            <button style={{ marginLeft: 8 }} onClick={() => { deleteRecipe(r.id).then(()=> setRecipes(recipes.filter(x=>x.id!==r.id))) }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
