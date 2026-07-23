import { useState, useEffect } from 'react'
import client from '../api/client'
import { useAuth } from '../context/AuthContext'

function useWatchlist() {
  const [watchlist, setWatchlist] = useState([])
  const [loading,   setLoading]   = useState(false)
  const { user }                  = useAuth()

  // Fetch watchlist when user logs in
  useEffect(() => {
    if (!user) {
      setWatchlist([])
      return
    }

    const fetchWatchlist = async () => {
      try {
        setLoading(true)
        const res = await client.get('/watchlist')
        setWatchlist(res.data)
      } catch (err) {
        console.error('Failed to fetch watchlist')
      } finally {
        setLoading(false)
      }
    }

    fetchWatchlist()
  }, [user]) // refetch when user changes

  const addToWatchlist = async (productId) => {
    try {
      await client.post('/watchlist', { productId })
      const res = await client.get('/watchlist')
      setWatchlist(res.data)
    } catch (err) {
      if (err.response?.status === 409) {
        throw new Error('Already in watchlist')
      }
      throw new Error('Failed to add to watchlist')
    }
  }

  const removeFromWatchlist = async (watchlistId) => {
    try {
      await client.delete(`/watchlist/${watchlistId}`)
      setWatchlist(prev => prev.filter(item => item.watchlist_id !== watchlistId))
    } catch (err) {
      throw new Error('Failed to remove from watchlist')
    }
  }

  const isInWatchlist = (productId) => {
    return watchlist.some(item => item.product_id === productId)
  }

  const getWatchlistId = (productId) => {
    return watchlist.find(item => item.product_id === productId)?.watchlist_id
  }

  return { watchlist, loading, addToWatchlist, removeFromWatchlist, isInWatchlist, getWatchlistId }
}

export default useWatchlist