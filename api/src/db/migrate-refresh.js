const sql = require('./db')

const migrate = async () => {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS refresh_tokens (
        id         SERIAL PRIMARY KEY,
        user_id    INTEGER NOT NULL REFERENCES auth_users(id) ON DELETE CASCADE,
        token      VARCHAR(512) NOT NULL UNIQUE,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `
    console.log('✅ Refresh tokens table created')
    process.exit(0)
  } catch (err) {
    console.error('Migration failed:', err.message)
    process.exit(1)
  }
}

migrate()