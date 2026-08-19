import React, { useState, useMemo } from 'react';
import { Search, Plus, Minus, Flame, ShieldAlert, Sparkles, Filter, Leaf, Heart, Star, AlertTriangle, Check, X } from 'lucide-react';

const CATEGORY_ICON_MAP = {
  'all': '✨',
  'Snacks & Rolls': '🌯',
  'Lunch Thali': '🍱',
  'Lunch Meals': '🍱',
  'Sandwiches & Burgers': '🥪',
  'Pasta & Noodles': '🍝',
  'Healthy & Salads': '🥗',
  'Beverages & Juices': '🧃',
  'Bakery & Sweets': '🧁',
  'South Indian': '🥞',
  'Wraps': '🌯'
};

const ALLERGEN_MAP = {
  'dairy': { label: 'Dairy', icon: '🥛', bg: '#eff6ff', border: '#bfdbfe', text: '#1e40af' },
  'gluten': { label: 'Gluten', icon: '🌾', bg: '#fefce8', border: '#fef08a', text: '#854d0e' },
  'wheat': { label: 'Wheat', icon: '🌾', bg: '#fefce8', border: '#fef08a', text: '#854d0e' },
  'nuts': { label: 'Nuts', icon: '🥜', bg: '#fff7ed', border: '#ffedd5', text: '#9a3412' },
  'peanuts': { label: 'Peanuts', icon: '🥜', bg: '#fff7ed', border: '#ffedd5', text: '#9a3412' },
  'eggs': { label: 'Eggs', icon: '🥚', bg: '#fdf4ff', border: '#fae8ff', text: '#86198f' },
  'soy': { label: 'Soy', icon: '🫘', bg: '#ecfdf5', border: '#d1fae5', text: '#065f46' }
};

const FALLBACK_IMAGES = {
  'Snacks & Rolls': 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=400&auto=format&fit=crop&q=80',
  'Lunch Thali': 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&auto=format&fit=crop&q=80',
  'Sandwiches & Burgers': 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&auto=format&fit=crop&q=80',
  'Pasta & Noodles': 'https://images.unsplash.com/photo-1621996346565-e3d5d62817d2?w=400&auto=format&fit=crop&q=80',
  'Healthy & Salads': 'https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=400&auto=format&fit=crop&q=80',
  'Beverages & Juices': 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&auto=format&fit=crop&q=80',
  'Bakery & Sweets': 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400&auto=format&fit=crop&q=80'
};

