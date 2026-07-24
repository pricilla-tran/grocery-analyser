function ProductGrid({ products, onSelect }) {
  if (products.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
        <p>No products in this category</p>
      </div>
    )
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
      gap: '12px',
      marginBottom: '2rem'
    }}>
      {products.map(product => (
        <div
          key={product.id}
          onClick={() => onSelect(product)}
          style={{
            padding: '1rem',
            background: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            cursor: 'pointer',
            transition: 'all 0.15s'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = '#16a34a'
            e.currentTarget.style.background  = '#f0fdf4'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = '#e2e8f0'
            e.currentTarget.style.background  = 'white'
          }}
        >
          <p style={{ fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>
            {product.name}
          </p>
          <p style={{ fontSize: '12px', color: '#94a3b8' }}>
            {product.unit}
          </p>
        </div>
      ))}
    </div>
  )
}

export default ProductGrid