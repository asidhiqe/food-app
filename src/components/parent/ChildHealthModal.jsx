import React, { useState } from 'react';
import { X, ShieldCheck, Heart, AlertTriangle, Check, Sparkles } from 'lucide-react';

const COMMON_ALLERGIES = [
  { id: 'Dairy', label: 'Dairy / Lactose', icon: '🥛', desc: 'Milk, Paneer, Cheese, Butter' },
  { id: 'Gluten', label: 'Gluten / Wheat', icon: '🌾', desc: 'Wheat, Maida, Pasta, Bread' },
  { id: 'Nuts', label: 'Peanuts & Tree Nuts', icon: '🥜', desc: 'Almonds, Cashews, Peanuts' },
  { id: 'Eggs', label: 'Eggs', icon: '🥚', desc: 'Egg whites & yolks' },
  { id: 'Soy', label: 'Soy', icon: '🫘', desc: 'Tofu, Soya chunks, Soy sauce' }
];

const DIETARY_OPTIONS = [
  { id: 'Veg', label: 'Pure Vegetarian', icon: '🌱' },
  { id: 'Jain', label: 'Jain (No Onion/Garlic)', icon: '🟡' },
  { id: 'Vegan', label: '100% Plant Vegan', icon: '🌿' },
  { id: 'NonVeg', label: 'Non-Veg Allowed', icon: '🍗' }
];

export default function ChildHealthModal({
  isOpen,
  onClose,
  child,
  onSaveHealthProfile
}) {
  if (!isOpen || !child) return null;

  const [selectedAllergies, setSelectedAllergies] = useState(child.allergies || []);
  const [dietary, setDietary] = useState(child.dietary || 'Veg');
  const [healthNotes, setHealthNotes] = useState(child.healthNotes || '');

  const toggleAllergy = (allergyId) => {
    setSelectedAllergies((prev) =>
      prev.includes(allergyId)
        ? prev.filter((a) => a !== allergyId)
        : [...prev, allergyId]
    );
  };

  const handleSave = () => {
    onSaveHealthProfile(child.id, {
      allergies: selectedAllergies,
      dietary,
      healthNotes
    });
    onClose();
  };

  const cleanName = child.studentName.split(' ')[0];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '440px', padding: '1.5rem' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 900 }}>{cleanName}'s Health & Allergies</h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                We'll flag safe meals and alert the school canteen kitchen
              </p>
            </div>
          </div>

          <button onClick={onClose} style={{ padding: '0.35rem', borderRadius: '50%', background: '#f1f5f9', border: 'none', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        {/* 1. Allergies Checklist */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Does {cleanName} have any food allergies / sensitivities?
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
            {COMMON_ALLERGIES.map((alg) => {
              const isChecked = selectedAllergies.includes(alg.id);
              return (
                <div
                  key={alg.id}
                  onClick={() => toggleAllergy(alg.id)}
                  style={{
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: isChecked ? '2px solid #ef4444' : '1px solid #e2e8f0',
                    background: isChecked ? '#fff5f5' : '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.1rem' }}>{alg.icon}</span>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: isChecked ? '#b91c1c' : 'var(--text-main)' }}>
                        {alg.label}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                        {alg.desc}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '6px',
                      border: isChecked ? '2px solid #ef4444' : '2px solid #cbd5e1',
                      background: isChecked ? '#ef4444' : '#ffffff',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {isChecked && <Check size={14} strokeWidth={3} />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Dietary Preference */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Dietary Preference
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.45rem' }}>
            {DIETARY_OPTIONS.map((d) => {
              const isSelected = dietary === d.id;
              return (
                <button
                  key={d.id}
                  onClick={() => setDietary(d.id)}
                  style={{
                    padding: '0.6rem 0.75rem',
                    borderRadius: 'var(--radius-md)',
                    border: isSelected ? '2px solid var(--primary)' : '1px solid #e2e8f0',
                    background: isSelected ? 'var(--primary-light)' : '#ffffff',
                    color: isSelected ? 'var(--primary)' : 'var(--text-main)',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    textAlign: 'left'
                  }}
                >
                  <span>{d.icon}</span>
                  <span>{d.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Special Health Note */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
            Special Note for School Canteen (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Mild lactose sensitive, prefers warm meals"
            value={healthNotes}
            onChange={(e) => setHealthNotes(e.target.value)}
            style={{
              width: '100%',
              padding: '0.65rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid #cbd5e1',
              fontSize: '0.82rem',
              outline: 'none'
            }}
          />
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="btn-primary"
          style={{ width: '100%', padding: '0.85rem', fontSize: '0.92rem' }}
        >
          <Check size={16} />
          <span>Save & Protect {cleanName}'s Meals</span>
        </button>
      </div>
    </div>
  );
}
