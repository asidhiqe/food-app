import React, { useState } from 'react';
import { Shield, ShieldAlert, KeyRound, ArrowRight, Sparkles, Building2, Layers, CheckCircle } from 'lucide-react';

export default function SuperAdminLoginScreen({ onLoginSuccess }) {
  const [passcode, setPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e) => {
    if (e) e.preventDefault();
    if (!passcode) {
      setErrorMsg('Please enter Platform Super Admin master key');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        superAdminName: 'SaaS Platform Owner',
        role: 'Platform Super Admin',
        email: 'superadmin@smartcanteen.io',
        authenticatedAt: new Date().toISOString()
      });
    }, 450);
  };

  const handleQuickDemoAccess = () => {
    setPasscode('super123');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        superAdminName: 'SaaS Platform Owner',
        role: 'Platform Super Admin',
        email: 'superadmin@smartcanteen.io',
        authenticatedAt: new Date().toISOString()
      });
    }, 350);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        position: 'relative',
        background: 'linear-gradient(135deg, #030712 0%, #0f172a 40%, #1e1b4b 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.25rem',
        overflowX: 'hidden'
      }}
    >
      {/* Background Ambient Aura */}
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          left: '30%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, rgba(99, 102, 241, 0) 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none'
        }}
      />

      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '24px',
          padding: '2.25rem 2rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
          zIndex: 10,
          position: 'relative'
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '18px',
              background: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem auto',
              boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
          >
            <Shield size={32} />
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(99, 102, 241, 0.15)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              padding: '3px 10px',
              borderRadius: 'var(--radius-full)',
              color: '#a5b4fc',
              fontSize: '0.72rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '0.6rem'
            }}
          >
            <Sparkles size={11} />
            <span>Platform Owner & SaaS Master Console</span>
          </div>

          <h1 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em', margin: '0 0 0.4rem 0' }}>
            Super Admin Control Center
          </h1>
          <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: 0, lineHeight: 1.4 }}>
            Multi-Tenant School Management, Feature Flag Licensing & Global Commercial Governance
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#cbd5e1', marginBottom: '0.4rem' }}>
              Master Security Passcode:
            </label>
            <div style={{ position: 'relative' }}>
              <KeyRound size={16} color="#64748b" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                placeholder="Enter super admin master passcode"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 38px',
                  borderRadius: '12px',
                  background: 'rgba(30, 41, 59, 0.7)',
                  border: errorMsg ? '1.5px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#ffffff',
                  fontSize: '0.88rem',
                  outline: 'none'
                }}
              />
            </div>
            {errorMsg && (
              <p style={{ fontSize: '0.72rem', color: '#f87171', margin: '0.4rem 0 0 0', fontWeight: 700 }}>
                {errorMsg}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '0.85rem',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              color: '#ffffff',
              border: 'none',
              fontWeight: 900,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
              transition: 'all 0.15s ease'
            }}
          >
            <span>{isLoading ? 'Verifying Super Admin...' : 'Authenticate & Open Master Console'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* 1-Tap Quick Demo Access */}
        <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)', textAlign: 'center' }}>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.6rem' }}>
            Product Evaluation & Sales Demo:
          </div>
          <button
            type="button"
            onClick={handleQuickDemoAccess}
            style={{
              width: '100%',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#e2e8f0',
              padding: '0.65rem',
              borderRadius: '10px',
              fontSize: '0.78rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <span>⚡ Quick Access as Platform Super Admin</span>
          </button>
        </div>
      </div>
    </div>
  );
}
