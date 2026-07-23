import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

function AuthModal({ onClose }) {
  const [mode,     setMode]     = useState('login') // 'login' or 'register'
  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState(null)
  const [loading,  setLoading]  = useState(false)

  const { login, register } = useAuth()

  const handleSubmit = async () => {
    try {
      setLoading(true)
      setError(null)

      if (mode === 'login') {
        await login(email, password)
      } else {
        await register(name, email, password)
      }

      onClose() // close modal on success
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    // Backdrop
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 100
      }}
    >
      {/* Modal — stop clicks propagating to backdrop */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'white',
          borderRadius: '12px',
          padding: '2rem',
          width: '100%',
          maxWidth: '400px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}
      >
        <h2 style={{ marginBottom: '1.5rem', fontSize: '20px', fontWeight: '700' }}>
          {mode === 'login' ? 'Sign in' : 'Create account'}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {mode === 'register' && (
            <input
              placeholder="Your name"
              value={name}
              onChange={e => setName(e.target.value)}
              style={inputStyle}
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={inputStyle}
          />

          {error && (
            <p style={{ color: '#dc2626', fontSize: '14px' }}>{error}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              padding: '12px',
              background: loading ? '#94a3b8' : '#16a34a',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>

          <p style={{ textAlign: 'center', fontSize: '14px', color: '#64748b' }}>
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(null) }}
              style={{ background: 'none', border: 'none', color: '#16a34a', cursor: 'pointer', fontWeight: '600' }}
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

const inputStyle = {
  padding: '10px 14px',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  fontSize: '15px',
  outline: 'none'
}

export default AuthModal