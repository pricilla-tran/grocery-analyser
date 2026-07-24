import { useState, useEffect } from 'react'
import client from '../api/client'

function useAllProducts() {
  const [products, setProducts] = useState([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await client.get('/products')
        setProducts(res.data)
      } catch (err) {
        console.error('Failed to fetch products')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  return { products, loading }
}

export default useAllProducts