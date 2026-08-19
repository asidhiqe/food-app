import React, { useState, useMemo } from 'react';
import { Search, Plus, Minus, Flame, Filter, Leaf, AlertTriangle, Check, X, Sparkles } from 'lucide-react';

const CATEGORY_TILE_STYLES = {
  'all': { icon: '✨', label: 'All', bg: '#f1f5f9', activeBg: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', text: '#0f172a', activeText: '#ffffff' },
  'Snacks & Rolls': { icon: '🌯', label: 'Rolls & Wraps', bg: '#fff7ed', activeBg: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)', text: '#9a3412', activeText: '#ffffff' },
  'Lunch Thali': { icon: '🍱', label: 'Lunch Meals', bg: '#f0fdf4', activeBg: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)', text: '#166534', activeText: '#ffffff' },
  'Lunch Meals': { icon: '🍱', label: 'Lunch Meals', bg: '#f0fdf4', activeBg: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)', text: '#166534', activeText: '#ffffff' },
  'Sandwiches & Burgers': { icon: '🥪', label: 'Sandwiches', bg: '#fff1f2', activeBg: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)', text: '#9f1239', activeText: '#ffffff' },
  'Pasta & Noodles': { icon: '🍝', label: 'Pasta & Noodles', bg: '#faf5ff', activeBg: 'linear-gradient(135deg, #9333ea 0%, #7e22ce 100%)', text: '#6b21a8', activeText: '#ffffff' },
  'Healthy & Salads': { icon: '🥗', label: 'Fresh Salads', bg: '#ecfdf5', activeBg: 'linear-gradient(135deg, #059669 0%, #047857 100%)', text: '#065f46', activeText: '#ffffff' },
  'Beverages & Juices': { icon: '🧃', label: 'Juices & Milk', bg: '#eff6ff', activeBg: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', text: '#1e40af', activeText: '#ffffff' },
  'Bakery & Sweets': { icon: '🧁', label: 'Bakery', bg: '#fdf2f8', activeBg: 'linear-gradient(135deg, #db2777 0%, #be185d 100%)', text: '#9d174d', activeText: '#ffffff' }
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

  const childName = activeChild ? activeChild.studentName.split(' ')[0] : 'Child';
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
      'all',
      ...Array.from(cats)
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
      {/* 1. Appetizing Category Carousel (Visual Food Storytelling) */}
      <div style={{ marginBottom: '0.85rem' }}>
        <div
          style={{
            display: 'flex',
            gap: '0.55rem',
            overflowX: 'auto',
            paddingBottom: '4px',
            scrollbarWidth: 'none'
          }}
        >
          {availableCategories.map((catKey) => {
            const isSelected = selectedCategory === catKey;
            const style = CATEGORY_TILE_STYLES[catKey] || {
              icon: '🍽️',
              label: catKey,
              bg: '#f8fafc',
              activeBg: 'var(--primary)',
              text: 'var(--text-main)',
              activeText: '#ffffff'
            };

            return (
              <div
                key={catKey}
                onClick={() => setSelectedCategory(catKey)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '12px',
                  background: isSelected ? style.activeBg : style.bg,
                  color: isSelected ? style.activeText : style.text,
                  boxShadow: isSelected ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'all 0.15s ease',
                  transform: isSelected ? 'scale(1.02)' : 'none'
                }}
              >
                <span style={{ fontSize: '1.1rem' }}>{style.icon}</span>
                <span style={{ fontSize: '0.78rem', fontWeight: 800 }}>{style.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Quick Search & Dietary / Safe Filters */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem',
          marginBottom: '0.85rem'
        }}
      >
        {/* Search Input */}
        <div style={{ position: 'relative', flex: 1 }}>
          <Search
            size={14}
            color="#94a3b8"
            style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            placeholder={`Search dishes for ${childName}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem 0.6rem 0.5rem 30px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              fontSize: '0.78rem',
              fontWeight: 600,
              outline: 'none'
            }}
          />
        </div>

        {/* Safe Filter */}
        {childAllergies.length > 0 && (
          <button
            onClick={() => setIsSafeOnly(!isSafeOnly)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
              padding: '0.45rem 0.65rem',
              borderRadius: 'var(--radius-md)',
              border: isSafeOnly ? '1.5px solid #059669' : '1px solid #cbd5e1',
              background: isSafeOnly ? '#ecfdf5' : '#ffffff',
              color: isSafeOnly ? '#065f46' : 'var(--text-main)',
              fontWeight: 800,
              fontSize: '0.72rem',
              cursor: 'pointer',
              flexShrink: 0
            }}
          >
            <span>🛡️</span>
            <span>Safe Only</span>
          </button>
        )}

        {/* Veg-Only Filter */}
        <button
          onClick={() => setIsVegOnly(!isVegOnly)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '0.45rem 0.65rem',
            borderRadius: 'var(--radius-md)',
            border: isVegOnly ? '1.5px solid #16a34a' : '1px solid #cbd5e1',
            background: isVegOnly ? '#ecfdf5' : '#ffffff',
            color: isVegOnly ? '#15803d' : 'var(--text-main)',
            fontWeight: 800,
            fontSize: '0.72rem',
            cursor: 'pointer',
            flexShrink: 0
          }}
        >
          <div
            style={{
              width: '10px',
              height: '10px',
              border: '1.5px solid #16a34a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '2px'
            }}
          >
            <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#16a34a' }} />
          </div>
          <span>VEG</span>
        </button>
      </div>

      {/* 3. Appetizing Food Dish Cards */}
      {filteredItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', background: '#ffffff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>🔍</div>
          <h4 style={{ fontSize: '0.92rem', fontWeight: 800 }}>No matching dishes found</h4>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Try resetting the search or category filters</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingBottom: '5rem' }}>
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
                  padding: '0.85rem',
                  display: 'flex',
                  gap: '0.85rem',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
                }}
              >
                {/* Left: Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '2px' }}>
                    <div
                      style={{
                        width: '12px',
                        height: '12px',
                        border: `1.5px solid ${item.isVeg ? '#16a34a' : '#dc2626'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '2px',
                        flexShrink: 0
                      }}
                    >
                      <div
                        style={{
                          width: '4px',
                          height: '4px',
                          borderRadius: '50%',
                          background: item.isVeg ? '#16a34a' : '#dc2626'
                        }}
                      />
                    </div>

                    <span style={{ fontSize: '0.66rem', color: '#64748b', fontWeight: 700 }}>
                      {item.category}
                    </span>
                  </div>

                  {/* Title & Price */}
                  <div style={{ fontSize: '0.92rem', fontWeight: 900, color: '#0f172a', lineHeight: 1.25 }}>
                    {item.name}
                  </div>

                  <div style={{ fontSize: '0.88rem', fontWeight: 900, color: '#1e293b', marginTop: '1px' }}>
                    {currency} {item.price}
                  </div>

                  {/* Short Description */}
                  <p
                    style={{
                      fontSize: '0.72rem',
                      color: '#64748b',
                      lineHeight: 1.35,
                      margin: '2px 0 4px 0',
                      display: '-webkit-box',
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {item.description}
                  </p>

                  {/* Clean Allergen Micro-Chips */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '3px', flexWrap: 'wrap' }}>
                    {rawAllergens.length > 0 ? (
                      rawAllergens.map((alg) => {
                        const key = alg.toLowerCase().trim();
                        const isConflict = childAllergies.includes(key);
                        const info = ALLERGEN_MAP[key] || { label: alg, icon: '⚠️', bg: '#f8fafc', border: '#e2e8f0', text: '#64748b' };
                        return (
                          <span
                            key={alg}
                            style={{
                              fontSize: '0.64rem',
                              fontWeight: 800,
                              color: isConflict ? '#b91c1c' : info.text,
                              background: isConflict ? '#fef2f2' : info.bg,
                              border: `1px solid ${isConflict ? '#fca5a5' : info.border}`,
                              padding: '1px 5px',
                              borderRadius: 'var(--radius-full)',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '2px'
                            }}
                          >
                            <span>{info.icon}</span>
                            <span>{info.label}</span>
                            {isConflict && <span>⚠️</span>}
                          </span>
                        );
                      })
                    ) : (
                      <span
                        style={{
                          fontSize: '0.62rem',
                          fontWeight: 800,
                          color: '#059669',
                          background: '#ecfdf5',
                          border: '1px solid #a7f3d0',
                          padding: '1px 5px',
                          borderRadius: 'var(--radius-full)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '2px'
                        }}
                      >
                        <span>🛡️</span>
                        <span>Safe</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Right: Image + Stepper Button */}
                <div style={{ position: 'relative', width: '92px', flexShrink: 0, textAlign: 'center' }}>
                  <div
                    style={{
                      width: '92px',
                      height: '92px',
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                      background: '#f1f5f9',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
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
                      bottom: '-7px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '80px'
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
                          padding: '3px 0',
                          fontWeight: 900,
                          fontSize: '0.78rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '2px',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                        }}
                      >
                        <Plus size={13} />
                        <span>ADD</span>
                      </button>
                    ) : (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          background: '#16a34a',
                          color: '#ffffff',
                          borderRadius: 'var(--radius-full)',
                          padding: '3px 6px',
                          fontWeight: 900,
                          fontSize: '0.78rem',
                          boxShadow: '0 2px 6px rgba(22,163,74,0.3)'
                        }}
                      >
                        <button
                          onClick={() => onRemoveFromCart(item.id)}
                          style={{ background: 'transparent', border: 'none', color: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '1px' }}
                        >
                          <Minus size={12} />
                        </button>
                        <span style={{ fontSize: '0.78rem', fontWeight: 900 }}>{qty}</span>
                        <button
                          onClick={() => onAddToCart(item)}
                          style={{ background: 'transparent', border: 'none', color: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '1px' }}
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* 4. Charming End-of-Menu Illustration & School Kitchen Promise Card */}
          <div
            style={{
              textAlign: 'center',
              padding: '2rem 1.25rem 1.5rem',
              marginTop: '0.5rem',
              background: 'linear-gradient(180deg, #f8fafc 0%, #eff6ff 100%)',
              borderRadius: 'var(--radius-xl)',
              border: '1px dashed #cbd5e1'
            }}
          >
            {/* Visual Icon Art */}
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                boxShadow: '0 4px 12px rgba(37,99,235,0.15)',
                marginBottom: '0.75rem'
              }}
            >
              🥗
            </div>

            <h4 style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
              You've reached the end of today's menu!
            </h4>

            <p style={{ fontSize: '0.76rem', color: '#64748b', lineHeight: 1.45, maxWidth: '280px', margin: '0 auto 1.15rem' }}>
              All meals are prepared fresh every morning in our ISO-certified school kitchen with 100% nut & allergen safety checks.
            </p>

            {/* Quality Badges */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.45rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#15803d', background: '#dcfce7', padding: '3px 8px', borderRadius: 'var(--radius-full)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                <span>🌱</span>
                <span>Farm Fresh Veggies</span>
              </span>
              <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#1e40af', background: '#dbeafe', padding: '3px 8px', borderRadius: 'var(--radius-full)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                <span>🧼</span>
                <span>FSSAI Hygiene Grade A</span>
              </span>
              <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#9a3412', background: '#ffedd5', padding: '3px 8px', borderRadius: 'var(--radius-full)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                <span>❤️</span>
                <span>Cooked with Love</span>
              </span>
            </div>

            {/* Back to top helper button */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: 'var(--radius-full)',
                padding: '5px 14px',
                fontSize: '0.74rem',
                fontWeight: 800,
                color: 'var(--text-main)',
                cursor: 'pointer',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}
            >
              ↑ Back to Top
            </button>
          </div>
        </div>
      )}

      {/* Allergy Safety Confirmation Alert Modal */}
      {pendingAllergyItem && (
        <div className="modal-overlay" onClick={() => setPendingAllergyItem(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '380px', padding: '1.25rem', textAlign: 'center' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#fee2e2', color: '#dc2626', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.65rem' }}>
              <AlertTriangle size={24} />
            </div>

            <h3 style={{ fontSize: '1rem', fontWeight: 900, marginBottom: '0.3rem' }}>
              Allergy Check for {childName}
            </h3>

            <p style={{ fontSize: '0.78rem', color: '#475569', lineHeight: 1.4, marginBottom: '1rem' }}>
              <strong>{pendingAllergyItem.item.name}</strong> contains <strong>{pendingAllergyItem.conflicts.join(', ')}</strong>. You tagged {childName} with this allergy.
            </p>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => setPendingAllergyItem(null)}
                style={{ flex: 1, padding: '0.65rem', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1', background: '#ffffff', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  onAddToCart(pendingAllergyItem.item);
                  setPendingAllergyItem(null);
                }}
                style={{ flex: 1, padding: '0.65rem', borderRadius: 'var(--radius-md)', border: 'none', background: '#dc2626', color: '#ffffff', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}
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
