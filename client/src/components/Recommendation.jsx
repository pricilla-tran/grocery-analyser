function Recommendation({ recommendation }) {
  const isBuy = recommendation.action === 'buy'

  return (
    <div style={{
      background: isBuy ? '#f0fdf4' : '#fefce8',
      border: `2px solid ${isBuy ? '#86efac' : '#fde047'}`,
      borderRadius: '12px',
      padding: '1.25rem 1.5rem',
      marginBottom: '1.5rem',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px'
    }}>
      <span style={{ fontSize: '28px' }}>{isBuy ? '✅' : '⏳'}</span>
      <div>
        <p style={{
          fontWeight: '700',
          fontSize: '18px',
          color: isBuy ? '#15803d' : '#854d0e',
          marginBottom: '4px'
        }}>
          {isBuy ? 'Good time to buy' : 'Consider waiting'}
        </p>
        <p style={{ color: isBuy ? '#166534' : '#713f12', fontSize: '14px' }}>
          {recommendation.reason}
        </p>
        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '8px' }}>
          <div>
            <p style={{ fontSize: '11px', color: '#666', marginBottom: '2px' }}>Lowest now</p>
            <p style={{ fontWeight: '700', fontSize: '16px' }}>${recommendation.lowestPrice.toFixed(2)}</p>
          </div>
          <div>
            <p style={{ fontSize: '11px', color: '#666', marginBottom: '2px' }}>30-day avg</p>
            <p style={{ fontWeight: '700', fontSize: '16px' }}>${recommendation.averagePrice.toFixed(2)}</p>
          </div>
          {recommendation.onSaleNow && (
            <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '6px', padding: '4px 10px', alignSelf: 'center' }}>
              <p style={{ fontSize: '12px', color: '#dc2626', fontWeight: '600' }}>🔥 On sale now</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Recommendation