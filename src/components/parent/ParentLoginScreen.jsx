import React, { useState } from 'react';
import { ShieldCheck, Phone, ArrowRight, Sparkles, CheckCircle2, Lock, School, Heart, ChevronDown, ChevronUp, User, Users, Check } from 'lucide-react';
import { StorageService } from '../../services/storageService';

const DEMO_ACCOUNTS = [
  {
    name: 'Rajesh Sharma',
    phone: '9876543210',
    relation: 'Father',
    avatar: '👨‍💼',
    kidsDesc: 'Aarav (Grade 4) & Ananya (Grade 8)',
    badge: '2 Students'
  },
  {
    name: 'Vikram Verma',
    phone: '9123456780',
    relation: 'Father',
    avatar: '👨‍⚕️',
    kidsDesc: 'Riya (Grade 2) & Aryan (Grade 6)',
    badge: '2 Students'
  },
  {
    name: 'Amit Gupta',
    phone: '9988776655',
    relation: 'Father',
    avatar: '👨‍🏫',
    kidsDesc: 'Rohan (Grade 5)',
    badge: '1 Student'
  }
];

export default function ParentLoginScreen({ activeSchool, onLoginSuccess }) {
  const [phone, setPhone] = useState('');
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [showDemoProfiles, setShowDemoProfiles] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Handle Request OTP
  const handleRequestOtp = (e) => {
    if (e) e.preventDefault();
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number');
      return;
    }

    setErrorMsg('');
    setIsLoading(true);
    setLoadingText('Sending 4-digit security code...');

    setTimeout(() => {
      setIsLoading(false);
      setOtpStep(true);
    }, 500);
  };

  // Handle Quick Demo Account Pick
  const handlePickDemo = (acc) => {
    setPhone(acc.phone);
    setErrorMsg('');
    setIsLoading(true);
    setLoadingText(`Connecting ${acc.name}'s parent account...`);

    setTimeout(() => {
      setIsLoading(false);
      setOtpStep(true);
      setOtp(['4', '5', '8', '2']);
    }, 400);
  };

  // Handle OTP Input
  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  // Verify OTP & Trigger Animated Welcome Loader
  const handleVerifyOtp = (e) => {
    if (e) e.preventDefault();
    const enteredOtp = otp.join('');
    if (enteredOtp.length < 4) {
      setErrorMsg('Please enter the full 4-digit code');
      return;
    }

    setIsLoading(true);
    setLoadingText('Verifying OTP & matching student records...');

    setTimeout(() => {
      const cleanPhone = phone.replace(/\D/g, '');
      const matchedKids = StorageService.findStudentsByParentPhone(activeSchool?.id, cleanPhone);

      if (matchedKids.length === 0) {
        setIsLoading(false);
        setErrorMsg('No registered students found for this mobile number. Try demo: 9876543210');
        return;
      }

      const sampleStudent = matchedKids[0];
      const isFather = (sampleStudent.fatherPhone || '').replace(/\D/g, '') === cleanPhone;
      const parentName = isFather
        ? sampleStudent.fatherName
        : sampleStudent.motherName || 'Parent';

      const session = {
        phone: cleanPhone,
        parentName,
        relation: isFather ? 'Father' : 'Mother',
        authenticatedAt: new Date().toISOString()
      };

      StorageService.setParentSession(session);

      // Delightful Welcome Transition
      setLoadingText(`Welcome back, ${parentName.split(' ')[0]}! Unlocking lunch profiles...`);

      setTimeout(() => {
        setIsLoading(false);
        onLoginSuccess(session, matchedKids);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 700);
    }, 600);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        position: 'relative',
        background: 'linear-gradient(135deg, #090e17 0%, #0f172a 45%, #1e1b4b 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem 1rem',
        overflow: 'hidden'
      }}
    >
      {/* Ambient Pulsing Background Glows */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '550px',
          height: '550px',
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.4) 0%, rgba(37, 99, 235, 0) 70%)',
          filter: 'blur(70px)',
          animation: 'pulseGlow 6s infinite ease-in-out',
          pointerEvents: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-10%',
          right: '5%',
          width: '450px',
          height: '450px',
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.25) 0%, rgba(245, 158, 11, 0) 70%)',
          filter: 'blur(60px)',
          animation: 'pulseGlow 7s infinite 1s ease-in-out',
          pointerEvents: 'none'
        }}
      />

      {/* Modern Micro-Dot Grid Pattern */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.09) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          pointerEvents: 'none'
        }}
      />

      {/* Floating Animated Badges (Desktop & Tablet) */}
      <div
        style={{
          position: 'absolute',
          top: '14%',
          left: '10%',
          background: 'rgba(255, 255, 255, 0.07)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          backdropFilter: 'blur(10px)',
          padding: '8px 14px',
          borderRadius: 'var(--radius-full)',
          color: '#cbd5e1',
          fontSize: '0.75rem',
          fontWeight: 800,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          animation: 'floatSlow 5s infinite ease-in-out',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          pointerEvents: 'none'
        }}
      >
        <span>🌱</span>
        <span>Farm Fresh Canteen</span>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: '12%',
          left: '12%',
          background: 'rgba(255, 255, 255, 0.07)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          backdropFilter: 'blur(10px)',
          padding: '8px 14px',
          borderRadius: 'var(--radius-full)',
          color: '#cbd5e1',
          fontSize: '0.75rem',
          fontWeight: 800,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          animation: 'floatReverse 6s infinite ease-in-out',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          pointerEvents: 'none'
        }}
      >
        <span>🧼</span>
        <span>100% Hygiene Certified</span>
      </div>

      <div
        style={{
          position: 'absolute',
          top: '20%',
          right: '10%',
          background: 'rgba(255, 255, 255, 0.07)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          backdropFilter: 'blur(10px)',
          padding: '8px 14px',
          borderRadius: 'var(--radius-full)',
          color: '#cbd5e1',
          fontSize: '0.75rem',
          fontWeight: 800,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          animation: 'floatReverse 5.5s infinite 0.5s ease-in-out',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          pointerEvents: 'none'
        }}
      >
        <span>🍱</span>
        <span>Classroom Break Delivery</span>
      </div>

      {/* Loading Overlay Animation */}
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
          <img
            src="./bis-hapur-responsive-logo.png"
            alt="School Logo"
            style={{
              width: '68px',
              height: '68px',
              borderRadius: '20px',
              objectFit: 'contain',
              background: '#ffffff',
              padding: '6px',
              boxShadow: '0 12px 30px rgba(0,0,0,0.5)',
              marginBottom: '1.25rem',
              animation: 'fabBounce 1s infinite alternate cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
          />

          <h3 style={{ color: '#ffffff', fontSize: '1.15rem', fontWeight: 900, marginBottom: '0.35rem' }}>
            {loadingText}
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.78rem' }}>
            Securing student privacy & campus canteen access
          </p>

          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              border: '3px solid rgba(255,255,255,0.2)',
              borderTopColor: '#60a5fa',
              animation: 'spin 0.8s linear infinite',
              marginTop: '1.25rem'
            }}
          />
        </div>
      )}

      {/* Main Form Container */}
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          position: 'relative',
          zIndex: 10,
          animation: 'slideUpFade 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        
        {/* Prominent White-Label School Brand Hero */}
        <div style={{ textAlign: 'center', marginBottom: '1.65rem' }}>
          {/* Official School Crest Emblem with Luminous Aura */}
          <div style={{ display: 'inline-block', position: 'relative', marginBottom: '0.85rem' }}>
            <div
              style={{
                position: 'absolute',
                inset: -6,
                borderRadius: '24px',
                background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.6) 0%, rgba(245, 158, 11, 0.4) 100%)',
                filter: 'blur(10px)',
                opacity: 0.7
              }}
            />
            <div
              style={{
                position: 'relative',
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
                alt="School Emblem"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
          </div>

          <h1
            style={{
              fontSize: '1.65rem',
              fontWeight: 900,
              color: '#ffffff',
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
              marginBottom: '0.35rem',
              textShadow: '0 2px 10px rgba(0,0,0,0.3)'
            }}
          >
            {activeSchool?.name || 'Brainwaves International School'}
          </h1>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(8px)',
              padding: '3px 12px',
              borderRadius: 'var(--radius-full)',
              color: '#93c5fd',
              fontSize: '0.76rem',
              fontWeight: 800,
              letterSpacing: '0.02em',
              border: '1px solid rgba(255, 255, 255, 0.15)'
            }}
          >
            <span>🍱</span>
            <span>{activeSchool?.canteenName || 'Official Student Dining & Canteen Portal'}</span>
          </div>
        </div>

        {/* Auth Glassmorphism Card */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.96)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '1.75rem 1.5rem',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.2)',
            marginBottom: '1rem',
            transition: 'all 0.3s ease'
          }}
        >
          {!otpStep ? (
            /* Step 1: Mobile Phone Number */
            <form onSubmit={handleRequestOtp}>
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      color: 'var(--text-main)'
                    }}
                  >
                    Parent Mobile Number
                  </label>
                  {phone.length === 10 && (
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#16a34a', display: 'flex', alignItems: 'center', gap: '2px' }}>
                      <Check size={12} /> Ready
                    </span>
                  )}
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    border: isFocused ? '1.5px solid var(--primary)' : '1.5px solid #cbd5e1',
                    borderRadius: '14px',
                    background: isFocused ? '#ffffff' : '#f8fafc',
                    padding: '0.45rem 0.85rem',
                    gap: '10px',
                    boxShadow: isFocused ? '0 0 0 4px rgba(37, 99, 235, 0.15)' : 'none',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontWeight: 800,
                      fontSize: '0.92rem',
                      color: 'var(--text-main)',
                      borderRight: '1.5px solid #e2e8f0',
                      paddingRight: '10px'
                    }}
                  >
                    <span style={{ fontSize: '1.1rem' }}>🇮🇳</span>
                    <span>+91</span>
                  </div>

                  <input
                    type="tel"
                    placeholder="Enter 10-digit number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    maxLength={10}
                    autoFocus
                    style={{
                      border: 'none',
                      background: 'transparent',
                      width: '100%',
                      fontSize: '1.05rem',
                      fontWeight: 800,
                      outline: 'none',
                      color: 'var(--text-main)',
                      letterSpacing: '1px'
                    }}
                  />
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                  We'll send a 4-digit code to securely match your child.
                </div>
              </div>

              {errorMsg && (
                <div
                  style={{
                    background: '#fee2e2',
                    color: '#b91c1c',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '12px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    marginBottom: '1.1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span>⚠️</span>
                  <span>{errorMsg}</span>
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
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  border: 'none',
                  borderRadius: 'var(--radius-full)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(37, 99, 235, 0.45)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 4px 14px rgba(37, 99, 235, 0.35)';
                }}
              >
                <span>Continue with OTP</span>
                <ArrowRight size={16} />
              </button>
            </form>
          ) : (
            /* Step 2: 4-Digit OTP */
            <form onSubmit={handleVerifyOtp}>
              <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.95rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                  Enter 4-Digit Code
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                  Sent to <strong style={{ color: 'var(--text-main)' }}>+91 {phone}</strong>
                </div>
              </div>

              {/* OTP Input Boxes with Micro-Interaction */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-input-${idx}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    style={{
                      width: '52px',
                      height: '56px',
                      borderRadius: '14px',
                      border: digit ? '2px solid var(--primary)' : '1.5px solid #cbd5e1',
                      background: digit ? '#eff6ff' : '#f8fafc',
                      fontSize: '1.45rem',
                      fontWeight: 900,
                      textAlign: 'center',
                      outline: 'none',
                      color: 'var(--text-main)',
                      boxShadow: digit ? '0 2px 10px rgba(37,99,235,0.22)' : 'none',
                      transform: digit ? 'scale(1.04)' : 'none',
                      transition: 'all 0.15s ease'
                    }}
                  />
                ))}
              </div>

              {errorMsg && (
                <div
                  style={{
                    background: '#fee2e2',
                    color: '#b91c1c',
                    padding: '0.65rem 0.85rem',
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
                  background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                  border: 'none',
                  borderRadius: 'var(--radius-full)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(22, 163, 74, 0.35)',
                  marginBottom: '0.75rem',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(22, 163, 74, 0.45)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 4px 14px rgba(22, 163, 74, 0.35)';
                }}
              >
                <CheckCircle2 size={16} />
                <span>Verify & View Menu</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setOtpStep(false);
                  setOtp(['', '', '', '']);
                  setErrorMsg('');
                }}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  fontSize: '0.76rem',
                  fontWeight: 800,
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '0.4rem',
                  transition: 'color 0.15s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-main)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
              >
                ← Change Phone Number
              </button>
            </form>
          )}
        </div>

        {/* Minimized Collapsible Demo Profiles Accordion */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(12px)',
            borderRadius: '18px',
            border: '1px solid rgba(255, 255, 255, 0.14)',
            overflow: 'hidden',
            transition: 'all 0.25s ease'
          }}
        >
          {/* Header Accordion Trigger */}
          <button
            onClick={() => setShowDemoProfiles(!showDemoProfiles)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#e2e8f0',
              transition: 'background 0.15s ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.9rem' }}>⚡</span>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#f1f5f9' }}>
                Quick Demo Test Logins
              </span>
              <span
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  background: 'rgba(255, 255, 255, 0.15)',
                  color: '#ffffff',
                  padding: '1px 6px',
                  borderRadius: '10px'
                }}
              >
                3 Profiles
              </span>
            </div>
            <div style={{ color: '#94a3b8' }}>
              {showDemoProfiles ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
          </button>

          {/* Collapsible Content */}
          {showDemoProfiles && (
            <div
              style={{
                padding: '0.5rem 0.85rem 0.85rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                animation: 'slideUpFade 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              {DEMO_ACCOUNTS.map((acc, i) => (
                <div
                  key={i}
                  onClick={() => handlePickDemo(acc)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '12px',
                    padding: '0.55rem 0.75rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 14px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.1rem' }}>{acc.avatar}</span>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--text-main)' }}>
                          {acc.name}
                        </span>
                        <span
                          style={{
                            fontSize: '0.62rem',
                            fontWeight: 800,
                            color: 'var(--primary)',
                            background: '#eff6ff',
                            padding: '1px 5px',
                            borderRadius: '6px'
                          }}
                        >
                          {acc.badge}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>
                        {acc.kidsDesc}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '2px'
                    }}
                  >
                    <span>Use</span>
                    <ArrowRight size={12} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Security Trust Micro-Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            marginTop: '1.25rem',
            fontSize: '0.72rem',
            color: '#64748b',
            fontWeight: 700
          }}
        >
          <Lock size={12} />
          <span>Zero-Trust Student Privacy • Verified Parents Only</span>
        </div>

      </div>
    </div>
  );
}
