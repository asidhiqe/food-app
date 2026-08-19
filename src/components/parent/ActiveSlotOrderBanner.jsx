import React from 'react';
import { AlertCircle, Clock, ChefHat, CheckCircle2, ArrowRight, Eye, ShieldAlert } from 'lucide-react';

export default function ActiveSlotOrderBanner({
  activeOrder,
  childName,
  currentParentSession,
  onViewOrder,
  selectedSlotName
}) {
  if (!activeOrder) return null;

  const isOrderedByOtherParent =
    currentParentSession &&
    activeOrder.orderedByParentPhone &&
    activeOrder.orderedByParentPhone !== currentParentSession.phone;

  const ordererTitle = isOrderedByOtherParent
    ? `${activeOrder.orderedByParentName || 'Other Parent'} (${activeOrder.parentRelation || 'Parent'})`
    : 'You';

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
        border: '1.5px solid #fcd34d',
        borderRadius: 'var(--radius-lg)',
        padding: '1rem 1.25rem',
        marginBottom: '1.25rem',
        boxShadow: '0 4px 14px rgba(245, 158, 11, 0.12)',
        animation: 'slideUp 0.2s ease'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f59e0b', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
            <AlertCircle size={20} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#92400e' }}>
                MEAL ALREADY ORDERED FOR THIS BREAK
              </span>
              <span className={`badge badge-${activeOrder.deliveryStatus.toLowerCase()}`} style={{ fontSize: '0.7rem' }}>
                {activeOrder.deliveryStatus}
              </span>
            </div>

            <p style={{ fontSize: '0.82rem', color: '#78350f', marginTop: '3px', fontWeight: 600 }}>
              <b>{ordererTitle}</b> has already placed an order for <b>{childName}</b> for <b>{selectedSlotName}</b> (Token <b>#{activeOrder.tokenNumber}</b>).
            </p>

            {/* Items Summary */}
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.4rem' }}>
              {activeOrder.items.map((i, idx) => (
                <span key={idx} style={{ background: 'rgba(255,255,255,0.85)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, color: '#92400e', border: '1px solid #fde68a' }}>
                  {i.quantity}x {i.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* View Order Tracker Button */}
        <button
          onClick={onViewOrder}
          style={{
            padding: '0.5rem 0.9rem',
            background: '#b45309',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.8rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(180, 83, 9, 0.25)',
            alignSelf: 'center'
          }}
        >
          <Eye size={15} />
          <span>View Live Order</span>
        </button>
      </div>
    </div>
  );
}
