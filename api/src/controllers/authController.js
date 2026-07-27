const bcrypt  = require('bcryptjs')
const jwt     = require('jsonwebtoken')
const sql     = require('../db/db')

const generateTokens = async (user) => {
  const accessToken = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  )

  const refreshToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
  )

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  await sql`
    INSERT INTO refresh_tokens (user_id, token, expires_at)
    VALUES (${user.id}, ${refreshToken}, ${expiresAt})
  `

  return { accessToken, refreshToken }
}

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    const [existing] = await sql`
      SELECT id FROM auth_users WHERE email = ${email}
    `
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const [newUser] = await sql`
      INSERT INTO auth_users (name, email, password)
      VALUES (${name}, ${email}, ${hashedPassword})
      RETURNING id, name, email, created_at
    `

    const { accessToken, refreshToken } = await generateTokens(newUser)

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.status(201).json({ user: newUser, accessToken })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Registration failed' })
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const [user] = await sql`SELECT * FROM auth_users WHERE email = ${email}`
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const { accessToken, refreshToken } = await generateTokens(user)

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    const { password: _, ...userWithoutPassword } = user
    res.status(200).json({ user: userWithoutPassword, accessToken })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Login failed' })
  }
}

const logout = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken
    if (token) {
      await sql`DELETE FROM refresh_tokens WHERE token = ${token}`
    }
    res.clearCookie('refreshToken')
    res.status(200).json({ message: 'Logged out successfully' })
  } catch (err) {
    res.status(500).json({ error: 'Logout failed' })
  }
}

module.exports = { register, login, logout }