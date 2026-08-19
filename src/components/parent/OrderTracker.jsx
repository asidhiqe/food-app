import React from 'react';
import { ArrowLeft, CheckCircle2, Clock, ChefHat, Package, Send, Check, ShieldCheck, MapPin, Sparkles, Flame } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const ORDER_STAGES = [
  {
    key: 'NEW',
    label: 'Order Confirmed & Paid',
    subtext: 'Payment received. Sent to canteen kitchen.',
    icon: CheckCircle2,
    color: '#2563eb',
    bg: '#dbeafe'
  },
  {
    key: 'ACCEPTED',
    label: 'Accepted by Kitchen',
    subtext: 'Canteen staff acknowledged today’s meal.',
    icon: Check,
    color: '#0284c7',
    bg: '#e0f2fe'
  },
  {
    key: 'PREPARING',
    label: 'Freshly Preparing Meal',
    subtext: 'Chef is cooking & assembling in kitchen.',
    icon: Flame,
    color: '#d97706',
    bg: '#fef3c7'
  },
  {
    key: 'PACKED',
    label: 'Meal Box Packed & Labeled',
    subtext: 'Thermal box packed with QR sticker for dispatch.',
    icon: Package,
    color: '#7c3aed',
    bg: '#ede9fe'
  },
  {
    key: 'DELIVERED',
    label: 'Delivered to Classroom',
    subtext: 'Handed over directly to student in class.',
    icon: Sparkles,
    color: '#16a34a',
    bg: '#dcfce7'
  }
];

export default function OrderTracker({ orders, onBackToMenu, currency, activeSchool }) {
  const getStageIndex = (status) => {
    switch (status) {
      case 'NEW': return 0;
      case 'ACCEPTED': return 1;
      case 'PREPARING': return 2;
      case 'PACKED':
      case 'READY': return 3;
      case 'DELIVERED': return 4;
      default: return 0;
    }
  };

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto' }}>
      {/* Top Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <button
          onClick={onBackToMenu}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 12px',
            borderRadius: 'var(--radius-full)',
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            color: 'var(--text-main)',
            fontSize: '0.78rem',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            transition: 'all 0.15s ease'
          }}
        >
          <ArrowLeft size={14} />
          <span>Back to Menu</span>
        </button>

        <h2 style={{ fontSize: '1.1rem', fontWeight: 900 }}>Live Order Tracking</h2>
        <div style={{ width: '80px' }} />
      </div>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', background: '#ffffff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📋</div>
          <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>No active orders found</h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Place a meal order to track real-time kitchen progress.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {orders.map((order) => {
            const currentStageIdx = getStageIndex(order.status);
            const isDelivered = order.status === 'DELIVERED';

            return (
              <div
                key={order.id}
                style={{
                  background: '#ffffff',
                  border: isDelivered ? '1.5px solid #86efac' : '1.5px solid #bfdbfe',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-md)',
                  overflow: 'hidden'
                }}
              >
                {/* Order Top Bar */}
                <div
                  style={{
                    background: isDelivered ? '#f0fdf4' : 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                    padding: '1rem 1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid var(--border-color)'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--text-main)' }}>
                        👦 {order.studentName}
                      </span>
                      <span style={{ background: '#ffffff', border: '1px solid #cbd5e1', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800 }}>
                        Grade {order.classSection}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '2px' }}>
                      Token #{order.tokenNumber} • {order.mealPeriodName} • {order.requiredDate}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#16a34a' }}>
                      {currency} {order.totalAmount}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                      Paid Online
                    </div>
                  </div>
                </div>

                {/* Live 5-Stage Stepper */}
                <div style={{ padding: '1.25rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '1rem' }}>
                    Kitchen & Delivery Lifecycle:
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
                    {ORDER_STAGES.map((stage, idx) => {
                      const isPast = idx < currentStageIdx;
                      const isCurrent = idx === currentStageIdx;
                      const isFuture = idx > currentStageIdx;
                      const IconComponent = stage.icon;

                      return (
                        <div key={stage.key} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                          {/* Step Icon / Circle */}
                          <div
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              background: isCurrent ? stage.color : isPast ? '#16a34a' : '#f1f5f9',
                              color: isCurrent || isPast ? '#ffffff' : '#94a3b8',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                              boxShadow: isCurrent ? `0 0 0 4px ${stage.bg}` : 'none',
                              animation: isCurrent ? 'pulse 2s infinite' : 'none'
                            }}
                          >
                            <IconComponent size={16} />
                          </div>

                          {/* Step Text */}
                          <div style={{ flex: 1 }}>
                            <div
                              style={{
                                fontSize: '0.85rem',
                                fontWeight: isCurrent ? 900 : isPast ? 700 : 500,
                                color: isCurrent ? stage.color : isPast ? 'var(--text-main)' : 'var(--text-light)'
                              }}
                            >
                              {stage.label}
                              {isCurrent && (
                                <span
                                  style={{
                                    background: stage.bg,
                                    color: stage.color,
                                    fontSize: '0.68rem',
                                    fontWeight: 800,
                                    padding: '1px 6px',
                                    borderRadius: '4px',
                                    marginLeft: '6px'
                                  }}
                                >
                                  In Progress
                                </span>
                              )}
                            </div>

                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '1px' }}>
                              {stage.subtext}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Ordered Items Summary */}
                  <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px dashed #e2e8f0' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                      ITEMS IN THIS ORDER:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {order.items.map((item, i) => (
                        <div
                          key={i}
                          style={{
                            background: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            fontWeight: 700
                          }}
                        >
                          {item.quantity}x {item.name}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Location Notice */}
                  <div
                    style={{
                      background: '#f0fdf4',
                      border: '1px solid #bbf7d0',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.65rem 0.85rem',
                      marginTop: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <MapPin size={16} color="#16a34a" />
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#15803d' }}>
                      Delivery Location: <strong>Classroom {order.classSection}</strong> for {order.mealPeriodName}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
