import React, { useState, useEffect } from 'react';
import { ShoppingBag, Clock, Users, ArrowUp, ChevronUp, ChevronDown, Sparkles, CheckCircle2 } from 'lucide-react';

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
  const [isOpen, setIsOpen] = useState(false);
  const [hasAddedAnim, setHasAddedAnim] = useState(false);

  // Trigger bounce animation whenever cartCount increases
  useEffect(() => {
    if (cartCount > 0) {
      setHasAddedAnim(true);
      const timer = setTimeout(() => setHasAddedAnim(false), 600);
      return () => clearTimeout(timer);
    }
  }, [cartCount]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsOpen(false);
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '20px',
        zIndex: 990,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '10px'
      }}
    >
      {/* Expanded Quick-Dial Menu Items */}
      {isOpen && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '8px',
            marginBottom: '4px',
            animation: 'slideUpFade 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {/* Sibling Quick Switch Orbs (If multi-child) */}
          {childrenList && childrenList.length > 1 && (
            <div
              style={{
                background: '#ffffff',
                padding: '6px 10px',
                borderRadius: 'var(--radius-xl)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Switch:
              </span>
              {childrenList.map((kid) => {
                const isSelected = activeChild && activeChild.id === kid.id;
                const kidCount = (cartsByChild[kid.id] || []).reduce((s, i) => s + i.quantity, 0);
                return (
                  <button
                    key={kid.id}
                    onClick={() => {
                      onSelectChild(kid);
                      setIsOpen(false);
                    }}
                    style={{
                      background: isSelected ? 'var(--primary)' : '#f1f5f9',
                      color: isSelected ? '#ffffff' : 'var(--text-main)',
                      border: 'none',
                      borderRadius: 'var(--radius-full)',
                      padding: '4px 8px',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span>{kid.studentName.split(' ')[0]}</span>
                    {kidCount > 0 && (
                      <span style={{ background: isSelected ? '#ffffff' : 'var(--primary)', color: isSelected ? 'var(--primary)' : '#ffffff', borderRadius: '50%', width: '15px', height: '15px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.62rem', fontWeight: 900 }}>
                        {kidCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Quick Orders Button */}
          <button
            onClick={() => {
              onViewOrders();
              setIsOpen(false);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: 'var(--radius-full)',
              padding: '8px 14px',
              color: 'var(--text-main)',
              fontSize: '0.82rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
              transition: 'transform 0.15s ease'
            }}
          >
            <Clock size={16} color="var(--primary)" />
            <span>Live Orders</span>
            {activeOrderCount > 0 && (
              <span style={{ background: '#10b981', color: '#ffffff', fontSize: '0.65rem', fontWeight: 900, padding: '1px 6px', borderRadius: '10px' }}>
                {activeOrderCount} Active
              </span>
            )}
          </button>

          {/* Scroll to Top */}
          <button
            onClick={scrollToTop}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: 'var(--radius-full)',
              padding: '6px 12px',
              color: 'var(--text-muted)',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
            }}
          >
            <ArrowUp size={14} />
            <span>Top</span>
          </button>
        </div>
      )}

      {/* Main Multi-Function Floatable Action Button (FAB) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Quick Tray Pill Trigger (If items in tray) */}
        {cartCount > 0 && (
          <button
            onClick={onOpenCart}
            className={hasAddedAnim ? 'fab-bounce-pulse' : ''}
            style={{
              background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: 'var(--radius-full)',
              padding: '0.7rem 1.15rem',
              fontSize: '0.86rem',
              fontWeight: 900,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 8px 24px rgba(22, 163, 74, 0.4), 0 2px 6px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
          >
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <ShoppingBag size={18} />
              <span
                style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  background: '#ffffff',
                  color: '#15803d',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.68rem',
                  fontWeight: 900,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}
              >
                {cartCount}
              </span>
            </div>
            <span>Tray ({currency} {cartTotal})</span>
            <span style={{ fontSize: '0.75rem', opacity: 0.9 }}>➔</span>
          </button>
        )}

        {/* Floating Quick-Dial Toggle Circle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            background: isOpen ? '#0f172a' : 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            color: '#ffffff',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 6px 20px rgba(37,99,235,0.35), 0 2px 6px rgba(0,0,0,0.1)',
            cursor: 'pointer',
            transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
            transform: isOpen ? 'rotate(180deg)' : 'none'
          }}
          title="Quick Actions"
        >
          {isOpen ? <ChevronDown size={22} /> : <Sparkles size={20} />}
        </button>
      </div>
    </div>
  );
}
