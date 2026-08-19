import React, { useState } from 'react';
import { ShieldCheck, Phone, ArrowRight, Sparkles, CheckCircle2, Lock, School, Heart, ChevronRight, User, Users } from 'lucide-react';
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
        background: 'radial-gradient(circle at 50% 0%, #eff6ff 0%, #f8fafc 50%, #f1f5f9 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem 1rem'
      }}
    >
      {/* Loading Overlay Animation */}
      {isLoading && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(10px)',
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
              boxShadow: '0 12px 30px rgba(0,0,0,0.4)',
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

      {/* Main Container */}
      <div style={{ width: '100%', maxWidth: '440px' }}>
        
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: '#ffffff',
              padding: '6px 14px 6px 8px',
              borderRadius: 'var(--radius-full)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              border: '1px solid rgba(226, 232, 240, 0.9)',
              marginBottom: '1rem'
            }}
          >
            <img
              src="./bis-hapur-responsive-logo.png"
              alt="Logo"
              style={{ width: '26px', height: '26px', borderRadius: '50%', objectFit: 'contain' }}
            />
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {activeSchool?.name || 'Brainwaves International School'}
            </span>
          </div>

          <h1
            style={{
              fontSize: '1.65rem',
              fontWeight: 900,
              color: 'var(--text-main)',
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
              marginBottom: '0.4rem'
            }}
          >
            Fresh Meals for Your Child
          </h1>
          <p
            style={{
              fontSize: '0.84rem',
              color: '#64748b',
              lineHeight: 1.45,
              maxWidth: '340px',
              margin: '0 auto'
            }}
          >
            Order wholesome, hygienic canteen meals delivered straight to classroom break times.
          </p>
        </div>

        {/* Auth Card */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '24px',
            padding: '1.75rem 1.5rem',
            boxShadow: '0 12px 36px rgba(15, 23, 42, 0.08), 0 2px 6px rgba(15, 23, 42, 0.04)',
            border: '1px solid rgba(226, 232, 240, 0.9)',
            marginBottom: '1.25rem'
          }}
        >
          {!otpStep ? (
            /* Step 1: Mobile Phone Number */
            <form onSubmit={handleRequestOtp}>
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
                  Parent Mobile Number
                </label>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    border: '1.5px solid #cbd5e1',
                    borderRadius: '14px',
                    background: '#f8fafc',
                    padding: '0.4rem 0.85rem',
                    gap: '10px',
                    transition: 'all 0.2s ease'
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
                  We'll send a 4-digit verification code to match your student.
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
                  padding: '0.85rem',
                  fontSize: '0.92rem',
                  fontWeight: 900,
                  color: '#ffffff',
                  background: 'var(--primary)',
                  border: 'none',
                  borderRadius: 'var(--radius-full)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>Continue</span>
                <ArrowRight size={16} />
              </button>
            </form>
          ) : (
            /* Step 2: 4-Digit OTP */
            <form onSubmit={handleVerifyOtp}>
              <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.95rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                  Enter Verification Code
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                  Sent to <strong style={{ color: 'var(--text-main)' }}>+91 {phone}</strong>
                </div>
              </div>

              {/* OTP Input Boxes */}
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
                      boxShadow: digit ? '0 2px 8px rgba(37,99,235,0.18)' : 'none'
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
                  padding: '0.85rem',
                  fontSize: '0.92rem',
                  fontWeight: 900,
                  color: '#ffffff',
                  background: 'var(--primary)',
                  border: 'none',
                  borderRadius: 'var(--radius-full)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
                  marginBottom: '0.75rem'
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
                  padding: '0.4rem'
                }}
              >
                ← Change Phone Number
              </button>
            </form>
          )}
        </div>

        {/* Quick Demo Test Profiles Section */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '1.1rem 1.15rem',
            border: '1px solid rgba(226, 232, 240, 0.8)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.75rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.9rem' }}>⚡</span>
              <span style={{ fontSize: '0.76rem', fontWeight: 900, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Quick Demo Profiles
              </span>
            </div>
            <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700 }}>
              1-Tap Test Login
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            {DEMO_ACCOUNTS.map((acc, i) => (
              <div
                key={i}
                onClick={() => handlePickDemo(acc)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '14px',
                  padding: '0.65rem 0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.transform = 'none';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '10px',
                      background: '#f1f5f9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.1rem'
                    }}
                  >
                    {acc.avatar}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 900, color: 'var(--text-main)' }}>
                        {acc.name}
                      </span>
                      <span
                        style={{
                          fontSize: '0.65rem',
                          fontWeight: 800,
                          color: 'var(--primary)',
                          background: '#eff6ff',
                          padding: '1px 6px',
                          borderRadius: '8px'
                        }}
                      >
                        {acc.badge}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>
                      {acc.kidsDesc}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--primary)'
                  }}
                >
                  <ArrowRight size={14} />
                </div>
              </div>
            ))}
          </div>
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
            color: '#94a3b8',
            fontWeight: 700
          }}
        >
          <Lock size={12} />
          <span>Zero-Trust Privacy • Only registered parents can access</span>
        </div>

      </div>
    </div>
  );
}
