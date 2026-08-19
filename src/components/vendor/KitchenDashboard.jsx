import React, { useState } from 'react';
import { ChefHat, CheckCircle2, Clock, Package, Send, Printer, RefreshCw, Filter, Search, Sparkles, Flame, Check, ArrowLeft, AlertTriangle } from 'lucide-react';
import { StorageService } from '../../services/storageService';
import ThermalStickerModal from './ThermalStickerModal';

const STATUS_FILTERS = [
  { id: 'ALL', label: 'All Orders', icon: '📋' },
  { id: 'NEW', label: 'New', icon: '🚨' },
  { id: 'ACCEPTED', label: 'Accepted', icon: '👨‍🍳' },
  { id: 'PREPARING', label: 'Cooking', icon: '🔥' },
  { id: 'PACKED', label: 'Packed', icon: '📦' },
  { id: 'DELIVERED', label: 'Delivered', icon: '✅' }
];

export default function KitchenDashboard({ orders, activeSchool, onRefresh }) {
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');
  const [activeSlotFilter, setActiveSlotFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [stickerOrder, setStickerOrder] = useState(null);
  const [isBatchPrinting, setIsBatchPrinting] = useState(false);

  // Progressive Status Progression Handler
  const handleUpdateStatus = (orderId, newStatus) => {
    StorageService.updateOrderStatus(orderId, newStatus);
    onRefresh();
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
        return <span style={{ background: '#fee2e2', color: '#991b1b', padding: '3px 8px', borderRadius: 'var(--radius-full)', fontSize: '0.72rem', fontWeight: 800 }}>🚨 New Order</span>;
      case 'ACCEPTED':
        return <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '3px 8px', borderRadius: 'var(--radius-full)', fontSize: '0.72rem', fontWeight: 800 }}>👨‍🍳 Accepted</span>;
      case 'PREPARING':
        return <span style={{ background: '#fef3c7', color: '#92400e', padding: '3px 8px', borderRadius: 'var(--radius-full)', fontSize: '0.72rem', fontWeight: 800 }}>🔥 Cooking</span>;
      case 'PACKED':
      case 'READY':
        return <span style={{ background: '#ede9fe', color: '#6b21a8', padding: '3px 8px', borderRadius: 'var(--radius-full)', fontSize: '0.72rem', fontWeight: 800 }}>📦 Box Packed</span>;
      case 'DELIVERED':
        return <span style={{ background: '#dcfce7', color: '#15803d', padding: '3px 8px', borderRadius: 'var(--radius-full)', fontSize: '0.72rem', fontWeight: 800 }}>✅ Delivered</span>;
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
          <button
            onClick={() => { window.location.hash = '#/order'; }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 12px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.25)',
              color: '#ffffff',
              fontSize: '0.76rem',
              fontWeight: 800,
              cursor: 'pointer',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.15s ease'
            }}
          >
            <ArrowLeft size={14} />
            <span>Back to Menu</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: '#cbd5e1', fontWeight: 700 }}>
            <img
              src="./bis-hapur-responsive-logo.png"
              alt="Logo"
              style={{ width: '18px', height: '18px', borderRadius: '50%', objectFit: 'contain', background: '#ffffff', padding: '1px' }}
            />
            <span>{activeSchool?.canteenName}</span>
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
              <span>{tab.label}</span>
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

      {/* 3. Search & Break Slot Filters (Clean Mobile Layout) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
        {/* Search */}
        <div style={{ position: 'relative' }}>
          <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search by student name, grade or token #..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.55rem 0.75rem 0.55rem 34px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              fontSize: '0.82rem',
              outline: 'none'
            }}
          />
        </div>

        {/* Break Slot Selector */}
        <select
          value={activeSlotFilter}
          onChange={(e) => setActiveSlotFilter(e.target.value)}
          style={{
            width: '100%',
            padding: '0.55rem 0.75rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid #cbd5e1',
            background: '#ffffff',
            fontSize: '0.82rem',
            fontWeight: 700,
            outline: 'none',
            color: 'var(--text-main)'
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

      {/* 4. Orders Queue Cards */}
      {filteredOrders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3.5rem 1rem', background: '#ffffff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>👨‍🍳</div>
          <h4 style={{ fontSize: '1rem', fontWeight: 800 }}>No orders in this status</h4>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>New student meal orders will appear in real time</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
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
                    <span>Label</span>
                  </button>
                </div>

                {/* Student Info & Allergy Banner */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                  <div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 900, color: 'var(--text-main)' }}>
                      👦 {order.studentName}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      Parent: {order.orderedByParentName || 'Parent'} ({order.orderedByParentPhone || 'N/A'})
                    </div>
                  </div>

                  <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '3px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800 }}>
                    Grade {order.classSection.replace(/Grade\s*/i, '')}
                  </div>
                </div>

                {/* Prominent Allergy Alert Badge in Kitchen */}
                {hasAllergies && (
                  <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: 'var(--radius-md)', padding: '0.45rem 0.65rem', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <AlertTriangle size={15} color="#e11d48" />
                    <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#be123c' }}>
                      ALLERGY ALERT: {order.allergies.join(', ')}
                    </span>
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
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {order.status === 'NEW' && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'ACCEPTED')}
                      className="btn-primary"
                      style={{ width: '100%', padding: '0.65rem', fontSize: '0.85rem' }}
                    >
                      <span>👨‍🍳 Accept Order & Send to Stove</span>
                    </button>
                  )}

                  {order.status === 'ACCEPTED' && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'PREPARING')}
                      style={{
                        width: '100%',
                        background: '#f59e0b',
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
                        gap: '5px'
                      }}
                    >
                      <Flame size={16} />
                      <span>Start Cooking Dish</span>
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
                        gap: '5px'
                      }}
                    >
                      <Package size={16} />
                      <span>Mark Box Packed & Labeled</span>
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
                        gap: '5px'
                      }}
                    >
                      <Send size={16} />
                      <span>Handover & Deliver to Desk</span>
                    </button>
                  )}

                  {order.status === 'DELIVERED' && (
                    <div style={{ width: '100%', textAlign: 'center', color: '#15803d', fontSize: '0.78rem', fontWeight: 800, padding: '4px', background: '#dcfce7', borderRadius: 'var(--radius-md)' }}>
                      ✅ Successfully Delivered to Classroom
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
