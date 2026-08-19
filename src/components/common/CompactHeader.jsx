import React, { useState } from 'react';
import { ShoppingBag, Clock, User, ChevronDown, Settings, LogOut, School, X, Calendar, Sparkles } from 'lucide-react';

export default function CompactHeader({
  activeSchool,
  schools,
  onSelectSchool,
  cartCount,
  cartTotal,
  onOpenCart,
  onViewMyOrders,
  activeOrderCount,
  parentSession,
  onOpenAuthModal,
  onLogoutParent,
  selectedDate,
  selectedSlot,
  onOpenDateSlotSheet
}) {
  const [isSchoolModalOpen, setIsSchoolModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];
  const isToday = selectedDate === todayStr;

  // Format date nicely (e.g. "Today, Aug 19" or "Wed, Aug 20")
  const dateObj = new Date(selectedDate);
  const dateFormatted = isToday
    ? 'Today'
    : dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
          boxShadow: '0 1px 4px rgba(0,0,0,0.03)'
        }}
      >
        {/* ROW 1: Clean Masthead (School Brand on Left, Orders & Profile on Right) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.65rem 0.95rem',
            borderBottom: '1px solid #f1f5f9'
          }}
        >
          {/* Left: School Logo / Campus Switcher */}
          <button
            onClick={() => setIsSchoolModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 'var(--radius-full)',
              padding: '3px 10px 3px 4px',
              cursor: 'pointer'
            }}
          >
            <img
              src="./bis-hapur-responsive-logo.png"
              alt="School Logo"
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                objectFit: 'contain',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                padding: '1px'
              }}
            />
            <div style={{ textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.01em' }}>
                  {activeSchool?.name?.includes('Brainwaves') ? "Brainwaves Int'l" : activeSchool?.name}
                </span>
                <ChevronDown size={12} color="#64748b" />
              </div>
            </div>
          </button>

          {/* Right: Orders & User Menu */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {/* Orders Button */}
            <button
              onClick={onViewMyOrders}
              style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: 'var(--radius-full)',
                padding: '4px 10px',
                fontSize: '0.76rem',
                fontWeight: 800,
                color: 'var(--text-main)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <span>Orders</span>
              {activeOrderCount > 0 && (
                <span style={{ background: '#10b981', color: 'white', borderRadius: '10px', padding: '1px 6px', fontSize: '0.65rem', fontWeight: 900 }}>
                  {activeOrderCount}
                </span>
              )}
            </button>

            {/* Settings Dropdown Trigger */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  border: '1px solid #cbd5e1',
                  background: '#f8fafc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'var(--text-main)'
                }}
              >
                <Settings size={15} />
              </button>

              {/* Dropdown Menu */}
              {isSettingsOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '38px',
                    right: 0,
                    width: '210px',
                    background: '#ffffff',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-lg)',
                    border: '1px solid var(--border-color)',
                    padding: '0.5rem',
                    zIndex: 200,
                    animation: 'slideUp 0.15s ease'
                  }}
                >
                  {parentSession && (
                    <div style={{ padding: '0.4rem 0.5rem', borderBottom: '1px solid #f1f5f9', marginBottom: '0.4rem' }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-main)' }}>
                        {parentSession.parentName}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                        +91 {parentSession.phone}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => { setIsSettingsOpen(false); window.location.hash = '#/kitchen'; }}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: 'none', background: 'transparent', textAlign: 'left', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <span>👨‍🍳</span>
                    <span>Kitchen Display (KDS)</span>
                  </button>

                  <button
                    onClick={() => { setIsSettingsOpen(false); window.location.hash = '#/admin'; }}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: 'none', background: 'transparent', textAlign: 'left', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <span>🏫</span>
                    <span>School Admin Portal</span>
                  </button>

                  <div style={{ borderTop: '1px solid #f1f5f9', marginTop: '0.35rem', paddingTop: '0.35rem' }}>
                    <button
                      onClick={() => { setIsSettingsOpen(false); onLogoutParent(); }}
                      style={{ width: '100%', padding: '0.45rem 0.5rem', borderRadius: '6px', border: 'none', background: '#fee2e2', color: '#b91c1c', textAlign: 'left', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <LogOut size={13} />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ROW 2: Prominent Date & Delivery Time Slot Banner (Guaranteed Single 1-Line) */}
        {(() => {
          const shortSlot = (selectedSlot?.name || 'Meal Break')
            .replace(/\s*\/\s*Short Break/i, '')
            .replace(/Morning Snack \/\s*/i, '');

          return (
            <div
              onClick={onOpenDateSlotSheet}
              style={{
                padding: '0.45rem 0.95rem',
                background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                borderBottom: '1px solid #bbf7d0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0, overflow: 'hidden' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#16a34a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Clock size={11} strokeWidth={2.5} />
                </div>

                <div style={{ fontSize: '0.76rem', color: '#166534', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  <span>{dateFormatted}</span>
                  <span style={{ color: '#86efac', margin: '0 5px' }}>•</span>
                  <strong style={{ color: '#14532d', fontWeight: 900 }}>{shortSlot} ({selectedSlot?.startTime || '10:30 AM'})</strong>
                </div>
              </div>

              <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#15803d', display: 'flex', alignItems: 'center', gap: '2px', background: '#ffffff', padding: '2px 7px', borderRadius: 'var(--radius-full)', border: '1px solid #86efac', flexShrink: 0 }}>
                <span>Change</span>
                <ChevronDown size={10} />
              </span>
            </div>
          );
        })()}
      </header>

      {/* Switch School Modal */}
      {isSchoolModalOpen && (
        <div className="modal-overlay" onClick={() => setIsSchoolModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '380px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 900 }}>Select School Campus</h3>
              <button onClick={() => setIsSchoolModalOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {schools.map((s) => {
                const isSelected = activeSchool?.id === s.id;
                return (
                  <div
                    key={s.id}
                    onClick={() => { onSelectSchool(s.id); setIsSchoolModalOpen(false); }}
                    style={{
                      padding: '0.75rem',
                      borderRadius: 'var(--radius-md)',
                      border: isSelected ? '2px solid var(--primary)' : '1px solid #e2e8f0',
                      background: isSelected ? 'var(--primary-light)' : '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem'
                    }}
                  >
                    <span style={{ fontSize: '1.4rem' }}>🏫</span>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: isSelected ? 'var(--primary)' : 'var(--text-main)' }}>
                        {s.name}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        {s.canteenName}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
