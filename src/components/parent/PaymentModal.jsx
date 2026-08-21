import React, { useState } from 'react';
import { X, Lock, QrCode, CreditCard, Building2, CheckCircle2, ShieldAlert, Loader2, Sparkles, Users, User } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { PaymentService } from '../../services/paymentService';

export default function PaymentModal({
  isOpen,
  onClose,
  verifiedStudent,
  checkoutMode = 'single', // 'single' | 'all'
  familyCheckoutData = [], // [{ student, cart, total }]
  selectedDate,
  selectedSlot,
  cart,
  cartTotal,
  currency,
  activeSchool,
  parentSession,
  onPaymentSuccess
}) {
  const [selectedMethod, setSelectedMethod] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  if (!isOpen) return null;

  const isCombined = checkoutMode === 'all' && familyCheckoutData.length > 1;
  const effectiveTotal = isCombined
    ? familyCheckoutData.reduce((sum, k) => sum + k.total, 0)
    : cartTotal;

  const upiPayPayload = `upi://pay?pa=canteen.${activeSchool.id}@bank&pn=${encodeURIComponent(activeSchool.canteenName)}&am=${effectiveTotal}&cu=INR&tn=Family_Lunch_Order_${Date.now()}`;

  const handlePayNow = async () => {
    setIsProcessing(true);
    setErrorMsg(null);
    try {
      const result = await PaymentService.processPayment({
        amount: effectiveTotal,
        currency,
        studentName: isCombined
          ? `${familyCheckoutData.length} Students (${familyCheckoutData.map(k => k.student.studentName.split(' ')[0]).join(', ')})`
          : verifiedStudent?.studentName || 'Student',
        orderSummary: isCombined
          ? `Combined Lunch for ${familyCheckoutData.length} kids (${familyCheckoutData.map(k => k.student.studentName.split(' ')[0]).join(', ')})`
          : `${cart.length} item(s) for ${verifiedStudent?.studentName}`,
        method: selectedMethod
      });

      setIsProcessing(false);
      onPaymentSuccess(result, isCombined ? 'all' : 'single', familyCheckoutData);
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
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                {isCombined ? '💳 Combined Family Payment' : '💳 Online Payment'}
              </h2>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                {isCombined ? `1-Tap Checkout for ${familyCheckoutData.length} Lunch Boxes` : 'Authorized Campus Gateway'}
              </p>
            </div>
          </div>
          <button onClick={onClose} disabled={isProcessing} style={{ padding: '0.4rem', borderRadius: '50%', background: '#f1f5f9', border: 'none', cursor: 'pointer' }}>
            <X size={18} color="var(--text-main)" />
          </button>
        </div>

        {/* Order Summary Strip */}
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-md)', padding: '0.85rem 1rem', marginBottom: '1rem' }}>
          {isCombined ? (
            /* Multi-Child Family Breakdown */
            <div>
              <div style={{ fontSize: '0.74rem', color: 'var(--primary)', fontWeight: 900, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Users size={14} />
                <span>FAMILY LUNCH BOXES ({familyCheckoutData.length} STUDENTS)</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginBottom: '0.6rem' }}>
                {familyCheckoutData.map((k, i) => (
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
                    <div>
                      <span style={{ fontWeight: 800 }}>🍱 {k.student.studentName}</span>
                      <span style={{ color: 'var(--text-muted)', marginLeft: '4px', fontSize: '0.7rem' }}>
                        ({k.student.class}-{k.student.section})
                      </span>
                    </div>
                    <span style={{ fontWeight: 900, color: 'var(--text-main)' }}>
                      {currency} {k.total}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Single Student Summary */
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700 }}>STUDENT:</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>{verifiedStudent?.studentName} ({verifiedStudent?.class}-{verifiedStudent?.section})</span>
            </div>
          )}

          {parentSession && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700 }}>ORDERED BY:</span>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary)' }}>
                {parentSession.parentName} ({parentSession.relation || 'Parent'})
              </span>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700 }}>SLOT & DATE:</span>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)' }}>{selectedDate} • {selectedSlot?.name}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 800 }}>
              {isCombined ? `Combined Total (${familyCheckoutData.length} Kids):` : 'Total Amount:'}
            </span>
            <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#059669' }}>{currency} {effectiveTotal}</span>
          </div>
        </div>

        {/* Mandatory Payment Notice */}
        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 'var(--radius-md)', padding: '0.65rem 0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Lock size={15} color="var(--primary)" />
          <span style={{ fontSize: '0.72rem', color: '#1e40af', fontWeight: 700 }}>
            {isCombined
              ? 'Separate tokenized meal boxes will be dispatched to each child\'s classroom desk!'
              : 'Mandatory Payment: Canteen kitchen prepares meals only after online payment verification.'}
          </span>
        </div>

        {/* Payment Methods */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <button
            onClick={() => setSelectedMethod('upi')}
            style={{
              flex: 1,
              padding: '0.65rem 0.5rem',
              borderRadius: 'var(--radius-md)',
              border: selectedMethod === 'upi' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
              background: selectedMethod === 'upi' ? 'var(--primary-light)' : 'white',
              color: selectedMethod === 'upi' ? 'var(--primary)' : 'var(--text-main)',
              fontWeight: 700,
              fontSize: '0.8rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer'
            }}
          >
            <QrCode size={18} />
            <span>Instant UPI QR</span>
          </button>

          <button
            onClick={() => setSelectedMethod('card')}
            style={{
              flex: 1,
              padding: '0.65rem 0.5rem',
              borderRadius: 'var(--radius-md)',
              border: selectedMethod === 'card' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
              background: selectedMethod === 'card' ? 'var(--primary-light)' : 'white',
              color: selectedMethod === 'card' ? 'var(--primary)' : 'var(--text-main)',
              fontWeight: 700,
              fontSize: '0.8rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer'
            }}
          >
            <CreditCard size={18} />
            <span>Debit / Credit</span>
          </button>

          <button
            onClick={() => setSelectedMethod('netbanking')}
            style={{
              flex: 1,
              padding: '0.65rem 0.5rem',
              borderRadius: 'var(--radius-md)',
              border: selectedMethod === 'netbanking' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
              background: selectedMethod === 'netbanking' ? 'var(--primary-light)' : 'white',
              color: selectedMethod === 'netbanking' ? 'var(--primary)' : 'var(--text-main)',
              fontWeight: 700,
              fontSize: '0.8rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer'
            }}
          >
            <Building2 size={18} />
            <span>Net Banking</span>
          </button>
        </div>

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
              VPA: <strong>canteen.{activeSchool.id}@bank</strong>
            </div>
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

        {selectedMethod === 'netbanking' && (
          <div style={{ marginBottom: '1.25rem' }}>
            <select
              style={{ width: '100%', padding: '0.65rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}
            >
              <option>HDFC Bank</option>
              <option>State Bank of India (SBI)</option>
              <option>ICICI Bank</option>
              <option>Axis Bank</option>
              <option>Kotak Mahindra Bank</option>
            </select>
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
                  ? `Pay ${currency} ${effectiveTotal} for All ${familyCheckoutData.length} Kids`
                  : `Pay ${currency} ${effectiveTotal} Now`}
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
