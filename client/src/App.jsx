import { useState } from 'react'
import SearchBar from './components/SearchBar'
import Recommendation from './components/Recommendation'
import PriceComparisonTable from './components/PriceComparisonTable'
import PriceHistoryChart from './components/PriceHistoryChart'
import useProduct from './hooks/useProduct'
import './App.css'

function App() {
  const [selectedProduct, setSelectedProduct] = useState(null)
  const { product, loading, error } = useProduct(selectedProduct?.id)

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>

      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>
          🛒 Grocery Price Analyser
        </h1>
        <p style={{ color: '#64748b', fontSize: '16px' }}>
          Compare prices across Woolworths, Coles and Aldi — know when to buy
        </p>
      </div>

      <SearchBar onSelect={setSelectedProduct} />

      {!selectedProduct && (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
          <p style={{ fontSize: '48px', marginBottom: '1rem' }}>🔍</p>
          <p style={{ fontSize: '16px' }}>Search for a product above to see price comparisons</p>
          <p style={{ fontSize: '14px', marginTop: '8px' }}>
            Try: milk, bread, eggs, chicken, cheese
          </p>
        </div>
      )}

      {loading && (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
          <p>Loading prices...</p>
        </div>
      )}

      {error && (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#dc2626' }}>
          <p>{error}</p>
        </div>
      )}

      {product && !loading && (
        <div>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '22px', fontWeight: '700' }}>{product.product.name}</h2>
            <p style={{ color: '#64748b', fontSize: '14px' }}>
              {product.product.category} · {product.product.unit}
            </p>
          </div>

          <Recommendation recommendation={product.recommendation} />
          <PriceComparisonTable currentPrices={product.currentPrices} />
          <PriceHistoryChart priceHistory={product.priceHistory} />
        </div>
      )}
    </div>
  )
}

export default App