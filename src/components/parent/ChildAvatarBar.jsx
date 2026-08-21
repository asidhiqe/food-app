import React from 'react';
import { User, ShieldCheck, AlertTriangle, Leaf, Edit3, ShoppingBag, Check } from 'lucide-react';

const CHILD_THEMES = {
  boy: {
    borderColor: '#2563eb',
    glow: '0 4px 14px rgba(37, 99, 235, 0.25)',
    activeTagBg: '#eff6ff',
    activeTagText: '#1d4ed8',
    cardBg: '#ffffff',
    border: '#bfdbfe'
  },
  girl: {
    borderColor: '#db2777',
    glow: '0 4px 14px rgba(219, 39, 119, 0.25)',
    activeTagBg: '#fdf2f8',
    activeTagText: '#be185d',
    cardBg: '#ffffff',
    border: '#fbcfe8'
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

  const currentChild = activeChild || childrenList[0];
  const isGirlCurrent = currentChild.gender === 'girl' ||
    currentChild.studentName.toLowerCase().includes('ananya') ||
    currentChild.studentName.toLowerCase().includes('riya') ||
    currentChild.studentName.toLowerCase().includes('meera');
  const currentTheme = isGirlCurrent ? CHILD_THEMES.girl : CHILD_THEMES.boy;
  const currentClass = String(currentChild.class || '4').replace(/Grade\s*/i, '').trim();
  const currentAllergies = currentChild.allergies || [];
  const currentCart = (cartsByChild && cartsByChild[currentChild.id]) || [];
  const currentItemsCount = currentCart.reduce((sum, i) => sum + i.quantity, 0);
  const currentTotalAmount = currentCart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <div style={{ marginBottom: '0.9rem' }}>
      {/* 1. Horizontal Real-Photo Profile Avatar Bubbles (Clean single border + soft glow) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.15rem',
          overflowX: 'auto',
          padding: '8px 6px 6px 6px',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {childrenList.map((child) => {
          const isSelected = currentChild && currentChild.id === child.id;
          const childCart = (cartsByChild && cartsByChild[child.id]) || [];
          const itemsCount = childCart.reduce((sum, i) => sum + i.quantity, 0);
          const isGirl = child.gender === 'girl' ||
            child.studentName.toLowerCase().includes('ananya') ||
            child.studentName.toLowerCase().includes('riya') ||
            child.studentName.toLowerCase().includes('meera');
          const theme = isGirl ? CHILD_THEMES.girl : CHILD_THEMES.boy;
          const firstName = child.studentName.split(' ')[0];

          // Determine avatar photo path
          let photoSrc = child.photo;
          if (!photoSrc) {
            const lower = firstName.toLowerCase();
            if (lower.includes('aarav')) photoSrc = './my-kids/aarav.jpg';
            else if (lower.includes('ananya')) photoSrc = './my-kids/ananya.jpg';
            else if (lower.includes('kabir')) photoSrc = './my-kids/kabir.jpg';
            else photoSrc = null;
          }

          return (
            <button
              key={child.id}
              onClick={() => onSelectChild(child)}
              style={{
                background: 'transparent',
                border: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                flexShrink: 0,
                outline: 'none',
                transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}
            >
              {/* Avatar Circle Container: Single Clean Border + Soft Glow */}
              <div style={{ position: 'relative', marginBottom: '5px' }}>
                <div
                  style={{
                    width: isSelected ? '52px' : '46px',
                    height: isSelected ? '52px' : '46px',
                    borderRadius: '50%',
                    boxShadow: isSelected ? theme.glow : '0 1px 3px rgba(0,0,0,0.06)',
                    border: isSelected ? `2.5px solid ${theme.borderColor}` : '1.5px solid #cbd5e1',
                    overflow: 'hidden',
                    background: '#f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                    transform: isSelected ? 'scale(1.04)' : 'scale(1)'
                  }}
                >
                  {photoSrc ? (
                    <img
                      src={photoSrc}
                      alt={child.studentName}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <User size={22} color={isSelected ? theme.borderColor : '#64748b'} />
                  )}
                </div>

                {/* Tray Active Items Counter Badge */}
                {itemsCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-3px',
                      right: '-3px',
                      background: '#16a34a',
                      color: '#ffffff',
                      fontSize: '0.65rem',
                      fontWeight: 900,
                      padding: '1px 5px',
                      borderRadius: '10px',
                      border: '2px solid #ffffff',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                    }}
                  >
                    {itemsCount}
                  </span>
                )}
              </div>

              {/* First Name */}
              <span
                style={{
                  fontSize: '0.76rem',
                  fontWeight: isSelected ? 900 : 700,
                  color: isSelected ? 'var(--text-main)' : 'var(--text-muted)',
                  lineHeight: 1.2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px'
                }}
              >
                {firstName}
                {isSelected && (
                  <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: theme.borderColor }} />
                )}
              </span>
            </button>
          );
        })}
      </div>

      {/* 2. Clean Active Child Details Card (No repetitive classroom/desk, clean vector icons) */}
      <div
        style={{
          background: currentTheme.cardBg,
          border: `1.5px solid ${currentTheme.border}`,
          borderRadius: '16px',
          padding: '0.75rem 0.95rem',
          boxShadow: '0 4px 14px rgba(15,23,42,0.05)',
          transition: 'all 0.2s ease',
          animation: 'fadeIn 0.25s ease'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Left: Kid Name & Class */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.94rem', fontWeight: 900, color: 'var(--text-main)' }}>
                {currentChild.studentName}
              </span>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  background: currentTheme.activeTagBg,
                  color: currentTheme.activeTagText,
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  border: `1px solid ${currentTheme.border}`
                }}
              >
                Class {currentClass}-{currentChild.section}
              </span>
            </div>

            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Student ID: <strong>{currentChild.id}</strong>
            </div>
          </div>

          {/* Right: Active Tray Status */}
          <div style={{ textAlign: 'right' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', fontSize: '0.84rem', fontWeight: 900, color: currentItemsCount > 0 ? '#16a34a' : 'var(--text-muted)' }}>
              <ShoppingBag size={14} />
              <span>{currentItemsCount > 0 ? `${currentItemsCount} items (${currency} ${currentTotalAmount})` : 'Tray Empty'}</span>
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
              {currentItemsCount > 0 ? 'Ready for break' : 'Select dishes below'}
            </div>
          </div>
        </div>

        {/* Allergen & Dietary Health Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.45rem', marginTop: '0.45rem', borderTop: '1px dashed rgba(203,213,225,0.8)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            {currentAllergies.length > 0 ? (
              <span
                onClick={onOpenHealthModal}
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  color: '#b91c1c',
                  background: '#fee2e2',
                  border: '1px solid #fca5a5',
                  padding: '1px 6px',
                  borderRadius: '4px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px',
                  cursor: 'pointer'
                }}
                title="Click to edit allergies"
              >
                <AlertTriangle size={11} />
                <span>{currentAllergies.join(', ')} Sensitive</span>
              </span>
            ) : (
              <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#15803d', background: '#dcfce7', padding: '1px 6px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                <ShieldCheck size={11} />
                <span>100% Allergen Safe</span>
              </span>
            )}

            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
              <Leaf size={11} color="#16a34a" />
              <span>{currentChild.dietary || 'Veg'}</span>
            </span>
          </div>

          <button
            onClick={onOpenHealthModal}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--primary)',
              fontSize: '0.68rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '3px'
            }}
          >
            <span>Edit Health</span>
            <Edit3 size={11} />
          </button>
        </div>
      </div>
    </div>
  );
}
