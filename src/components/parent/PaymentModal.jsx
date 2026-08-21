import React, { useState, useEffect } from 'react';
import { X, Lock, QrCode, CreditCard, Building2, CheckCircle2, ShieldAlert, Loader2, Sparkles, Users, User, AlertCircle, ShoppingBag, Wallet, Zap, ShieldCheck } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { PaymentService } from '../../services/paymentService';
import { StorageService } from '../../services/storageService';

export default function PaymentModal({
  isOpen,
  onClose,
  verifiedStudent,
  checkoutMode = 'single', // 'single' | 'all'
  familyCheckoutData = [], // [{ student, cart, total }]
  selectedDate,
  selectedSlot,
  cart = [],
  cartTotal = 0,
  currency = '₹',
  activeSchool,
  parentSession,
  onPaymentSuccess,
  onOpenWalletTopUp
}) {
  const parentPhone = parentSession?.phone || 'default';
  const walletBalance = StorageService.getParentWalletBalance(parentPhone);

  const validFamilyData = Array.isArray(familyCheckoutData) ? familyCheckoutData : [];
  const isCombined = checkoutMode === 'all' && validFamilyData.length > 0;
  const effectiveTotal = isCombined
    ? validFamilyData.reduce((sum, k) => sum + (Number(k.total) || 0), 0)
    : (Number(cartTotal) || 0);

  const hasSufficientWallet = walletBalance >= effectiveTotal;
  const [selectedMethod, setSelectedMethod] = useState(hasSufficientWallet ? 'wallet' : 'upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // Keyboard Escape listener
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isProcessing) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isProcessing, onClose]);

  if (!isOpen) return null;

  const schoolId = activeSchool?.id || 'school';
  const canteenName = activeSchool?.canteenName || 'Campus Canteen';
  const upiPayPayload = `upi://pay?pa=canteen.${schoolId}@bank&pn=${encodeURIComponent(canteenName)}&am=${effectiveTotal}&cu=INR&tn=Family_Lunch_Order_${Date.now()}`;

  const handlePayNow = async () => {
    setIsProcessing(true);
    setErrorMsg(null);
    try {
      const summaryText = isCombined
        ? `Combined Lunch for ${validFamilyData.length} kids (${validFamilyData.map(k => k.student?.studentName?.split(' ')[0] || 'Child').join(', ')})`
        : `${(cart || []).length} item(s) for ${verifiedStudent?.studentName || 'Student'}`;

      const studentNameText = isCombined
        ? `${validFamilyData.length} Students (${validFamilyData.map(k => k.student?.studentName?.split(' ')[0] || 'Child').join(', ')})`
        : verifiedStudent?.studentName || 'Student';

      let result;
      if (selectedMethod === 'wallet') {
        const deductRes = StorageService.deductParentWallet(parentPhone, effectiveTotal, summaryText);
        if (!deductRes.success) {
          throw new Error('Insufficient wallet balance. Please top up your wallet.');
        }
        result = {
          success: true,
          transactionId: `WAL_${Date.now()}`,
          method: 'Campus Lunch Wallet',
          amount: effectiveTotal,
          studentName: studentNameText,
          timestamp: new Date().toISOString()
        };
      } else {
        result = await PaymentService.processPayment({
          amount: effectiveTotal,
          currency,
          studentName: studentNameText,
          orderSummary: summaryText,
          method: selectedMethod
        });
      }

      setIsProcessing(false);
      onPaymentSuccess(result, isCombined ? 'all' : 'single', validFamilyData);
    } catch (err) {
      setIsProcessing(false);
      setErrorMsg(err.message || 'Payment failed. Please retry.');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '500px', padding: '1.75rem', maxHeight: '92vh', overflowY: 'auto' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Lock size={20} color="#059669" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.12rem', fontWeight: 900 }}>
                {isCombined ? 'Family Lunch Checkout' : 'Online Payment'}
              </h2>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Authorized Campus Gateway
              </p>
            </div>
          </div>
          <button onClick={onClose} disabled={isProcessing} style={{ padding: '0.4rem', borderRadius: '50%', background: '#f1f5f9', border: 'none', cursor: 'pointer' }}>
            <X size={18} color="var(--text-main)" />
          </button>
        </div>

        {/* Order Summary Strip */}
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '0.85rem 1rem', marginBottom: '1rem' }}>
          {isCombined ? (
            /* Multi-Child Breakdown */
            <div style={{ marginBottom: '0.65rem' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 800, marginBottom: '0.45rem' }}>
                STUDENTS ({validFamilyData.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {validFamilyData.map((k, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: '#ffffff',
                      padding: '0.45rem 0.65rem',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      fontSize: '0.78rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
                      {k.student?.photo ? (
                        <img src={k.student.photo} alt="" style={{ width: '18px', height: '18px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                      ) : (
                        <User size={13} color="var(--primary)" style={{ flexShrink: 0 }} />
                      )}
                      <span style={{ fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{k.student?.studentName || 'Student'}</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', flexShrink: 0 }}>
                        ({k.student?.class || ''}-{k.student?.section || ''})
                      </span>
                    </div>
                    <span style={{ fontWeight: 900, color: 'var(--text-main)', flexShrink: 0, marginLeft: '8px' }}>
                      {currency} {k.total}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Single Student Clean Badge */
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem', paddingBottom: '0.6rem', borderBottom: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                {verifiedStudent?.photo ? (
                  <img src={verifiedStudent.photo} alt="" style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                ) : (
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <User size={15} />
                  </div>
                )}
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {verifiedStudent?.studentName || 'Student'}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    Class {verifiedStudent?.class || ''}-{verifiedStudent?.section || ''}
                  </div>
                </div>
              </div>
              <span style={{ background: '#eff6ff', color: 'var(--primary)', padding: '2px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 800, flexShrink: 0 }}>
                ID: {verifiedStudent?.id || ''}
              </span>
            </div>
          )}

          {/* Clean Delivery Slot Strip (Single Line) */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.76rem', marginBottom: '0.45rem' }}>
            <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>Delivering:</span>
            <strong style={{ color: 'var(--text-main)', whiteSpace: 'nowrap' }}>
              {selectedDate || 'Today'} • {selectedSlot?.name?.split('/')[0]?.trim() || 'Break'}
            </strong>
          </div>

          {/* Total */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.45rem', borderTop: '1px dashed #cbd5e1' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 800 }}>Total to Pay:</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#059669' }}>{currency} {effectiveTotal}</span>
          </div>
        </div>

        {/* Notice (Clean Single Line) */}
        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 'var(--radius-md)', padding: '0.55rem 0.8rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <Lock size={13} color="var(--primary)" style={{ flexShrink: 0 }} />
          <span style={{ fontSize: '0.72rem', color: '#1e40af', fontWeight: 600 }}>
            {isCombined
              ? 'Tokenized lunch boxes delivered directly to classrooms.'
              : 'Kitchen prepares meals after payment confirmation.'}
          </span>
        </div>

        {/* Payment Methods (Ranked by Business & UX Priority) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '0.5rem', marginBottom: '1.25rem' }}>
          {/* 1. Campus Wallet (Primary / Highest Business Value) */}
          <button
            onClick={() => setSelectedMethod('wallet')}
            style={{
              padding: '0.75rem 0.5rem',
              borderRadius: 'var(--radius-md)',
              border: selectedMethod === 'wallet' ? '2px solid #16a34a' : '1px solid var(--border-color)',
              background: selectedMethod === 'wallet' ? '#f0fdf4' : 'white',
              color: selectedMethod === 'wallet' ? '#15803d' : 'var(--text-main)',
              fontWeight: 800,
              fontSize: '0.78rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer',
              boxShadow: selectedMethod === 'wallet' ? '0 2px 8px rgba(22,163,74,0.15)' : 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Wallet size={16} color={selectedMethod === 'wallet' ? '#16a34a' : 'var(--primary)'} />
              <span>Campus Wallet</span>
            </div>
            <span style={{ fontSize: '0.66rem', color: '#15803d', fontWeight: 800, background: '#dcfce7', padding: '1px 6px', borderRadius: '4px' }}>
              1-Tap Pay
            </span>
          </button>

          {/* 2. Instant UPI (Highest Consumer Volume in India) */}
          <button
            onClick={() => setSelectedMethod('upi')}
            style={{
              padding: '0.75rem 0.5rem',
              borderRadius: 'var(--radius-md)',
              border: selectedMethod === 'upi' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
              background: selectedMethod === 'upi' ? 'var(--primary-light)' : 'white',
              color: selectedMethod === 'upi' ? 'var(--primary)' : 'var(--text-main)',
              fontWeight: 800,
              fontSize: '0.78rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <QrCode size={16} />
              <span>UPI QR / App</span>
            </div>
            <span style={{ fontSize: '0.66rem', color: '#64748b', fontWeight: 600 }}>
              GPay / PhonePe
            </span>
          </button>

          {/* 3. Debit / Credit Card */}
          <button
            onClick={() => setSelectedMethod('card')}
            style={{
              padding: '0.75rem 0.5rem',
              borderRadius: 'var(--radius-md)',
              border: selectedMethod === 'card' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
              background: selectedMethod === 'card' ? 'var(--primary-light)' : 'white',
              color: selectedMethod === 'card' ? 'var(--primary)' : 'var(--text-main)',
              fontWeight: 800,
              fontSize: '0.78rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CreditCard size={16} />
              <span>Card</span>
            </div>
            <span style={{ fontSize: '0.66rem', color: '#64748b', fontWeight: 600 }}>
              Visa / RuPay
            </span>
          </button>
        </div>

        {/* Selected Method View */}
        {selectedMethod === 'wallet' && (
          <div style={{ marginBottom: '1.25rem' }}>
            {hasSufficientWallet ? (
              <div
                style={{
                  background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                  border: '1.5px solid #86efac',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  color: '#14532d'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#15803d', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Zap size={14} color="#16a34a" />
                    <span>Campus Meal Wallet Active</span>
                  </span>
                  <span style={{ fontSize: '0.92rem', fontWeight: 900, color: '#14532d' }}>
                    Bal: {currency} {walletBalance.toLocaleString('en-IN')}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: '#166534', padding: '4px 0', borderTop: '1px dashed #bbf7d0' }}>
                  <span>Deducting for this order:</span>
                  <strong>- {currency} {effectiveTotal}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: '#166534', paddingTop: '2px' }}>
                  <span>Remaining balance:</span>
                  <strong>{currency} {(walletBalance - effectiveTotal).toLocaleString('en-IN')}</strong>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.68rem', color: '#15803d', marginTop: '0.65rem', fontWeight: 700 }}>
                  <ShieldCheck size={12} />
                  <span>Instant 1-tap confirmation (Zero gateway loading or OTP delay)</span>
                </div>
              </div>
            ) : (
              <div
                style={{
                  background: '#fffbeb',
                  border: '1.5px solid #fde68a',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#92400e', marginBottom: '4px' }}>
                  Low Wallet Balance ({currency} {walletBalance})
                </div>
                <div style={{ fontSize: '0.72rem', color: '#78350f', marginBottom: '0.75rem' }}>
                  This order requires {currency} {effectiveTotal}. Top up or pay via UPI QR below.
                </div>
                {onOpenWalletTopUp && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenWalletTopUp();
                    }}
                    style={{
                      background: 'var(--primary)',
                      color: '#ffffff',
                      border: 'none',
                      padding: '5px 14px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    + Top-Up Wallet Now
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Selected Method View */}
        {selectedMethod === 'upi' && (
          <div style={{ textAlign: 'center', padding: '1rem', background: '#f8fafc', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
            <div style={{ display: 'inline-block', padding: '10px', background: 'white', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', marginBottom: '0.75rem' }}>
              <QRCodeSVG value={upiPayPayload} size={150} />
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Scan with GPay, PhonePe, Paytm, or BHIM
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              VPA: <strong>canteen.{schoolId}@bank</strong>
            </div>

            {/* Wallet Top-Up Upsell */}
            {onOpenWalletTopUp && (
              <div
                onClick={() => {
                  onClose();
                  onOpenWalletTopUp();
                }}
                style={{
                  marginTop: '0.85rem',
                  padding: '6px 10px',
                  background: '#eff6ff',
                  border: '1px dashed #bfdbfe',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.7rem',
                  color: '#1e40af',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px'
                }}
              >
                <Sparkles size={12} color="#2563eb" />
                <span>Top up Wallet with UPI for ₹50 bonus & 1-tap checkout next time</span>
              </div>
            )}
          </div>
        )}

        {selectedMethod === 'card' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <input
              type="text"
              placeholder="Card Number (4000 1234 5678 9010)"
              defaultValue="4532 8901 2345 6789"
              style={{ width: '100%', padding: '0.65rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}
            />
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                placeholder="MM/YY"
                defaultValue="12/28"
                style={{ width: '50%', padding: '0.65rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}
              />
              <input
                type="password"
                placeholder="CVV"
                defaultValue="888"
                maxLength={3}
                style={{ width: '50%', padding: '0.65rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}
              />
            </div>
          </div>
        )}

        {errorMsg && (
          <div style={{ color: '#dc2626', fontSize: '0.78rem', marginBottom: '1rem', textAlign: 'center', background: '#fef2f2', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Action CTA */}
        <button
          onClick={handlePayNow}
          disabled={isProcessing}
          className="btn-primary"
          style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem' }}
        >
          {isProcessing ? (
            <>
              <Loader2 className="spin-icon" size={18} />
              <span>Verifying Canteen Payment...</span>
            </>
          ) : (
            <>
              <CheckCircle2 size={18} />
              <span>
                {isCombined
                  ? `Pay ${currency} ${effectiveTotal} for All ${validFamilyData.length} Kids`
                  : `Pay ${currency} ${effectiveTotal} Now`}
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
