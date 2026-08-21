import React, { useEffect } from 'react';
import { X, Calendar, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function DateSlotSheet({
  isOpen,
  onClose,
  activeSchool,
  selectedDate,
  setSelectedDate,
  selectedSlot,
  setSelectedSlot
}) {
  // Keyboard Escape listener
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Generate next 5 school days
  const dateOptions = [];
  const today = new Date();
  for (let i = 0; i < 5; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    // Skip weekends if desired, or keep all days
    const iso = d.toISOString().split('T')[0];
    const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' });
    const formatted = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    dateOptions.push({ iso, dayName, formatted });
  }

  const mealPeriods = activeSchool?.mealPeriods || [];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '440px', padding: '1.5rem' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calendar size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 900 }}>Select Date & Meal Slot</h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Advance meal ordering for your child</p>
            </div>
          </div>
          <button onClick={onClose} style={{ padding: '0.35rem', borderRadius: '50%', background: '#f1f5f9', border: 'none', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        {/* 1. Date Selector */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Delivery Date:
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.4rem' }}>
            {dateOptions.map((opt) => {
              const isSelected = selectedDate === opt.iso;
              return (
                <button
                  key={opt.iso}
                  onClick={() => setSelectedDate(opt.iso)}
                  style={{
                    padding: '0.55rem 0.25rem',
                    borderRadius: 'var(--radius-md)',
                    border: isSelected ? '2px solid var(--primary)' : '1px solid #e2e8f0',
                    background: isSelected ? 'var(--primary-light)' : '#ffffff',
                    color: isSelected ? 'var(--primary)' : 'var(--text-main)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span style={{ fontSize: '0.68rem', fontWeight: 800 }}>{opt.dayName}</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 900 }}>{opt.formatted}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Break Slot Selector */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            School Meal / Break Period:
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {mealPeriods.map((slot) => {
              const isSelected = selectedSlot && selectedSlot.id === slot.id;
              return (
                <div
                  key={slot.id}
                  onClick={() => setSelectedSlot(slot)}
                  style={{
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    border: isSelected ? '2px solid var(--primary)' : '1px solid #e2e8f0',
                    background: isSelected ? '#eff6ff' : '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        border: isSelected ? '5px solid var(--primary)' : '2px solid #cbd5e1',
                        background: '#ffffff'
                      }}
                    />
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-main)' }}>
                        {slot.name}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        Timing: {slot.startTime} - {slot.endTime} • Cutoff: {slot.cutoffTime}
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--primary)', background: '#dbeafe', padding: '2px 8px', borderRadius: 'var(--radius-full)' }}>
                      Active
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Done Button */}
        <button
          onClick={onClose}
          className="btn-primary"
          style={{ width: '100%', padding: '0.8rem', fontSize: '0.9rem' }}
        >
          <CheckCircle2 size={16} />
          <span>Confirm & View Menu</span>
        </button>
      </div>
    </div>
  );
}
