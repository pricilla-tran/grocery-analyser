import { useState } from 'react'
import client from '../api/client'

function SearchBar({ onSelect }) {
  const [query,   setQuery]   = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e) => {
    const value = e.target.value
    setQuery(value)

    if (value.length < 2) {
      setResults([])
      return
    }

    try {
      setLoading(true)
      const res = await client.get(`/products/search?q=${value}`)
      setResults(res.data)
    } catch (err) {
      console.error('Search failed')
    } finally {
      setLoading(false)
    }
  }

  const handleSelect = (product) => {
    onSelect(product)
    setQuery(product.name)
    setResults([])
  }

  return (
    <div style={{ position: 'relative', maxWidth: '500px', margin: '0 auto 2rem' }}>
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Search for a product — e.g. milk, eggs, bread"
        style={{
          width: '100%',
          padding: '12px 16px',
          fontSize: '16px',
          border: '2px solid #e2e8f0',
          borderRadius: '8px',
          outline: 'none',
          boxSizing: 'border-box'
        }}
      />

      {loading && (
        <p style={{ position:'absolute', right:'12px', top:'12px', color:'#94a3b8', fontSize:'14px' }}>
          Searching...
        </p>
      )}

      {results.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          zIndex: 10,
          marginTop: '4px'
        }}>
          {results.map(product => (
            <div
              key={product.id}
              onClick={() => handleSelect(product)}
              style={{
                padding: '10px 16px',
                cursor: 'pointer',
                borderBottom: '1px solid #f1f5f9',
                fontSize: '14px'
              }}
              onMouseEnter={e => e.target.style.background = '#f8fafc'}
              onMouseLeave={e => e.target.style.background = 'white'}
            >
              <span style={{ fontWeight: '500' }}>{product.name}</span>
              <span style={{ color: '#94a3b8', marginLeft: '8px', fontSize: '12px' }}>
                {product.category} · {product.unit}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchBar