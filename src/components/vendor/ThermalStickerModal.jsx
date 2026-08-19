import React from 'react';
import { X, Printer, Check } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function ThermalStickerModal({
  isOpen,
  onClose,
  ordersToPrint,
  activeSchool,
  onPrintCompleted
}) {
  if (!isOpen || !ordersToPrint || ordersToPrint.length === 0) return null;

  const handlePrint = () => {
    window.print();
    if (onPrintCompleted) {
      onPrintCompleted(ordersToPrint.map((o) => o.id));
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '440px', padding: '1.5rem', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Printer size={20} color="var(--text-main)" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Meal Box Stickers</h2>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                {ordersToPrint.length} sticker(s) ready to print
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ padding: '0.4rem', borderRadius: '50%', background: '#f1f5f9' }}>
            <X size={18} color="var(--text-main)" />
          </button>
        </div>

        {/* Stickers Preview & Printable Container */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem', background: '#f8fafc', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
          <div className="printable-area sticker-container">
            {ordersToPrint.map((order) => (
              <div key={order.id} className="canteen-thermal-sticker">
                {/* Sticker Header */}
                <div className="sticker-header">
                  <div className="sticker-school-name">{activeSchool.name}</div>
                  <div className="sticker-canteen-name">{activeSchool.canteenName}</div>
                </div>

                {/* Student Info Block */}
                <div className="sticker-student-block">
                  <div className="sticker-student-name">{order.studentName}</div>
                  <div className="sticker-meta-row">
                    <span>CLASS: {order.classSection}</span>
                    <span>ID: {order.studentId}</span>
                  </div>
                  <div className="sticker-slot-badge">
                    {order.mealPeriodName} • {order.requiredDate}
                  </div>
                </div>

                {/* Items Ordered */}
                <div className="sticker-items-list">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="sticker-item-row">
                      <span>{item.quantity}x {item.name}</span>
                      <span>{activeSchool.currency}{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* Footer with Token & QR */}
                <div className="sticker-footer">
                  <div>
                    <div className="sticker-token">TOKEN #{order.tokenNumber}</div>
                    <div style={{ fontSize: '10px', fontWeight: 'bold' }}>✅ PAID ONLINE</div>
                  </div>
                  <div className="sticker-qr">
                    <QRCodeSVG value={`ORDER:${order.orderNumber}|STU:${order.studentId}`} size={46} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Print Button */}
        <button
          onClick={handlePrint}
          className="btn-primary"
          style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem' }}
        >
          <Printer size={18} />
          <span>Print {ordersToPrint.length > 1 ? `All ${ordersToPrint.length} Stickers` : 'Sticker'} Now</span>
        </button>
      </div>
    </div>
  );
}
