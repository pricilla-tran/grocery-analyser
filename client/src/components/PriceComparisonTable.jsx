function PriceComparisonTable({ currentPrices }) {
  const sorted = [...currentPrices].sort((a, b) => a.price - b.price)
  const lowest = parseFloat(sorted[0]?.price)

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <h3 style={{ marginBottom: '0.75rem', fontSize: '16px', fontWeight: '600' }}>
        Current prices
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {sorted.map((store, index) => {
          const price     = parseFloat(store.price)
          const wasPrice  = store.was_price ? parseFloat(store.was_price) : null
          const isCheapest = price === lowest

          return (
            <div
              key={store.store_id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                background: isCheapest ? '#f0fdf4' : '#f8fafc',
                border: `1px solid ${isCheapest ? '#86efac' : '#e2e8f0'}`,
                borderRadius: '8px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {isCheapest && <span style={{ fontSize: '16px' }}>🏆</span>}
                <span style={{ fontWeight: '500', fontSize: '15px' }}>{store.store_name}</span>
                {store.on_sale && (
                  <span style={{
                    background: '#fef2f2',
                    color: '#dc2626',
                    fontSize: '11px',
                    fontWeight: '600',
                    padding: '2px 8px',
                    borderRadius: '4px'
                  }}>
                    SALE
                  </span>
                )}
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontWeight: '700', fontSize: '18px', color: isCheapest ? '#15803d' : '#1e293b' }}>
                  ${price.toFixed(2)}
                </span>
                {wasPrice && (
                  <span style={{ textDecoration: 'line-through', color: '#94a3b8', fontSize: '13px', marginLeft: '8px' }}>
                    ${wasPrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default PriceComparisonTable