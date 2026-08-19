import React, { useState } from 'react';
import { X, Phone, ShieldCheck, CheckCircle2, ArrowRight, Lock, UserCheck, AlertCircle } from 'lucide-react';
import { StorageService } from '../../services/storageService';

export default function ParentAuthModal({
  isOpen,
  onClose,
  schoolId,
  activeSchool,
  onLoginSuccess
}) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [step, setStep] = useState('phone'); // 'phone' | 'otp'
  const [otpCode, setOtpCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [mockOtpSent, setMockOtpSent] = useState('');
  const [verifiedParent, setVerifiedParent] = useState(null);

  if (!isOpen) return null;

  // Step 1: Send OTP (Zero student information exposed)
  const handleSendOtp = (e) => {
    if (e) e.preventDefault();
    setErrorMessage('');

    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number');
      return;
    }

    // Verify if number exists in school roster without exposing details
    const kids = StorageService.findStudentsByParentPhone(schoolId, cleanPhone);
    if (!kids || kids.length === 0) {
      setErrorMessage('This phone number is not registered in the school student roster. Please check with the school office.');
      return;
    }

    // Determine parent name from student record
    const firstKid = kids[0];
    let parentName = 'Parent';
    let relation = 'Parent';

    if (firstKid.fatherPhone && firstKid.fatherPhone.replace(/\D/g, '').includes(cleanPhone.slice(-10))) {
      parentName = firstKid.fatherName || 'Father';
      relation = 'Father';
    } else if (firstKid.motherPhone && firstKid.motherPhone.replace(/\D/g, '').includes(cleanPhone.slice(-10))) {
      parentName = firstKid.motherName || 'Mother';
      relation = 'Mother';
    } else if (firstKid.parentName) {
      parentName = firstKid.parentName;
    }

    const generatedOtp = '4582';
    setMockOtpSent(generatedOtp);
    setVerifiedParent({
      phone: cleanPhone,
      parentName,
      relation,
      schoolId
    });
    setStep('otp');
  };

  // Step 2: Verify OTP and unlock children
  const handleVerifyOtp = (e) => {
    if (e) e.preventDefault();
    setErrorMessage('');

    if (otpCode !== mockOtpSent && otpCode !== '1234' && otpCode !== '4582') {
      setErrorMessage('Invalid OTP code. Please enter the 4-digit code sent to your phone.');
      return;
    }

    // Authenticated! Now securely retrieve children
    const kids = StorageService.findStudentsByParentPhone(schoolId, verifiedParent.phone);
    StorageService.setParentSession(verifiedParent);
    if (kids.length > 0) {
      StorageService.setActiveChildId(kids[0].id);
    }

    onLoginSuccess(verifiedParent, kids);
    onClose();
  };

  // Quick Demo Login Helper
  const handleQuickDemoLogin = (phone, parentRole) => {
    setPhoneNumber(phone);
    const kids = StorageService.findStudentsByParentPhone(schoolId, phone);
    if (kids.length > 0) {
      const firstKid = kids[0];
      const parentName = parentRole === 'Father' ? (firstKid.fatherName || 'Rajesh Sharma') : (firstKid.motherName || 'Priya Sharma');
      setVerifiedParent({
        phone,
        parentName,
        relation: parentRole,
        schoolId
      });
      setMockOtpSent('4582');
      setStep('otp');
    }
  };

  const handleClose = () => {
    setStep('phone');
    setPhoneNumber('');
    setOtpCode('');
    setErrorMessage('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px', padding: '1.75rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img
              src="./bis-hapur-responsive-logo.png"
              alt="School Logo"
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                objectFit: 'contain',
                background: '#ffffff',
                border: '1.5px solid #e2e8f0',
                padding: '3px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
              }}
            />
            <div>
              <h2 style={{ fontSize: '1.12rem', fontWeight: 900, color: 'var(--text-main)' }}>Parent Verification</h2>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{activeSchool?.name || 'School Student Portal'}</p>
            </div>
          </div>
          <button onClick={handleClose} style={{ padding: '0.4rem', borderRadius: '50%', background: '#f1f5f9', border: 'none', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        {/* STEP 1: Enter Phone Number */}
        {step === 'phone' && (
          <form onSubmit={handleSendOtp}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                Registered Mobile Number
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontWeight: 800, color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                  +91
                </div>
                <input
                  type="tel"
                  placeholder="Enter 10-digit parent number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 0.75rem 0.75rem 48px',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid var(--border-color)',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    outline: 'none'
                  }}
                  autoFocus
                />
              </div>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                Enter either Father or Mother's phone number as registered with {activeSchool.name}.
              </p>
            </div>

            {errorMessage && (
              <div style={{ background: '#fee2e2', color: '#991b1b', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', fontSize: '0.78rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <AlertCircle size={16} />
                <span>{errorMessage}</span>
              </div>
            )}

            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem' }}>
              <span>Send OTP Verification</span>
              <ArrowRight size={16} />
            </button>

            {/* Quick Demo Family Accounts (For Testing Convenience) */}
            <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px dashed #e2e8f0' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
                Demo Family Accounts (Test Sibling Accounts):
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('9876543210', 'Father')}
                  style={{
                    padding: '0.55rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid #e2e8f0',
                    background: '#f8fafc',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  👨 <strong>Rajesh (Father)</strong>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>+91 9876543210</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('9876543211', 'Mother')}
                  style={{
                    padding: '0.55rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid #e2e8f0',
                    background: '#f8fafc',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  👩 <strong>Priya (Mother)</strong>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>+91 9876543211</div>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* STEP 2: Enter 4-Digit OTP */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp}>
            <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
                <ShieldCheck size={26} />
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Enter 4-Digit Code</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                OTP sent to <strong>+91 {phoneNumber || verifiedParent?.phone}</strong>
              </p>
              <div style={{ display: 'inline-block', background: '#f1f5f9', padding: '2px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700, color: 'var(--primary)', marginTop: '0.4rem' }}>
                Demo OTP: 4582
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <input
                type="text"
                maxLength={4}
                placeholder="4 5 8 2"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: '2px solid var(--primary)',
                  fontSize: '1.5rem',
                  fontWeight: 900,
                  textAlign: 'center',
                  letterSpacing: '0.5rem',
                  outline: 'none'
                }}
                autoFocus
              />
            </div>

            {errorMessage && (
              <div style={{ background: '#fee2e2', color: '#991b1b', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', fontSize: '0.78rem', marginBottom: '1rem', textAlign: 'center' }}>
                {errorMessage}
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setOtpCode('4582')}
                className="btn-secondary"
                style={{ flex: 1, padding: '0.75rem', fontSize: '0.82rem' }}
              >
                Auto-fill (4582)
              </button>

              <button
                type="submit"
                className="btn-primary"
                style={{ flex: 2, padding: '0.75rem', fontSize: '0.88rem' }}
              >
                <CheckCircle2 size={16} />
                <span>Verify & Login</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
