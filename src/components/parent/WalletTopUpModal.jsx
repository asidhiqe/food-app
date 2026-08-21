import React, { useState } from 'react';
import { X, CreditCard, Plus, ArrowUpRight, ArrowDownLeft, ShieldCheck, Sparkles, CheckCircle2, Wallet, Zap } from 'lucide-react';
import { StorageService } from '../../services/storageService';

const TOPUP_PRESETS = [
  {
    amount: 500,
    bonus: 0,
    label: 'Standard',
    subtext: 'Ideal for 1 week snacks'
  },
  {
    amount: 1000,
    bonus: 50,
    label: 'Most Popular',
    subtext: 'Get ₹50 Free Bonus credit',
    isPopular: true
  },
  {
    amount: 2000,
    bonus: 150,
    label: '22-Day Meal Pass',
    subtext: 'Get ₹150 Free Bonus credit'
  }
];

export default function WalletTopUpModal({
  isOpen,
  onClose,
  walletBalance,
  onWalletUpdated,
  currency = '₹',
  parentPhone = 'default'
}) {
  const [selectedPreset, setSelectedPreset] = useState(TOPUP_PRESETS[1]);
  const [customAmount, setCustomAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('topup'); // 'topup' | 'history'
  const [successToast, setSuccessToast] = useState(null);

  if (!isOpen) return null;

  const transactions = StorageService.getWalletTransactions(parentPhone);

  const handleTopUp = () => {
    setIsProcessing(true);
    const amount = customAmount ? Number(customAmount) : selectedPreset.amount;
    const bonus = customAmount ? 0 : selectedPreset.bonus;

    setTimeout(() => {
      const newBal = StorageService.topUpParentWallet(parentPhone, amount, bonus, 'UPI Instant');
      setIsProcessing(false);
      onWalletUpdated(newBal);
      setSuccessToast(`🎉 Successfully added ${currency} ${amount + bonus} to Campus Wallet!`);
      setTimeout(() => {
        setSuccessToast(null);
        onClose();
      }, 1500);
    }, 600);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '440px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #e2e8f0'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Wallet size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>
                Campus Lunch Wallet
              </h3>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                1-Tap cashless school canteen payments
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: '4px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Balance Card */}
        <div style={{ padding: '1rem 1.25rem 0.5rem' }}>
          <div
            style={{
              background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.2rem',
              color: '#ffffff',
              boxShadow: '0 8px 24px rgba(37,99,235,0.25)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{ fontSize: '0.72rem', color: '#bfdbfe', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Available Meal Balance
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 900, marginTop: '2px', letterSpacing: '-0.02em' }}>
              {currency} {walletBalance.toLocaleString('en-IN')}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '8px', fontSize: '0.72rem', color: '#dbeafe' }}>
              <Zap size={13} color="#fde047" />
              <span>Instant 1-tap checkout enabled for all siblings</span>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', padding: '0.5rem 1.25rem', gap: '8px' }}>
          <button
            onClick={() => setActiveTab('topup')}
            style={{
              flex: 1,
              padding: '6px 0',
              borderRadius: 'var(--radius-full)',
              border: activeTab === 'topup' ? '1.5px solid var(--primary)' : '1px solid #e2e8f0',
              background: activeTab === 'topup' ? '#eff6ff' : '#ffffff',
              color: activeTab === 'topup' ? 'var(--primary)' : 'var(--text-muted)',
              fontSize: '0.78rem',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            + Add Funds
          </button>
          <button
            onClick={() => setActiveTab('history')}
            style={{
              flex: 1,
              padding: '6px 0',
              borderRadius: 'var(--radius-full)',
              border: activeTab === 'history' ? '1.5px solid var(--primary)' : '1px solid #e2e8f0',
              background: activeTab === 'history' ? '#eff6ff' : '#ffffff',
              color: activeTab === 'history' ? 'var(--primary)' : 'var(--text-muted)',
              fontSize: '0.78rem',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            Passbook History
          </button>
        </div>

        {/* Tab Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0.75rem 1.25rem 1.25rem' }}>
          {successToast ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <CheckCircle2 size={48} color="#16a34a" style={{ margin: '0 auto 0.75rem' }} />
              <h4 style={{ fontSize: '1rem', fontWeight: 900, color: '#15803d' }}>
                {successToast}
              </h4>
            </div>
          ) : activeTab === 'topup' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Select Top-Up Amount:
              </div>

              {/* Preset Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {TOPUP_PRESETS.map((preset) => {
                  const isSelected = !customAmount && selectedPreset.amount === preset.amount;

                  return (
                    <div
                      key={preset.amount}
                      onClick={() => {
                        setCustomAmount('');
                        setSelectedPreset(preset);
                      }}
                      style={{
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        border: isSelected ? '2px solid var(--primary)' : '1px solid #e2e8f0',
                        background: isSelected ? '#f8fafc' : '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        boxShadow: isSelected ? '0 2px 8px rgba(37,99,235,0.1)' : 'none',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '1.05rem', fontWeight: 900, color: 'var(--text-main)' }}>
                            {currency} {preset.amount}
                          </span>
                          {preset.bonus > 0 && (
                            <span style={{ fontSize: '0.68rem', fontWeight: 800, background: '#dcfce7', color: '#15803d', padding: '1px 6px', borderRadius: '4px' }}>
                              + {currency} {preset.bonus} FREE Bonus
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '2px' }}>
                          {preset.subtext}
                        </div>
                      </div>

                      <div
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          border: isSelected ? '5px solid var(--primary)' : '2px solid #cbd5e1',
                          background: '#ffffff'
                        }}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Security Shield Note */}
              <div
                style={{
                  background: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.55rem 0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.72rem',
                  color: '#15803d',
                  fontWeight: 700
                }}
              >
                <ShieldCheck size={14} />
                <span>100% Refundable to bank account if unused at term-end</span>
              </div>

              {/* Action Button */}
              <button
                onClick={handleTopUp}
                disabled={isProcessing}
                className="btn-primary"
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  fontSize: '0.92rem',
                  marginTop: '0.5rem'
                }}
              >
                {isProcessing ? 'Processing Top-Up...' : `Add ${currency} ${customAmount || (selectedPreset.amount + selectedPreset.bonus)} to Wallet →`}
              </button>
            </div>
          ) : (
            /* History Tab */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {transactions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  No transaction history yet
                </div>
              ) : (
                transactions.map((tx) => {
                  const isTopup = tx.type === 'TOPUP';
                  const txDate = new Date(tx.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  });

                  return (
                    <div
                      key={tx.id}
                      style={{
                        padding: '0.65rem 0.85rem',
                        borderRadius: 'var(--radius-md)',
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            background: isTopup ? '#dcfce7' : '#f1f5f9',
                            color: isTopup ? '#15803d' : '#64748b',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          {isTopup ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                        </div>
                        <div>
                          <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)' }}>
                            {tx.title}
                          </div>
                          <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)' }}>
                            {txDate} • {tx.paymentMethod}
                          </div>
                        </div>
                      </div>

                      <div
                        style={{
                          fontSize: '0.88rem',
                          fontWeight: 900,
                          color: isTopup ? '#16a34a' : '#0f172a'
                        }}
                      >
                        {isTopup ? `+ ${currency} ${tx.amount}` : `- ${currency} ${tx.amount}`}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
