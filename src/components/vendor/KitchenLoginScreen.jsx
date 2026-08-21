import React, { useState } from 'react';
import { ChefHat, Lock, ArrowRight, CheckCircle2, ShieldCheck, Flame, Utensils, Sparkles, X, Clock, PackageCheck, AlertCircle } from 'lucide-react';

const KITCHEN_STAFF_PROFILES = [
  {
    name: 'Chef Ramesh',
    role: 'Head Chef • Live Cooking Station',
    avatar: '👨‍🍳',
    pin: '1234',
    badge: 'Station 1'
  },
  {
    name: 'Pooja Sharma',
    role: 'Meal Packing & Thermal Labeling',
    avatar: '📦',
    pin: '2345',
    badge: 'Station 2'
  },
  {
    name: 'Imran Khan',
    role: 'Classroom Delivery & Dispatch',
    avatar: '🚚',
    pin: '3456',
    badge: 'Runner'
  }
];

export default function KitchenLoginScreen({ activeSchool, onLoginSuccess }) {
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  const handlePinSubmit = (e) => {
    if (e) e.preventDefault();
    if (pin.length < 4) {
      setErrorMsg('Please enter a 4-digit staff PIN');
      return;
    }

    setIsLoading(true);
    setLoadingText('Authenticating kitchen staff...');

    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        staffName: 'Canteen Staff',
        role: 'Kitchen Operations',
        authenticatedAt: new Date().toISOString()
      });
    }, 450);
  };

  const handlePickDemoStaff = (staff) => {
    setIsDemoModalOpen(false);
    setPin(staff.pin);
    setErrorMsg('');
    setIsLoading(true);
    setLoadingText(`Opening KDS for ${staff.name}...`);

    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        staffName: staff.name,
        role: staff.role,
        avatar: staff.avatar,
        authenticatedAt: new Date().toISOString()
      });
    }, 400);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        position: 'relative',
        background: 'linear-gradient(135deg, #0c1322 0%, #1e1b4b 50%, #0c1322 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.25rem',
        overflowX: 'hidden'
      }}
    >
      {/* Ambient Pulsing Warm Lighting */}
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          left: '30%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(234, 88, 12, 0.35) 0%, rgba(234, 88, 12, 0) 70%)',
          filter: 'blur(80px)',
          animation: 'pulseGlow 6s infinite ease-in-out',
          pointerEvents: 'none'
        }}
      />

      {/* Subtle Dot Grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          pointerEvents: 'none'
        }}
      />

      {/* Loading Overlay */}
      {isLoading && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            textAlign: 'center',
            animation: 'fadeIn 0.2s ease'
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '1rem', animation: 'fabBounce 1s infinite alternate' }}>
            👨‍🍳
          </div>
          <h3 style={{ color: '#ffffff', fontSize: '1.15rem', fontWeight: 900, marginBottom: '0.35rem' }}>
            {loadingText}
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.78rem' }}>
            Loading Live Kitchen Display & Dispatch Queue
          </p>
        </div>
      )}

      {/* Responsive Shell: 1 Column on Mobile, 2 Columns on Tablet & Desktop */}
      <div className="login-split-layout">
        {/* MOBILE ONLY COMPACT BRAND HEADER */}
        <div className="login-hero-mobile">
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '14px',
              background: '#ffffff',
              padding: '4px',
              boxShadow: '0 6px 16px rgba(0,0,0,0.3)',
              marginBottom: '0.4rem'
            }}
          >
            <img
              src="./bis-hapur-responsive-logo.png"
              alt="School Crest"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
          <h1
            style={{
              fontSize: '1.25rem',
              fontWeight: 900,
              color: '#ffffff',
              lineHeight: 1.2,
              marginBottom: '0.25rem',
              textShadow: '0 2px 8px rgba(0,0,0,0.3)'
            }}
          >
            {activeSchool?.name || 'Brainwaves International School'}
          </h1>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              background: 'rgba(234, 88, 12, 0.2)',
              border: '1px solid rgba(234, 88, 12, 0.4)',
              backdropFilter: 'blur(8px)',
              padding: '3px 10px',
              borderRadius: 'var(--radius-full)',
              color: '#fdba74',
              fontSize: '0.72rem',
              fontWeight: 800
            }}
          >
            <span>👨‍🍳</span>
            <span>Kitchen Display & Dispatch (KDS)</span>
          </div>
        </div>

        {/* DESKTOP ONLY COLUMN: School Kitchen Brand & Station Capabilities */}
        <div className="login-hero-desktop" style={{ color: '#ffffff' }}>
          <div style={{ display: 'inline-block', position: 'relative', marginBottom: '1rem' }}>
            <div
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '22px',
                background: '#ffffff',
                border: '2px solid rgba(255, 255, 255, 0.9)',
                padding: '5px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <img
                src="./bis-hapur-responsive-logo.png"
                alt="School Crest"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
          </div>

          <h1
            style={{
              fontSize: '2rem',
              fontWeight: 900,
              color: '#ffffff',
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
              marginBottom: '0.4rem'
            }}
          >
            {activeSchool?.name || 'Brainwaves International School'}
          </h1>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(234, 88, 12, 0.2)',
              border: '1px solid rgba(234, 88, 12, 0.4)',
              backdropFilter: 'blur(8px)',
              padding: '5px 14px',
              borderRadius: 'var(--radius-full)',
              color: '#fdba74',
              fontSize: '0.8rem',
              fontWeight: 800,
              marginBottom: '1.5rem'
            }}
          >
            <span>👨‍🍳</span>
            <span>Kitchen Display & Dispatch (KDS)</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '420px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.07)', padding: '0.75rem 1rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <span style={{ fontSize: '1.4rem' }}>🔥</span>
              <div>
                <div style={{ fontSize: '0.86rem', fontWeight: 900 }}>Live Order Queue & Cooking Timers</div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Real-time orders matched with cutoff countdowns</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.07)', padding: '0.75rem 1rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <span style={{ fontSize: '1.4rem' }}>🏷️</span>
              <div>
                <div style={{ fontSize: '0.86rem', fontWeight: 900 }}>Thermal Desk Sticker Dispatch</div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Allergies & classroom student labels</div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: KDS Station Login Card */}
        <div style={{ width: '100%', maxWidth: '440px', justifySelf: 'center' }}>
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.96)',
              backdropFilter: 'blur(20px)',
              borderRadius: '26px',
              padding: '2rem 1.75rem',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.38)',
              marginBottom: '1rem'
            }}
          >
            <form onSubmit={handlePinSubmit}>
              <div style={{ marginBottom: '1.4rem' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.82rem',
                    fontWeight: 900,
                    color: 'var(--text-main)',
                    marginBottom: '0.5rem'
                  }}
                >
                  Enter Kitchen Staff PIN
                </label>

                <input
                  type="password"
                  maxLength={4}
                  placeholder="4-digit PIN (Try: 1234)"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    borderRadius: '14px',
                    border: '2px solid #cbd5e1',
                    background: '#f8fafc',
                    fontSize: '1.35rem',
                    fontWeight: 900,
                    textAlign: 'center',
                    letterSpacing: '8px',
                    outline: 'none',
                    color: 'var(--text-main)'
                  }}
                />
              </div>

              {errorMsg && (
                <div
                  style={{
                    background: '#fee2e2',
                    color: '#b91c1c',
                    padding: '0.65rem',
                    borderRadius: '12px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    marginBottom: '1rem',
                    textAlign: 'center'
                  }}
                >
                  ⚠️ {errorMsg}
                </div>
              )}

              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '0.92rem',
                  fontSize: '0.95rem',
                  fontWeight: 900,
                  color: '#ffffff',
                  background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
                  border: 'none',
                  borderRadius: 'var(--radius-full)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(234, 88, 12, 0.35)'
                }}
              >
                <span>Unlock Kitchen Display</span>
                <ArrowRight size={16} />
              </button>
            </form>
          </div>

          {/* Minimized Demo Trigger */}
          <button
            onClick={() => setIsDemoModalOpen(true)}
            style={{
              width: '100%',
              padding: '0.75rem 1.15rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(12px)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              cursor: 'pointer',
              color: '#e2e8f0'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.95rem' }}>⚡</span>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#f1f5f9' }}>
                Quick Demo Staff Stations
              </span>
            </div>
            <div style={{ color: '#fdba74', fontSize: '0.74rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>Select</span>
              <ArrowRight size={12} />
            </div>
          </button>
        </div>
      </div>

      {/* Demo Modal */}
      {isDemoModalOpen && (
        <div
          className="modal-overlay"
          onClick={() => setIsDemoModalOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '420px',
              background: '#ffffff',
              borderRadius: '24px',
              padding: '1.5rem 1.25rem',
              boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
              animation: 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: 'var(--text-main)' }}>
                  ⚡ Quick Demo Kitchen Staff
                </h3>
                <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  Select a station to open the live orders feed
                </p>
              </div>
              <button onClick={() => setIsDemoModalOpen(false)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', padding: '6px', cursor: 'pointer' }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {KITCHEN_STAFF_PROFILES.map((staff, i) => (
                <div
                  key={i}
                  onClick={() => handlePickDemoStaff(staff)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: '#f8fafc',
                    border: '1.5px solid #e2e8f0',
                    borderRadius: '16px',
                    padding: '0.85rem 1rem',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.6rem' }}>{staff.avatar}</span>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 900, color: 'var(--text-main)' }}>{staff.name}</span>
                        <span style={{ fontSize: '0.65rem', fontWeight: 800, background: '#fff7ed', color: '#ea580c', border: '1px solid #fed7aa', padding: '1px 6px', borderRadius: '6px' }}>
                          {staff.badge}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{staff.role}</div>
                    </div>
                  </div>
                  <ArrowRight size={14} color="#ea580c" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
