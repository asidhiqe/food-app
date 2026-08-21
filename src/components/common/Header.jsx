import React, { useState } from 'react';
import { ShoppingBag, Clock, User, ChevronDown, Settings, LogOut, LogIn, School, ShieldCheck, Users, HelpCircle, X } from 'lucide-react';

export default function Header({
  activeSchool,
  schools,
  onSelectSchool,
  activePortal,
  cartCount,
  cartTotal,
  onOpenCart,
  onViewMyOrders,
  activeOrderCount,
  parentSession,
  onOpenAuthModal,
  onLogoutParent
}) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSchoolPickerOpen, setIsSchoolPickerOpen] = useState(false);

  return (
    <>
      <header className="app-header">
        <div className="header-container">
          {/* Left: School Logo & Name with subtle switcher */}
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer' }}
            onClick={() => setIsSchoolPickerOpen(true)}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'var(--primary)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.3rem',
                boxShadow: '0 4px 10px rgba(37,99,235,0.2)',
                flexShrink: 0
              }}
            >
              {activeSchool.logo || '🍱'}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <h1 style={{ fontSize: '0.98rem', fontWeight: 900, lineHeight: 1.1, color: 'var(--text-main)' }}>
                  {activeSchool.canteenName}
                </h1>
                <ChevronDown size={14} color="var(--text-muted)" />
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                {activeSchool.name}
              </div>
            </div>
          </div>

          {/* Right: Clean Action Controls (My Orders, Cart, Settings/Profile) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {activePortal === 'parent' && (
              <>
                {/* My Orders Button */}
                <button
                  onClick={onViewMyOrders}
                  style={{
                    background: '#ffffff',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-full)',
                    padding: '0.5rem 0.85rem',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: 'var(--text-main)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    position: 'relative'
                  }}
                  title="My Orders"
                >
                  <Clock size={16} color="var(--primary)" />
                  <span className="hide-mobile">Orders</span>
                  {activeOrderCount > 0 && (
                    <span
                      style={{
                        background: '#10b981',
                        color: '#ffffff',
                        fontSize: '0.68rem',
                        fontWeight: 900,
                        padding: '1px 6px',
                        borderRadius: '10px'
                      }}
                    >
                      {activeOrderCount}
                    </span>
                  )}
                </button>

                {/* Cart / Tray Button */}
                <button
                  onClick={onOpenCart}
                  style={{
                    background: 'var(--primary)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: 'var(--radius-full)',
                    padding: '0.5rem 0.95rem',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 12px rgba(37,99,235,0.25)'
                  }}
                >
                  <ShoppingBag size={16} />
                  <span className="hide-mobile">Tray</span>
                  {cartCount > 0 && (
                    <span
                      style={{
                        background: '#ffffff',
                        color: 'var(--primary)',
                        borderRadius: '10px',
                        padding: '1px 6px',
                        fontSize: '0.72rem',
                        fontWeight: 900
                      }}
                    >
                      {cartCount}
                    </span>
                  )}
                </button>
              </>
            )}

            {/* Profile & Settings Trigger */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              style={{
                background: '#f8fafc',
                border: '1px solid var(--border-color)',
                borderRadius: '50%',
                width: '38px',
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--text-main)',
                flexShrink: 0
              }}
              title="Profile & Settings"
            >
              {parentSession ? (
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem' }}>
                  {parentSession.parentName.charAt(0)}
                </div>
              ) : (
                <User size={18} />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Profile & Settings Bottom Drawer */}
      {isSettingsOpen && (
        <div className="modal-overlay" onClick={() => setIsSettingsOpen(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '420px', padding: '1.5rem' }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Settings size={20} color="var(--text-main)" />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Account & Settings</h2>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>School Food Court Preferences</p>
                </div>
              </div>
              <button onClick={() => setIsSettingsOpen(false)} style={{ padding: '0.4rem', borderRadius: '50%', background: '#f1f5f9', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            {/* Parent Profile Card */}
            {parentSession ? (
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem' }}>
                    {parentSession.parentName.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 800 }}>{parentSession.parentName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      +91 {parentSession.phone} • {parentSession.relation || 'Parent'}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsSettingsOpen(false);
                    onLogoutParent();
                  }}
                  style={{
                    width: '100%',
                    marginTop: '0.85rem',
                    padding: '0.5rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid #fee2e2',
                    background: '#fff5f5',
                    color: '#dc2626',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '5px'
                  }}
                >
                  <LogOut size={14} />
                  <span>Log Out from this Device</span>
                </button>
              </div>
            ) : (
              <div style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', border: '1px solid #bfdbfe', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1.25rem', textAlign: 'center' }}>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#1e40af', marginBottom: '0.3rem' }}>
                  Login with Mobile OTP
                </div>
                <div style={{ fontSize: '0.75rem', color: '#3b82f6', marginBottom: '0.85rem' }}>
                  Instantly access your children's profiles and track their meal breaks.
                </div>
                <button
                  onClick={() => {
                    setIsSettingsOpen(false);
                    onOpenAuthModal();
                  }}
                  className="btn-primary"
                  style={{ width: '100%', padding: '0.65rem', fontSize: '0.85rem' }}
                >
                  <LogIn size={15} />
                  <span>Login / Register Phone</span>
                </button>
              </div>
            )}

            {/* Menu List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button
                onClick={() => {
                  setIsSettingsOpen(false);
                  setIsSchoolPickerOpen(true);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid #e2e8f0',
                  background: '#ffffff',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <School size={16} color="var(--primary)" />
                  <span>Switch School</span>
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {activeSchool?.name ? activeSchool.name.split(' ')[0] : 'School'}...
                </span>
              </button>

              <button
                onClick={() => {
                  setIsSettingsOpen(false);
                  window.location.hash = '#/kitchen';
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid #e2e8f0',
                  background: '#ffffff',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span>👨‍🍳</span>
                  <span>Kitchen Display (KDS Portal)</span>
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Staff Only</span>
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
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid #e2e8f0',
                  background: '#ffffff',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span>🏫</span>
                  <span>School Admin & Excel Roster</span>
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Admin</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* School Picker Modal */}
      {isSchoolPickerOpen && (
        <div className="modal-overlay" onClick={() => setIsSchoolPickerOpen(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '420px', padding: '1.5rem' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Select School Food Court</h3>
              <button onClick={() => setIsSchoolPickerOpen(false)} style={{ padding: '0.4rem', borderRadius: '50%', background: '#f1f5f9', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {schools.map((s) => (
                <div
                  key={s.id}
                  onClick={() => {
                    onSelectSchool(s.id);
                    setIsSchoolPickerOpen(false);
                  }}
                  style={{
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    border: s.id === activeSchool.id ? '2px solid var(--primary)' : '1px solid #e2e8f0',
                    background: s.id === activeSchool.id ? 'var(--primary-light)' : '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{ fontSize: '1.4rem' }}>{s.logo || '🏫'}</div>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-main)' }}>
                        {s.name}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {s.canteenName} • {s.city}
                      </div>
                    </div>
                  </div>

                  {s.id === activeSchool.id && (
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--primary)' }}>
                      Active
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
