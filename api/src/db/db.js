const { neon } = require('@neondatabase/serverless')
require('dotenv').config()
// Connect to Postgresql
const sql = neon(process.env.DATABASE_URL)

module.exports = sql