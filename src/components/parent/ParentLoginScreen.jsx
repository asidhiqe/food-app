import React, { useState } from 'react';
import { ShieldCheck, Phone, ArrowRight, Sparkles, CheckCircle2, Lock, School, Heart } from 'lucide-react';
import { StorageService } from '../../services/storageService';

const DEMO_ACCOUNTS = [
  {
    name: 'Rajesh Sharma',
    phone: '9876543210',
    relation: 'Father',
    kidsDesc: '👦 Aarav (4-B) & 👧 Ananya (8-A)',
    badge: '2 Kids'
  },
  {
    name: 'Vikram Verma',
    phone: '9123456780',
    relation: 'Father',
    kidsDesc: '👧 Riya (2-C) & 👦 Aryan (6-B)',
    badge: '2 Kids'
  },
  {
    name: 'Amit Gupta',
    phone: '9988776655',
    relation: 'Father',
    kidsDesc: '👦 Rohan (5-A)',
    badge: '1 Kid'
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
    }, 600);
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
    }, 500);
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
        setErrorMsg('No registered students found for this mobile number. Try demo number: 9876543210');
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
      }, 900);
    }, 800);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #f8fafc 0%, #eff6ff 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '1.5rem 1.25rem'
      }}
    >
      {/* Loading Overlay Animation */}
      {isLoading && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            textAlign: 'center',
            animation: 'fadeIn 0.2s ease'
          }}
        >
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '24px',
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.2rem',
              boxShadow: '0 10px 30px rgba(37,99,235,0.4)',
              marginBottom: '1.25rem',
              animation: 'fabBounce 1s infinite alternate cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
          >
            🍱
          </div>

          <h3 style={{ color: '#ffffff', fontSize: '1.15rem', fontWeight: 900, marginBottom: '0.4rem' }}>
            {loadingText}
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
            Securing student privacy & campus canteen access
          </p>

          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: '3px solid rgba(255,255,255,0.2)',
              borderTopColor: '#60a5fa',
              animation: 'spin 0.8s linear infinite',
              marginTop: '1.25rem'
            }}
          />
        </div>
      )}

      {/* Main Login Card */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          padding: '1.75rem 1.5rem',
          boxShadow: 'var(--shadow-card)',
          border: '1px solid rgba(226, 232, 240, 0.9)',
          animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* School Emblem & Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              color: '#ffffff',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8rem',
              boxShadow: '0 8px 24px rgba(37,99,235,0.25)',
              marginBottom: '0.75rem'
            }}
          >
            🏫
          </div>

          <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-main)', lineHeight: 1.25 }}>
            {activeSchool?.name || 'School Food Court'}
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            {activeSchool?.canteenName} • Parent Ordering Portal
          </p>
        </div>

        {/* Step 1: Mobile Phone Number */}
        {!otpStep ? (
          <form onSubmit={handleRequestOtp}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.45rem' }}>
                Parent Registered Mobile Number:
              </label>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1.5px solid #cbd5e1',
                  borderRadius: 'var(--radius-md)',
                  background: '#f8fafc',
                  padding: '0.35rem 0.75rem',
                  gap: '8px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-main)', borderRight: '1px solid #cbd5e1', paddingRight: '8px' }}>
                  <span>🇮🇳</span>
                  <span>+91</span>
                </div>

                <input
                  type="tel"
                  placeholder="Enter 10-digit mobile"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  maxLength={10}
                  autoFocus
                  style={{
                    border: 'none',
                    background: 'transparent',
                    width: '100%',
                    fontSize: '1rem',
                    fontWeight: 800,
                    outline: 'none',
                    color: 'var(--text-main)',
                    letterSpacing: '1px'
                  }}
                />
              </div>
            </div>

            {errorMsg && (
              <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-md)', fontSize: '0.78rem', fontWeight: 700, marginBottom: '1rem' }}>
                ⚠️ {errorMsg}
              </div>
            )}

            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', padding: '0.9rem', fontSize: '0.95rem', borderRadius: 'var(--radius-full)' }}
            >
              <span>Continue with Secure OTP</span>
              <ArrowRight size={17} />
            </button>
          </form>
        ) : (
          /* Step 2: 4-Digit OTP Input */
          <form onSubmit={handleVerifyOtp}>
            <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.2rem' }}>
                Enter 4-Digit Security Code
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Sent to <strong>+91 {phone}</strong>
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
                    borderRadius: 'var(--radius-md)',
                    border: digit ? '2px solid var(--primary)' : '1.5px solid #cbd5e1',
                    background: digit ? '#eff6ff' : '#f8fafc',
                    fontSize: '1.5rem',
                    fontWeight: 900,
                    textAlign: 'center',
                    outline: 'none',
                    color: 'var(--text-main)',
                    boxShadow: digit ? '0 2px 8px rgba(37,99,235,0.15)' : 'none'
                  }}
                />
              ))}
            </div>

            {errorMsg && (
              <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-md)', fontSize: '0.78rem', fontWeight: 700, marginBottom: '1rem', textAlign: 'center' }}>
                ⚠️ {errorMsg}
              </div>
            )}

            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', padding: '0.9rem', fontSize: '0.95rem', borderRadius: 'var(--radius-full)', marginBottom: '0.75rem' }}
            >
              <CheckCircle2 size={17} />
              <span>Verify & Unlock Lunch Menu</span>
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
                color: 'var(--text-muted)',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                padding: '4px'
              }}
            >
              Change phone number
            </button>
          </form>
        )}

        {/* Demo Fast-Testing Pill Cards */}
        <div style={{ marginTop: '1.75rem', borderTop: '1px dashed #cbd5e1', paddingTop: '1.15rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '0.65rem' }}>
            <Sparkles size={14} color="var(--primary)" />
            <span style={{ fontSize: '0.72rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Quick Demo Logins (For Testing)
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.phone}
                onClick={() => handlePickDemo(acc)}
                type="button"
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.6rem 0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 900, color: 'var(--text-main)' }}>
                      {acc.name}
                    </span>
                    <span style={{ background: '#dbeafe', color: '#1e40af', padding: '1px 6px', borderRadius: '10px', fontSize: '0.62rem', fontWeight: 900 }}>
                      {acc.badge}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '1px' }}>
                    {acc.kidsDesc}
                  </div>
                </div>

                <div style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 800 }}>
                  1-Tap Login ➔
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Security Note */}
      <div style={{ textAlign: 'center', marginTop: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
        <Lock size={12} />
        <span>Student privacy protected • Verified parent access only</span>
      </div>
    </div>
  );
}
