import { useState, useEffect } from 'react'
import client from '../api/client'

function useProduct(productId) {
  const [product,  setProduct]  = useState(null)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState(null)

  useEffect(() => {
    // Don't fetch if no product selected
    if (!productId) return

    const fetchProduct = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await client.get(`/products/${productId}`)
        setProduct(res.data)
      } catch (err) {
        setError('Failed to load product details')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [productId])  // refetch when productId changes

  return { product, loading, error }
}

export default useProduct