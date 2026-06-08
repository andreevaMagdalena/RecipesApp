import React, { useState } from 'react'
import { signUp } from '../services/api'

export default function SignUpPage({ onCancel, onSignUpSuccess }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      const result = await signUp({ name, email, password })
      if (onSignUpSuccess) onSignUpSuccess(result)
    } catch (err) {
      setError(err.message || 'Unable to create account. Please try again.')
    } finally {
      setLoading(false)
    }
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

        {error && <div className="alert alert-error">{error}</div>}
        <div className="form-actions">
          <button type="button" className="secondary-button" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </div>
      </form>
    </div>
  )
}
