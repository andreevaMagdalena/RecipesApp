import React, { useState } from 'react'
import { logIn } from '../services/api'

export default function LoginPage({ onCancel, onSignUp, onLoginSuccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      const result = await logIn({ email, password })
      if (onLoginSuccess) onLoginSuccess(result)
    } catch (err) {
      setError(err.message || 'Unable to sign in. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-panel">
      <h2>Log in</h2>
      <p className="subtitle">Enter your credentials to access your recipes.</p>

      <form className="recipe-form" onSubmit={handleSubmit}>
        {error && <div className="alert alert-error">{error}</div>}
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
          <button type="button" className="secondary-button" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? 'Signing in…' : 'Log in'}
          </button>
        </div>
      </form>

      <div className="form-actions" style={{ justifyContent: 'center', marginTop: '16px' }}>
        <button type="button" className="text-button" onClick={onSignUp}>
          Don’t have an account? Create account
        </button>
      </div>
    </div>
  )
}
