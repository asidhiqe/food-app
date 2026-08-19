import React, { useState } from 'react';
import { Settings, Upload, Download, School, Palette, Clock, Users, FileSpreadsheet, Check, AlertCircle, Trash2, Plus, Search } from 'lucide-react';
import { StorageService } from '../../services/storageService';
import { ExcelService } from '../../services/excelService';

export default function SchoolSettings({
  activeSchool,
  students,
  orders,
  onRefresh
}) {
  const [activeTab, setActiveTab] = useState('branding'); // branding, roster, mealSlots, export
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

  // Handle Excel/CSV Roster Upload
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
    <div>
      {/* Header Banner */}
      <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Settings size={22} color="var(--primary)" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>School & Canteen Administration</h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                White-label branding, student roster database, and accounting reports
              </p>
            </div>
          </div>

          {/* Quick Export Button */}
          <button
            onClick={handleExportOrders}
            className="btn-secondary"
            style={{ fontSize: '0.85rem', padding: '0.6rem 1rem' }}
          >
            <FileSpreadsheet size={16} color="#15803d" />
            <span>Export Orders to Excel</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.25rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem', overflowX: 'auto' }}>
          <button
            onClick={() => setActiveTab('branding')}
            className={`portal-btn ${activeTab === 'branding' ? 'active' : ''}`}
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
          >
            <Palette size={16} />
            <span>White-Label Branding</span>
          </button>

          <button
            onClick={() => setActiveTab('roster')}
            className={`portal-btn ${activeTab === 'roster' ? 'active' : ''}`}
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
          >
            <Users size={16} />
            <span>Student Roster ({students.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('mealSlots')}
            className={`portal-btn ${activeTab === 'mealSlots' ? 'active' : ''}`}
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
          >
            <Clock size={16} />
            <span>Break Slots & Cutoffs</span>
          </button>
        </div>
      </div>

      {/* TAB 1: White-Label Branding */}
      {activeTab === 'branding' && (
        <div className="glass-card" style={{ padding: '1.5rem', maxWidth: '700px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <School size={18} color="var(--primary)" />
            <span>School Identity & Theme Settings</span>
          </h3>

          <form onSubmit={handleSaveBranding} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>
                OFFICIAL SCHOOL NAME:
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{ width: '100%', padding: '0.7rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontWeight: 600 }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>
                CANTEEN / FOOD COURT NAME:
              </label>
              <input
                type="text"
                value={formData.canteenName}
                onChange={(e) => setFormData({ ...formData, canteenName: e.target.value })}
                style={{ width: '100%', padding: '0.7rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontWeight: 600 }}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>
                  BRAND PRIMARY COLOR:
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="color"
                    value={formData.primaryColor}
                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                    style={{ width: '44px', height: '40px', padding: 0, border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                  />
                  <input
                    type="text"
                    value={formData.primaryColor}
                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                    style={{ flex: 1, padding: '0.65rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontWeight: 600 }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>
                  CURRENCY SYMBOL & CODE:
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    placeholder="Symbol (₹, $, €)"
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    style={{ width: '70px', padding: '0.65rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontWeight: 700, textAlign: 'center' }}
                  />
                  <input
                    type="text"
                    placeholder="Code (INR, USD)"
                    value={formData.currencyCode}
                    onChange={(e) => setFormData({ ...formData, currencyCode: e.target.value })}
                    style={{ flex: 1, padding: '0.65rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontWeight: 600 }}
                  />
                </div>
              </div>
            </div>

            {saveSuccess && (
              <div style={{ background: '#d1fae5', color: '#065f46', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Check size={18} />
                <span>Branding updated successfully! Colors and school identity applied.</span>
              </div>
            )}

            <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem', padding: '0.85rem' }}>
              <span>Save & Apply School Branding</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 2: Student Roster Management */}
      {activeTab === 'roster' && (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          {/* Top Upload Section */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', background: '#f8fafc', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid #e2e8f0' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Upload size={18} color="var(--primary)" />
                <span>Import Student Master List (Excel / CSV)</span>
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Upload the school roster containing Student ID, Name, Class, Section, and Parent Phone.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <button onClick={() => ExcelService.downloadSampleTemplate()} className="btn-secondary" style={{ fontSize: '0.8rem' }}>
                <Download size={14} />
                <span>Sample Template</span>
              </button>

              <label className="btn-primary" style={{ fontSize: '0.82rem', padding: '0.55rem 1rem', cursor: 'pointer' }}>
                <Upload size={15} />
                <span>{isUploading ? 'Uploading...' : 'Upload Excel / CSV'}</span>
                <input type="file" accept=".xlsx, .xls, .csv" onChange={handleFileUpload} style={{ display: 'none' }} />
              </label>
            </div>
          </div>

          {importStatus && (
            <div style={{ background: importStatus.success ? '#d1fae5' : '#fee2e2', color: importStatus.success ? '#065f46' : '#991b1b', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.85rem', fontWeight: 700 }}>
              {importStatus.success
                ? `🎉 Successfully imported ${importStatus.count} students into the school database!`
                : `❌ Import Error: ${importStatus.error}`}
            </div>
          )}

          {/* Search Box */}
          <div style={{ marginBottom: '1rem', position: 'relative' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search enrolled students by Name, ID, or Grade..."
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
              style={{ width: '100%', padding: '0.6rem 0.75rem 0.6rem 2.2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontWeight: 600 }}
            />
          </div>

          {/* Students Table */}
          <div style={{ overflowX: 'auto', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 800 }}>Student ID</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 800 }}>Student Name</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 800 }}>Class & Section</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 800 }}>Parent Contact</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 800 }}>Parent Name</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((s) => (
                  <tr key={s.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 800, color: 'var(--primary)' }}>{s.id}</td>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>{s.studentName}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>{s.class} - {s.section}</td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>{s.parentPhone || 'N/A'}</td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>{s.parentName || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Meal Periods & Cutoff Rules */}
      {activeTab === 'mealSlots' && (
        <div className="glass-card" style={{ padding: '1.5rem', maxWidth: '700px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={18} color="var(--primary)" />
            <span>Configured Meal & Break Slots</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {activeSchool.mealPeriods.map((slot) => (
              <div
                key={slot.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem',
                  background: '#f8fafc',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800 }}>{slot.name}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Meal Timing: <b>{slot.time}</b> • Order Cut-off: <b>{slot.cutoffMins} mins prior</b>
                  </div>
                </div>
                <span className="badge badge-preparing">Active</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
