import React, { useState, useEffect, useRef } from 'react';
import { X, ShieldCheck, Heart, AlertTriangle, Check, Camera, Upload, User, Milk, Wheat, Egg, Leaf, Sparkles, RefreshCw } from 'lucide-react';

const COMMON_ALLERGIES = [
  { id: 'Dairy', label: 'Dairy / Lactose', icon: Milk, desc: 'Milk, Paneer, Cheese, Butter' },
  { id: 'Gluten', label: 'Gluten / Wheat', icon: Wheat, desc: 'Wheat, Maida, Pasta, Bread' },
  { id: 'Nuts', label: 'Peanuts & Tree Nuts', icon: AlertTriangle, desc: 'Almonds, Cashews, Peanuts' },
  { id: 'Eggs', label: 'Eggs', icon: Egg, desc: 'Egg whites & yolks' },
  { id: 'Soy', label: 'Soy', icon: Leaf, desc: 'Tofu, Soya chunks, Soy sauce' }
];

const DIETARY_OPTIONS = [
  { id: 'Veg', label: 'Pure Vegetarian', icon: Leaf },
  { id: 'Jain', label: 'Jain (No Onion/Garlic)', icon: Sparkles },
  { id: 'Vegan', label: '100% Plant Vegan', icon: Leaf },
  { id: 'NonVeg', label: 'Non-Veg Allowed', icon: ShieldCheck }
];

const PRESET_PHOTOS = [
  { id: 'aarav', label: 'Student 1', path: './my-kids/aarav.jpg' },
  { id: 'ananya', label: 'Student 2', path: './my-kids/ananya.jpg' },
  { id: 'kabir', label: 'Student 3', path: './my-kids/kabir.jpg' }
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
  const [photo, setPhoto] = useState(child.photo || '');
  const fileInputRef = useRef(null);

  // Keyboard Escape Key to Close Modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Handle Photo File Upload (compressed to compact square dataURL)
  const handlePhotoUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const size = 200;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        // Draw cropped square
        const minDim = Math.min(img.width, img.height);
        const startX = (img.width - minDim) / 2;
        const startY = (img.height - minDim) / 2;

        ctx.drawImage(img, startX, startY, minDim, minDim, 0, 0, size, size);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setPhoto(dataUrl);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const toggleAllergy = (allergyId) => {
    setSelectedAllergies((prev) =>
      prev.includes(allergyId)
        ? prev.filter((a) => a !== allergyId)
        : [...prev, allergyId]
    );
  };

  const handleSave = () => {
    onSaveHealthProfile(child.id, {
      photo,
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
        style={{
          maxWidth: '460px',
          padding: '1.4rem',
          maxHeight: '90vh',
          overflowY: 'auto',
          animation: 'scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#eff6ff', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: 'var(--text-main)' }}>
                {cleanName}'s Profile & Health
              </h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Class {child.class}-{child.section} • ID: {child.id}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            title="Close (Esc)"
            style={{ padding: '0.35rem', borderRadius: '50%', background: '#f1f5f9', border: 'none', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* 1. Student Profile Photo Uploader */}
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '0.9rem', marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
            Student Profile Photo
          </label>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Avatar Preview with Camera Overlay */}
            <div
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              style={{
                position: 'relative',
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                overflow: 'hidden',
                background: '#e2e8f0',
                cursor: 'pointer',
                border: '2.5px solid var(--primary)',
                boxShadow: '0 4px 12px rgba(37,99,235,0.2)',
                flexShrink: 0
              }}
            >
              {photo ? (
                <img
                  src={photo}
                  alt={child.studentName}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={() => setPhoto('')}
                />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                  <User size={30} />
                </div>
              )}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(0,0,0,0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0.8,
                  transition: 'opacity 0.2s ease'
                }}
              >
                <Camera size={18} color="#ffffff" />
              </div>
            </div>

            {/* Upload Buttons & Preset Options */}
            <div style={{ flex: 1 }}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                style={{ display: 'none' }}
              />

              <button
                type="button"
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  background: '#ffffff',
                  border: '1.5px solid #cbd5e1',
                  borderRadius: 'var(--radius-md)',
                  padding: '5px 10px',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                  marginBottom: '0.45rem'
                }}
              >
                <Upload size={12} />
                <span>Upload New Photo</span>
              </button>

              {/* Sample Presets */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700 }}>Presets:</span>
                {PRESET_PHOTOS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPhoto(p.path)}
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      border: photo === p.path ? '2px solid var(--primary)' : '1px solid #cbd5e1',
                      padding: 0,
                      cursor: 'pointer'
                    }}
                  >
                    <img src={p.path} alt={p.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 2. Allergies Checklist */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Food Allergies & Sensitivities
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
            {COMMON_ALLERGIES.map((alg) => {
              const isChecked = selectedAllergies.includes(alg.id);
              const IconComp = alg.icon;
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
                    <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: isChecked ? '#fee2e2' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isChecked ? '#b91c1c' : '#64748b' }}>
                      <IconComp size={15} />
                    </div>
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
                      width: '18px',
                      height: '18px',
                      borderRadius: '5px',
                      border: isChecked ? '2px solid #ef4444' : '2px solid #cbd5e1',
                      background: isChecked ? '#ef4444' : '#ffffff',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {isChecked && <Check size={12} strokeWidth={3} />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Dietary Preference */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Dietary Habit
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            {DIETARY_OPTIONS.map((opt) => {
              const isSelected = dietary === opt.id;
              const IconComp = opt.icon;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setDietary(opt.id)}
                  style={{
                    padding: '0.6rem 0.75rem',
                    borderRadius: 'var(--radius-md)',
                    border: isSelected ? '2px solid var(--primary)' : '1px solid #e2e8f0',
                    background: isSelected ? 'var(--primary-light)' : '#ffffff',
                    color: isSelected ? 'var(--primary)' : 'var(--text-main)',
                    fontSize: '0.76rem',
                    fontWeight: isSelected ? 800 : 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <IconComp size={13} />
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Special Kitchen Notes */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
            Special Kitchen / Diet Notes (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Mild spice only, prefer warm water..."
            value={healthNotes}
            onChange={(e) => setHealthNotes(e.target.value)}
            style={{
              width: '100%',
              padding: '0.6rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid #cbd5e1',
              fontSize: '0.78rem',
              outline: 'none'
            }}
          />
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              flex: 1,
              padding: '0.75rem',
              borderRadius: 'var(--radius-full)',
              border: '1px solid #cbd5e1',
              background: '#f8fafc',
              fontSize: '0.85rem',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="btn-primary"
            style={{
              flex: 2,
              padding: '0.75rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.85rem',
              fontWeight: 900
            }}
          >
            Save Profile & Preferences
          </button>
        </div>
      </div>
    </div>
  );
}
