import React, { useState } from 'react'

export default function SignUpPage({ onCancel }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    window.alert('Sign-up submitted. Implement registration next.')
  }

  return (
    <div className="form-panel">
      <h2>Sign up</h2>
      <p className="subtitle">Create a new account and start managing your recipes.</p>

      <form className="recipe-form" onSubmit={handleSubmit}>
        <label>
          Full name
          <input
            type="text"
            value={name}
            onChange={event => setName(event.target.value)}
            required
            placeholder="Your name"
          />
        </label>

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
            Create account
          </button>
        </div>
      </form>
    </div>
  )
}
