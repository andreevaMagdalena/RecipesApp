import React, { useState } from 'react'

export default function LoginPage({ onCancel }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    // Placeholder: actual authentication can be added later
    window.alert('Login submitted. Implement authentication next.')
  }

  return (
    <div className="form-panel">
      <h2>Log in</h2>
      <p className="subtitle">Enter your credentials to access your recipes.</p>

      <form className="recipe-form" onSubmit={handleSubmit}>
        <label>
          Email address
          <input
            type="email"
            value={email}
            onChange={event => setEmail(event.target.value)}
            required
            placeholder="you@example.com"
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={event => setPassword(event.target.value)}
            required
            placeholder="••••••••"
          />
        </label>

        <div className="form-actions">
          <button type="button" className="secondary-button" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="primary-button">
            Log in
          </button>
        </div>
      </form>
    </div>
  )
}
