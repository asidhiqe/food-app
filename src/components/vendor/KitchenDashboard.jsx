import React, { useState } from 'react';
import { ChefHat, CheckCircle2, Clock, Package, Send, Printer, RefreshCw, Filter, Search, Sparkles, Flame, Check } from 'lucide-react';
import { StorageService } from '../../services/storageService';
import ThermalStickerModal from './ThermalStickerModal';

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
      o.status === selectedStatusFilter ||
      (selectedStatusFilter === 'ACTIVE' && o.status !== 'DELIVERED');

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
        return <span className="badge badge-new" style={{ background: '#fee2e2', color: '#991b1b' }}>🚨 New Order</span>;
      case 'ACCEPTED':
        return <span className="badge badge-accepted" style={{ background: '#e0f2fe', color: '#0369a1' }}>👨‍🍳 Accepted</span>;
      case 'PREPARING':
        return <span className="badge badge-preparing" style={{ background: '#fef3c7', color: '#92400e' }}>🔥 Cooking</span>;
      case 'PACKED':
      case 'READY':
        return <span className="badge badge-packed" style={{ background: '#ede9fe', color: '#6b21a8' }}>📦 Box Packed</span>;
      case 'DELIVERED':
        return <span className="badge badge-delivered" style={{ background: '#dcfce7', color: '#15803d' }}>✅ Delivered</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  return (
    <div>
      {/* Top Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.25rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ChefHat size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 900 }}>Kitchen Display System (KDS)</h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Live order queue for {activeSchool.canteenName} • Total Orders: {orders.length}
              </p>
            </div>
          </div>
        </div>

        {/* Actions: Batch Print & Refresh */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setIsBatchPrinting(true)}
            className="btn-secondary"
            style={{ padding: '0.55rem 0.95rem', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '5px' }}
          >
            <Printer size={16} />
            <span>Batch Print Stickers</span>
          </button>

          <button
            onClick={onRefresh}
            className="btn-primary"
            style={{ padding: '0.55rem 0.95rem', fontSize: '0.82rem' }}
          >
            <RefreshCw size={15} />
            <span>Refresh Queue</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          padding: '1rem',
          marginBottom: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem'
        }}
      >
        {/* Status Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '4px' }}>
          {[
            { key: 'ALL', label: 'All Orders', count: orders.length },
            { key: 'NEW', label: '🚨 New', count: orders.filter((o) => o.status === 'NEW').length },
            { key: 'ACCEPTED', label: '👨‍🍳 Accepted', count: orders.filter((o) => o.status === 'ACCEPTED').length },
            { key: 'PREPARING', label: '🔥 Cooking', count: orders.filter((o) => o.status === 'PREPARING').length },
            { key: 'PACKED', label: '📦 Box Packed', count: orders.filter((o) => o.status === 'PACKED' || o.status === 'READY').length },
            { key: 'DELIVERED', label: '✅ Delivered', count: orders.filter((o) => o.status === 'DELIVERED').length }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedStatusFilter(tab.key)}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                border: selectedStatusFilter === tab.key ? '1.5px solid var(--primary)' : '1px solid var(--border-color)',
                background: selectedStatusFilter === tab.key ? 'var(--primary-light)' : '#f8fafc',
                color: selectedStatusFilter === tab.key ? 'var(--primary)' : 'var(--text-main)',
                fontSize: '0.78rem',
                fontWeight: 800,
                cursor: 'pointer',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>{tab.label}</span>
              <span style={{ background: selectedStatusFilter === tab.key ? 'var(--primary)' : '#e2e8f0', color: selectedStatusFilter === tab.key ? 'white' : 'var(--text-main)', padding: '1px 6px', borderRadius: '10px', fontSize: '0.7rem' }}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search & Slot Filters */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.75rem' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search by student name, grade, or token #..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '0.55rem 0.75rem 0.55rem 36px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '0.82rem' }}
            />
          </div>

          <select
            value={activeSlotFilter}
            onChange={(e) => setActiveSlotFilter(e.target.value)}
            style={{ padding: '0.55rem 0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: '#ffffff', fontSize: '0.8rem', fontWeight: 700 }}
          >
            <option value="ALL">All Break Slots</option>
            {(activeSchool.mealPeriods || []).map((slot) => (
              <option key={slot.id} value={slot.id}>
                {slot.name} ({slot.startTime})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Grid */}
      {filteredOrders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', background: '#ffffff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>👨‍🍳</div>
          <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>No orders in this queue</h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>All meals are processed or no orders match current filter.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
          {filteredOrders.map((order) => {
            return (
              <div
                key={order.id}
                style={{
                  background: '#ffffff',
                  borderRadius: 'var(--radius-lg)',
                  border: order.status === 'NEW' ? '2px solid #ef4444' : '1px solid var(--border-color)',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden'
                }}
              >
                {/* Card Header */}
                <div style={{ padding: '0.85rem 1rem', background: order.status === 'NEW' ? '#fef2f2' : '#f8fafc', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--text-main)' }}>
                        #{order.tokenNumber}
                      </span>
                      {getStatusBadge(order.status)}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '2px' }}>
                      {order.mealPeriodName} • {order.requiredDate}
                    </div>
                  </div>

                  <button
                    onClick={() => setStickerOrder(order)}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      padding: '4px 8px',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Printer size={13} />
                    <span>Sticker</span>
                  </button>
                </div>

                {/* Card Body: Student & Items */}
                <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Student & Class Block */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px dashed #e2e8f0' }}>
                    <div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 900, color: 'var(--text-main)' }}>
                        👦 {order.studentName}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        Parent: {order.orderedByParentName || 'Parent'}
                      </div>
                    </div>
                    <div style={{ background: '#0f172a', color: '#ffffff', padding: '3px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800 }}>
                      Class {order.classSection}
                    </div>
                  </div>

                  {/* Items List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1, marginBottom: '0.85rem' }}>
                    {order.items.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 700 }}>
                        <span style={{ color: 'var(--text-main)' }}>
                          <strong style={{ color: 'var(--primary)', marginRight: '4px' }}>{item.quantity}x</strong> {item.name}
                        </span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                          {activeSchool.currency} {item.subtotal || item.price * item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Action Button Lifecycle */}
                  <div style={{ paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
                    {order.status === 'NEW' && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'ACCEPTED')}
                        className="btn-primary"
                        style={{ width: '100%', padding: '0.65rem', fontSize: '0.85rem', background: '#0284c7' }}
                      >
                        <Check size={16} />
                        <span>Accept Order (Send to Chefs)</span>
                      </button>
                    )}

                    {order.status === 'ACCEPTED' && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'PREPARING')}
                        className="btn-primary"
                        style={{ width: '100%', padding: '0.65rem', fontSize: '0.85rem', background: '#d97706' }}
                      >
                        <Flame size={16} />
                        <span>Start Cooking</span>
                      </button>
                    )}

                    {order.status === 'PREPARING' && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'PACKED')}
                        className="btn-primary"
                        style={{ width: '100%', padding: '0.65rem', fontSize: '0.85rem', background: '#7c3aed' }}
                      >
                        <Package size={16} />
                        <span>Mark Box Packed & Print Sticker</span>
                      </button>
                    )}

                    {(order.status === 'PACKED' || order.status === 'READY') && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'DELIVERED')}
                        className="btn-primary"
                        style={{ width: '100%', padding: '0.65rem', fontSize: '0.85rem', background: '#16a34a' }}
                      >
                        <Send size={16} />
                        <span>Deliver to Classroom {order.classSection}</span>
                      </button>
                    )}

                    {order.status === 'DELIVERED' && (
                      <div style={{ textAlign: 'center', padding: '0.4rem', background: '#dcfce7', color: '#15803d', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                        <CheckCircle2 size={16} />
                        <span>Delivered to Classroom</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Single / Batch Thermal Sticker Print Modal */}
      {(stickerOrder || isBatchPrinting) && (
        <ThermalStickerModal
          order={stickerOrder}
          orders={isBatchPrinting ? filteredOrders : null}
          activeSchool={activeSchool}
          onClose={() => {
            setStickerOrder(null);
            setIsBatchPrinting(false);
          }}
        />
      )}
    </div>
  );
}
