import React from 'react';
import { ShoppingBag, ArrowRight, Sparkles, Users } from 'lucide-react';

export default function FloatingActionHub({
  cartCount,
  cartTotal,
  currency,
  activeOrderCount,
  onOpenCart,
  onViewOrders,
  activeChild,
  childrenList,
  onSelectChild,
  cartsByChild
}) {
  if (cartCount === 0) return null;

  const activeName = activeChild ? activeChild.studentName.split(' ')[0] : 'Child';

  const kidsWithItems = (childrenList || []).filter((kid) => {
    const kidCart = (cartsByChild && cartsByChild[kid.id]) || [];
    return kidCart.length > 0;
  });

  const hasMultipleKids = kidsWithItems.length > 1;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '16px',
        left: '16px',
        right: '16px',
        maxWidth: '460px',
        margin: '0 auto',
        zIndex: 90,
        animation: 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      <div
        onClick={onOpenCart}
        style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          color: '#ffffff',
          borderRadius: 'var(--radius-full)',
          padding: '0.75rem 1.15rem',
          boxShadow: '0 8px 24px rgba(15,23,42,0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          border: '1px solid rgba(255,255,255,0.12)'
        }}
      >
        {/* Left: Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: hasMultipleKids ? '#16a34a' : 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}
          >
            {hasMultipleKids ? <Users size={18} /> : <ShoppingBag size={18} />}
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 900, lineHeight: 1.2 }}>
              {cartCount} item{cartCount > 1 ? 's' : ''} • {currency} {cartTotal}
            </div>
            <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
              {hasMultipleKids
                ? `Ready for ${kidsWithItems.length} kids (${kidsWithItems.map(k => k.studentName.split(' ')[0]).join(', ')})`
                : `Packing for ${activeName}`}
            </div>
          </div>
        </div>

        {/* Right: Action */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: hasMultipleKids ? '#16a34a' : 'var(--primary)',
            color: '#ffffff',
            padding: '6px 14px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.78rem',
            fontWeight: 800
          }}
        >
          <span>{hasMultipleKids ? 'Pay All →' : 'View Tray →'}</span>
        </div>
      </div>
    </div>
  );
}
