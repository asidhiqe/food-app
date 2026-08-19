import React from 'react';
import { Calendar, Clock, Sparkles } from 'lucide-react';

export default function DateSlotSelector({
  activeSchool,
  selectedDate,
  setSelectedDate,
  selectedSlot,
  setSelectedSlot
}) {
  // Generate next 7 days
  const dates = [];
  const today = new Date();
  for (let i = 0; i < (activeSchool.advanceBookingDays || 7); i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    // Skip Sunday if desired, or keep all days
    const dateStr = d.toISOString().split('T')[0];
    const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' });
    const formattedDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    dates.push({ dateStr, dayName, formattedDate });
  }

  const mealPeriods = activeSchool.mealPeriods || [];

  return (
    <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Calendar size={18} color="var(--primary)" />
          </div>
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800 }}>1. Choose Delivery Date & Break Slot</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Food will be freshly prepared and delivered to your child's classroom</p>
          </div>
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: '#fef3c7', padding: '0.25rem 0.6rem', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700, color: '#92400e' }}>
          <Sparkles size={13} />
          <span>7-Day Advance Booking Active</span>
        </div>
      </div>

      {/* Date Pills */}
      <div style={{ display: 'flex', gap: '0.6rem', overflowX: 'auto', paddingBottom: '0.5rem', scrollbarWidth: 'none' }}>
        {dates.map(({ dateStr, dayName, formattedDate }) => {
          const isSelected = selectedDate === dateStr;
          return (
            <button
              key={dateStr}
              onClick={() => setSelectedDate(dateStr)}
              style={{
                flexShrink: 0,
                padding: '0.6rem 0.9rem',
                borderRadius: 'var(--radius-md)',
                border: isSelected ? `2px solid var(--primary)` : '1px solid var(--border-color)',
                background: isSelected ? 'var(--primary-light)' : 'white',
                color: isSelected ? 'var(--primary)' : 'var(--text-main)',
                textAlign: 'center',
                transition: 'all 0.15s ease',
                minWidth: '90px'
              }}
            >
              <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: isSelected ? 'var(--primary)' : 'var(--text-muted)' }}>
                {dayName}
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, marginTop: '2px' }}>
                {formattedDate}
              </div>
            </button>
          );
        })}
      </div>

      {/* Meal Periods Selector */}
      <div style={{ marginTop: '0.85rem', paddingTop: '0.85rem', borderTop: '1px solid #f1f5f9' }}>
        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
          SELECT MEAL / BREAK PERIOD:
        </div>
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          {mealPeriods.map((slot) => {
            const isSelected = selectedSlot?.id === slot.id;
            return (
              <button
                key={slot.id}
                onClick={() => setSelectedSlot(slot)}
                style={{
                  padding: '0.55rem 1rem',
                  borderRadius: 'var(--radius-full)',
                  border: isSelected ? `2px solid var(--primary)` : '1px solid var(--border-color)',
                  background: isSelected ? 'var(--primary)' : 'white',
                  color: isSelected ? 'white' : 'var(--text-main)',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.15s ease'
                }}
              >
                <Clock size={15} color={isSelected ? 'white' : 'var(--text-muted)'} />
                <span>{slot.name}</span>
                <span style={{ fontSize: '0.72rem', opacity: isSelected ? 0.9 : 0.6, background: isSelected ? 'rgba(0,0,0,0.15)' : '#f1f5f9', padding: '0.1rem 0.4rem', borderRadius: '10px' }}>
                  {slot.time}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
