import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts'

const STORE_COLORS = {
  'Woolworths': '#16a34a',
  'Coles':      '#dc2626',
  'Aldi':       '#2563eb'
}

function PriceHistoryChart({ priceHistory }) {
  // Transform flat array into recharts format
  // Group by date, one entry per date with all store prices
  const chartData = priceHistory.reduce((acc, entry) => {
    const date = new Date(entry.captured_at).toLocaleDateString('en-AU', {
      month: 'short', day: 'numeric'
    })

    const existing = acc.find(d => d.date === date)
    if (existing) {
      existing[entry.store_name] = parseFloat(entry.price)
    } else {
      acc.push({ date, [entry.store_name]: parseFloat(entry.price) })
    }
    return acc
  }, [])

  const stores = [...new Set(priceHistory.map(p => p.store_name))]

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <h3 style={{ marginBottom: '0.75rem', fontSize: '16px', fontWeight: '600' }}>
        30-day price history
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            interval={6}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            tickFormatter={v => `$${v.toFixed(2)}`}
            domain={['auto', 'auto']}
          />
          <Tooltip
            formatter={(value, name) => [`$${parseFloat(value).toFixed(2)}`, name]}
            contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
          />
          <Legend />
          {stores.map(store => (
            <Line
              key={store}
              type="monotone"
              dataKey={store}
              stroke={STORE_COLORS[store] || '#666'}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default PriceHistoryChart