import { createContext, useContext, useState } from 'react'
import client from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,        setUser]        = useState(null)
  const [accessToken, setAccessToken] = useState(null)

  const login = async (email, password) => {
    const res = await client.post('/auth/login', { email, password })
    setUser(res.data.user)
    setAccessToken(res.data.accessToken)
    // Attach token to all future requests automatically
    client.defaults.headers.common['Authorization'] = `Bearer ${res.data.accessToken}`
    return res.data
  }

  const register = async (name, email, password) => {
    const res = await client.post('/auth/register', { name, email, password })
    setUser(res.data.user)
    setAccessToken(res.data.accessToken)
    client.defaults.headers.common['Authorization'] = `Bearer ${res.data.accessToken}`
    return res.data
  }

  const logout = async () => {
    await client.post('/auth/logout')
    setUser(null)
    setAccessToken(null)
    delete client.defaults.headers.common['Authorization']
  }

  return (
    <AuthContext.Provider value={{ user, accessToken, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}