const sql = require('../db/db')

const getWatchlist = async (req, res) => {
  try {
    const { userId } = req.user

    const items = await sql`
      SELECT
        w.id          AS watchlist_id,
        w.created_at  AS added_at,
        p.id          AS product_id,
        p.name,
        p.category,
        p.unit
      FROM watchlist w
      JOIN products p ON w.product_id = p.id
      WHERE w.user_id = ${userId}
      ORDER BY w.created_at DESC
    `

    res.status(200).json(items)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch watchlist' })
  }
}

const addToWatchlist = async (req, res) => {
  try {
    const { userId }    = req.user
    const { productId } = req.body

    // Check product exists
    const [product] = await sql`SELECT id FROM products WHERE id = ${productId}`
    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }

    // UNIQUE constraint handles duplicates — catch the error code
    const [item] = await sql`
      INSERT INTO watchlist (user_id, product_id)
      VALUES (${userId}, ${productId})
      RETURNING *
    `

    res.status(201).json(item)
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Already in watchlist' })
    }
    console.error(err)
    res.status(500).json({ error: 'Failed to add to watchlist' })
  }
}

const removeFromWatchlist = async (req, res) => {
  try {
    const { userId } = req.user
    const { id }     = req.params

    const [deleted] = await sql`
      DELETE FROM watchlist
      WHERE id = ${id} AND user_id = ${userId}
      RETURNING *
    `

    if (!deleted) {
      return res.status(404).json({ error: 'Watchlist item not found' })
    }

    res.status(204).send()
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to remove from watchlist' })
  }
}

module.exports = { getWatchlist, addToWatchlist, removeFromWatchlist }