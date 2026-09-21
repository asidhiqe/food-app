import React, { useState, useEffect } from 'react';
import {
  ArrowLeft, CheckCircle2, Clock, ChefHat, Package, Send, Check, ShieldCheck,
  MapPin, Sparkles, Flame, User, Utensils, AlertTriangle, X, HelpCircle,
  FileText, RefreshCw
} from 'lucide-react';
import { hasFeature } from '../../services/featureService';
import { StorageService } from '../../services/storageService';
import { t } from '../../services/i18nService';

export default function OrderTracker({
  orders = [],
  onBackToMenu,
  currency = '₹',
  activeSchool,
  parentSession,
  onRefresh
}) {
  const isClassroomDelivery = hasFeature(activeSchool, 'classroomDelivery');

  // Modal states
  const [cancellingOrder, setCancellingOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState('Child unwell / absent today');
  const [cancelCustomNotes, setCancelCustomNotes] = useState('');

  const [disputeOrder, setDisputeOrder] = useState(null);
  const [disputeType, setDisputeType] = useState('MISSING_ITEM');
  const [disputeComments, setDisputeComments] = useState('');

  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const ORDER_STAGES = [
    {
      key: 'NEW',
      label: t('en', 'parent.stages.NEW.label'),
      subtext: t('en', 'parent.stages.NEW.subtext'),
      icon: CheckCircle2,
      color: '#2563eb',
      bg: '#dbeafe'
    },
    {
      key: 'ACCEPTED',
      label: t('en', 'parent.stages.ACCEPTED.label'),
      subtext: t('en', 'parent.stages.ACCEPTED.subtext'),
      icon: Check,
      color: '#0284c7',
      bg: '#e0f2fe'
    },
    {
      key: 'PREPARING',
      label: t('en', 'parent.stages.PREPARING.label'),
      subtext: t('en', 'parent.stages.PREPARING.subtext'),
      icon: Package,
      color: '#7c3aed',
      bg: '#ede9fe'
    },
    {
      key: 'PACKED',
      label: isClassroomDelivery ? t('en', 'parent.stages.PACKED_DELIVERY.label') : t('en', 'parent.stages.PACKED_PICKUP.label'),
      subtext: isClassroomDelivery ? t('en', 'parent.stages.PACKED_DELIVERY.subtext') : t('en', 'parent.stages.PACKED_PICKUP.subtext'),
      icon: isClassroomDelivery ? Send : Utensils,
      color: '#d97706',
      bg: '#fef3c7'
    },
    {
      key: 'DELIVERED',
      label: isClassroomDelivery ? t('en', 'parent.stages.DELIVERED_DESK.label') : t('en', 'parent.stages.DELIVERED_COUNTER.label'),
      subtext: isClassroomDelivery ? t('en', 'parent.stages.DELIVERED_DESK.subtext') : t('en', 'parent.stages.DELIVERED_COUNTER.subtext'),
      icon: ShieldCheck,
      color: '#16a34a',
      bg: '#dcfce7'
    }
  ];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (cancellingOrder) setCancellingOrder(null);
        else if (disputeOrder) setDisputeOrder(null);
        else if (onBackToMenu) onBackToMenu();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cancellingOrder, disputeOrder, onBackToMenu]);

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

  const handleConfirmCancel = () => {
    if (!cancellingOrder) return;
    const finalReason = cancelReason === 'Other' && cancelCustomNotes ? cancelCustomNotes : cancelReason;
    const res = StorageService.cancelOrder(activeSchool.id, cancellingOrder.id, {
      reason: finalReason,
      cancelledBy: 'PARENT'
    });

    if (res.success) {
      showToast(res.message);
      setCancellingOrder(null);
      if (onRefresh) onRefresh();
    } else {
      alert(res.error || 'Failed to cancel order');
    }
  };

  const handleSubmitDispute = () => {
    if (!disputeOrder) return;
    const res = StorageService.reportOrderDispute(activeSchool.id, disputeOrder.id, {
      issueType: disputeType,
      comments: disputeComments || 'Reported by parent via order tracking.',
      parentName: parentSession?.parentName || 'Parent'
    });

    if (res.success) {
      showToast('Dispute reported. Canteen supervisor has been notified.');
      setDisputeOrder(null);
      setDisputeComments('');
      if (onRefresh) onRefresh();
    }
  };

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', position: 'relative' }}>
      {/* Notification Toast */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999,
            background: '#1e293b',
            color: '#ffffff',
            padding: '10px 20px',
            borderRadius: 'var(--radius-full)',
            boxShadow: '0 10px 25px rgba(0,0,0,0.25)',
            fontSize: '0.85rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Sparkles size={16} color="#38bdf8" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '1.15rem',
          padding: '0.2rem 0'
        }}
      >
        <button
          onClick={onBackToMenu}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: '#ffffff',
            border: '1.5px solid #cbd5e1',
            color: 'var(--text-main)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
          }}
          title="Back to Menu"
        >
          <ArrowLeft size={18} />
        </button>

        <div style={{ minWidth: 0, flex: 1 }}>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 900, color: 'var(--text-main)', lineHeight: 1.2, margin: 0 }}>
            Live Order Tracking & Audit
          </h2>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Transparent timeline from confirmed order to classroom desk
          </div>
        </div>

        {onRefresh && (
          <button
            onClick={onRefresh}
            style={{
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderRadius: 'var(--radius-full)',
              padding: '5px 10px',
              fontSize: '0.72rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: 'var(--text-main)'
            }}
          >
            <RefreshCw size={13} />
            <span>Refresh</span>
          </button>
        )}
      </div>

      {/* Zero Orders State */}
      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', background: '#ffffff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📋</div>
          <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>No meal orders recorded</h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Book a meal to view real-time kitchen preparation, label packing, and classroom delivery.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {orders.map((order) => {
            const isCancelled = order.status === 'CANCELLED' || order.status === 'CANCELLED_LATE';
            const isUnable = order.status === 'UNABLE_TO_FULFIL';
            const isDelivered = order.status === 'DELIVERED';
            const canCancel = order.status === 'NEW' || order.status === 'ACCEPTED';
            const cleanClass = String(order.classSection || '').replace(/Grade\s*/gi, '').trim();
            const currentStageIdx = getStageIndex(order.status);
            const isBeforeCutoff = StorageService.isOrderBeforeCutoff(order, activeSchool?.cancellationCutoffTime || '09:00');

            return (
              <div
                key={order.id}
                style={{
                  background: '#ffffff',
                  border: isCancelled
                    ? '1.5px solid #fca5a5'
                    : isUnable
                    ? '1.5px solid #fed7aa'
                    : isDelivered
                    ? '1.5px solid #86efac'
                    : '1.5px solid #bfdbfe',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-md)',
                  overflow: 'hidden'
                }}
              >
                {/* Order Top Bar */}
                <div
                  style={{
                    background: isCancelled
                      ? '#fff1f2'
                      : isUnable
                      ? '#fff7ed'
                      : isDelivered
                      ? '#f0fdf4'
                      : 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                    padding: '1rem 1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid var(--border-color)'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <User size={16} color="var(--primary)" />
                        <span>{order.studentName}</span>
                      </span>
                      <span style={{ background: '#ffffff', border: '1px solid #cbd5e1', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 800 }}>
                        Class {cleanClass}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '2px' }}>
                      Token #{order.tokenNumber} • {order.mealPeriodName?.split('/')[0]?.trim() || 'Break'} • {order.requiredDate}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.05rem', fontWeight: 900, color: isCancelled ? '#dc2626' : '#16a34a' }}>
                      {currency} {order.totalAmount}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: isCancelled ? '#dc2626' : 'var(--text-muted)', fontWeight: 700 }}>
                      {isCancelled ? 'Cancelled' : isUnable ? 'Refunded' : 'Paid Online'}
                    </div>
                  </div>
                </div>

                {/* Body Content */}
                <div style={{ padding: '1.25rem' }}>
                  {/* Scenario A: Cancelled Order */}
                  {isCancelled && (
                    <div
                      style={{
                        background: '#fef2f2',
                        border: '1px solid #fca5a5',
                        borderRadius: 'var(--radius-md)',
                        padding: '1rem',
                        marginBottom: '1rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#dc2626', fontWeight: 900, fontSize: '0.88rem' }}>
                        <X size={18} />
                        <span>Order Cancelled ({order.cancellationReason || 'Cancelled'})</span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#7f1d1d', marginTop: '6px' }}>
                        {order.refundAmount > 0 ? (
                          <span>
                            ✅ <strong>Full Refund Confirmed:</strong> {currency}{order.refundAmount} has been credited back to your School Lunch Wallet.
                          </span>
                        ) : (
                          <span>
                            ⚠️ <strong>Late Cancellation Notice:</strong> Order was cancelled after the 9:00 AM meal preparation cutoff. As kitchen preparation had already started, refunds are governed by canteen operational policy.
                          </span>
                        )}
                      </div>
                      {order.cancelledAt && (
                        <div style={{ fontSize: '0.7rem', color: '#991b1b', marginTop: '4px' }}>
                          Timestamp: {new Date(order.cancelledAt).toLocaleString()}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Scenario B: Unable to Fulfil (Kitchen Out of Stock) */}
                  {isUnable && (
                    <div
                      style={{
                        background: '#fff7ed',
                        border: '1px solid #fdba74',
                        borderRadius: 'var(--radius-md)',
                        padding: '1rem',
                        marginBottom: '1rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#c2410c', fontWeight: 900, fontSize: '0.88rem' }}>
                        <AlertTriangle size={18} />
                        <span>Kitchen Unable to Fulfil ({order.unableReason || 'Ingredient Shortage'})</span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#9a3412', marginTop: '6px' }}>
                        The kitchen was unable to prepare this meal today due to fresh supply unavailability.
                        <br />
                        ✅ <strong>100% Refund:</strong> {currency}{order.refundAmount || order.totalAmount} has been automatically credited back to your Lunch Wallet.
                      </div>
                    </div>
                  )}

                  {/* Scenario C: Active or Delivered Stepper */}
                  {!isCancelled && !isUnable && (
                    <>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '1rem' }}>
                        Kitchen & Delivery Lifecycle:
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
                        {ORDER_STAGES.map((stage, idx) => {
                          const isPast = idx < currentStageIdx;
                          const isCurrent = idx === currentStageIdx;
                          const IconComponent = stage.icon;

                          return (
                            <div key={stage.key} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
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
                                  boxShadow: isCurrent ? `0 0 0 4px ${stage.bg}` : 'none'
                                }}
                              >
                                <IconComponent size={16} />
                              </div>

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
                    </>
                  )}

                  {/* Ordered Items Summary */}
                  <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px dashed #e2e8f0' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                      ITEMS IN THIS MEAL:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {(order.items || []).map((item, i) => (
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
                  {!isCancelled && !isUnable && (
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
                        Delivery Destination: <strong>Classroom {order.classSection}</strong> for {order.mealPeriodName}
                      </span>
                    </div>
                  )}

                  {/* Dispute Status Banner if filed */}
                  {order.dispute && (
                    <div
                      style={{
                        background: '#fef2f2',
                        border: '1px solid #f87171',
                        borderRadius: 'var(--radius-md)',
                        padding: '0.65rem 0.85rem',
                        marginTop: '1rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#b91c1c', fontWeight: 900, fontSize: '0.78rem' }}>
                        <AlertTriangle size={15} />
                        <span>Issue Reported: {order.dispute.issueType}</span>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#7f1d1d', marginTop: '3px' }}>
                        "{order.dispute.comments}"
                      </div>
                      <div style={{ fontSize: '0.68rem', color: '#991b1b', marginTop: '4px' }}>
                        Status: <strong>Under Review</strong> • Canteen supervisor & school admin notified
                      </div>
                    </div>
                  )}

                  {/* Interactive Action Buttons */}
                  <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {/* 1. Parent Cancellation (Only available for NEW and ACCEPTED) */}
                    {canCancel && (
                      <button
                        onClick={() => setCancellingOrder(order)}
                        style={{
                          flex: 1,
                          padding: '0.55rem 0.85rem',
                          borderRadius: 'var(--radius-md)',
                          background: '#ffffff',
                          border: '1.5px solid #fca5a5',
                          color: '#dc2626',
                          fontSize: '0.78rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        <X size={14} />
                        <span>Cancel Meal Order</span>
                        <span style={{ fontSize: '0.68rem', opacity: 0.85, fontWeight: 700 }}>
                          ({isBeforeCutoff ? '100% Refund before 9 AM' : 'Past Cutoff'})
                        </span>
                      </button>
                    )}

                    {/* 2. Audit Trail & Dispute (Available for DELIVERED) */}
                    {isDelivered && (
                      <button
                        onClick={() => setDisputeOrder(order)}
                        style={{
                          flex: 1,
                          padding: '0.55rem 0.85rem',
                          borderRadius: 'var(--radius-md)',
                          background: '#f8fafc',
                          border: '1.5px solid #cbd5e1',
                          color: 'var(--text-main)',
                          fontSize: '0.78rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        <FileText size={14} color="var(--primary)" />
                        <span>{order.dispute ? 'View Audit & Dispute' : 'Audit Trail / Report Issue'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* --- MODAL 1: CANCELLATION DIALOG WITH CUTOFF INTELLIGENCE --- */}
      {cancellingOrder && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem'
          }}
          onClick={() => setCancellingOrder(null)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              maxWidth: '480px',
              width: '100%',
              padding: '1.5rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
              border: '1px solid var(--border-color)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.25rem' }}>❌</span>
                <h3 style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>
                  Cancel Order #{cancellingOrder.tokenNumber}
                </h3>
              </div>
              <button
                onClick={() => setCancellingOrder(null)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Cutoff Policy Box */}
            {StorageService.isOrderBeforeCutoff(cancellingOrder, activeSchool?.cancellationCutoffTime || '09:00') ? (
              <div
                style={{
                  background: '#f0fdf4',
                  border: '1px solid #86efac',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.75rem',
                  marginBottom: '1rem'
                }}
              >
                <div style={{ color: '#15803d', fontWeight: 900, fontSize: '0.82rem' }}>
                  ✅ Before 9:00 AM Cutoff — 100% Refund Eligible
                </div>
                <div style={{ color: '#166534', fontSize: '0.74rem', marginTop: '3px' }}>
                  Cancelling now will immediately credit {currency}{cancellingOrder.totalAmount} back into your School Lunch Wallet.
                </div>
              </div>
            ) : (
              <div
                style={{
                  background: '#fff1f2',
                  border: '1px solid #fecdd3',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.75rem',
                  marginBottom: '1rem'
                }}
              >
                <div style={{ color: '#be123c', fontWeight: 900, fontSize: '0.82rem' }}>
                  ⚠️ Past 9:00 AM Cutoff Notice
                </div>
                <div style={{ color: '#9f1239', fontSize: '0.74rem', marginTop: '3px' }}>
                  Today's meal preparation has already started. As raw groceries have been prepped, cancellations past 9:00 AM are not refunded to the wallet according to school rules.
                </div>
              </div>
            )}

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                Select Cancellation Reason:
              </label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  outline: 'none',
                  color: 'var(--text-main)'
                }}
              >
                <option value="Child unwell / absent today">Child unwell / absent today</option>
                <option value="Brought lunch from home">Brought lunch from home</option>
                <option value="Class excursion / outdoor sports">Class excursion / outdoor sports</option>
                <option value="Ordered wrong item / date by mistake">Ordered wrong item / date by mistake</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {cancelReason === 'Other' && (
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                  Additional Details:
                </label>
                <input
                  type="text"
                  placeholder="Specify reason..."
                  value={cancelCustomNotes}
                  onChange={(e) => setCancelCustomNotes(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.8rem',
                    outline: 'none'
                  }}
                />
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.25rem' }}>
              <button
                onClick={() => setCancellingOrder(null)}
                style={{
                  flex: 1,
                  padding: '0.65rem',
                  background: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  color: 'var(--text-main)'
                }}
              >
                Keep Order
              </button>
              <button
                onClick={handleConfirmCancel}
                style={{
                  flex: 1.4,
                  padding: '0.65rem',
                  background: '#dc2626',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.82rem',
                  fontWeight: 900,
                  cursor: 'pointer'
                }}
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 2: DIGITAL AUDIT TRAIL & QUALITY DISPUTE --- */}
      {disputeOrder && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem'
          }}
          onClick={() => setDisputeOrder(null)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              maxWidth: '520px',
              width: '100%',
              padding: '1.5rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
              border: '1px solid var(--border-color)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={18} color="var(--primary)" />
                <h3 style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>
                  Audit Trail — Order #{disputeOrder.tokenNumber}
                </h3>
              </div>
              <button
                onClick={() => setDisputeOrder(null)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Student details header */}
            <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.78rem' }}>
              <div><strong>Student:</strong> {disputeOrder.studentName} (Class {disputeOrder.classSection})</div>
              <div><strong>Break Period:</strong> {disputeOrder.mealPeriodName} ({disputeOrder.requiredDate})</div>
              <div><strong>Delivered To:</strong> Classroom {disputeOrder.classSection}</div>
            </div>

            {/* Verified Digital Timestamps */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
                Verified Digital Timestamps:
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.78rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: '#f8fafc', borderRadius: '6px' }}>
                  <span>💳 Order Placed & Paid</span>
                  <strong style={{ color: 'var(--text-main)' }}>
                    {disputeOrder.createdAt ? new Date(disputeOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Logged'}
                  </strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: '#f8fafc', borderRadius: '6px' }}>
                  <span>👨‍🍳 Kitchen Acknowledged</span>
                  <strong style={{ color: 'var(--text-main)' }}>
                    {disputeOrder.acceptedAt ? new Date(disputeOrder.acceptedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Verified at Counter'}
                  </strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: '#f8fafc', borderRadius: '6px' }}>
                  <span>🔥 Stove Cooking Started</span>
                  <strong style={{ color: 'var(--text-main)' }}>
                    {disputeOrder.preparingAt ? new Date(disputeOrder.preparingAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Verified'}
                  </strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: '#f8fafc', borderRadius: '6px' }}>
                  <span>📦 Meal Box Packed & QR Tagged</span>
                  <strong style={{ color: 'var(--text-main)' }}>
                    {disputeOrder.packedAt ? new Date(disputeOrder.packedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Packed in Crate'}
                  </strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '6px' }}>
                  <span style={{ color: '#065f46', fontWeight: 800 }}>🏫 Classroom Delivery</span>
                  <strong style={{ color: '#047857' }}>
                    {disputeOrder.deliveredAt ? new Date(disputeOrder.deliveredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Completed'}
                  </strong>
                </div>
              </div>
            </div>

            {/* Dispute Section */}
            {disputeOrder.dispute ? (
              <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: 'var(--radius-md)', padding: '0.85rem' }}>
                <div style={{ color: '#be123c', fontWeight: 900, fontSize: '0.82rem' }}>
                  ⚠️ Dispute Under Investigation
                </div>
                <div style={{ fontSize: '0.75rem', color: '#9f1239', marginTop: '4px' }}>
                  <strong>Type:</strong> {disputeOrder.dispute.issueType}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#9f1239', marginTop: '2px' }}>
                  <strong>Parent Note:</strong> "{disputeOrder.dispute.comments}"
                </div>
                <div style={{ fontSize: '0.7rem', color: '#881337', marginTop: '6px' }}>
                  Reported at {new Date(disputeOrder.dispute.reportedAt).toLocaleString()}. School canteen manager has received this ticket.
                </div>
              </div>
            ) : (
              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                  Report an Issue with this Delivery
                </div>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                  If your child did not receive their meal or experienced an issue, report it here for immediate canteen resolution.
                </p>

                <div style={{ marginBottom: '0.75rem' }}>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 800, marginBottom: '0.3rem' }}>
                    Issue Category:
                  </label>
                  <select
                    value={disputeType}
                    onChange={(e) => setDisputeType(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.55rem 0.7rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.8rem',
                      outline: 'none'
                    }}
                  >
                    <option value="Meal Not Received">Meal not received on child’s desk</option>
                    <option value="Incorrect Item">Wrong dish or missing item</option>
                    <option value="Food Quality Issue">Cold food / packaging spilled</option>
                    <option value="Allergy Concern">Dietary / allergy concern</option>
                    <option value="Other">Other dispute</option>
                  </select>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 800, marginBottom: '0.3rem' }}>
                    Comments / Details:
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Provide details for canteen supervisor..."
                    value={disputeComments}
                    onChange={(e) => setDisputeComments(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.55rem 0.7rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.8rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <button
                  onClick={handleSubmitDispute}
                  style={{
                    width: '100%',
                    padding: '0.65rem',
                    background: '#dc2626',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.82rem',
                    fontWeight: 900,
                    cursor: 'pointer'
                  }}
                >
                  Submit Dispute to Canteen Admin
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
