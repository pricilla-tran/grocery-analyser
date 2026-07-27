const express = require('express')
const router  = express.Router()
const {
  searchProducts,
  getProductWithPrices,
  getAllProducts
} = require('../controllers/productsController')

router.get('/',        getAllProducts)
router.get('/search',  searchProducts)
router.get('/:id',     getProductWithPrices)

module.exports = router