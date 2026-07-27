const sql = require('./db')

const migrate = async () => {
  try {
    // Products table
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id         SERIAL PRIMARY KEY,
        name       VARCHAR(255) NOT NULL,
        category   VARCHAR(100),
        unit       VARCHAR(50),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `

    // Stores table
    await sql`
      CREATE TABLE IF NOT EXISTS stores (
        id         SERIAL PRIMARY KEY,
        name       VARCHAR(100) NOT NULL,
        website    VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `

    // Prices table — the core of the app
    await sql`
      CREATE TABLE IF NOT EXISTS prices (
        id          SERIAL PRIMARY KEY,
        product_id  INTEGER REFERENCES products(id) ON DELETE CASCADE,
        store_id    INTEGER REFERENCES stores(id) ON DELETE CASCADE,
        price       DECIMAL(10,2) NOT NULL,
        was_price   DECIMAL(10,2),
        on_sale     BOOLEAN DEFAULT FALSE,
        captured_at TIMESTAMP DEFAULT NOW()
      )
    `

    // Auth users — same structure as express-api
    await sql`
      CREATE TABLE IF NOT EXISTS auth_users (
        id         SERIAL PRIMARY KEY,
        name       VARCHAR(100) NOT NULL,
        email      VARCHAR(255) NOT NULL UNIQUE,
        password   VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `

    // Watchlist — junction table
    await sql`
      CREATE TABLE IF NOT EXISTS watchlist (
        id         SERIAL PRIMARY KEY,
        user_id    INTEGER REFERENCES auth_users(id) ON DELETE CASCADE,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id, product_id)
      )
    `

    console.log('✅ All tables created')
    process.exit(0)
  } catch (err) {
    console.error('Migration failed:', err.message)
    process.exit(1)
  }
}

migrate()