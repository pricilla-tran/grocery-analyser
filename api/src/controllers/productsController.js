const sql = require('../db/db')

// Search products by name
const searchProducts = async (req, res) => {
  try {
    const { q } = req.query

    if (!q || q.trim().length < 2) {
      return res.status(400).json({ error: 'Search query must be at least 2 characters' })
    }

    // ILIKE = case-insensitive LIKE in PostgreSQL
    // % means "anything before or after"
    const products = await sql`
      SELECT id, name, category, unit
      FROM products
      WHERE name ILIKE ${'%' + q + '%'}
      ORDER BY name
    `

    res.status(200).json(products)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Search failed' })
  }
}

// Get a single product with current prices at all stores
const getProductWithPrices = async (req, res) => {
  try {
    const { id } = req.params

    // First get the product
    const [product] = await sql`
      SELECT * FROM products WHERE id = ${id}
    `

    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }

    // Get the most recent price at each store using a subquery
    // DISTINCT ON (store_id) = one row per store, the most recent one
    const currentPrices = await sql`
      SELECT DISTINCT ON (pr.store_id)
        s.id          AS store_id,
        s.name        AS store_name,
        pr.price,
        pr.was_price,
        pr.on_sale,
        pr.captured_at
      FROM prices pr
      JOIN stores s ON pr.store_id = s.id
      WHERE pr.product_id = ${id}
      ORDER BY pr.store_id, pr.captured_at DESC
    `

    // Get price history for the chart — last 30 days, all stores
    const priceHistory = await sql`
      SELECT
        pr.price,
        pr.on_sale,
        pr.captured_at,
        s.name AS store_name
      FROM prices pr
      JOIN stores s ON pr.store_id = s.id
      WHERE pr.product_id = ${id}
        AND pr.captured_at >= NOW() - INTERVAL '30 days'
      ORDER BY pr.captured_at ASC
    `

    // Calculate the buy or wait recommendation
    const allPrices    = currentPrices.map(p => parseFloat(p.price))
    const lowestNow    = Math.min(...allPrices)
    const avgHistorical = priceHistory.reduce((sum, p) => sum + parseFloat(p.price), 0) / priceHistory.length
    const savingVsAvg  = ((avgHistorical - lowestNow) / avgHistorical * 100).toFixed(1)
    const onSaleNow    = currentPrices.some(p => p.on_sale)

    const recommendation = {
      action: lowestNow < avgHistorical ? 'buy' : 'wait',
      reason: lowestNow < avgHistorical
        ? `Currently ${savingVsAvg}% below the 30-day average — good time to buy`
        : 'Price is above the 30-day average — consider waiting for a sale',
      lowestPrice: lowestNow,
      averagePrice: parseFloat(avgHistorical.toFixed(2)),
      onSaleNow
    }

    res.status(200).json({
      product,
      currentPrices,
      priceHistory,
      recommendation
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch product' })
  }
}

// Get all products grouped by category
const getAllProducts = async (req, res) => {
  try {
    const products = await sql`
      SELECT * FROM products ORDER BY category, name
    `
    res.status(200).json(products)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' })
  }
}

module.exports = { searchProducts, getProductWithPrices, getAllProducts }