import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import useWatchlist from '../hooks/useWatchlist'

function WatchlistButton({ productId, onAuthRequired }) {
  const { user }                                              = useAuth()
  const { isInWatchlist, getWatchlistId, addToWatchlist,
          removeFromWatchlist }                               = useWatchlist()
  const [loading, setLoading]                                 = useState(false)
  const [message, setMessage]                                 = useState(null)

  const inWatchlist  = isInWatchlist(productId)
  const watchlistId  = getWatchlistId(productId)

  const handleClick = async () => {
    if (!user) {
      onAuthRequired() // open login modal
      return
    }

    try {
      setLoading(true)
      setMessage(null)

      if (inWatchlist) {
        await removeFromWatchlist(watchlistId)
        setMessage('Removed from watchlist')
      } else {
        await addToWatchlist(productId)
        setMessage('Added to watchlist!')
      }
    } catch (err) {
      setMessage(err.message)
    } finally {
      setLoading(false)
      setTimeout(() => setMessage(null), 2000)
    }
  }

  return (
    <div style={{ marginBottom: '1rem' }}>
      <button
        onClick={handleClick}
        disabled={loading}
        style={{
          padding: '10px 20px',
          background: inWatchlist ? '#fef2f2' : '#f0fdf4',
          border: `1px solid ${inWatchlist ? '#fca5a5' : '#86efac'}`,
          borderRadius: '8px',
          color: inWatchlist ? '#dc2626' : '#16a34a',
          fontWeight: '600',
          fontSize: '14px',
          cursor: loading ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}
      >
        {inWatchlist ? '❤️ Remove from watchlist' : '🤍 Add to watchlist'}
      </button>
      {message && (
        <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>{message}</p>
      )}
    </div>
  )
}

export default WatchlistButton