import React, { useState } from 'react';
import { X, Lock, QrCode, CreditCard, Building2, CheckCircle2, ShieldAlert, Loader2, Sparkles } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { PaymentService } from '../../services/paymentService';

export default function PaymentModal({
  isOpen,
  onClose,
  verifiedStudent,
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

  if (!isOpen || !verifiedStudent) return null;

  const upiPayPayload = `upi://pay?pa=canteen.${activeSchool.id}@bank&pn=${encodeURIComponent(activeSchool.canteenName)}&am=${cartTotal}&cu=INR&tn=Meal_Order_${verifiedStudent.id}`;

  const handlePayNow = async () => {
    setIsProcessing(true);
    setErrorMsg(null);
    try {
      const result = await PaymentService.processPayment({
        amount: cartTotal,
        currency,
        studentName: verifiedStudent.studentName,
        orderSummary: `${cart.length} item(s) for ${verifiedStudent.studentName}`,
        method: selectedMethod
      });

      setIsProcessing(false);
      onPaymentSuccess(result);
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
        style={{ maxWidth: '500px', padding: '1.75rem' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Lock size={20} color="#059669" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Compulsory Online Payment</h2>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Authorized Gateway Simulator</p>
            </div>
          </div>
          <button onClick={onClose} disabled={isProcessing} style={{ padding: '0.4rem', borderRadius: '50%', background: '#f1f5f9' }}>
            <X size={18} color="var(--text-main)" />
          </button>
        </div>

        {/* Order Summary Strip */}
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-md)', padding: '0.85rem 1rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700 }}>STUDENT:</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>{verifiedStudent.studentName} ({verifiedStudent.class}-{verifiedStudent.section})</span>
          </div>

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
            <span style={{ fontSize: '0.9rem', fontWeight: 800 }}>Total Amount:</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#059669' }}>{currency} {cartTotal}</span>
          </div>
        </div>

        {/* Mandatory Payment Notice */}
        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 'var(--radius-md)', padding: '0.65rem 0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Lock size={15} color="var(--primary)" />
          <span style={{ fontSize: '0.72rem', color: '#1e40af', fontWeight: 700 }}>
            Mandatory Payment: Canteen kitchen prepares meals only after online payment verification.
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
              gap: '4px'
            }}
          >
            <QrCode size={20} />
            <span>UPI / QR</span>
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
              gap: '4px'
            }}
          >
            <CreditCard size={20} />
            <span>Card</span>
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
              gap: '4px'
            }}
          >
            <Building2 size={20} />
            <span>Net Banking</span>
          </button>
        </div>

        {/* UPI QR Display */}
        {selectedMethod === 'upi' && (
          <div style={{ textAlign: 'center', padding: '1rem', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
            <div style={{ display: 'inline-block', padding: '8px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '8px' }}>
              <QRCodeSVG value={upiPayPayload} size={130} />
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              Scan with GPay, PhonePe, Paytm, or BHIM
            </div>
          </div>
        )}

        {/* Card Mock Details */}
        {selectedMethod === 'card' && (
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <input type="text" placeholder="Card Number (4532 •••• •••• 8890)" defaultValue="4532 8901 2345 8890" style={{ padding: '0.6rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontWeight: 600 }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <input type="text" placeholder="MM / YY" defaultValue="12/28" style={{ padding: '0.6rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontWeight: 600 }} />
              <input type="password" placeholder="CVV" defaultValue="789" style={{ padding: '0.6rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontWeight: 600 }} />
            </div>
          </div>
        )}

        {/* Netbanking Mock */}
        {selectedMethod === 'netbanking' && (
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
            <select style={{ width: '100%', padding: '0.6rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontWeight: 600 }}>
              <option>HDFC Bank</option>
              <option>State Bank of India (SBI)</option>
              <option>ICICI Bank</option>
              <option>Axis Bank</option>
              <option>Kotak Mahindra</option>
            </select>
          </div>
        )}

        {errorMsg && (
          <div style={{ background: '#fee2e2', color: '#991b1b', padding: '0.6rem', borderRadius: '6px', fontSize: '0.78rem', marginBottom: '1rem' }}>
            {errorMsg}
          </div>
        )}

        {/* Pay Button */}
        <button
          onClick={handlePayNow}
          disabled={isProcessing}
          className="btn-primary"
          style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', background: '#059669', boxShadow: '0 4px 14px rgba(5, 150, 105, 0.3)' }}
        >
          {isProcessing ? (
            <>
              <Loader2 size={18} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
              <span>Authorizing Payment...</span>
            </>
          ) : (
            <>
              <CheckCircle2 size={18} />
              <span>Confirm & Pay {currency} {cartTotal}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
