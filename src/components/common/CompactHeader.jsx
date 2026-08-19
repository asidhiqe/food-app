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
  const dateLabel = isToday ? 'Today' : selectedDate;

  return (
    <>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
          padding: '0.6rem 0.85rem',
          boxShadow: '0 1px 4px rgba(0,0,0,0.03)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.4rem' }}>
          {/* Left: School & Slot Picker (Integrated) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              onClick={() => setIsSchoolModalOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 'var(--radius-full)',
                padding: '4px 8px 4px 6px',
                cursor: 'pointer'
              }}
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'var(--primary)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem'
                }}
              >
                🏫
              </div>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-main)', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {activeSchool?.name?.split(' ')[0] || 'School'}
              </span>
              <ChevronDown size={12} color="#64748b" />
            </button>

            {/* Delivery Slot Pill */}
            <button
              onClick={onOpenDateSlotSheet}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                borderRadius: 'var(--radius-full)',
                padding: '4px 8px',
                cursor: 'pointer',
                color: '#1d4ed8',
                fontSize: '0.74rem',
                fontWeight: 800
              }}
            >
              <Clock size={12} color="#2563eb" />
              <span style={{ maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {dateLabel}, {selectedSlot?.name?.split('/')[0] || selectedSlot?.name || 'Break'}
              </span>
              <ChevronDown size={11} />
            </button>
          </div>

          {/* Right: Orders & User Profile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            {/* Orders Pill */}
            <button
              onClick={onViewMyOrders}
              style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: 'var(--radius-full)',
                padding: '4px 8px',
                fontSize: '0.74rem',
                fontWeight: 800,
                color: 'var(--text-main)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span>Orders</span>
              {activeOrderCount > 0 && (
                <span style={{ background: '#10b981', color: 'white', borderRadius: '10px', padding: '0 5px', fontSize: '0.65rem', fontWeight: 900 }}>
                  {activeOrderCount}
                </span>
              )}
            </button>

            {/* Settings / Parent Menu */}
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
