import React from 'react';
import { Check, Edit3, ShieldAlert, Sparkles, Heart } from 'lucide-react';

const CHILD_THEMES = {
  boy: {
    activeBg: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
    activeBorder: '#3b82f6',
    activeText: '#1d4ed8',
    avatarBg: '#dbeafe',
    glow: '0 4px 14px rgba(37,99,235,0.18)'
  },
  girl: {
    activeBg: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)',
    activeBorder: '#ec4899',
    activeText: '#be185d',
    avatarBg: '#fce7f3',
    glow: '0 4px 14px rgba(236,72,153,0.18)'
  }
};

export default function ChildAvatarBar({
  childrenList,
  activeChild,
  onSelectChild,
  cartsByChild,
  currency,
  onOpenHealthModal
}) {
  if (!childrenList || childrenList.length === 0) return null;

  return (
    <div style={{ marginBottom: '1rem' }}>
      {/* Visual Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem', padding: '0 2px' }}>
        <span style={{ fontSize: '0.72rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Select Child to Pack Lunch
        </span>
        <span style={{ fontSize: '0.68rem', color: 'var(--primary)', fontWeight: 800 }}>
          {childrenList.length} Linked Students
        </span>
      </div>

      {/* Interactive Child Identity Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: childrenList.length === 1 ? '1fr' : `repeat(${childrenList.length}, 1fr)`,
          gap: '0.6rem'
        }}
      >
        {childrenList.map((child) => {
          const isSelected = activeChild && activeChild.id === child.id;
          const childCart = cartsByChild[child.id] || [];
          const itemsCount = childCart.reduce((sum, i) => sum + i.quantity, 0);
          const totalAmount = childCart.reduce((sum, i) => sum + i.price * i.quantity, 0);

          const isGirl = child.studentName.toLowerCase().includes('ananya') || child.studentName.toLowerCase().includes('riya');
          const theme = isGirl ? CHILD_THEMES.girl : CHILD_THEMES.boy;
          const avatarEmoji = isGirl ? '👧' : '👦';
          const cleanClass = child.class.replace(/Grade\s*/i, '').trim();
          const allergies = child.allergies || [];

          return (
            <div
              key={child.id}
              onClick={() => onSelectChild(child)}
              style={{
                position: 'relative',
                borderRadius: 'var(--radius-lg)',
                padding: '0.75rem 0.85rem',
                background: isSelected ? theme.activeBg : '#ffffff',
                border: isSelected ? `2px solid ${theme.activeBorder}` : '1.5px solid #e2e8f0',
                boxShadow: isSelected ? theme.glow : '0 1px 3px rgba(0,0,0,0.03)',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: isSelected ? 'translateY(-1px)' : 'none'
              }}
            >
              {/* Active Selection Pin */}
              {isSelected && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '10px',
                    background: theme.activeBorder,
                    color: '#ffffff',
                    padding: '1px 6px',
                    borderRadius: '8px',
                    fontSize: '0.6rem',
                    fontWeight: 900,
                    boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px'
                  }}
                >
                  <Check size={9} strokeWidth={3.5} />
                  <span>ACTIVE</span>
                </div>
              )}

              {/* Row 1: Avatar + Name + Class */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.45rem' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '12px',
                    background: isSelected ? '#ffffff' : theme.avatarBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.25rem',
                    boxShadow: isSelected ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
                    flexShrink: 0
                  }}
                >
                  {avatarEmoji}
                </div>

                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 900, color: 'var(--text-main)', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {child.studentName.split(' ')[0]}
                  </div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: isSelected ? theme.activeText : 'var(--text-muted)' }}>
                    Grade {cleanClass}-{child.section}
                  </div>
                </div>
              </div>

              {/* Row 2: Tray Box Status or Safety Tag */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.35rem', borderTop: isSelected ? '1px dashed rgba(59,130,246,0.3)' : '1px dashed #f1f5f9' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: itemsCount > 0 ? '#15803d' : 'var(--text-muted)' }}>
                  {itemsCount > 0 ? `🍱 ${itemsCount} items (${currency}${totalAmount})` : 'Tray Empty'}
                </div>

                {allergies.length > 0 ? (
                  <span
                    onClick={(e) => { e.stopPropagation(); onOpenHealthModal(); }}
                    style={{
                      fontSize: '0.62rem',
                      fontWeight: 800,
                      color: '#b45309',
                      background: '#fef3c7',
                      border: '1px solid #fde68a',
                      padding: '1px 5px',
                      borderRadius: '4px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '2px'
                    }}
                    title="Click to edit child allergies"
                  >
                    <span>⚠️</span>
                    <span>{allergies.join(',')}</span>
                  </span>
                ) : (
                  <span style={{ fontSize: '0.62rem', fontWeight: 800, color: '#15803d', background: '#dcfce7', padding: '1px 5px', borderRadius: '4px' }}>
                    🛡️ Safe
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
