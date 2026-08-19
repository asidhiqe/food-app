import React, { useState } from 'react';
import { ShoppingBag, Clock, User, ChevronDown, Settings, LogOut, LogIn, School, X, Calendar } from 'lucide-react';

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
          background: '#ffffff',
          borderBottom: '1px solid var(--border-color)',
          padding: '0.65rem 0.85rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}
      >
        {/* ROW 1: School Logo/Dropdown (Left) & Actions (Right) */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.45rem' }}>
          {/* Left: School Logo & Switcher */}
          <button
            onClick={() => setIsSchoolModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 'var(--radius-full)',
              padding: '4px 10px 4px 5px',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <div
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                background: 'var(--primary)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.85rem'
              }}
            >
              🏫
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 900, color: 'var(--text-main)', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {activeSchool.name.split(' ')[0]}
                </span>
                <ChevronDown size={13} color="var(--primary)" />
              </div>
              <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontWeight: 700, lineHeight: 1 }}>
                {activeSchool.canteenName}
              </div>
            </div>
          </button>

          {/* Right: Orders, Cart, Settings/Auth */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            {/* My Orders Button */}
            <button
              onClick={onViewMyOrders}
              style={{
                background: '#ffffff',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-full)',
                padding: '0.35rem 0.6rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--text-main)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
              title="My Orders"
            >
              <Clock size={14} color="var(--primary)" />
              <span>Orders</span>
              {activeOrderCount > 0 && (
                <span style={{ background: '#10b981', color: '#ffffff', fontSize: '0.62rem', fontWeight: 900, padding: '1px 5px', borderRadius: '10px' }}>
                  {activeOrderCount}
                </span>
              )}
            </button>

            {/* Tray Button */}
            <button
              onClick={onOpenCart}
              style={{
                background: 'var(--primary)',
                color: '#ffffff',
                border: 'none',
                borderRadius: 'var(--radius-full)',
                padding: '0.4rem 0.75rem',
                fontSize: '0.78rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                boxShadow: '0 2px 8px rgba(37,99,235,0.2)'
              }}
            >
              <ShoppingBag size={14} />
              <span>Tray</span>
              {cartCount > 0 && (
                <span style={{ background: '#ffffff', color: 'var(--primary)', borderRadius: '10px', padding: '1px 5px', fontSize: '0.65rem', fontWeight: 900 }}>
                  {cartCount}
                </span>
              )}
            </button>

            {/* Settings Trigger */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              style={{
                background: '#f8fafc',
                border: '1px solid var(--border-color)',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <Settings size={15} color="var(--text-muted)" />
            </button>
          </div>
        </div>

        {/* ROW 2: Compact Slot Pill (Full Width) */}
        <div>
          <button
            onClick={onOpenDateSlotSheet}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 'var(--radius-full)',
              padding: '4px 10px',
              fontSize: '0.75rem',
              fontWeight: 800,
              color: 'var(--text-main)',
              cursor: 'pointer',
              width: '100%',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            <Calendar size={13} color="var(--primary)" />
            <span style={{ color: 'var(--primary)', fontWeight: 900 }}>{dateLabel}</span>
            <span style={{ color: '#94a3b8' }}>•</span>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-main)' }}>
              {selectedSlot ? selectedSlot.name : 'Select Break Slot'}
            </span>
            <ChevronDown size={12} color="var(--text-muted)" style={{ marginLeft: 'auto' }} />
          </button>
        </div>
      </header>

      {/* School Switcher Modal */}
      {isSchoolModalOpen && (
        <div className="modal-overlay" onClick={() => setIsSchoolModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 900 }}>Select School Food Court</h3>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Choose your campus canteen</p>
              </div>
              <button onClick={() => setIsSchoolModalOpen(false)} style={{ padding: '0.35rem', borderRadius: '50%', background: '#f1f5f9', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {schools.map((school) => {
                const isSelected = activeSchool && activeSchool.id === school.id;
                return (
                  <div
                    key={school.id}
                    onClick={() => {
                      onSelectSchool(school.id);
                      setIsSchoolModalOpen(false);
                    }}
                    style={{
                      padding: '0.85rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      border: isSelected ? '2px solid var(--primary)' : '1px solid #e2e8f0',
                      background: isSelected ? '#eff6ff' : '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div
                        style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '10px',
                          background: school.primaryColor || '#2563eb',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 900,
                          fontSize: '1.1rem'
                        }}
                      >
                        🏫
                      </div>
                      <div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 900, color: 'var(--text-main)' }}>
                          {school.name}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          {school.canteenName} • {school.address}
                        </div>
                      </div>
                    </div>

                    {isSelected && (
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--primary)', background: '#dbeafe', padding: '2px 8px', borderRadius: 'var(--radius-full)' }}>
                        Selected
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="modal-overlay" onClick={() => setIsSettingsOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 900 }}>Settings & Portals</h3>
              <button onClick={() => setIsSettingsOpen(false)} style={{ padding: '0.35rem', borderRadius: '50%', background: '#f1f5f9', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            {parentSession ? (
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-md)', padding: '0.85rem', marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.88rem', fontWeight: 800 }}>{parentSession.parentName}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  +91 {parentSession.phone} • {parentSession.relation || 'Parent'}
                </div>
                <button
                  onClick={() => {
                    setIsSettingsOpen(false);
                    onLogoutParent();
                  }}
                  style={{
                    width: '100%',
                    marginTop: '0.65rem',
                    padding: '0.45rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid #fee2e2',
                    background: '#fff5f5',
                    color: '#dc2626',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                >
                  <LogOut size={13} />
                  <span>Log Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setIsSettingsOpen(false);
                  onOpenAuthModal();
                }}
                className="btn-primary"
                style={{ width: '100%', marginBottom: '1rem', padding: '0.65rem', fontSize: '0.85rem' }}
              >
                <LogIn size={15} />
                <span>Login Parent Account</span>
              </button>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button
                onClick={() => {
                  setIsSettingsOpen(false);
                  window.location.hash = '#/kitchen';
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid #e2e8f0',
                  background: '#ffffff',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <span>👨‍🍳 Kitchen KDS Portal</span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Staff</span>
              </button>

              <button
                onClick={() => {
                  setIsSettingsOpen(false);
                  window.location.hash = '#/admin';
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid #e2e8f0',
                  background: '#ffffff',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <span>🏫 School Admin & Roster</span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Admin</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
