import React from 'react';
import { User, Users, Check, Sparkles, LogOut, Phone, ShieldCheck, Clock } from 'lucide-react';

export default function ChildSwitcher({
  parentSession,
  childrenList,
  activeChild,
  onSelectChild,
  onOpenAuthModal,
  onLogout,
  ordersForToday
}) {
  if (!parentSession) {
    return (
      <div
        className="glass-card"
        style={{
          padding: '1rem 1.25rem',
          marginBottom: '1.25rem',
          background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
          border: '1.5px solid #93c5fd',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1e3a8a' }}>
              Parent & Sibling Auto-Login
            </div>
            <div style={{ fontSize: '0.75rem', color: '#3b82f6', fontWeight: 600 }}>
              Enter mobile number once to link all your children in this school
            </div>
          </div>
        </div>

        <button
          onClick={onOpenAuthModal}
          className="btn-primary"
          style={{ padding: '0.55rem 1.1rem', fontSize: '0.82rem', borderRadius: 'var(--radius-full)' }}
        >
          <Phone size={14} />
          <span>Login with Mobile OTP</span>
        </button>
      </div>
    );
  }

  return (
    <div className="glass-card" style={{ padding: '1rem 1.25rem', marginBottom: '1.25rem' }}>
      {/* Parent Greeting Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.1rem' }}>👋</span>
          <div>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {parentSession.parentName}
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: '6px', background: '#f1f5f9', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>
              {parentSession.relation || 'Parent'} ({parentSession.phone})
            </span>
          </div>
        </div>

        <button
          onClick={onLogout}
          style={{ fontSize: '0.72rem', color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}
        >
          <LogOut size={13} />
          <span>Change Number</span>
        </button>
      </div>

      {/* Sibling / Child Switcher Pills */}
      <div>
        <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span>SELECT CHILD TO ORDER FOOD FOR:</span>
          {childrenList.length > 1 && (
            <span style={{ background: '#ecfdf5', color: '#047857', padding: '1px 6px', borderRadius: '10px', fontSize: '0.68rem' }}>
              {childrenList.length} Siblings Linked
            </span>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
          {childrenList.map((child) => {
            const isSelected = activeChild?.id === child.id;
            const childOrderToday = ordersForToday?.find((o) => o.studentId === child.id && o.deliveryStatus !== 'DELIVERED');

            return (
              <button
                key={child.id}
                onClick={() => onSelectChild(child)}
                style={{
                  textAlign: 'left',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-lg)',
                  border: isSelected ? '2px solid var(--primary)' : '1.5px solid var(--border-color)',
                  background: isSelected ? 'var(--primary-light)' : '#ffffff',
                  transition: 'all 0.15s ease',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  cursor: 'pointer',
                  boxShadow: isSelected ? '0 4px 12px rgba(37,99,235,0.12)' : 'none'
                }}
              >
                {/* Avatar */}
                <div
                  style={{
                    fontSize: '1.4rem',
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: isSelected ? 'white' : '#f8fafc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: isSelected ? '1.5px solid var(--primary)' : '1px solid #e2e8f0',
                    flexShrink: 0
                  }}
                >
                  {child.avatar || '🎓'}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 800, color: isSelected ? 'var(--primary)' : 'var(--text-main)' }}>
                      {child.studentName}
                    </span>
                    {isSelected && <Check size={14} color="var(--primary)" style={{ flexShrink: 0 }} />}
                  </div>

                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    {child.class} - {child.section} • ID: {child.id}
                  </div>

                  {/* Active Order Today Badge */}
                  {childOrderToday && (
                    <div style={{ marginTop: '3px', display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '0.68rem', fontWeight: 800, color: '#b45309', background: '#fef3c7', padding: '1px 6px', borderRadius: '4px' }}>
                      <Clock size={10} />
                      <span>{childOrderToday.mealPeriodName.split(' ')[0]} Order Active</span>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
