const express      = require('express')
const cors         = require('cors')
const cookieParser = require('cookie-parser')
require('dotenv').config()

const productsRouter  = require('./routes/products')
const authRouter      = require('./routes/auth')
const watchlistRouter = require('./routes/watchlist')

const app = express()

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}))
app.use(express.json())
app.use(cookieParser())

app.use('/products',  productsRouter)
app.use('/auth',      authRouter)
app.use('/watchlist', watchlistRouter)

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' })
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong' })
})

module.exports = app