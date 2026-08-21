import React, { useState } from 'react';
import { Settings, Upload, Download, School, Palette, Clock, Users, FileSpreadsheet, Check, AlertCircle, Trash2, Plus, Search, ArrowLeft, X, ShieldAlert, UserPlus, Edit3, Clock3, UtensilsCrossed, Flame, Dumbbell, Sparkles, ToggleLeft, ToggleRight, Leaf } from 'lucide-react';
import { StorageService } from '../../services/storageService';
import { ExcelService } from '../../services/excelService';

const TABS = [
  { id: 'branding', label: 'Branding', icon: '🎨' },
  { id: 'menu', label: 'Menu & Nutrition', icon: '🍱' },
  { id: 'roster', label: 'Roster', icon: '👥' },
  { id: 'mealSlots', label: 'Break Slots', icon: '⏰' },
  { id: 'export', label: 'Export', icon: '📊' }
];

const ROLE_PERMISSIONS = {
  'Super Admin': ['branding', 'menu', 'roster', 'mealSlots', 'export'],
  'Operations': ['menu', 'roster', 'mealSlots', 'export'],
  'Dietitian': ['menu', 'roster', 'mealSlots'],
  'default': ['branding', 'menu', 'roster', 'mealSlots', 'export']
};

const COMMON_ALLERGIES = ['Peanuts', 'Tree Nuts', 'Lactose/Dairy', 'Eggs', 'Wheat/Gluten', 'Soy', 'Mustard', 'Sesame'];

