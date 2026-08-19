import React, { useState, useEffect } from 'react';
import { X, UserCheck, Search, ShieldCheck, AlertCircle, Phone, BookOpen, Layers, ArrowRight, User } from 'lucide-react';
import { StorageService } from '../../services/storageService';

export default function StudentIDModal({
  isOpen,
  onClose,
  schoolId,
  activeSchool,
  onStudentVerified,
  cartTotal,
  currency
}) {
  const [studentIdInput, setStudentIdInput] = useState('');
  const [matchedStudent, setMatchedStudent] = useState(null);
  const [savedProfiles, setSavedProfiles] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSavedProfiles(StorageService.getSavedStudentIds());
      // Default to first saved profile if available
      const saved = StorageService.getSavedStudentIds();
      if (saved.length > 0) {
        setStudentIdInput(saved[0].id);
        const match = StorageService.findStudentById(schoolId, saved[0].id);
        if (match) setMatchedStudent(match);
      }
    }
  }, [isOpen, schoolId]);

  if (!isOpen) return null;

  const handleLookup = (idToSearch) => {
    const cleanId = (idToSearch || studentIdInput).trim();
    setHasSearched(true);
    if (!cleanId) {
      setMatchedStudent(null);
      return;
    }

    const student = StorageService.findStudentById(schoolId, cleanId);
    if (student) {
      setMatchedStudent(student);
    } else {
      setMatchedStudent(null);
    }
  };

  const handleSelectSavedProfile = (profile) => {
    setStudentIdInput(profile.id);
    const student = StorageService.findStudentById(schoolId, profile.id);
    setMatchedStudent(student || profile);
    setHasSearched(true);
  };

  const handleProceed = () => {
    if (matchedStudent) {
      // Save profile for fast future ordering
      StorageService.saveStudentId(matchedStudent);
      onStudentVerified(matchedStudent);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '480px', padding: '1.75rem' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UserCheck size={22} color="var(--primary)" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Student Verification</h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Enter Student ID to fetch school records</p>
            </div>
          </div>
          <button onClick={onClose} style={{ padding: '0.4rem', borderRadius: '50%', background: '#f1f5f9' }}>
            <X size={18} color="var(--text-main)" />
          </button>
        </div>

        {/* Saved Profiles Quick Chips */}
        {savedProfiles.length > 0 && (
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              RECENT / SAVED CHILDREN:
            </div>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {savedProfiles.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSelectSavedProfile(p)}
                  style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: 'var(--radius-full)',
                    background: studentIdInput === p.id ? 'var(--primary-light)' : '#f1f5f9',
                    border: studentIdInput === p.id ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: studentIdInput === p.id ? 'var(--primary)' : 'var(--text-main)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <User size={13} />
                  <span>{p.studentName} ({p.id})</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Box */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-main)' }}>
            STUDENT ID / ADMISSION NUMBER:
          </label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              placeholder="e.g. BW-101, BW-102, BW-2026-1042"
              value={studentIdInput}
              onChange={(e) => {
                setStudentIdInput(e.target.value);
                handleLookup(e.target.value);
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleLookup(studentIdInput)}
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: '2px solid var(--border-color)',
                outline: 'none',
                fontWeight: 700,
                fontSize: '1rem',
                letterSpacing: '0.04em',
                textTransform: 'uppercase'
              }}
            />
            <button
              onClick={() => handleLookup(studentIdInput)}
              className="btn-primary"
              style={{ padding: '0 1.25rem', borderRadius: 'var(--radius-md)' }}
            >
              <Search size={18} />
            </button>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
            💡 Try preloaded sample IDs: <b style={{ cursor: 'pointer', color: 'var(--primary)' }} onClick={() => { setStudentIdInput('BW-101'); handleLookup('BW-101'); }}>BW-101</b>, <b style={{ cursor: 'pointer', color: 'var(--primary)' }} onClick={() => { setStudentIdInput('BW-102'); handleLookup('BW-102'); }}>BW-102</b>, or <b style={{ cursor: 'pointer', color: 'var(--primary)' }} onClick={() => { setStudentIdInput('BW-2026-1042'); handleLookup('BW-2026-1042'); }}>BW-2026-1042</b>
          </div>
        </div>

        {/* Auto-Fetched Student Verification Card */}
        {matchedStudent ? (
          <div
            style={{
              background: '#ecfdf5',
              border: '1.5px solid #6ee7b7',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem',
              marginBottom: '1.25rem',
              animation: 'scaleUp 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#065f46', fontSize: '0.8rem', fontWeight: 800 }}>
                <ShieldCheck size={18} color="#059669" />
                <span>VERIFIED SCHOOL RECORD</span>
              </div>
              <span style={{ fontSize: '0.75rem', background: '#059669', color: 'white', padding: '2px 8px', borderRadius: '12px', fontWeight: 800 }}>
                {matchedStudent.id}
              </span>
            </div>

            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#064e3b', marginBottom: '0.5rem' }}>
              {matchedStudent.studentName}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', fontSize: '0.82rem' }}>
              <div style={{ background: 'white', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #d1fae5' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <BookOpen size={12} /> CLASS & SECTION:
                </span>
                <span style={{ fontWeight: 800, color: '#0f172a' }}>{matchedStudent.class} - {matchedStudent.section}</span>
              </div>

              <div style={{ background: 'white', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #d1fae5' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Phone size={12} /> PARENT PHONE:
                </span>
                <span style={{ fontWeight: 800, color: '#0f172a' }}>{matchedStudent.parentPhone || 'Registered'}</span>
              </div>
            </div>
          </div>
        ) : hasSearched && studentIdInput.trim() !== '' ? (
          <div style={{ background: '#fee2e2', border: '1px solid #fecaca', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
            <AlertCircle size={18} color="#dc2626" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '0.82rem', color: '#991b1b' }}>
              <b>Student ID "{studentIdInput}" not found.</b>
              <p style={{ marginTop: '2px' }}>Please double check the ID or contact the school administrative office to update the roster.</p>
            </div>
          </div>
        ) : null}

        {/* Action Button */}
        <button
          onClick={handleProceed}
          disabled={!matchedStudent}
          className="btn-primary"
          style={{ width: '100%', padding: '0.9rem', fontSize: '0.95rem' }}
        >
          <span>Proceed to Compulsory Payment ({currency} {cartTotal})</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
