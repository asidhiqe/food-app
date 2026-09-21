import React, { useState } from 'react';
import { ChefHat, CheckCircle2, Clock, Package, Send, Printer, RefreshCw, Filter, Search, Sparkles, Flame, Check, ArrowLeft, AlertTriangle } from 'lucide-react';
import { StorageService } from '../../services/storageService';
import { hasFeature } from '../../services/featureService';
import { t, SUPPORTED_LANGUAGES } from '../../services/i18nService';
import ThermalStickerModal from './ThermalStickerModal';

const STATUS_FILTERS = [
  { id: 'ALL', label: 'All Orders', icon: '📋' },
  { id: 'NEW', label: 'Pre-Orders', icon: '🚨' },
  { id: 'ACCEPTED', label: 'In Batch', icon: '📊' },
  { id: 'PREPARING', label: 'Portioning', icon: '🍱' },
  { id: 'PACKED', label: 'Packed & Labeled', icon: '📦' },
  { id: 'DELIVERED', label: 'Dispatched', icon: '✅' },
  { id: 'UNABLE_TO_FULFIL', label: 'Out of Stock', icon: '⚠️' },
  { id: 'CANCELLED', label: 'Cancelled', icon: '❌' }
];

export default function KitchenDashboard({
  orders,
  activeSchool,
  onRefresh,
  staffSession,
  onLogoutKitchen
}) {
  const enableThermal = hasFeature(activeSchool, 'thermalPrinting');
  const isClassroomDelivery = hasFeature(activeSchool, 'classroomDelivery');

  // Multi-language state powered by i18nService & translations.json
  const [lang, setLang] = useState('en');
  const toggleLang = () => setLang((prev) => (prev === 'en' ? 'hi' : 'en'));

  // Default filter based on kitchen staff role
  const getInitialFilter = () => {
    if (!staffSession) return 'ALL';
    if (staffSession.staffName?.includes('Ramesh')) return 'PREPARING';
    if (staffSession.staffName?.includes('Pooja')) return 'PACKED';
    if (staffSession.staffName?.includes('Imran')) return 'PACKED';
    return 'ALL';
  };

  const [selectedStatusFilter, setSelectedStatusFilter] = useState(getInitialFilter);
  const [activeSlotFilter, setActiveSlotFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [stickerOrder, setStickerOrder] = useState(null);
  const [isBatchPrinting, setIsBatchPrinting] = useState(false);

  const getFilterLabel = (f) => t(lang, `kitchen.filters.${f.id}`, f.label);

  // Progressive Status Progression Handler
  const handleUpdateStatus = (orderId, newStatus) => {
    StorageService.updateOrderStatus(activeSchool?.id, orderId, newStatus);
    onRefresh();
  };

  // Kitchen Out of Stock / Unable to Fulfil Handler
  const handleMarkUnableToFulfil = (orderId) => {
    const reason = window.prompt('Enter reason for inability to fulfil (will issue instant refund to parent wallet):', 'Ingredient Out of Stock');
    if (reason) {
      StorageService.markOrderUnableToFulfil(activeSchool?.id, orderId, reason);
      onRefresh();
    }
  };

  // Filter Orders
  const filteredOrders = orders.filter((o) => {
    const matchesStatus =
      selectedStatusFilter === 'ALL' ||
      o.status === selectedStatusFilter;

    const matchesSlot = activeSlotFilter === 'ALL' || o.mealPeriodId === activeSlotFilter;

    const matchesSearch =
      o.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.classSection.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(o.tokenNumber).includes(searchQuery);

    return matchesStatus && matchesSlot && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'NEW':
        return <span style={{ background: '#fee2e2', color: '#991b1b', padding: '3px 8px', borderRadius: 'var(--radius-full)', fontSize: '0.72rem', fontWeight: 800 }}>{t(lang, 'kitchen.badges.NEW')}</span>;
      case 'ACCEPTED':
        return <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '3px 8px', borderRadius: 'var(--radius-full)', fontSize: '0.72rem', fontWeight: 800 }}>{t(lang, 'kitchen.badges.ACCEPTED')}</span>;
      case 'PREPARING':
        return <span style={{ background: '#fef3c7', color: '#92400e', padding: '3px 8px', borderRadius: 'var(--radius-full)', fontSize: '0.72rem', fontWeight: 800 }}>{t(lang, 'kitchen.badges.PREPARING')}</span>;
      case 'PACKED':
      case 'READY':
        return <span style={{ background: '#ede9fe', color: '#6b21a8', padding: '3px 8px', borderRadius: 'var(--radius-full)', fontSize: '0.72rem', fontWeight: 800 }}>{t(lang, isClassroomDelivery ? 'kitchen.badges.PACKED' : 'kitchen.badges.READY')}</span>;
      case 'DELIVERED':
        return <span style={{ background: '#dcfce7', color: '#15803d', padding: '3px 8px', borderRadius: 'var(--radius-full)', fontSize: '0.72rem', fontWeight: 800 }}>{t(lang, isClassroomDelivery ? 'kitchen.badges.DELIVERED_DESK' : 'kitchen.badges.DELIVERED_COUNTER')}</span>;
      case 'CANCELLED':
      case 'CANCELLED_LATE':
        return <span style={{ background: '#fee2e2', color: '#dc2626', padding: '3px 8px', borderRadius: 'var(--radius-full)', fontSize: '0.72rem', fontWeight: 800 }}>{t(lang, 'kitchen.badges.CANCELLED')}</span>;
      case 'UNABLE_TO_FULFIL':
        return <span style={{ background: '#ffedd5', color: '#c2410c', padding: '3px 8px', borderRadius: 'var(--radius-full)', fontSize: '0.72rem', fontWeight: 800 }}>{t(lang, 'kitchen.badges.UNABLE_TO_FULFIL')}</span>;
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div style={{ paddingBottom: '2rem' }}>
      {/* 1. Mobile-First Sticky Header Bar */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          color: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          padding: '1rem',
          marginBottom: '1rem',
          boxShadow: 'var(--shadow-card)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img
              src="./bis-hapur-responsive-logo.png"
              alt="Logo"
              style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'contain', background: '#ffffff', padding: '1px' }}
            />
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#f8fafc' }}>
              {activeSchool?.name || 'Brainwaves International School'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* 1-Tap Kitchen Language Switcher (backed by i18nService & translations.json) */}
            <button
              onClick={toggleLang}
              style={{
                background: lang === 'hi' ? '#15803d' : 'rgba(255, 255, 255, 0.15)',
                border: lang === 'hi' ? '1px solid #4ade80' : '1px solid rgba(255, 255, 255, 0.3)',
                color: '#ffffff',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.7rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '3px'
              }}
              title="Toggle Kitchen Language"
            >
              <span>{t(lang, 'kitchen.toggleLang')}</span>
            </button>

            {staffSession && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: 'rgba(234, 88, 12, 0.2)',
                  border: '1px solid rgba(234, 88, 12, 0.4)',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: '#fdba74'
                }}
              >
                <span>{staffSession.avatar || '👨‍🍳'}</span>
                <span>{staffSession.staffName}</span>
              </div>
            )}

            {onLogoutKitchen && (
              <button
                onClick={onLogoutKitchen}
                style={{
                  background: 'rgba(239, 68, 68, 0.2)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  color: '#fca5a5',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                Switch Staff
              </button>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ChefHat size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 900, lineHeight: 1.2 }}>Kitchen Display (KDS)</h2>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                {filteredOrders.length} active orders in queue
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '4px' }}>
            {enableThermal && (
              <button
                onClick={() => setIsBatchPrinting(true)}
                style={{
                  background: 'rgba(255,255,255,0.12)',
                  color: '#ffffff',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 'var(--radius-md)',
                  padding: '6px 8px',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px'
                }}
                title="Batch Print All Labels"
              >
                <Printer size={13} />
                <span>Stickers</span>
              </button>
            )}

            <button
              onClick={onRefresh}
              style={{
                background: 'var(--primary)',
                color: '#ffffff',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                padding: '6px 10px',
                fontSize: '0.72rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <RefreshCw size={13} />
              <span>Sync</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Responsive Status Filter Carousel */}
      <div
        style={{
          display: 'flex',
          gap: '0.45rem',
          overflowX: 'auto',
          paddingBottom: '0.65rem',
          marginBottom: '0.85rem',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {STATUS_FILTERS.map((tab) => {
          const isSelected = selectedStatusFilter === tab.id;
          const count = tab.id === 'ALL'
            ? orders.length
            : orders.filter((o) => o.status === tab.id).length;

          return (
            <button
              key={tab.id}
              onClick={() => setSelectedStatusFilter(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                border: isSelected ? '1.5px solid var(--primary)' : '1px solid #e2e8f0',
                background: isSelected
                  ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)'
                  : '#ffffff',
                color: isSelected ? '#ffffff' : 'var(--text-main)',
                fontWeight: isSelected ? 900 : 700,
                fontSize: '0.75rem',
                cursor: 'pointer',
                flexShrink: 0,
                boxShadow: isSelected ? '0 4px 12px rgba(37,99,235,0.25)' : '0 1px 3px rgba(0,0,0,0.03)'
              }}
            >
              <span>{tab.icon}</span>
              <span>{getFilterLabel(tab)}</span>
              <span
                style={{
                  background: isSelected ? '#ffffff' : '#f1f5f9',
                  color: isSelected ? 'var(--primary)' : 'var(--text-muted)',
                  borderRadius: '10px',
                  padding: '1px 5px',
                  fontSize: '0.65rem',
                  fontWeight: 900
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. Search & Break Slot Filters (Responsive Grid for Tab/Laptop) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '0.65rem',
          marginBottom: '1.25rem'
        }}
      >
        {/* Search */}
        <div style={{ position: 'relative' }}>
          <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search student, grade, token #..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.6rem 0.75rem 0.6rem 34px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              fontSize: '0.84rem',
              outline: 'none',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
            }}
          />
        </div>

        {/* Break Slot Selector */}
        <select
          value={activeSlotFilter}
          onChange={(e) => setActiveSlotFilter(e.target.value)}
          style={{
            width: '100%',
            padding: '0.6rem 0.75rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid #cbd5e1',
            background: '#ffffff',
            fontSize: '0.84rem',
            fontWeight: 700,
            outline: 'none',
            color: 'var(--text-main)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
          }}
        >
          <option value="ALL">🕒 All Break Slots</option>
          {(activeSchool?.mealPeriods || []).map((slot) => (
            <option key={slot.id} value={slot.id}>
              {slot.name} ({slot.startTime} - {slot.endTime})
            </option>
          ))}
        </select>
      </div>

      {/* 4. Orders Queue Grid (1 col on mobile, 2-3 cols on tablet, 3-4 cols on laptop) */}
      {filteredOrders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3.5rem 1rem', background: '#ffffff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>👨‍🍳</div>
          <h4 style={{ fontSize: '1rem', fontWeight: 800 }}>No orders in this status</h4>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>New student meal orders will appear in real time</p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '1rem'
          }}
        >
          {filteredOrders.map((order) => {
            const hasAllergies = order.allergies && order.allergies.length > 0;

            return (
              <div
                key={order.id}
                style={{
                  background: '#ffffff',
                  borderRadius: 'var(--radius-lg)',
                  border: hasAllergies ? '1.5px solid #fca5a5' : '1px solid var(--border-color)',
                  padding: '1rem',
                  boxShadow: 'var(--shadow-card)'
                }}
              >
                {/* Header: Token, Time, Sticker Button */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--text-main)' }}>
                        #{order.tokenNumber}
                      </span>
                      {getStatusBadge(order.status)}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      {order.mealPeriodName} • {order.requiredDate}
                    </div>
                  </div>

                  <button
                    onClick={() => setStickerOrder(order)}
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      borderRadius: 'var(--radius-full)',
                      padding: '4px 10px',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Printer size={13} />
                    <span>{t(lang, 'kitchen.printLabel')}</span>
                  </button>
                </div>

                {/* Student Info & Allergy Banner */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                  <div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 900, color: 'var(--text-main)' }}>
                      👦 {order.studentName}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {t(lang, 'kitchen.parent')}: {order.orderedByParentName || 'Parent'} ({order.orderedByParentPhone || 'N/A'})
                    </div>
                  </div>

                  <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '3px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800 }}>
                    {t(lang, 'kitchen.grade')} {order.classSection.replace(/Grade\s*/i, '')}
                  </div>
                </div>

                {/* Prominent Allergy Alert Badge in Kitchen */}
                {hasAllergies && (
                  <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: 'var(--radius-md)', padding: '0.45rem 0.65rem', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <AlertTriangle size={15} color="#e11d48" />
                    <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#be123c' }}>
                      {t(lang, 'kitchen.allergyAlert')}: {order.allergies.join(', ')}
                    </span>
                  </div>
                )}

                {/* Parent Dispute Alert */}
                {order.dispute && (
                  <div style={{ background: '#fef2f2', border: '1px solid #f87171', borderRadius: 'var(--radius-md)', padding: '0.5rem 0.65rem', marginBottom: '0.65rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#b91c1c', fontWeight: 900, fontSize: '0.75rem' }}>
                      <AlertTriangle size={14} />
                      <span>{t(lang, 'kitchen.dispute')}: {order.dispute.type?.toUpperCase()}</span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#7f1d1d', marginTop: '2px' }}>
                      "{order.dispute.comments}" • {order.dispute.reportedAt ? new Date(order.dispute.reportedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Reported'}
                    </div>
                  </div>
                )}

                {/* Item List */}
                <div style={{ background: '#f8fafc', borderRadius: 'var(--radius-md)', padding: '0.6rem 0.75rem', marginBottom: '0.85rem' }}>
                  {(order.items || []).map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: idx < order.items.length - 1 ? '4px' : 0 }}>
                      <span style={{ fontWeight: 800 }}>
                        <strong style={{ color: 'var(--primary)' }}>{item.quantity}x</strong> {item.name}
                      </span>
                      <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>₹{item.subtotal || item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                  {/* Action Stepper Buttons */}
                  <div style={{ display: 'flex', gap: '0.4rem', flexDirection: 'column' }}>
                    {order.status === 'NEW' && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'ACCEPTED')}
                        className="btn-primary"
                        style={{ width: '100%', padding: '0.65rem', fontSize: '0.85rem' }}
                      >
                        <span>{t(lang, 'kitchen.actions.confirmBatch')}</span>
                      </button>
                    )}

                    {order.status === 'ACCEPTED' && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'PREPARING')}
                        style={{
                          width: '100%',
                          background: '#0284c7',
                          color: 'white',
                          border: 'none',
                          borderRadius: 'var(--radius-md)',
                          padding: '0.65rem',
                          fontSize: '0.85rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        <Sparkles size={16} />
                        <span>{t(lang, 'kitchen.actions.portionTray')}</span>
                      </button>
                    )}

                    {order.status === 'PREPARING' && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'PACKED')}
                        style={{
                          width: '100%',
                          background: '#7c3aed',
                          color: 'white',
                          border: 'none',
                          borderRadius: 'var(--radius-md)',
                          padding: '0.65rem',
                          fontSize: '0.85rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        <Package size={16} />
                        <span>{t(lang, 'kitchen.actions.sealBox')}</span>
                      </button>
                    )}

                    {order.status === 'PACKED' && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'DELIVERED')}
                        style={{
                          width: '100%',
                          background: '#16a34a',
                          color: 'white',
                          border: 'none',
                          borderRadius: 'var(--radius-md)',
                          padding: '0.65rem',
                          fontSize: '0.85rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        <Send size={16} />
                        <span>{t(lang, isClassroomDelivery ? 'kitchen.actions.dispatchDesk' : 'kitchen.actions.dispatchCounter')}</span>
                      </button>
                    )}

                  {/* Negative / Out of Stock Option for active orders */}
                  {['NEW', 'ACCEPTED', 'PREPARING'].includes(order.status) && (
                    <button
                      onClick={() => handleMarkUnableToFulfil(order.id)}
                      style={{
                        width: '100%',
                        background: '#fff',
                        color: '#dc2626',
                        border: '1px dashed #f87171',
                        borderRadius: 'var(--radius-md)',
                        padding: '0.45rem',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '5px'
                      }}
                    >
                      <AlertTriangle size={13} />
                      <span>Unable to Fulfil / Stock Out (Auto Refund)</span>
                    </button>
                  )}

                  {order.status === 'DELIVERED' && (
                    <div style={{ width: '100%', textAlign: 'center', color: '#15803d', fontSize: '0.78rem', fontWeight: 800, padding: '6px', background: '#dcfce7', borderRadius: 'var(--radius-md)' }}>
                      ✅ Successfully Delivered to Classroom
                    </div>
                  )}

                  {(order.status === 'CANCELLED' || order.status === 'CANCELLED_LATE') && (
                    <div style={{ width: '100%', textAlign: 'center', color: '#b91c1c', fontSize: '0.78rem', fontWeight: 800, padding: '6px', background: '#fee2e2', borderRadius: 'var(--radius-md)' }}>
                      ❌ Order Cancelled ({order.cancelReason || 'Cancelled'}) {order.refundAmount ? `• ₹${order.refundAmount} Refunded` : ''}
                    </div>
                  )}

                  {order.status === 'UNABLE_TO_FULFIL' && (
                    <div style={{ width: '100%', textAlign: 'center', color: '#c2410c', fontSize: '0.78rem', fontWeight: 800, padding: '6px', background: '#ffedd5', borderRadius: 'var(--radius-md)' }}>
                      ⚠️ Out of Stock / Rejected ({order.unableReason || 'Ingredients unavailable'}) {order.refundAmount ? `• ₹${order.refundAmount} Auto-Refunded` : ''}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Thermal Label Modal */}
      {stickerOrder && (
        <ThermalStickerModal
          isOpen={true}
          onClose={() => setStickerOrder(null)}
          order={stickerOrder}
          schoolName={activeSchool.name}
          currency={activeSchool.currency}
        />
      )}
    </div>
  );
}
