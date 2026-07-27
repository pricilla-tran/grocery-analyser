const express    = require('express')
const router     = express.Router()
const { register, login, logout } = require('../controllers/authController')
const validate   = require('../middleware/validate')
const { registerSchema, loginSchema } = require('../schemas/authSchemas')
const authenticate = require('../middleware/auth')

router.post('/register', validate(registerSchema), register)
router.post('/login',    validate(loginSchema),    login)
router.post('/logout',   authenticate,             logout)

module.exports = router