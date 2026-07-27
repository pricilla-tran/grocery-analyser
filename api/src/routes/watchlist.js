const express    = require('express')
const router     = express.Router()
const authenticate = require('../middleware/auth')
const {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist
} = require('../controllers/watchlistController')

// All watchlist routes require authentication
router.use(authenticate)

router.get('/',      getWatchlist)
router.post('/',     addToWatchlist)
router.delete('/:id', removeFromWatchlist)

module.exports = router