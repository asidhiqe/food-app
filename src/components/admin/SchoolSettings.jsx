import React, { useState } from 'react';
import { Settings, Upload, Download, School, Palette, Clock, Users, FileSpreadsheet, Check, AlertCircle, Trash2, Plus, Search, ArrowLeft } from 'lucide-react';
import { StorageService } from '../../services/storageService';
import { ExcelService } from '../../services/excelService';

const TABS = [
  { id: 'branding', label: 'Branding', icon: '🎨' },
  { id: 'roster', label: 'Roster', icon: '👥' },
  { id: 'mealSlots', label: 'Break Slots', icon: '⏰' },
  { id: 'export', label: 'Export', icon: '📊' }
];

export default function SchoolSettings({
  activeSchool,
  students,
  orders,
  onRefresh,
  adminSession,
  onLogoutAdmin
}) {
  const [activeTab, setActiveTab] = useState('branding');
  const [formData, setFormData] = useState({ ...activeSchool });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [importStatus, setImportStatus] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [studentSearch, setStudentSearch] = useState('');

  // Handle Branding Save
  const handleSaveBranding = (e) => {
    e.preventDefault();
    StorageService.updateSchoolConfig(activeSchool.id, formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
    onRefresh();
  };

  // Handle Excel Roster Upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setImportStatus(null);

    try {
      const parsedStudents = await ExcelService.parseStudentFile(file);
      StorageService.importStudents(activeSchool.id, parsedStudents);
      setImportStatus({ success: true, count: parsedStudents.length });
      setIsUploading(false);
      onRefresh();
    } catch (err) {
      setImportStatus({ success: false, error: err.message || 'Failed to parse file.' });
      setIsUploading(false);
    }
  };

  // Handle Excel Export
  const handleExportOrders = () => {
    ExcelService.exportOrdersToExcel(orders, activeSchool.name);
  };

  const filteredStudents = students.filter((s) =>
    s.studentName.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.id.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.class.toLowerCase().includes(studentSearch.toLowerCase())
  );

  return (
    <div style={{ paddingBottom: '2rem' }}>
      {/* 1. Mobile Header Bar */}
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
            <span>Parent View</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {adminSession && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: 'rgba(124, 58, 237, 0.2)',
                  border: '1px solid rgba(124, 58, 237, 0.4)',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: '#c4b5fd'
                }}
              >
                <span>{adminSession.avatar || '🏫'}</span>
                <span>{adminSession.adminName}</span>
              </div>
            )}

            {onLogoutAdmin && (
              <button
                onClick={onLogoutAdmin}
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
                Switch Admin
              </button>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Settings size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 900, lineHeight: 1.2 }}>School & Canteen Admin</h2>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
              Campus setup, student roster & accounting
            </div>
          </div>
        </div>
      </div>

      {/* 2. Responsive Tabs Carousel */}
      <div
        style={{
          display: 'flex',
          gap: '0.45rem',
          overflowX: 'auto',
          paddingBottom: '0.65rem',
          marginBottom: '1rem',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {TABS.map((tab) => {
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
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
              {tab.id === 'roster' && (
                <span style={{ background: isSelected ? '#ffffff' : '#f1f5f9', color: isSelected ? 'var(--primary)' : 'var(--text-muted)', padding: '1px 5px', borderRadius: '10px', fontSize: '0.65rem', fontWeight: 900 }}>
                  {students.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 3. Tab Contents */}

      {/* TAB 1: BRANDING */}
      {activeTab === 'branding' && (
        <form onSubmit={handleSaveBranding} style={{ background: '#ffffff', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-card)' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 900, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>🎨</span>
            <span>School Identity & Theme</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                Official School Name:
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1', fontSize: '0.85rem', fontWeight: 600 }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                Canteen / Food Court Name:
              </label>
              <input
                type="text"
                value={formData.canteenName}
                onChange={(e) => setFormData({ ...formData, canteenName: e.target.value })}
                style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1', fontSize: '0.85rem', fontWeight: 600 }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                  Brand Primary Color:
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <input
                    type="color"
                    value={formData.primaryColor || '#2563eb'}
                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                    style={{ width: '36px', height: '36px', borderRadius: '6px', border: '1px solid #cbd5e1', cursor: 'pointer', padding: 0 }}
                  />
                  <input
                    type="text"
                    value={formData.primaryColor || '#2563eb'}
                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                    style={{ flex: 1, padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1', fontSize: '0.78rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                  Currency Symbol:
                </label>
                <input
                  type="text"
                  value={formData.currency || '₹'}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1', fontSize: '0.85rem', fontWeight: 800, textAlign: 'center' }}
                />
              </div>
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.75rem' }}>
            <Check size={16} />
            <span>Save School Branding</span>
          </button>

          {saveSuccess && (
            <div style={{ marginTop: '0.75rem', padding: '0.5rem', background: '#dcfce7', color: '#15803d', borderRadius: 'var(--radius-md)', textAlign: 'center', fontSize: '0.78rem', fontWeight: 800 }}>
              ✅ Branding saved & updated!
            </div>
          )}
        </form>
      )}

      {/* TAB 2: ROSTER */}
      {activeTab === 'roster' && (
        <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 900 }}>👥 Student Roster ({students.length})</h3>
            <label
              style={{
                background: 'var(--primary)',
                color: 'white',
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Upload size={13} />
              <span>Import Excel</span>
              <input type="file" accept=".xlsx,.xls,.csv" onChange={handleFileUpload} style={{ display: 'none' }} />
            </label>
          </div>

          {/* Search */}
          <div style={{ position: 'relative', marginBottom: '0.85rem' }}>
            <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search students..."
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
              style={{ width: '100%', padding: '0.5rem 0.6rem 0.5rem 30px', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1', fontSize: '0.8rem', outline: 'none' }}
            />
          </div>

          {/* Student Cards List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {filteredStudents.map((s) => (
              <div
                key={s.id}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.65rem 0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    {s.studentName}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    ID: {s.id} • {s.class}-{s.section}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--primary)' }}>
                    {s.fatherPhone || s.parentPhone || 'No Phone'}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                    {s.fatherName || 'Parent'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: BREAK SLOTS */}
      {activeTab === 'mealSlots' && (
        <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-card)' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 900, marginBottom: '0.85rem' }}>⏰ Campus Meal Periods & Cutoffs</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {(activeSchool?.mealPeriods || []).map((slot) => (
              <div
                key={slot.id}
                style={{
                  padding: '0.75rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid #e2e8f0',
                  background: '#f8fafc'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.88rem', fontWeight: 800 }}>{slot.name}</span>
                  <span style={{ fontSize: '0.68rem', background: '#dbeafe', color: '#1e40af', padding: '1px 6px', borderRadius: '4px', fontWeight: 800 }}>Active</span>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  Break Timing: <strong>{slot.startTime} - {slot.endTime}</strong> • Order Cutoff: <strong>{slot.cutoffTime}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: EXPORT & REPORTS */}
      {activeTab === 'export' && (
        <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-card)' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 900, marginBottom: '0.5rem' }}>📊 Accounting & Settlement Reports</h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            Download itemized transaction reports for canteen vendor billing and school commission audits.
          </p>

          <button
            onClick={handleExportOrders}
            className="btn-primary"
            style={{ width: '100%', padding: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
          >
            <FileSpreadsheet size={18} />
            <span>Download All Orders (.xlsx)</span>
          </button>
        </div>
      )}
    </div>
  );
}
