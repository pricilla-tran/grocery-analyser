import { useState } from 'react'
import SearchBar from './components/SearchBar'
import Recommendation from './components/Recommendation'
import PriceComparisonTable from './components/PriceComparisonTable'
import PriceHistoryChart from './components/PriceHistoryChart'
import WatchlistButton from './components/WatchlistButton'
import WatchlistPanel from './components/WatchlistPanel'
import AuthModal from './components/AuthModal'
import useProduct from './hooks/useProduct'
import { useAuth } from './context/AuthContext'
import './App.css'

function App() {
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showAuthModal,   setShowAuthModal]   = useState(false)
  const [showWatchlist,   setShowWatchlist]   = useState(false)
  const { product, loading, error }           = useProduct(selectedProduct?.id)
  const { user, logout }                      = useAuth()

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '700' }}>🛒 Grocery Price Analyser</h1>
          <p style={{ color: '#64748b', fontSize: '14px' }}>Compare prices across Woolworths, Coles and Aldi</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {user ? (
            <>
              <button
                onClick={() => setShowWatchlist(!showWatchlist)}
                style={{ padding: '8px 14px', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '8px', color: '#16a34a', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}
              >
                ❤️ Watchlist
              </button>
              <span style={{ fontSize: '13px', color: '#64748b' }}>Hi, {user.name.split(' ')[0]}</span>
              <button
                onClick={logout}
                style={{ padding: '8px 14px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#64748b', cursor: 'pointer', fontSize: '13px' }}
              >
                Sign out
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              style={{ padding: '8px 16px', background: '#16a34a', border: 'none', borderRadius: '8px', color: 'white', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}
            >
              Sign in
            </button>
          )}
        </div>
      </div>

      {/* Watchlist panel */}
      {showWatchlist && user && (
        <div style={{ marginBottom: '2rem', background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem' }}>
          <WatchlistPanel onSelectProduct={(p) => { setSelectedProduct(p); setShowWatchlist(false) }} />
        </div>
      )}

      <SearchBar onSelect={setSelectedProduct} />

      {!selectedProduct && !showWatchlist && (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
          <p style={{ fontSize: '48px', marginBottom: '1rem' }}>🔍</p>
          <p style={{ fontSize: '16px' }}>Search for a product above to see price comparisons</p>
          <p style={{ fontSize: '14px', marginTop: '8px' }}>Try: milk, bread, eggs, chicken, cheese</p>
        </div>
      )}

      {loading && <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}><p>Loading prices...</p></div>}
      {error   && <div style={{ textAlign: 'center', padding: '2rem', color: '#dc2626' }}><p>{error}</p></div>}

      {product && !loading && (
        <div>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '22px', fontWeight: '700' }}>{product.product.name}</h2>
              <p style={{ color: '#64748b', fontSize: '14px' }}>{product.product.category} · {product.product.unit}</p>
            </div>
            <WatchlistButton
              productId={product.product.id}
              onAuthRequired={() => setShowAuthModal(true)}
            />
          </div>

          <Recommendation recommendation={product.recommendation} />
          <PriceComparisonTable currentPrices={product.currentPrices} />
          <PriceHistoryChart priceHistory={product.priceHistory} />
        </div>
      )}

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </div>
  )
}

export default App