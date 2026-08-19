import React from 'react';
import { ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';

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

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '16px',
        left: '16px',
        right: '16px',
        maxWidth: '448px',
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1rem'
            }}
          >
            🍱
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 900, lineHeight: 1.2 }}>
              {cartCount} item{cartCount > 1 ? 's' : ''} added • {currency} {cartTotal}
            </div>
            <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
              Packing for {activeName}
            </div>
          </div>
        </div>

        {/* Right: Action */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'var(--primary)',
            color: '#ffffff',
            padding: '5px 12px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.78rem',
            fontWeight: 800
          }}
        >
          <span>View Tray</span>
          <ArrowRight size={14} />
        </div>
      </div>
    </div>
  );
}
