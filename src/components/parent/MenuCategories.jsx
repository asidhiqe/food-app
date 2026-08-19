import React from 'react';

const CATEGORIES = [
  { id: 'all', label: 'All Items', icon: '✨', img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=160&q=80' },
  { id: 'thali', label: 'Thalis & Meals', icon: '🍱', img: 'https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?w=160&q=80' },
  { id: 'sandwich', label: 'Sandwiches', icon: '🥪', img: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=160&q=80' },
  { id: 'wrap', label: 'Wraps & Rolls', icon: '🌯', img: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=160&q=80' },
  { id: 'pasta', label: 'Pasta & Noodles', icon: '🍝', img: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=160&q=80' },
  { id: 'healthy', label: 'Fruit & Salads', icon: '🥗', img: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=160&q=80' },
  { id: 'beverage', label: 'Juices & Shakes', icon: '🧃', img: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=160&q=80' }
];

export default function MenuCategories({ selectedCategory, onSelectCategory }) {
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', padding: '0 0.25rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
          What’s on today’s menu?
        </h3>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', cursor: 'pointer' }} onClick={() => onSelectCategory('all')}>
          See all
        </span>
      </div>

      <div
        style={{
          display: 'flex',
          gap: '0.85rem',
          overflowX: 'auto',
          paddingBottom: '0.5rem',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                flexShrink: 0,
                outline: 'none',
                minWidth: '68px'
              }}
            >
              <div
                style={{
                  width: '62px',
                  height: '62px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  padding: isSelected ? '2.5px' : '1.5px',
                  border: isSelected ? '2.5px solid var(--primary)' : '1.5px solid #e2e8f0',
                  boxShadow: isSelected ? '0 4px 12px rgba(37,99,235,0.25)' : '0 2px 6px rgba(0,0,0,0.04)',
                  transition: 'all 0.2s ease',
                  background: '#ffffff'
                }}
              >
                <img
                  src={cat.img}
                  alt={cat.label}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    objectFit: 'cover'
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: isSelected ? 800 : 600,
                  color: isSelected ? 'var(--primary)' : 'var(--text-main)',
                  textAlign: 'center',
                  lineHeight: 1.1,
                  maxWidth: '70px'
                }}
              >
                {cat.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
