const { z } = require('zod')

const registerSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  email: z.string().email().toLowerCase(),
  password: z.string().min(8)
})

const loginSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string()
})

module.exports = { registerSchema, loginSchema }