export default function MenuCatalog({
  menuItems,
  selectedSlot,
  cart,
  onAddToCart,
  onRemoveFromCart,
  currency,
  activeChild
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isVegOnly, setIsVegOnly] = useState(false);
  const [isSafeOnly, setIsSafeOnly] = useState(false);
  const [pendingAllergyItem, setPendingAllergyItem] = useState(null);

  const childName = activeChild ? activeChild.studentName.split(' ')[0] : 'Your child';
  const childAllergies = (activeChild?.allergies || []).map((a) => a.toLowerCase().trim());

  // Check if an item conflicts with active child's allergies
  const checkItemConflict = (item) => {
    if (childAllergies.length === 0) return null;
    const itemAllergens = (Array.isArray(item.allergens) ? item.allergens : (item.allergens ? [item.allergens] : []))
      .map((a) => a.toLowerCase().trim());

    const conflicting = childAllergies.filter((ca) => itemAllergens.includes(ca));
    return conflicting.length > 0 ? conflicting : null;
  };

  // Extract unique categories
  const availableCategories = useMemo(() => {
    const cats = new Set();
    menuItems.forEach((item) => {
      if (item.category) cats.add(item.category);
    });
    return [
      { id: 'all', label: 'All Dishes', icon: '✨' },
      ...Array.from(cats).map((cat) => ({
        id: cat,
        label: cat,
        icon: CATEGORY_ICON_MAP[cat] || '🍽️'
      }))
    ];
  }, [menuItems]);

  // Filter Menu Items
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesVeg = !isVegOnly || item.isVeg;
      const conflicts = checkItemConflict(item);
      const matchesSafe = !isSafeOnly || !conflicts;

      return matchesSearch && matchesCategory && matchesVeg && matchesSafe;
    });
  }, [menuItems, searchQuery, selectedCategory, isVegOnly, isSafeOnly, activeChild]);

  const getItemQuantity = (itemId) => {
    const found = cart.find((i) => i.id === itemId);
    return found ? found.quantity : 0;
  };

  // Safe Add Interceptor
  const handleAddClick = (item) => {
    const conflicts = checkItemConflict(item);
    if (conflicts && getItemQuantity(item.id) === 0) {
      setPendingAllergyItem({ item, conflicts });
    } else {
      onAddToCart(item);
    }
  };

  return (
    <div>
      {/* 1. Category Carousel */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          overflowX: 'auto',
          paddingBottom: '0.65rem',
          marginBottom: '0.75rem',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {availableCategories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '0.45rem 0.9rem',
                borderRadius: 'var(--radius-full)',
                border: isSelected ? '1.5px solid var(--primary)' : '1px solid #e2e8f0',
                background: isSelected
                  ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)'
                  : '#ffffff',
                color: isSelected ? '#ffffff' : 'var(--text-main)',
                fontWeight: isSelected ? 900 : 700,
                fontSize: '0.76rem',
                cursor: 'pointer',
                flexShrink: 0,
                boxShadow: isSelected ? '0 4px 12px rgba(37,99,235,0.25)' : '0 1px 3px rgba(0,0,0,0.03)',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: isSelected ? 'translateY(-1px)' : 'none'
              }}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* 2. Quick Search & Dietary / Safe Filters */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '1rem',
          flexWrap: 'wrap'
        }}
      >
        {/* Search Input */}
        <div style={{ position: 'relative', flex: 1, minWidth: '160px' }}>
          <Search
            size={16}
            color="#64748b"
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            placeholder={`Search dishes for ${childName}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.55rem 0.75rem 0.55rem 36px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              fontSize: '0.82rem',
              fontWeight: 600,
              outline: 'none'
            }}
          />
        </div>

        {/* 100% Safe Filter for Child (If child has allergies) */}
        {childAllergies.length > 0 && (
          <button
            onClick={() => setIsSafeOnly(!isSafeOnly)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '0.45rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              border: isSafeOnly ? '1.5px solid #059669' : '1px solid #cbd5e1',
              background: isSafeOnly ? '#ecfdf5' : '#ffffff',
              color: isSafeOnly ? '#065f46' : 'var(--text-main)',
              fontWeight: 800,
              fontSize: '0.74rem',
              cursor: 'pointer',
              flexShrink: 0
            }}
          >
            <span>🛡️</span>
            <span>Safe for {childName}</span>
          </button>
        )}

        {/* Veg-Only Toggle Pill */}
        <button
          onClick={() => setIsVegOnly(!isVegOnly)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '0.45rem 0.75rem',
            borderRadius: 'var(--radius-full)',
            border: isVegOnly ? '1.5px solid #16a34a' : '1px solid #cbd5e1',
            background: isVegOnly ? '#ecfdf5' : '#ffffff',
            color: isVegOnly ? '#15803d' : 'var(--text-main)',
            fontWeight: 800,
            fontSize: '0.74rem',
            cursor: 'pointer',
            flexShrink: 0
          }}
        >
          <div
            style={{
              width: '13px',
              height: '13px',
              border: '1.5px solid #16a34a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '2px'
            }}
          >
            <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#16a34a' }} />
          </div>
          <span>VEG</span>
        </button>
      </div>

      {/* 3. Elevated Food Dish Cards */}
      {filteredItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3.5rem 1rem', background: '#ffffff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔍</div>
          <h4 style={{ fontSize: '1rem', fontWeight: 800 }}>No matching dishes found</h4>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Try resetting the search or category filters</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setIsVegOnly(false);
              setIsSafeOnly(false);
            }}
            style={{
              marginTop: '0.75rem',
              background: 'var(--primary-light)',
              color: 'var(--primary)',
              border: 'none',
              borderRadius: 'var(--radius-full)',
              padding: '0.45rem 1rem',
              fontSize: '0.78rem',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem' }}>
          {filteredItems.map((item) => {
            const qty = getItemQuantity(item.id);
            const foodImg = item.image || item.imageUrl || FALLBACK_IMAGES[item.category] || FALLBACK_IMAGES['Snacks & Rolls'];
            const rawAllergens = Array.isArray(item.allergens) ? item.allergens : (item.allergens ? [item.allergens] : []);
            const conflicts = checkItemConflict(item);

            return (
              <div
                key={item.id}
                style={{
                  background: '#ffffff',
                  borderRadius: 'var(--radius-lg)',
                  border: conflicts ? '1.5px solid #fecaca' : '1px solid rgba(226, 232, 240, 0.9)',
                  padding: '1rem',
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  boxShadow: 'var(--shadow-card)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
              >
                {/* Left: Info & Details (65% width) */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  {/* Veg / Non-Veg Indicator & Badges */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', flexWrap: 'wrap' }}>
                    <div
                      style={{
                        width: '14px',
                        height: '14px',
                        border: `1.5px solid ${item.isVeg ? '#16a34a' : '#dc2626'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '3px',
                        flexShrink: 0
                      }}
                    >
                      <div
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: item.isVeg ? '#16a34a' : '#dc2626'
                        }}
                      />
                    </div>

                    {item.calories && (
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#b45309', background: '#fef3c7', padding: '1px 6px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '2px' }}>
                        <Flame size={11} />
                        {item.calories} kcal
                      </span>
                    )}

                    <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700, background: '#f1f5f9', padding: '1px 6px', borderRadius: '4px' }}>
                      {item.category}
                    </span>
                  </div>

                  {/* Title & Price */}
                  <div style={{ fontSize: '0.98rem', fontWeight: 900, color: '#0f172a', lineHeight: 1.25, marginBottom: '3px' }}>
                    {item.name}
                  </div>

                  <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#1e293b', marginBottom: '5px' }}>
                    {currency} {item.price}
                  </div>

                  {/* Description */}
                  <p
                    style={{
                      fontSize: '0.76rem',
                      color: '#64748b',
                      lineHeight: 1.4,
                      margin: 0,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {item.description}
                  </p>

                  {/* Visual Allergen Micro-Chips Bar */}
                  <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
                    {rawAllergens.length > 0 ? (
                      rawAllergens.map((alg) => {
                        const key = alg.toLowerCase().trim();
                        const isChildSensitive = childAllergies.includes(key);
                        const info = ALLERGEN_MAP[key] || { label: alg, icon: '⚠️', bg: '#f8fafc', border: '#e2e8f0', text: '#64748b' };
                        return (
                          <span
                            key={alg}
                            style={{
                              fontSize: '0.68rem',
                              fontWeight: 800,
                              color: isChildSensitive ? '#b91c1c' : info.text,
                              background: isChildSensitive ? '#fef2f2' : info.bg,
                              border: `1px solid ${isChildSensitive ? '#fca5a5' : info.border}`,
                              padding: '2px 7px',
                              borderRadius: 'var(--radius-full)',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '3px'
                            }}
                            title={`Contains ${info.label}`}
                          >
                            <span style={{ fontSize: '0.75rem' }}>{info.icon}</span>
                            <span>{info.label}</span>
                            {isChildSensitive && <span style={{ fontSize: '0.65rem' }}>⚠️</span>}
                          </span>
                        );
                      })
                    ) : (
                      <span
                        style={{
                          fontSize: '0.66rem',
                          fontWeight: 800,
                          color: '#059669',
                          background: '#ecfdf5',
                          border: '1px solid #a7f3d0',
                          padding: '1px 6px',
                          borderRadius: 'var(--radius-full)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px'
                        }}
                      >
                        <span>🛡️</span>
                        <span>Nut & Allergen Safe</span>
                      </span>
                    )}

                    {conflicts && (
                      <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#dc2626', background: '#fee2e2', padding: '2px 6px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        ⚠️ Sensitivity for {childName}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right: Crisp Image + Floating Stepper */}
                <div style={{ position: 'relative', width: '105px', flexShrink: 0, textAlign: 'center' }}>
                  <div
                    style={{
                      width: '105px',
                      height: '105px',
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                      background: '#f1f5f9',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                      border: '1px solid #f1f5f9'
                    }}
                  >
                    <img
                      src={foodImg}
                      alt={item.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = FALLBACK_IMAGES[item.category] || FALLBACK_IMAGES['Snacks & Rolls'];
                      }}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>

                  {/* Overlapping Add / Stepper Button */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '-8px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '88px'
                    }}
                  >
                    {qty === 0 ? (
                      <button
                        onClick={() => handleAddClick(item)}
                        style={{
                          width: '100%',
                          background: '#ffffff',
                          color: conflicts ? '#dc2626' : '#16a34a',
                          border: `1.5px solid ${conflicts ? '#dc2626' : '#16a34a'}`,
                          borderRadius: 'var(--radius-full)',
                          padding: '4px 0',
                          fontWeight: 900,
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '3px',
                          boxShadow: 'var(--shadow-btn-green)',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <Plus size={14} />
                        <span>ADD</span>
                      </button>
                    ) : (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                          color: '#ffffff',
                          borderRadius: 'var(--radius-full)',
                          padding: '3px 8px',
                          fontWeight: 900,
                          fontSize: '0.82rem',
                          boxShadow: 'var(--shadow-btn-green)'
                        }}
                      >
                        <button
                          onClick={() => onRemoveFromCart(item.id)}
                          style={{ background: 'transparent', border: 'none', color: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '2px' }}
                        >
                          <Minus size={13} />
                        </button>
                        <span style={{ fontSize: '0.82rem', fontWeight: 900 }}>{qty}</span>
                        <button
                          onClick={() => onAddToCart(item)}
                          style={{ background: 'transparent', border: 'none', color: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '2px' }}
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Allergy Safety Confirmation Alert Modal */}
      {pendingAllergyItem && (
        <div className="modal-overlay" onClick={() => setPendingAllergyItem(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px', padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#fee2e2', color: '#dc2626', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.85rem' }}>
              <AlertTriangle size={26} />
            </div>

            <h3 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '0.35rem' }}>
              Allergy Safety Check for {childName}
            </h3>

            <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.45, marginBottom: '1.25rem' }}>
              <strong>{pendingAllergyItem.item.name}</strong> contains <strong>{pendingAllergyItem.conflicts.join(', ')}</strong>. You previously tagged {childName} with a sensitivity to these ingredients.
            </p>

            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <button
                onClick={() => setPendingAllergyItem(null)}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  onAddToCart(pendingAllergyItem.item);
                  setPendingAllergyItem(null);
                }}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  background: '#dc2626',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Add Anyway
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
