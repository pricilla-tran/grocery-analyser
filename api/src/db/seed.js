const sql = require('./db')

const seed = async () => {
  try {
    // Insert stores
    await sql`
      INSERT INTO stores (name, website) VALUES
        ('Woolworths', 'https://www.woolworths.com.au'),
        ('Coles', 'https://www.coles.com.au'),
        ('Aldi', 'https://www.aldi.com.au')
      ON CONFLICT DO NOTHING
    `

    // Insert products
    await sql`
      INSERT INTO products (name, category, unit) VALUES
        ('Full Cream Milk', 'dairy', '2L'),
        ('White Bread', 'bakery', '700g'),
        ('Free Range Eggs', 'dairy', '12 pack'),
        ('Chicken Breast', 'meat', '1kg'),
        ('Cheddar Cheese', 'dairy', '500g'),
        ('Olive Oil', 'pantry', '750ml'),
        ('Greek Yoghurt', 'dairy', '1kg'),
        ('Pasta', 'pantry', '500g')
      ON CONFLICT DO NOTHING
    `

    // Get ids back for price seeding
    const stores   = await sql`SELECT id, name FROM stores`
    const products = await sql`SELECT id, name FROM products`

    const woolworths = stores.find(s => s.name === 'Woolworths')
    const coles      = stores.find(s => s.name === 'Coles')
    const aldi       = stores.find(s => s.name === 'Aldi')
    const milk       = products.find(p => p.name === 'Full Cream Milk')
    const bread      = products.find(p => p.name === 'White Bread')
    const eggs       = products.find(p => p.name === 'Free Range Eggs')
    const chicken    = products.find(p => p.name === 'Chicken Breast')
    const cheese     = products.find(p => p.name === 'Cheddar Cheese')

    // Seed price history — last 30 days with realistic fluctuations
    const now = new Date()
    for (let daysAgo = 30; daysAgo >= 0; daysAgo--) {
      const date = new Date(now)
      date.setDate(date.getDate() - daysAgo)

      // Milk prices — Woolworths occasionally goes on sale
      const milkOnSale = daysAgo < 5  // on sale for last 5 days
      await sql`
        INSERT INTO prices (product_id, store_id, price, was_price, on_sale, captured_at)
        VALUES
          (${milk.id}, ${woolworths.id}, ${milkOnSale ? 2.50 : 3.20}, ${milkOnSale ? 3.20 : null}, ${milkOnSale}, ${date}),
          (${milk.id}, ${coles.id},      ${3.00}, ${null}, ${false}, ${date}),
          (${milk.id}, ${aldi.id},       ${2.79}, ${null}, ${false}, ${date})
      `

      // Bread prices
      await sql`
        INSERT INTO prices (product_id, store_id, price, was_price, on_sale, captured_at)
        VALUES
          (${bread.id}, ${woolworths.id}, ${3.50}, ${null}, ${false}, ${date}),
          (${bread.id}, ${coles.id},      ${3.20}, ${null}, ${false}, ${date}),
          (${bread.id}, ${aldi.id},       ${2.99}, ${null}, ${false}, ${date})
      `

      // Eggs prices
      const eggsOnSale = daysAgo >= 10 && daysAgo <= 15
      await sql`
        INSERT INTO prices (product_id, store_id, price, was_price, on_sale, captured_at)
        VALUES
          (${eggs.id}, ${woolworths.id}, ${7.00}, ${null}, ${false}, ${date}),
          (${eggs.id}, ${coles.id},      ${eggsOnSale ? 5.50 : 7.50}, ${eggsOnSale ? 7.50 : null}, ${eggsOnSale}, ${date}),
          (${eggs.id}, ${aldi.id},       ${6.49}, ${null}, ${false}, ${date})
      `

      // Chicken prices
      await sql`
        INSERT INTO prices (product_id, store_id, price, was_price, on_sale, captured_at)
        VALUES
          (${chicken.id}, ${woolworths.id}, ${10.00}, ${null}, ${false}, ${date}),
          (${chicken.id}, ${coles.id},      ${9.50},  ${null}, ${false}, ${date}),
          (${chicken.id}, ${aldi.id},       ${8.99},  ${null}, ${false}, ${date})
      `

      // Cheese prices
      await sql`
        INSERT INTO prices (product_id, store_id, price, was_price, on_sale, captured_at)
        VALUES
          (${cheese.id}, ${woolworths.id}, ${8.00}, ${null}, ${false}, ${date}),
          (${cheese.id}, ${coles.id},      ${7.50}, ${null}, ${false}, ${date}),
          (${cheese.id}, ${aldi.id},       ${6.99}, ${null}, ${false}, ${date})
      `
    }

    console.log('✅ Database seeded with 30 days of price history')
    process.exit(0)
  } catch (err) {
    console.error('Seed failed:', err.message)
    process.exit(1)
  }
}

seed()