const MENU_CATEGORIES = [
  'Lunch Thali',
  'Snacks & Rolls',
  'Sandwiches & Burgers',
  'Pasta & Noodles',
  'Healthy & Salads',
  'Beverages & Juices',
  'Bakery & Sweets'
];

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

  const [activeTab, setActiveTab] = useState(() => allowedTabs[0] || 'menu');
  const [formData, setFormData] = useState({ ...activeSchool });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [importStatus, setImportStatus] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [studentSearch, setStudentSearch] = useState('');
  const [menuSearch, setMenuSearch] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');

  // --- Student Add / Edit State ---
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [studentAddSuccess, setStudentAddSuccess] = useState(false);
  const [newStudent, setNewStudent] = useState({
    studentName: '',
    id: `BIS-${Math.floor(1000 + Math.random() * 9000)}`,
    class: '4',
    section: 'A',
    gender: 'boy',
    fatherName: '',
    fatherPhone: '',
    motherName: '',
    motherPhone: '',
    allergies: [],
    dietary: 'Veg'
  });

  // --- Break Slot Add / Edit State ---
  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
  const [editingSlotId, setEditingSlotId] = useState(null);
  const [slotSaveSuccess, setSlotSaveSuccess] = useState(false);
  const [slotForm, setSlotForm] = useState({
    name: '',
    startTime: '10:00 AM',
    endTime: '10:30 AM',
    cutoffMins: '45'
  });

  // --- Menu & Nutrition Add / Edit State ---
  const [isDishModalOpen, setIsDishModalOpen] = useState(false);
  const [editingDishId, setEditingDishId] = useState(null);
  const [dishSaveSuccess, setDishSaveSuccess] = useState(false);
  const [dishForm, setDishForm] = useState({
    name: '',
    description: '',
    category: 'Lunch Thali',
    price: '90',
    isVeg: true,
    calories: '350',
    protein: '12',
    carbs: '45',
    fats: '10',
    fiber: '5',
    allergens: [],
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80',
    isAvailable: true
  });

  const menuList = StorageService.getMenu(activeSchool.id);

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

  // Open Student Modal for Adding
  const handleOpenAddStudent = () => {
    setEditingStudentId(null);
    setNewStudent({
      studentName: '',
      id: `BIS-${Math.floor(1000 + Math.random() * 9000)}`,
      class: '4',
      section: 'A',
      gender: 'boy',
      fatherName: '',
      fatherPhone: '',
      motherName: '',
      motherPhone: '',
      allergies: [],
      dietary: 'Veg'
    });
    setIsAddStudentModalOpen(true);
  };

  // Open Student Modal for Editing
  const handleOpenEditStudent = (student) => {
    setEditingStudentId(student.id);
    setNewStudent({
      studentName: student.studentName || '',
      id: student.id,
      class: student.class || '4',
      section: student.section || 'A',
      gender: student.gender || 'boy',
      fatherName: student.fatherName || '',
      fatherPhone: student.fatherPhone || student.parentPhone || '',
      motherName: student.motherName || '',
      motherPhone: student.motherPhone || '',
      allergies: student.allergies || [],
      dietary: student.dietary || 'Veg'
    });
    setIsAddStudentModalOpen(true);
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
      setEditingStudentId(null);
    }, 500);
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
    if (window.confirm(`Are you sure you want to remove ${studentName} (${studentId}) from the campus roster?`)) {
      StorageService.deleteStudent(activeSchool.id, studentId);
      onRefresh();
    }
  };

  // --- Slot Handlers ---
  const handleOpenAddSlot = () => {
    setEditingSlotId(null);
    setSlotForm({
      name: '',
      startTime: '10:00 AM',
      endTime: '10:30 AM',
      cutoffMins: '45'
    });
    setIsSlotModalOpen(true);
  };

  const handleOpenEditSlot = (slot) => {
    setEditingSlotId(slot.id);
    setSlotForm({
      name: slot.name,
      startTime: slot.startTime || '10:00 AM',
      endTime: slot.endTime || '10:30 AM',
      cutoffMins: String(slot.cutoffMins || 45)
    });
    setIsSlotModalOpen(true);
  };

  const handleSlotFormSubmit = (e) => {
    e.preventDefault();
    if (!slotForm.name.trim()) return;

    if (editingSlotId) {
      StorageService.updateMealSlot(activeSchool.id, editingSlotId, slotForm);
    } else {
      StorageService.addMealSlot(activeSchool.id, slotForm);
    }

    setSlotSaveSuccess(true);
    setTimeout(() => {
      setSlotSaveSuccess(false);
      setIsSlotModalOpen(false);
      setEditingSlotId(null);
    }, 450);
    onRefresh();
  };

  const handleDeleteSlot = (slotId, slotName) => {
    if (window.confirm(`Are you sure you want to delete break slot "${slotName}"?`)) {
      StorageService.deleteMealSlot(activeSchool.id, slotId);
      onRefresh();
    }
  };

  // --- Menu Handlers ---
  const handleOpenAddDish = () => {
    setEditingDishId(null);
    setDishForm({
      name: '',
      description: '',
      category: 'Lunch Thali',
      price: '90',
      isVeg: true,
      calories: '350',
      protein: '12',
      carbs: '45',
      fats: '10',
      fiber: '5',
      allergens: [],
      image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80',
      isAvailable: true
    });
    setIsDishModalOpen(true);
  };

  const handleOpenEditDish = (dish) => {
    setEditingDishId(dish.id);
    setDishForm({
      name: dish.name || '',
      description: dish.description || '',
      category: dish.category || 'Lunch Thali',
      price: String(dish.price || 90),
      isVeg: dish.isVeg !== undefined ? dish.isVeg : true,
      calories: String(dish.calories || 350),
      protein: String(dish.protein || 12),
      carbs: String(dish.carbs || 45),
      fats: String(dish.fats || 10),
      fiber: String(dish.fiber || 5),
      allergens: dish.allergens || [],
      image: dish.image || 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80',
      isAvailable: dish.isAvailable !== undefined ? dish.isAvailable : true
    });
    setIsDishModalOpen(true);
  };

  const toggleDishAllergen = (allergy) => {
    setDishForm((prev) => {
      const exists = prev.allergens.includes(allergy);
      const updated = exists
        ? prev.allergens.filter((a) => a !== allergy)
        : [...prev.allergens, allergy];
      return { ...prev, allergens: updated };
    });
  };

  const handleDishFormSubmit = (e) => {
    e.preventDefault();
    if (!dishForm.name.trim()) return;

    if (editingDishId) {
      StorageService.updateMenuItem(activeSchool.id, editingDishId, dishForm);
    } else {
      StorageService.addMenuItem(activeSchool.id, dishForm);
    }

    setDishSaveSuccess(true);
    setTimeout(() => {
      setDishSaveSuccess(false);
      setIsDishModalOpen(false);
      setEditingDishId(null);
    }, 450);
    onRefresh();
  };

  const handleDeleteDish = (dishId, dishName) => {
    if (window.confirm(`Are you sure you want to remove "${dishName}" from the menu?`)) {
      StorageService.deleteMenuItem(activeSchool.id, dishId);
      onRefresh();
    }
  };

  const handleToggleDishAvailability = (dishId) => {
    StorageService.toggleMenuItemAvailability(activeSchool.id, dishId);
    onRefresh();
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

  const filteredMenu = menuList.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
      item.category.toLowerCase().includes(menuSearch.toLowerCase());
    const matchesCat = selectedCategoryFilter === 'All' || item.category === selectedCategoryFilter;
    return matchesSearch && matchesCat;
  });

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
              {adminSession?.role ? `Role: ${adminSession.role} • ` : ''}Menu calories, protein & campus management
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
              {tab.id === 'menu' && (
                <span style={{ background: isSelected ? '#ffffff' : '#f1f5f9', color: isSelected ? 'var(--primary)' : 'var(--text-muted)', padding: '1px 5px', borderRadius: '10px', fontSize: '0.65rem', fontWeight: 900 }}>
                  {menuList.length}
                </span>
              )}
              {tab.id === 'roster' && (
                <span style={{ background: isSelected ? '#ffffff' : '#f1f5f9', color: isSelected ? 'var(--primary)' : 'var(--text-muted)', padding: '1px 5px', borderRadius: '10px', fontSize: '0.65rem', fontWeight: 900 }}>
                  {students.length}
                </span>
              )}
              {tab.id === 'mealSlots' && (
                <span style={{ background: isSelected ? '#ffffff' : '#f1f5f9', color: isSelected ? 'var(--primary)' : 'var(--text-muted)', padding: '1px 5px', borderRadius: '10px', fontSize: '0.65rem', fontWeight: 900 }}>
                  {(activeSchool?.mealPeriods || []).length}
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

      {/* TAB 2: MENU & NUTRITION MANAGEMENT */}
      {activeTab === 'menu' && (
        <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 900 }}>🍱 Campus Food Menu & Nutrition</h3>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                Add dishes with calories, protein, carbs & allergy safety
              </p>
            </div>

            <button
              onClick={handleOpenAddDish}
              style={{
                background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                color: 'white',
                border: 'none',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.76rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                boxShadow: '0 2px 8px rgba(22, 163, 74, 0.25)'
              }}
            >
              <Plus size={14} />
              <span>Add New Dish</span>
            </button>
          </div>

          {/* Search & Category Filter */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.85rem', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
              <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search dish name or category..."
                value={menuSearch}
                onChange={(e) => setMenuSearch(e.target.value)}
                style={{ width: '100%', padding: '0.55rem 0.6rem 0.55rem 32px', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1', fontSize: '0.82rem', outline: 'none' }}
              />
            </div>

            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              style={{ padding: '0.55rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1', fontSize: '0.82rem', fontWeight: 700 }}
            >
              <option value="All">All Categories ({menuList.length})</option>
              {MENU_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Menu Items Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '0.85rem'
            }}
          >
            {filteredMenu.map((item) => (
              <div
                key={item.id}
                style={{
                  background: item.isAvailable ? '#ffffff' : '#f8fafc',
                  border: item.isAvailable ? '1px solid #e2e8f0' : '1px dashed #cbd5e1',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.9rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  opacity: item.isAvailable ? 1 : 0.7,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.6rem' }}>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: '64px', height: '64px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span style={{ fontSize: '0.65rem' }}>{item.isVeg ? '🟢' : '🔴'}</span>
                          <span style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-main)' }}>
                            {item.name}
                          </span>
                        </div>
                        <span style={{ fontSize: '0.9rem', fontWeight: 900, color: 'var(--primary)' }}>
                          {activeSchool.currency} {item.price}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Category: <strong>{item.category}</strong>
                      </div>

                      {/* Nutritional Macro Chips */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
                        <span style={{ fontSize: '0.68rem', fontWeight: 800, background: '#fef3c7', color: '#b45309', padding: '1px 6px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '2px' }}>
                          <Flame size={10} /> {item.calories || 350} kcal
                        </span>
                        <span style={{ fontSize: '0.68rem', fontWeight: 800, background: '#dcfce7', color: '#15803d', padding: '1px 6px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '2px' }}>
                          <Dumbbell size={10} /> {item.protein || 12}g protein
                        </span>
                        {item.carbs && (
                          <span style={{ fontSize: '0.68rem', fontWeight: 700, background: '#f1f5f9', color: '#475569', padding: '1px 5px', borderRadius: '4px' }}>
                            {item.carbs}g carbs
                          </span>
                        )}
                        {item.fiber && (
                          <span style={{ fontSize: '0.68rem', fontWeight: 700, background: '#f1f5f9', color: '#475569', padding: '1px 5px', borderRadius: '4px' }}>
                            {item.fiber}g fiber
                          </span>
                        )}
                      </div>

                      {item.allergens && item.allergens.length > 0 && (
                        <div style={{ fontSize: '0.66rem', color: '#b91c1c', marginTop: '4px', fontWeight: 700 }}>
                          ⚠️ Contains: {item.allergens.join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.55rem', borderTop: '1px solid #e2e8f0', marginTop: '0.5rem' }}>
                  {/* Availability Toggle */}
                  <button
                    onClick={() => handleToggleDishAvailability(item.id)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      color: item.isAvailable ? '#16a34a' : '#64748b',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    {item.isAvailable ? '🟢 In Stock' : '⚪ Out of Stock'}
                  </button>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button
                      onClick={() => handleOpenEditDish(item)}
                      style={{
                        background: '#eff6ff',
                        border: '1px solid #bfdbfe',
                        color: 'var(--primary)',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px'
                      }}
                    >
                      <Edit3 size={12} />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => handleDeleteDish(item.id, item.name)}
                      style={{
                        background: '#fee2e2',
                        border: '1px solid #fecaca',
                        color: '#b91c1c',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px'
                      }}
                    >
                      <Trash2 size={12} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ROSTER */}
      {activeTab === 'roster' && (
        <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 900 }}>👥 Student Roster ({students.length})</h3>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                onClick={handleOpenAddStudent}
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

          {/* Student Cards Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '0.75rem'
            }}
          >
            {filteredStudents.map((s) => (
              <div
                key={s.id}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.85rem 0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.15s ease',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ fontSize: '1.05rem' }}>{s.gender === 'girl' ? '👧' : '👦'}</span>
                    <span style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-main)' }}>
                      {s.studentName}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    ID: <strong>{s.id}</strong> • Grade {s.class}-{s.section}
                  </div>
                  
                  <div style={{ fontSize: '0.68rem', color: 'var(--primary)', fontWeight: 700, marginTop: '3px' }}>
                    👨 {s.fatherPhone || s.parentPhone || 'No Father Phone'}
                    {s.motherPhone && <span style={{ color: '#db2777', marginLeft: '6px' }}>👩 {s.motherPhone}</span>}
                  </div>

                  {s.allergies && s.allergies.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px', marginTop: '4px' }}>
                      <span style={{ fontSize: '0.64rem', color: '#b91c1c', background: '#fee2e2', padding: '1px 5px', borderRadius: '4px', fontWeight: 800 }}>
                        ⚠️ {s.allergies.join(', ')}
                      </span>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <button
                    onClick={() => handleOpenEditStudent(s)}
                    title="Edit Student"
                    style={{
                      background: '#eff6ff',
                      border: '1px solid #bfdbfe',
                      color: 'var(--primary)',
                      cursor: 'pointer',
                      padding: '5px',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Edit3 size={14} />
                  </button>

                  <button
                    onClick={() => handleDeleteStudent(s.id, s.studentName)}
                    title="Remove Student"
                    style={{
                      background: '#fee2e2',
                      border: '1px solid #fecaca',
                      color: '#b91c1c',
                      cursor: 'pointer',
                      padding: '5px',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: BREAK SLOTS */}
      {activeTab === 'mealSlots' && (
        <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 900 }}>⏰ Campus Meal Periods & Cutoffs</h3>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                Set break delivery times and order booking cutoffs
              </p>
            </div>

            <button
              onClick={handleOpenAddSlot}
              style={{
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)',
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
                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)'
              }}
            >
              <Plus size={14} />
              <span>Add Break Slot</span>
            </button>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '0.85rem'
            }}
          >
            {(activeSchool?.mealPeriods || []).map((slot) => (
              <div
                key={slot.id}
                style={{
                  padding: '1rem 1.1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid #e2e8f0',
                  background: '#f8fafc',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.95rem', fontWeight: 900, color: 'var(--text-main)' }}>
                      {slot.name}
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, background: '#eff6ff', color: 'var(--primary)', padding: '2px 8px', borderRadius: 'var(--radius-full)', border: '1px solid #bfdbfe' }}>
                      {slot.time || `${slot.startTime} - ${slot.endTime}`}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Order Cutoff: <strong style={{ color: '#b91c1c' }}>{slot.cutoffMins} mins</strong> before break starts
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px', marginTop: '0.85rem', paddingTop: '0.65rem', borderTop: '1px solid #e2e8f0' }}>
                  <button
                    onClick={() => handleOpenEditSlot(slot)}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
                      color: 'var(--text-main)',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Edit3 size={13} />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => handleDeleteSlot(slot.id, slot.name)}
                    style={{
                      background: '#fee2e2',
                      border: '1px solid #fecaca',
                      color: '#b91c1c',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Trash2 size={13} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: EXPORT & REPORTS */}
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

      {/* Add / Edit Dish Modal */}
      {isDishModalOpen && (
        <div
          className="modal-overlay"
          onClick={() => setIsDishModalOpen(false)}
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
              maxWidth: '520px',
              background: '#ffffff',
              borderRadius: '24px',
              padding: '1.5rem',
              boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
              maxHeight: '92vh',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--text-main)' }}>
                  {editingDishId ? '✏️ Edit Menu Item & Nutrition' : '➕ Add Campus Menu Item'}
                </h3>
                <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  Set pricing, calories, protein macros and dietary flags
                </p>
              </div>
              <button onClick={() => setIsDishModalOpen(false)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', padding: '6px', cursor: 'pointer' }}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleDishFormSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.25rem' }}>
                {/* Dish Name & Category */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.2fr', gap: '0.6rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                      Dish Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Paneer Kathi Roll"
                      value={dishForm.name}
                      onChange={(e) => setDishForm({ ...dishForm, name: e.target.value })}
                      style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '0.84rem', fontWeight: 700 }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                      Category *
                    </label>
                    <select
                      value={dishForm.category}
                      onChange={(e) => setDishForm({ ...dishForm, category: e.target.value })}
                      style={{ width: '100%', padding: '0.55rem', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '0.84rem', fontWeight: 700 }}
                    >
                      {MENU_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Price & Veg/Non-Veg */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                      Price ({activeSchool.currency}) *
                    </label>
                    <input
                      type="number"
                      required
                      min="5"
                      value={dishForm.price}
                      onChange={(e) => setDishForm({ ...dishForm, price: e.target.value })}
                      style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '0.84rem', fontWeight: 800 }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                      Dietary Type
                    </label>
                    <select
                      value={dishForm.isVeg ? 'veg' : 'nonveg'}
                      onChange={(e) => setDishForm({ ...dishForm, isVeg: e.target.value === 'veg' })}
                      style={{ width: '100%', padding: '0.55rem', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '0.84rem', fontWeight: 700 }}
                    >
                      <option value="veg">🟢 100% Vegetarian</option>
                      <option value="nonveg">🔴 Non-Vegetarian</option>
                    </select>
                  </div>
                </div>

                {/* NUTRITIONAL MACROS SECTION */}
                <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 900, color: 'var(--primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Sparkles size={14} />
                    <span>NUTRITIONAL BREAKDOWN (PER SERVING)</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                        🔥 Calories (kcal)
                      </label>
                      <input
                        type="number"
                        placeholder="350"
                        value={dishForm.calories}
                        onChange={(e) => setDishForm({ ...dishForm, calories: e.target.value })}
                        style={{ width: '100%', padding: '0.45rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem', fontWeight: 700 }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                        💪 Protein (g)
                      </label>
                      <input
                        type="number"
                        placeholder="12"
                        value={dishForm.protein}
                        onChange={(e) => setDishForm({ ...dishForm, protein: e.target.value })}
                        style={{ width: '100%', padding: '0.45rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem', fontWeight: 700 }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                        🌾 Carbs (g)
                      </label>
                      <input
                        type="number"
                        placeholder="45"
                        value={dishForm.carbs}
                        onChange={(e) => setDishForm({ ...dishForm, carbs: e.target.value })}
                        style={{ width: '100%', padding: '0.45rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem', fontWeight: 700 }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                        🥑 Healthy Fats (g)
                      </label>
                      <input
                        type="number"
                        placeholder="10"
                        value={dishForm.fats}
                        onChange={(e) => setDishForm({ ...dishForm, fats: e.target.value })}
                        style={{ width: '100%', padding: '0.45rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem', fontWeight: 700 }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                        🥗 Dietary Fiber (g)
                      </label>
                      <input
                        type="number"
                        placeholder="5"
                        value={dishForm.fiber}
                        onChange={(e) => setDishForm({ ...dishForm, fiber: e.target.value })}
                        style={{ width: '100%', padding: '0.45rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem', fontWeight: 700 }}
                      />
                    </div>
                  </div>
                </div>

                {/* Allergen Flags */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                    ⚠️ Allergen Safety Warnings:
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                    {COMMON_ALLERGIES.map((allergy) => {
                      const isSelected = dishForm.allergens.includes(allergy);
                      return (
                        <button
                          key={allergy}
                          type="button"
                          onClick={() => toggleDishAllergen(allergy)}
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

                {/* Description & Image */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                    Description / Ingredients
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Fresh cottage cheese, multigrain roll, mint chutney"
                    value={dishForm.description}
                    onChange={(e) => setDishForm({ ...dishForm, description: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '0.82rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                    Dish Image URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={dishForm.image}
                    onChange={(e) => setDishForm({ ...dishForm, image: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '0.82rem' }}
                  />
                </div>
              </div>

              {dishSaveSuccess && (
                <div style={{ marginBottom: '1rem', padding: '0.5rem', background: '#dcfce7', color: '#15803d', borderRadius: 'var(--radius-md)', textAlign: 'center', fontSize: '0.78rem', fontWeight: 800 }}>
                  🎉 {editingDishId ? 'Dish updated successfully!' : 'Dish added to menu successfully!'}
                </div>
              )}

              <button
                type="submit"
                className="btn-primary"
                style={{ width: '100%', padding: '0.85rem' }}
              >
                <Check size={16} />
                <span>{editingDishId ? 'Save & Update Dish' : 'Save & Add to Campus Menu'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Direct Add/Edit Student Modal */}
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
              maxWidth: '500px',
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
                  {editingStudentId ? '✏️ Edit Student Profile' : '➕ Enroll New Student'}
                </h3>
                <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  {editingStudentId ? 'Update student identity & parent phone numbers' : 'Directly add a student to the campus lunch roster'}
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
                      disabled={!!editingStudentId}
                      value={newStudent.id}
                      onChange={(e) => setNewStudent({ ...newStudent, id: e.target.value })}
                      style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '0.84rem', fontWeight: 700, background: editingStudentId ? '#f1f5f9' : '#ffffff' }}
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

                {/* 👨 FATHER / PARENT 1 DETAILS */}
                <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.76rem', fontWeight: 900, color: 'var(--primary)', marginBottom: '0.45rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>👨</span>
                    <span>Father's Details (Primary Contact) *</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr', gap: '0.6rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                        Father's Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rajesh Sharma"
                        value={newStudent.fatherName}
                        onChange={(e) => setNewStudent({ ...newStudent, fatherName: e.target.value })}
                        style={{ width: '100%', padding: '0.5rem 0.65rem', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '0.82rem', fontWeight: 700 }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                        Father's Mobile (+91) *
                      </label>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="10-digit number"
                        value={newStudent.fatherPhone}
                        onChange={(e) => setNewStudent({ ...newStudent, fatherPhone: e.target.value })}
                        style={{ width: '100%', padding: '0.5rem 0.65rem', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '0.82rem', fontWeight: 800 }}
                      />
                    </div>
                  </div>
                </div>

                {/* 👩 MOTHER / PARENT 2 DETAILS */}
                <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.76rem', fontWeight: 900, color: '#db2777', marginBottom: '0.45rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>👩</span>
                    <span>Mother's Details (Co-Parent / Login)</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr', gap: '0.6rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                        Mother's Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Pooja Sharma"
                        value={newStudent.motherName}
                        onChange={(e) => setNewStudent({ ...newStudent, motherName: e.target.value })}
                        style={{ width: '100%', padding: '0.5rem 0.65rem', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '0.82rem', fontWeight: 700 }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                        Mother's Mobile (+91)
                      </label>
                      <input
                        type="tel"
                        maxLength={10}
                        placeholder="10-digit number"
                        value={newStudent.motherPhone}
                        onChange={(e) => setNewStudent({ ...newStudent, motherPhone: e.target.value })}
                        style={{ width: '100%', padding: '0.5rem 0.65rem', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '0.82rem', fontWeight: 800 }}
                      />
                    </div>
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
                  🎉 {editingStudentId ? 'Student updated successfully!' : 'Student enrolled successfully!'}
                </div>
              )}

              <button
                type="submit"
                className="btn-primary"
                style={{ width: '100%', padding: '0.85rem' }}
              >
                <Check size={16} />
                <span>{editingStudentId ? 'Save & Update Profile' : 'Save & Enroll Student'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Direct Add/Edit Break Slot Modal */}
      {isSlotModalOpen && (
        <div
          className="modal-overlay"
          onClick={() => setIsSlotModalOpen(false)}
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
              maxWidth: '440px',
              background: '#ffffff',
              borderRadius: '24px',
              padding: '1.5rem',
              boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--text-main)' }}>
                  {editingSlotId ? '✏️ Edit Break Slot' : '⏰ Add New Break Slot'}
                </h3>
                <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  Configure break timing & booking cutoff
                </p>
              </div>
              <button onClick={() => setIsSlotModalOpen(false)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', padding: '6px', cursor: 'pointer' }}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSlotFormSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                    Break Slot Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Morning Recess, Lunch Break"
                    value={slotForm.name}
                    onChange={(e) => setSlotForm({ ...slotForm, name: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '0.84rem', fontWeight: 700 }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                      Start Time
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 10:00 AM"
                      value={slotForm.startTime}
                      onChange={(e) => setSlotForm({ ...slotForm, startTime: e.target.value })}
                      style={{ width: '100%', padding: '0.55rem', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '0.84rem', fontWeight: 700 }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                      End Time
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 10:30 AM"
                      value={slotForm.endTime}
                      onChange={(e) => setSlotForm({ ...slotForm, endTime: e.target.value })}
                      style={{ width: '100%', padding: '0.55rem', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '0.84rem', fontWeight: 700 }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                    Order Cutoff (Minutes Before Break Starts)
                  </label>
                  <select
                    value={slotForm.cutoffMins}
                    onChange={(e) => setSlotForm({ ...slotForm, cutoffMins: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '0.84rem', fontWeight: 700 }}
                  >
                    <option value="15">15 Minutes Before</option>
                    <option value="30">30 Minutes Before</option>
                    <option value="45">45 Minutes Before (Recommended)</option>
                    <option value="60">1 Hour Before</option>
                    <option value="120">2 Hours Before</option>
                  </select>
                </div>
              </div>

              {slotSaveSuccess && (
                <div style={{ marginBottom: '1rem', padding: '0.5rem', background: '#dcfce7', color: '#15803d', borderRadius: 'var(--radius-md)', textAlign: 'center', fontSize: '0.78rem', fontWeight: 800 }}>
                  🎉 Break slot saved successfully!
                </div>
              )}

              <button
                type="submit"
                className="btn-primary"
                style={{ width: '100%', padding: '0.85rem' }}
              >
                <Check size={16} />
                <span>{editingSlotId ? 'Save & Update Break Slot' : 'Save & Add Break Slot'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
