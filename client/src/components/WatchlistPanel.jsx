import useWatchlist from '../hooks/useWatchlist'

function WatchlistPanel({ onSelectProduct }) {
  const { watchlist, loading, removeFromWatchlist } = useWatchlist()

  if (loading) return <p style={{ color: '#94a3b8' }}>Loading watchlist...</p>

  if (watchlist.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
        <p style={{ fontSize: '24px' }}>🤍</p>
        <p style={{ fontSize: '14px' }}>No products on your watchlist yet</p>
      </div>
    )
  }

  return (
    <div>
      <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '0.75rem' }}>
        Your watchlist ({watchlist.length})
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {watchlist.map(item => (
          <div
            key={item.watchlist_id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px'
            }}
          >
            <div
              onClick={() => onSelectProduct({ id: item.product_id, name: item.name })}
              style={{ cursor: 'pointer', flex: 1 }}
            >
              <p style={{ fontWeight: '500', fontSize: '14px' }}>{item.name}</p>
              <p style={{ fontSize: '12px', color: '#94a3b8' }}>{item.category} · {item.unit}</p>
            </div>
            <button
              onClick={() => removeFromWatchlist(item.watchlist_id)}
              style={{
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                fontSize: '18px',
                padding: '4px'
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default WatchlistPanel