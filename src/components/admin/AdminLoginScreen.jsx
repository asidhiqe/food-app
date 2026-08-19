import React, { useState } from 'react';
import { ShieldCheck, Lock, ArrowRight, ArrowLeft, KeyRound, Building2, X } from 'lucide-react';

const ADMIN_DEMO_PROFILES = [
  {
    name: 'Dr. Shalini Saxena',
    role: 'Principal & Campus Meal Director',
    avatar: '👩‍💼',
    passcode: 'admin123',
    badge: 'Super Admin'
  },
  {
    name: 'Sanjay Verma',
    role: 'Canteen Operations & Vendor Manager',
    avatar: '👨‍💼',
    passcode: 'vendor123',
    badge: 'Operations'
  },
  {
    name: 'Ritu Mathur',
    role: 'Nutritionist & Meal Planner',
    avatar: '🥗',
    passcode: 'health123',
    badge: 'Dietitian'
  }
];

export default function AdminLoginScreen({ activeSchool, onLoginSuccess }) {
  const [passcode, setPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  const handleLogin = (e) => {
    if (e) e.preventDefault();
    if (!passcode) {
      setErrorMsg('Please enter administrator passcode');
      return;
    }

    setIsLoading(true);
    setLoadingText('Authenticating administrator...');

    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        adminName: 'School Administrator',
        role: 'Super Admin',
        authenticatedAt: new Date().toISOString()
      });
    }, 500);
  };

  const handlePickDemoAdmin = (admin) => {
    setIsDemoModalOpen(false);
    setPasscode(admin.passcode);
    setErrorMsg('');
    setIsLoading(true);
    setLoadingText(`Logging in as ${admin.name}...`);

    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        adminName: admin.name,
        role: admin.role,
        avatar: admin.avatar,
        authenticatedAt: new Date().toISOString()
      });
    }, 450);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        position: 'relative',
        background: 'linear-gradient(135deg, #090e17 0%, #1e1b4b 45%, #090e17 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem 1rem',
        overflow: 'hidden'
      }}
    >
      {/* Ambient Pulsing Glow */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '550px',
          height: '550px',
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.35) 0%, rgba(124, 58, 237, 0) 70%)',
          filter: 'blur(70px)',
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
            🏫
          </div>
          <h3 style={{ color: '#ffffff', fontSize: '1.15rem', fontWeight: 900, marginBottom: '0.35rem' }}>
            {loadingText}
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.78rem' }}>
            Unlocking Campus Food Court Control Center & Roster
          </p>
        </div>
      )}

      {/* Main Login Card */}
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          position: 'relative',
          zIndex: 10,
          animation: 'slideUpFade 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Back to Parent App button */}
        <button
          onClick={() => { window.location.hash = '#/'; }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: 'var(--radius-full)',
            padding: '5px 12px',
            color: '#e2e8f0',
            fontSize: '0.75rem',
            fontWeight: 800,
            cursor: 'pointer',
            marginBottom: '1.25rem'
          }}
        >
          <ArrowLeft size={13} />
          <span>Parent Dining View</span>
        </button>

        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'inline-block', position: 'relative', marginBottom: '0.75rem' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '20px',
                background: '#ffffff',
                border: '2px solid rgba(255, 255, 255, 0.9)',
                padding: '4px',
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
              fontSize: '1.55rem',
              fontWeight: 900,
              color: '#ffffff',
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
              marginBottom: '0.35rem'
            }}
          >
            {activeSchool?.name || 'Brainwaves International School'}
          </h1>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(124, 58, 237, 0.2)',
              border: '1px solid rgba(124, 58, 237, 0.4)',
              backdropFilter: 'blur(8px)',
              padding: '4px 12px',
              borderRadius: 'var(--radius-full)',
              color: '#c4b5fd',
              fontSize: '0.76rem',
              fontWeight: 800
            }}
          >
            <span>🏫</span>
            <span>School & Canteen Administration</span>
          </div>
        </div>

        {/* Auth Glassmorphic Card */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.96)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '1.65rem 1.4rem',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.35)',
            marginBottom: '1rem'
          }}
        >
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  color: 'var(--text-main)',
                  marginBottom: '0.5rem'
                }}
              >
                Administrator Passcode
              </label>

              <input
                type="password"
                placeholder="Enter password (Try: admin123)"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                autoFocus
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '14px',
                  border: '1.5px solid #cbd5e1',
                  background: '#f8fafc',
                  fontSize: '1rem',
                  fontWeight: 800,
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
                padding: '0.88rem',
                fontSize: '0.95rem',
                fontWeight: 900,
                color: '#ffffff',
                background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                border: 'none',
                borderRadius: 'var(--radius-full)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(124, 58, 237, 0.35)'
              }}
            >
              <span>Access Admin Dashboard</span>
              <ArrowRight size={16} />
            </button>
          </form>
        </div>

        {/* Minimized Demo Trigger */}
        <button
          onClick={() => setIsDemoModalOpen(true)}
          style={{
            width: '100%',
            padding: '0.7rem 1rem',
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
            <span style={{ fontSize: '0.9rem' }}>⚡</span>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#f1f5f9' }}>
              Quick Demo Admin Profiles
            </span>
          </div>
          <div style={{ color: '#c4b5fd', fontSize: '0.72rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>Select</span>
            <ArrowRight size={12} />
          </div>
        </button>
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
            alignItems: 'flex-end',
            justifyContent: 'center'
          }}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '420px',
              background: '#ffffff',
              borderTopLeftRadius: '24px',
              borderTopRightRadius: '24px',
              padding: '1.5rem 1.25rem',
              animation: 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: 'var(--text-main)' }}>
                  ⚡ Quick Demo Admin Roles
                </h3>
                <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  Select an administrative persona
                </p>
              </div>
              <button onClick={() => setIsDemoModalOpen(false)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', padding: '6px', cursor: 'pointer' }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {ADMIN_DEMO_PROFILES.map((admin, i) => (
                <div
                  key={i}
                  onClick={() => handlePickDemoAdmin(admin)}
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
                    <span style={{ fontSize: '1.6rem' }}>{admin.avatar}</span>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 900, color: 'var(--text-main)' }}>{admin.name}</span>
                        <span style={{ fontSize: '0.65rem', fontWeight: 800, background: '#f5f3ff', color: '#7c3aed', border: '1px solid #ddd6fe', padding: '1px 6px', borderRadius: '6px' }}>
                          {admin.badge}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{admin.role}</div>
                    </div>
                  </div>
                  <ArrowRight size={14} color="#7c3aed" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
