import React, { useState } from 'react';
import { Settings, Upload, Download, School, Palette, Clock, Users, FileSpreadsheet, Check, AlertCircle, Trash2, Plus, Search, ArrowLeft, X, ShieldAlert, UserPlus } from 'lucide-react';
import { StorageService } from '../../services/storageService';
import { ExcelService } from '../../services/excelService';

const TABS = [
  { id: 'branding', label: 'Branding', icon: '🎨' },
  { id: 'roster', label: 'Roster', icon: '👥' },
  { id: 'mealSlots', label: 'Break Slots', icon: '⏰' },
  { id: 'export', label: 'Export', icon: '📊' }
];

const ROLE_PERMISSIONS = {
  'Super Admin': ['branding', 'roster', 'mealSlots', 'export'],
  'Operations': ['roster', 'mealSlots', 'export'],
  'Dietitian': ['roster', 'mealSlots'],
  'default': ['branding', 'roster', 'mealSlots', 'export']
};

const COMMON_ALLERGIES = ['Peanuts', 'Tree Nuts', 'Lactose/Dairy', 'Eggs', 'Wheat/Gluten', 'Soy', 'Mustard', 'Sesame'];

export default function SchoolSettings({
  activeSchool,
  students,
  orders,
  onRefresh,
  adminSession,
  onLogoutAdmin
}) {
  const userRole = adminSession?.role || 'Super Admin';
  const allowedTabs = ROLE_PERMISSIONS[userRole] || ROLE_PERMISSIONS['default'];

  const [activeTab, setActiveTab] = useState(() => allowedTabs[0] || 'roster');
  const [formData, setFormData] = useState({ ...activeSchool });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [importStatus, setImportStatus] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [studentSearch, setStudentSearch] = useState('');

  // Direct Student Add State
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [studentAddSuccess, setStudentAddSuccess] = useState(false);
  const [newStudent, setNewStudent] = useState({
    studentName: '',
    id: `BIS-${Math.floor(1000 + Math.random() * 9000)}`,
    class: '4',
    section: 'A',
    gender: 'boy',
    fatherName: '',
    fatherPhone: '',
    allergies: [],
    dietary: 'Veg'
  });

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

  // Handle Direct Student Form Submit
  const handleAddStudentSubmit = (e) => {
    e.preventDefault();
    if (!newStudent.studentName.trim()) return;
    if (!newStudent.fatherPhone.trim()) return;

    StorageService.addStudent(activeSchool.id, newStudent);
    setStudentAddSuccess(true);
    setTimeout(() => {
      setStudentAddSuccess(false);
      setIsAddStudentModalOpen(false);
      // Reset form
      setNewStudent({
        studentName: '',
        id: `BIS-${Math.floor(1000 + Math.random() * 9000)}`,
        class: '4',
        section: 'A',
        gender: 'boy',
        fatherName: '',
        fatherPhone: '',
        allergies: [],
        dietary: 'Veg'
      });
    }, 600);
    onRefresh();
  };

  // Toggle Allergy Chip in Modal
  const toggleAllergy = (allergy) => {
    setNewStudent((prev) => {
      const exists = prev.allergies.includes(allergy);
      const updated = exists
        ? prev.allergies.filter((a) => a !== allergy)
        : [...prev.allergies, allergy];
      return { ...prev, allergies: updated };
    });
  };

  // Handle Delete Student
  const handleDeleteStudent = (studentId, studentName) => {
    if (window.confirm(`Are you sure you want to remove ${studentName} from the campus roster?`)) {
      StorageService.deleteStudent(activeSchool.id, studentId);
      onRefresh();
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
      {/* 1. Header Bar */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)',
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
            {adminSession && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: 'rgba(124, 58, 237, 0.25)',
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
              {adminSession?.role ? `Role: ${adminSession.role} • ` : ''}Campus setup & student roster
            </div>
          </div>
        </div>
      </div>

      {/* 2. Responsive Tabs Carousel (Filtered by Role Permissions) */}
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
        {TABS.filter((tab) => allowedTabs.includes(tab.id)).map((tab) => {
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 900 }}>👥 Student Roster ({students.length})</h3>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {/* Direct Add Student Button */}
              <button
                onClick={() => setIsAddStudentModalOpen(true)}
                style={{
                  background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  boxShadow: '0 2px 8px rgba(22, 163, 74, 0.25)'
                }}
              >
                <Plus size={14} />
                <span>Add Student</span>
              </button>

              {/* Excel Import Button */}
              <label
                style={{
                  background: '#f1f5f9',
                  color: 'var(--text-main)',
                  border: '1px solid #cbd5e1',
                  padding: '5px 12px',
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
          </div>

          {importStatus && (
            <div
              style={{
                marginBottom: '1rem',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                background: importStatus.success ? '#dcfce7' : '#fee2e2',
                color: importStatus.success ? '#15803d' : '#b91c1c',
                fontSize: '0.78rem',
                fontWeight: 700
              }}
            >
              {importStatus.success ? `✅ Successfully imported ${importStatus.count} students!` : `⚠️ ${importStatus.error}`}
            </div>
          )}

          {/* Search */}
          <div style={{ position: 'relative', marginBottom: '0.85rem' }}>
            <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search by student name, ID or grade..."
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
              style={{ width: '100%', padding: '0.55rem 0.6rem 0.55rem 32px', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1', fontSize: '0.82rem', outline: 'none' }}
            />
          </div>

          {/* Student Cards Grid (Responsive 1-col on mobile, 2-3 cols on tablet/laptop) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '0.65rem'
            }}
          >
            {filteredStudents.map((s) => (
              <div
                key={s.id}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.75rem 0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.15s ease'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ fontSize: '1rem' }}>{s.gender === 'girl' ? '👧' : '👦'}</span>
                    <span style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--text-main)' }}>
                      {s.studentName}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    ID: {s.id} • Grade {s.class}-{s.section}
                  </div>
                  {s.allergies && s.allergies.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px', marginTop: '3px' }}>
                      <span style={{ fontSize: '0.64rem', color: '#b91c1c', background: '#fee2e2', padding: '1px 5px', borderRadius: '4px', fontWeight: 800 }}>
                        ⚠️ {s.allergies.join(', ')}
                      </span>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--primary)' }}>
                      {s.fatherPhone || s.parentPhone || 'No Phone'}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                      {s.fatherName || 'Parent'}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteStudent(s.id, s.studentName)}
                    title="Remove Student"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      padding: '4px',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#ef4444'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8'; }}
                  >
                    <Trash2 size={15} />
                  </button>
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
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '0.75rem'
            }}
          >
            {(activeSchool?.mealPeriods || []).map((slot) => (
              <div
                key={slot.id}
                style={{
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid #e2e8f0',
                  background: '#f8fafc'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 900 }}>{slot.name}</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, background: '#eff6ff', color: 'var(--primary)', padding: '2px 8px', borderRadius: 'var(--radius-full)' }}>
                    {slot.time}
                  </span>
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  Order Cutoff: <strong>{slot.cutoffMins} mins</strong> before break starts
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

      {/* Direct Add Student Modal */}
      {isAddStudentModalOpen && (
        <div
          className="modal-overlay"
          onClick={() => setIsAddStudentModalOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '480px',
              background: '#ffffff',
              borderRadius: '24px',
              padding: '1.5rem',
              boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--text-main)' }}>
                  ➕ Enroll New Student
                </h3>
                <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  Directly add a student to the campus lunch roster
                </p>
              </div>
              <button onClick={() => setIsAddStudentModalOpen(false)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', padding: '6px', cursor: 'pointer' }}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddStudentSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.25rem' }}>
                {/* Name & Gender */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '0.6rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                      Student Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ananya Sharma"
                      value={newStudent.studentName}
                      onChange={(e) => setNewStudent({ ...newStudent, studentName: e.target.value })}
                      style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '0.84rem', fontWeight: 700 }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                      Avatar Gender
                    </label>
                    <select
                      value={newStudent.gender}
                      onChange={(e) => setNewStudent({ ...newStudent, gender: e.target.value })}
                      style={{ width: '100%', padding: '0.55rem', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '0.84rem', fontWeight: 700 }}
                    >
                      <option value="boy">👦 Boy</option>
                      <option value="girl">👧 Girl</option>
                    </select>
                  </div>
                </div>

                {/* Admission ID, Grade, Section */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: '0.6rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                      Student ID / Roll
                    </label>
                    <input
                      type="text"
                      value={newStudent.id}
                      onChange={(e) => setNewStudent({ ...newStudent, id: e.target.value })}
                      style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '0.84rem', fontWeight: 700 }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                      Class / Grade
                    </label>
                    <select
                      value={newStudent.class}
                      onChange={(e) => setNewStudent({ ...newStudent, class: e.target.value })}
                      style={{ width: '100%', padding: '0.55rem', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '0.84rem', fontWeight: 700 }}
                    >
                      {[1,2,3,4,5,6,7,8,9,10,11,12].map((g) => (
                        <option key={g} value={String(g)}>Grade {g}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                      Section
                    </label>
                    <select
                      value={newStudent.section}
                      onChange={(e) => setNewStudent({ ...newStudent, section: e.target.value })}
                      style={{ width: '100%', padding: '0.55rem', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '0.84rem', fontWeight: 700 }}
                    >
                      {['A', 'B', 'C', 'D'].map((s) => (
                        <option key={s} value={s}>Sec {s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Parent / Father Details (For Phone OTP Matching) */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr', gap: '0.6rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                      Parent Mobile (+91) *
                    </label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="10-digit number"
                      value={newStudent.fatherPhone}
                      onChange={(e) => setNewStudent({ ...newStudent, fatherPhone: e.target.value })}
                      style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '0.84rem', fontWeight: 800 }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                      Parent Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Rajesh Sharma"
                      value={newStudent.fatherName}
                      onChange={(e) => setNewStudent({ ...newStudent, fatherName: e.target.value })}
                      style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '0.84rem', fontWeight: 700 }}
                    />
                  </div>
                </div>

                {/* Allergen & Dietary Safety Flags */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                    🛡️ Medical Allergies & Dietary Flags:
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                    {COMMON_ALLERGIES.map((allergy) => {
                      const isSelected = newStudent.allergies.includes(allergy);
                      return (
                        <button
                          key={allergy}
                          type="button"
                          onClick={() => toggleAllergy(allergy)}
                          style={{
                            padding: '3px 8px',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.7rem',
                            fontWeight: 800,
                            border: isSelected ? '1.5px solid #ef4444' : '1px solid #cbd5e1',
                            background: isSelected ? '#fee2e2' : '#f8fafc',
                            color: isSelected ? '#b91c1c' : 'var(--text-muted)',
                            cursor: 'pointer'
                          }}
                        >
                          {isSelected ? '✓ ' : '+ '}{allergy}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {studentAddSuccess && (
                <div style={{ marginBottom: '1rem', padding: '0.5rem', background: '#dcfce7', color: '#15803d', borderRadius: 'var(--radius-md)', textAlign: 'center', fontSize: '0.78rem', fontWeight: 800 }}>
                  🎉 Student enrolled successfully!
                </div>
              )}

              <button
                type="submit"
                className="btn-primary"
                style={{ width: '100%', padding: '0.85rem' }}
              >
                <Check size={16} />
                <span>Save & Enroll Student</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
