import React from 'react';
import { Check, Edit3, ShieldCheck, AlertTriangle } from 'lucide-react';

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
    <div style={{ marginBottom: '0.75rem' }}>
      {/* 1. Sleek Horizontal Sibling Row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          overflowX: 'auto',
          paddingBottom: '2px',
          scrollbarWidth: 'none'
        }}
      >
        {childrenList.map((child) => {
          const isSelected = activeChild && activeChild.id === child.id;
          const childCart = cartsByChild[child.id] || [];
          const itemsCount = childCart.reduce((sum, i) => sum + i.quantity, 0);
          const isGirl = child.studentName.toLowerCase().includes('ananya') || child.studentName.toLowerCase().includes('riya');
          const avatarEmoji = isGirl ? '👧' : '👦';
          const cleanClass = child.class.replace(/Grade\s*/i, '').trim();

          return (
            <div
              key={child.id}
              onClick={() => onSelectChild(child)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px 4px 6px',
                borderRadius: 'var(--radius-full)',
                background: isSelected ? '#ffffff' : 'rgba(255,255,255,0.7)',
                border: isSelected ? '1.5px solid var(--primary)' : '1px solid #e2e8f0',
                boxShadow: isSelected ? '0 2px 8px rgba(37,99,235,0.12)' : 'none',
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'all 0.15s ease'
              }}
            >
              <div
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: isSelected ? 'var(--primary-light)' : '#f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.9rem'
                }}
              >
                {avatarEmoji}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: isSelected ? 900 : 700,
                    color: isSelected ? 'var(--primary)' : 'var(--text-main)'
                  }}
                >
                  {child.studentName.split(' ')[0]}
                </span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  ({cleanClass}-{child.section})
                </span>

                {itemsCount > 0 && (
                  <span
                    style={{
                      background: '#10b981',
                      color: 'white',
                      padding: '1px 5px',
                      borderRadius: '8px',
                      fontSize: '0.62rem',
                      fontWeight: 900
                    }}
                  >
                    {itemsCount}
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {/* Slim Allergy Tag (Inline next to avatars) */}
        {activeChild && (
          <button
            onClick={onOpenHealthModal}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 8px',
              borderRadius: 'var(--radius-full)',
              background: allergies.length > 0 ? '#fffbeb' : '#f0fdf4',
              border: `1px solid ${allergies.length > 0 ? '#fde68a' : '#bbf7d0'}`,
              color: allergies.length > 0 ? '#92400e' : '#166534',
              fontSize: '0.7rem',
              fontWeight: 800,
              cursor: 'pointer',
              flexShrink: 0
            }}
          >
            <span>{allergies.length > 0 ? '⚠️' : '🛡️'}</span>
            <span style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {allergies.length > 0 ? allergies.join(', ') : 'Allergen Safe'}
            </span>
            <Edit3 size={10} style={{ opacity: 0.7 }} />
          </button>
        )}
      </div>
    </div>
  );
}
