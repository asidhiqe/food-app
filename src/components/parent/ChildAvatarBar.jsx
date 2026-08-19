import React from 'react';
import { Sparkles, Plus, Check, ShieldCheck, Heart, Edit3 } from 'lucide-react';

const AVATAR_THEMES = [
  { bg: '#eff6ff', border: '#3b82f6', activeBg: '#2563eb', text: '#1d4ed8', emoji: '👦', gradient: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)' },
  { bg: '#fdf2f8', border: '#ec4899', activeBg: '#db2777', text: '#be185d', emoji: '👧', gradient: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)' },
  { bg: '#fefce8', border: '#eab308', activeBg: '#ca8a04', text: '#a16207', emoji: '🧒', gradient: 'linear-gradient(135deg, #fef08a 0%, #fde047 100%)' }
];

export default function ChildAvatarBar({
  childrenList,
  activeChild,
  onSelectChild,
  cartsByChild,
  currency,
  onOpenHealthModal
}) {
  if (!childrenList || childrenList.length === 0) return null;

  const activeName = activeChild ? activeChild.studentName.split(' ')[0] : 'Child';
  const allergies = activeChild?.allergies || [];

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        borderRadius: 'var(--radius-lg)',
        padding: '0.8rem 0.95rem',
        marginBottom: '0.85rem',
        border: '1px solid #e2e8f0',
        boxShadow: 'var(--shadow-card)'
      }}
    >
      {/* Header Info */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 900, color: 'var(--text-main)' }}>
            🍱 Packing Lunch for:
          </span>
          <span style={{ fontSize: '0.65rem', color: '#2563eb', fontWeight: 800, background: '#eff6ff', border: '1px solid #bfdbfe', padding: '1px 7px', borderRadius: 'var(--radius-full)' }}>
            {childrenList.length} Kids
          </span>
        </div>

        {activeChild && (
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>
            {activeName}'s Box: <strong style={{ color: 'var(--primary)', fontWeight: 900 }}>
              {currency} {((cartsByChild[activeChild.id] || []).reduce((s, i) => s + i.price * i.quantity, 0))}
            </strong>
          </div>
        )}
      </div>

      {/* Avatars Row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          overflowX: 'auto',
          paddingBottom: '6px',
          paddingTop: '2px',
          scrollbarWidth: 'none'
        }}
      >
        {childrenList.map((child, index) => {
          const isSelected = activeChild && activeChild.id === child.id;
          const childCart = cartsByChild[child.id] || [];
          const itemsCount = childCart.reduce((sum, i) => sum + i.quantity, 0);
          const theme = AVATAR_THEMES[index % AVATAR_THEMES.length];
          const isGirl = child.studentName.toLowerCase().includes('ananya') || child.studentName.toLowerCase().includes('priya');
          const avatarEmoji = isGirl ? '👧' : '👦';
          const cleanClass = child.class.replace(/Grade\s*/i, '').trim();

          return (
            <div
              key={child.id}
              onClick={() => onSelectChild(child)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '5px 12px 5px 6px',
                borderRadius: 'var(--radius-full)',
                background: isSelected ? '#ffffff' : '#f8fafc',
                border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                boxShadow: isSelected ? '0 4px 14px rgba(37,99,235,0.18)' : '0 1px 3px rgba(0,0,0,0.03)',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: isSelected ? 'translateY(-1px)' : 'none',
                flexShrink: 0
              }}
            >
              {/* Circular Avatar Badge with Ring */}
              <div style={{ position: 'relative' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: theme.gradient,
                    border: isSelected ? `2px solid #2563eb` : `1px solid ${theme.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.25rem',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.06)'
                  }}
                >
                  {avatarEmoji}
                </div>

                {isSelected && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '-2px',
                      right: '-2px',
                      background: '#2563eb',
                      color: '#ffffff',
                      borderRadius: '50%',
                      width: '15px',
                      height: '15px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px solid #ffffff',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                    }}
                  >
                    <Check size={9} strokeWidth={3.5} />
                  </div>
                )}
              </div>

              {/* Child Meta */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: isSelected ? 900 : 700,
                      color: isSelected ? '#1e293b' : 'var(--text-main)',
                      lineHeight: 1.2
                    }}
                  >
                    {child.studentName.split(' ')[0]}
                  </span>

                  {itemsCount > 0 && (
                    <span
                      style={{
                        background: '#10b981',
                        color: 'white',
                        padding: '1px 6px',
                        borderRadius: '8px',
                        fontSize: '0.62rem',
                        fontWeight: 900,
                        boxShadow: '0 1px 4px rgba(16,185,129,0.3)'
                      }}
                    >
                      {itemsCount}
                    </span>
                  )}
                </div>

                <div style={{ fontSize: '0.68rem', color: isSelected ? '#2563eb' : 'var(--text-muted)', fontWeight: 700 }}>
                  Grade {cleanClass}-{child.section}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Child's Health & Allergy Safety Strip */}
      {activeChild && (
        <div
          onClick={onOpenHealthModal}
          style={{
            marginTop: '0.6rem',
            padding: '0.45rem 0.75rem',
            borderRadius: 'var(--radius-md)',
            background: allergies.length > 0 ? '#fffbeb' : '#f0fdf4',
            border: `1px solid ${allergies.length > 0 ? '#fde68a' : '#bbf7d0'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden' }}>
            <span style={{ fontSize: '0.85rem' }}>{allergies.length > 0 ? '⚠️' : '🛡️'}</span>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: allergies.length > 0 ? '#92400e' : '#166534', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {allergies.length > 0 ? (
                <span>{activeName}'s Allergies: <strong>{allergies.join(', ')}</strong></span>
              ) : (
                <span>{activeName} has no known food allergies (Safe)</span>
              )}
            </div>
          </div>

          <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '2px', flexShrink: 0 }}>
            <span>Edit</span>
            <Edit3 size={11} />
          </span>
        </div>
      )}
    </div>
  );
}
