const CATEGORIES = [
  { id: 'all',    label: '🛒 All',     },
  { id: 'dairy',  label: '🥛 Dairy'   },
  { id: 'bakery', label: '🍞 Bakery'  },
  { id: 'meat',   label: '🥩 Meat'    },
  { id: 'pantry', label: '🫙 Pantry'  },
]

function CategoryFilter({ selected, onSelect }) {
  return (
    <div style={{
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap',
      marginBottom: '1.5rem'
    }}>
      {CATEGORIES.map(cat => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          style={{
            padding: '8px 16px',
            borderRadius: '20px',
            border: '1px solid',
            borderColor: selected === cat.id ? '#16a34a' : '#e2e8f0',
            background: selected === cat.id ? '#f0fdf4' : 'white',
            color: selected === cat.id ? '#16a34a' : '#64748b',
            fontWeight: selected === cat.id ? '600' : '400',
            cursor: 'pointer',
            fontSize: '13px',
            transition: 'all 0.15s'
          }}
        >
          {cat.label}
        </button>
      ))}
    </div>
  )
}

export default CategoryFilter