import React, { useState } from 'react';
import { Shield, Building2, Plus, Sparkles, Sliders, ToggleLeft, ToggleRight, Check, X, ArrowRight, LogOut, TrendingUp, Users, Utensils, DollarSign, ExternalLink, Settings, ShieldAlert, Award } from 'lucide-react';
import { StorageService } from '../../services/storageService';
import { FEATURE_DEFINITIONS, FEATURE_CATEGORIES, TIER_PRESETS, getSchoolTier } from '../../services/featureService';

export default function SuperAdminDashboard({
  schools,
  activeSchool,
  onSelectSchool,
  onRefresh,
  superAdminSession,
  onLogoutSuperAdmin,
  onJumpToPortal
}) {
  const [selectedSchoolForFeatures, setSelectedSchoolForFeatures] = useState(null);
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(null);

  // New School Onboarding Form State
  const [newSchoolForm, setNewSchoolForm] = useState({
    id: '',
    name: '',
    canteenName: '',
    emoji: '🏫',
    primaryColor: '#2563eb',
    accentColor: '#10b981',
    currency: '₹',
    currencyCode: 'INR',
    tier: 'growth',
    phone: '+91 98765 00000',
    address: 'Campus Main Road',
    advanceBookingDays: 7
  });

  // Calculate Global SaaS Metrics
  const totalSchools = schools.length;
  const totalARR = schools.reduce((sum, s) => {
    const tier = s.tier || 'enterprise';
    const monthlyRate = tier === 'starter' ? 8000 : tier === 'growth' ? 16000 : 24000;
    return sum + (monthlyRate * 12);
  }, 0);

  const totalMRR = Math.round(totalARR / 12);

  // Handle Plan Preset Application for a specific school
  const handleApplySchoolTier = (schoolId, tierKey) => {
    const preset = TIER_PRESETS[tierKey];
    if (!preset) return;

    const targetSchool = schools.find((s) => s.id === schoolId);
    if (!targetSchool) return;

    const updated = {
      ...targetSchool,
      tier: tierKey,
      features: { ...preset.features }
    };

    StorageService.updateSchoolConfig(schoolId, updated);
    if (selectedSchoolForFeatures && selectedSchoolForFeatures.id === schoolId) {
      setSelectedSchoolForFeatures(updated);
    }
    setSaveSuccessMsg(`Applied ${preset.name} to ${targetSchool.name}!`);
    setTimeout(() => setSaveSuccessMsg(null), 3000);
    onRefresh();
  };

  // Handle Granular Feature Flag Toggle for a specific school
  const handleToggleSchoolFeature = (schoolId, featureKey) => {
    const targetSchool = schools.find((s) => s.id === schoolId);
    if (!targetSchool) return;

    const currentFeatures = targetSchool.features || { ...TIER_PRESETS[targetSchool.tier || 'enterprise']?.features };
    const currentVal = typeof currentFeatures[featureKey] !== 'undefined'
      ? !!currentFeatures[featureKey]
      : true;

    const updatedFeatures = {
      ...currentFeatures,
      [featureKey]: !currentVal
    };

    const updated = {
      ...targetSchool,
      features: updatedFeatures
    };

    StorageService.updateSchoolConfig(schoolId, updated);
    if (selectedSchoolForFeatures && selectedSchoolForFeatures.id === schoolId) {
      setSelectedSchoolForFeatures(updated);
    }
    onRefresh();
  };

  // Handle Onboarding New School Submit
  const handleCreateSchool = (e) => {
    e.preventDefault();
    if (!newSchoolForm.name.trim()) return;

    const schoolId = newSchoolForm.id.trim() || newSchoolForm.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const preset = TIER_PRESETS[newSchoolForm.tier] || TIER_PRESETS.growth;

    const newSchoolObj = {
      ...newSchoolForm,
      id: schoolId,
      logoText: newSchoolForm.name.slice(0, 2).toUpperCase(),
      features: { ...preset.features },
      mealPeriods: [
        { id: 'break_morning', name: 'Morning Recess', time: '10:15 AM', cutoffMins: 45 },
        { id: 'lunch_break', name: 'Lunch Hour', time: '12:45 PM', cutoffMins: 45 }
      ]
    };

    const existingSchools = StorageService.getSchools();
    const updatedSchools = [...existingSchools, newSchoolObj];
    localStorage.setItem('sfa_schools_list', JSON.stringify(updatedSchools));

    setIsOnboardingModalOpen(false);
    setSaveSuccessMsg(`New school "${newSchoolObj.name}" successfully onboarded!`);
    setTimeout(() => setSaveSuccessMsg(null), 3500);
    onRefresh();
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '1.5rem 1rem' }}>
      {/* Toast Notification */}
      {saveSuccessMsg && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: 'linear-gradient(135deg, #15803d 0%, #166534 100%)',
            color: '#ffffff',
            padding: '0.75rem 1.25rem',
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.85rem',
            fontWeight: 800
          }}
        >
          <Check size={16} />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Top Super Admin Masthead */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
          color: '#ffffff',
          padding: '1.5rem',
          borderRadius: '20px',
          boxShadow: '0 12px 32px rgba(15,23,42,0.15)',
          border: '1px solid rgba(255,255,255,0.12)',
          marginBottom: '1.5rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 6px 16px rgba(99,102,241,0.4)',
                border: '1px solid rgba(255,255,255,0.2)'
              }}
            >
              <Shield size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h1 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#ffffff', margin: 0, letterSpacing: '-0.01em' }}>
                  SaaS Platform Super Admin Console
                </h1>
                <span
                  style={{
                    background: 'rgba(99, 102, 241, 0.25)',
                    border: '1px solid rgba(99, 102, 241, 0.5)',
                    color: '#c7d2fe',
                    fontSize: '0.68rem',
                    fontWeight: 900,
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    textTransform: 'uppercase'
                  }}
                >
                  Master Governance
                </span>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
                Manage Partner School Accounts, Feature Licensing Tiers & Commercial Controls
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setIsOnboardingModalOpen(true)}
              style={{
                background: '#6366f1',
                color: '#ffffff',
                border: 'none',
                padding: '0.6rem 1rem',
                borderRadius: '10px',
                fontSize: '0.8rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 12px rgba(99,102,241,0.35)'
              }}
            >
              <Plus size={16} />
              <span>Onboard New School</span>
            </button>

            {onLogoutSuperAdmin && (
              <button
                onClick={onLogoutSuperAdmin}
                style={{
                  background: 'rgba(239, 68, 68, 0.2)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  color: '#fca5a5',
                  padding: '0.6rem 0.9rem',
                  borderRadius: '10px',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <LogOut size={14} />
                <span>Exit Console</span>
              </button>
            )}
          </div>
        </div>

        {/* Global Key Performance Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>Total Active Campuses</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#ffffff', marginTop: '2px' }}>
              {totalSchools} Schools
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>Monthly SaaS ARR Rate</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#38bdf8', marginTop: '2px' }}>
              ₹{(totalARR / 100000).toFixed(1)} Lakhs / yr
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>Contracted Monthly MRR</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#4ade80', marginTop: '2px' }}>
              ₹{totalMRR.toLocaleString('en-IN')} / mo
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>Platform SLA & Uptime</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#c084fc', marginTop: '2px' }}>
              99.98% Healthy
            </div>
          </div>
        </div>
      </div>

      {/* Main Section: Onboarded Schools & Feature Control Matrix */}
      <div style={{ background: '#ffffff', borderRadius: '18px', border: '1px solid var(--border-color)', padding: '1.25rem', boxShadow: 'var(--shadow-card)', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.15rem' }}>
          <div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
              🏫 Partner Schools Directory & Feature Licensing
            </h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
              Select a school to configure its paid subscription plan or toggle individual feature flags.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
          {schools.map((school) => {
            const tierInfo = getSchoolTier(school);
            const features = school.features || tierInfo.features;
            const enabledCount = FEATURE_DEFINITIONS.filter((f) => features[f.key] !== false).length;
            const isSelected = activeSchool?.id === school.id;

            return (
              <div
                key={school.id}
                style={{
                  border: isSelected ? '2px solid var(--primary)' : '1px solid #e2e8f0',
                  borderRadius: '14px',
                  padding: '1.15rem',
                  background: isSelected ? '#f8fafc' : '#ffffff',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  boxShadow: isSelected ? '0 4px 14px rgba(37,99,235,0.08)' : '0 1px 3px rgba(0,0,0,0.02)'
                }}
              >
                <div>
                  {/* Top Row: School Badge + Plan Pill */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '0.6rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '1.5rem' }}>{school.emoji || '🏫'}</span>
                      <div>
                        <h3 style={{ fontSize: '0.94rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                          {school.name}
                        </h3>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          {school.canteenName} • {school.currencyCode || 'INR'} ({school.currency})
                        </div>
                      </div>
                    </div>

                    <span
                      style={{
                        background: tierInfo.color,
                        color: '#ffffff',
                        fontSize: '0.65rem',
                        fontWeight: 900,
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-full)',
                        textTransform: 'uppercase',
                        flexShrink: 0
                      }}
                    >
                      {tierInfo.badge}
                    </span>
                  </div>

                  {/* Plan & Pricing Info */}
                  <div style={{ background: '#f1f5f9', borderRadius: '10px', padding: '0.6rem 0.75rem', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.76rem' }}>
                      <span style={{ fontWeight: 800, color: '#334155' }}>Subscribed Tier:</span>
                      <strong style={{ color: tierInfo.color }}>{tierInfo.name}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem', marginTop: '3px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Monthly License:</span>
                      <strong style={{ color: '#0f172a' }}>{tierInfo.price}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem', marginTop: '3px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Enabled Modules:</span>
                      <span style={{ fontWeight: 800, color: '#16a34a' }}>
                        {enabledCount} / {FEATURE_DEFINITIONS.length} features active
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  <button
                    onClick={() => setSelectedSchoolForFeatures(school)}
                    style={{
                      width: '100%',
                      background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                      color: '#ffffff',
                      border: 'none',
                      padding: '0.55rem',
                      borderRadius: '8px',
                      fontSize: '0.76rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '5px'
                    }}
                  >
                    <Sliders size={13} />
                    <span>Configure Feature Flags & Tier</span>
                  </button>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.35rem' }}>
                    <button
                      onClick={() => onJumpToPortal(school.id, 'parent')}
                      style={{
                        padding: '0.4rem 0.2rem',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        background: '#ffffff',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                      title="Preview Parent View"
                    >
                      🍱 Parent
                    </button>
                    <button
                      onClick={() => onJumpToPortal(school.id, 'kitchen')}
                      style={{
                        padding: '0.4rem 0.2rem',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        background: '#ffffff',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                      title="Preview Kitchen View"
                    >
                      👨‍🍳 Kitchen
                    </button>
                    <button
                      onClick={() => onJumpToPortal(school.id, 'admin')}
                      style={{
                        padding: '0.4rem 0.2rem',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        background: '#ffffff',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                      title="Preview School Admin View"
                    >
                      🏫 Admin
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Feature Flag & Plan Governance Modal for Selected School */}
      {selectedSchoolForFeatures && (
        <div className="modal-overlay" onClick={() => setSelectedSchoolForFeatures(null)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '780px', maxHeight: '88vh', overflowY: 'auto', padding: '1.5rem' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid #e2e8f0' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.4rem' }}>{selectedSchoolForFeatures.emoji || '🏫'}</span>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                    {selectedSchoolForFeatures.name} — Feature Flag & Plan Governance
                  </h3>
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Super Admin licensing control. Changes update the tenant's app behavior immediately.
                </div>
              </div>

              <button
                onClick={() => setSelectedSchoolForFeatures(null)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Plan Tier Switcher */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.88rem', fontWeight: 900, color: '#1e293b', marginBottom: '0.6rem' }}>
                1. Set Commercial Subscription Tier
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.65rem' }}>
                {Object.values(TIER_PRESETS).map((preset) => {
                  const isCurrent = (selectedSchoolForFeatures.tier || 'enterprise') === preset.id;
                  return (
                    <div
                      key={preset.id}
                      onClick={() => handleApplySchoolTier(selectedSchoolForFeatures.id, preset.id)}
                      style={{
                        padding: '0.85rem',
                        borderRadius: '12px',
                        border: isCurrent ? `2px solid ${preset.color}` : '1px solid #e2e8f0',
                        background: isCurrent ? '#f0fdf4' : '#ffffff',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                          <span style={{ fontSize: '0.84rem', fontWeight: 900, color: '#0f172a' }}>{preset.name}</span>
                          {isCurrent && <Check size={14} color="#16a34a" />}
                        </div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 900, color: preset.color }}>{preset.price}</div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '4px' }}>{preset.description}</div>
                      </div>
                      <button
                        type="button"
                        style={{
                          marginTop: '0.65rem',
                          padding: '0.35rem',
                          borderRadius: '6px',
                          border: 'none',
                          background: isCurrent ? preset.color : '#f1f5f9',
                          color: isCurrent ? '#ffffff' : '#64748b',
                          fontSize: '0.72rem',
                          fontWeight: 800
                        }}
                      >
                        {isCurrent ? 'Current Plan' : 'Select Plan'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Granular Toggles */}
            <div>
              <h4 style={{ fontSize: '0.88rem', fontWeight: 900, color: '#1e293b', marginBottom: '0.75rem' }}>
                2. Granular Feature Flag Overrides for this Campus
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {Object.values(FEATURE_CATEGORIES).map((cat) => {
                  const catFeatures = FEATURE_DEFINITIONS.filter((f) => f.category === cat.id);
                  const schoolFeatures = selectedSchoolForFeatures.features || {};

                  return (
                    <div key={cat.id} style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.65rem' }}>
                        <span>{cat.icon}</span>
                        <span style={{ fontSize: '0.82rem', fontWeight: 900, color: '#1e293b' }}>{cat.label}</span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.5rem' }}>
                        {catFeatures.map((f) => {
                          const isEnabled = typeof schoolFeatures[f.key] !== 'undefined'
                            ? !!schoolFeatures[f.key]
                            : f.defaultEnabled;

                          return (
                            <div
                              key={f.key}
                              onClick={() => handleToggleSchoolFeature(selectedSchoolForFeatures.id, f.key)}
                              style={{
                                padding: '0.6rem 0.75rem',
                                borderRadius: '8px',
                                border: isEnabled ? '1.5px solid #86efac' : '1px solid #e2e8f0',
                                background: isEnabled ? '#ffffff' : '#f1f5f9',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '8px',
                                cursor: 'pointer'
                              }}
                            >
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: isEnabled ? '#14532d' : '#475569' }}>
                                  {f.name}
                                </div>
                                <div style={{ fontSize: '0.65rem', color: '#64748b' }}>
                                  {f.minTier === 'enterprise' ? 'Enterprise Module' : f.minTier === 'growth' ? 'Growth Module' : 'Standard'}
                                </div>
                              </div>

                              <button
                                type="button"
                                style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}
                              >
                                {isEnabled ? (
                                  <ToggleRight size={24} color="#16a34a" />
                                ) : (
                                  <ToggleLeft size={24} color="#94a3b8" />
                                )}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
              <button
                onClick={() => setSelectedSchoolForFeatures(null)}
                className="btn-primary"
                style={{ padding: '0.65rem 1.5rem', fontSize: '0.85rem' }}
              >
                <span>Done & Close</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Onboard New School Modal */}
      {isOnboardingModalOpen && (
        <div className="modal-overlay" onClick={() => setIsOnboardingModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 900 }}>🏫 Onboard New Partner School</h3>
              <button onClick={() => setIsOnboardingModalOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateSchool} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                  School Name:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Delhi Public Academy"
                  value={newSchoolForm.name}
                  onChange={(e) => setNewSchoolForm({ ...newSchoolForm, name: e.target.value })}
                  style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                  Canteen / Dining Hall Name:
                </label>
                <input
                  type="text"
                  placeholder="e.g. DPA Healthy Food Court"
                  value={newSchoolForm.canteenName}
                  onChange={(e) => setNewSchoolForm({ ...newSchoolForm, canteenName: e.target.value })}
                  style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                    Currency Symbol:
                  </label>
                  <select
                    value={newSchoolForm.currency}
                    onChange={(e) => setNewSchoolForm({ ...newSchoolForm, currency: e.target.value, currencyCode: e.target.value === '₹' ? 'INR' : 'USD' })}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                  >
                    <option value="₹">₹ (INR)</option>
                    <option value="$">$ (USD)</option>
                    <option value="AED">AED (Dirham)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                    Initial SaaS Tier:
                  </label>
                  <select
                    value={newSchoolForm.tier}
                    onChange={(e) => setNewSchoolForm({ ...newSchoolForm, tier: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                  >
                    <option value="starter">Starter (₹8,000/mo)</option>
                    <option value="growth">Growth (₹16,000/mo)</option>
                    <option value="enterprise">Enterprise (₹24,000/mo)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{ marginTop: '0.5rem', width: '100%', padding: '0.7rem' }}
              >
                <span>Provision & Launch School Tenant</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
