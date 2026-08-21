// Multi-tenant storage engine with BroadcastChannel real-time sync & Sibling phone lookup

import { INITIAL_SCHOOLS } from '../data/schoolsData';
import { INITIAL_STUDENTS, INITIAL_MENUS, INITIAL_ORDERS } from '../data/mockData';

const KEYS = {
  ACTIVE_SCHOOL: 'sfa_active_school_id',
  SCHOOLS: 'sfa_schools_list',
  STUDENTS_PREFIX: 'sfa_students_',
  MENUS_PREFIX: 'sfa_menu_',
  ORDERS_PREFIX: 'sfa_orders_',
  PARENT_SESSION: 'sfa_parent_session',
  ACTIVE_CHILD: 'sfa_active_child_id'
};

// BroadcastChannel for cross-tab realtime synchronization
const channel = typeof window !== 'undefined' && window.BroadcastChannel
  ? new BroadcastChannel('school_food_app_sync')
  : null;

const SCHEMA_VERSION_KEY = 'sfa_schema_version_v2';
const CURRENT_SCHEMA_VERSION = 'v2.1_kapoor_3kids';

export const StorageService = {
  // --- Initialization ---
  init() {
    const savedVersion = localStorage.getItem(SCHEMA_VERSION_KEY);
    const needsMigration = savedVersion !== CURRENT_SCHEMA_VERSION;

    if (needsMigration) {
      localStorage.setItem(KEYS.SCHOOLS, JSON.stringify(INITIAL_SCHOOLS));
      localStorage.setItem(KEYS.ACTIVE_SCHOOL, 'brainwaves');

      INITIAL_SCHOOLS.forEach((school) => {
        const stuKey = KEYS.STUDENTS_PREFIX + school.id;
        localStorage.setItem(stuKey, JSON.stringify(INITIAL_STUDENTS[school.id] || []));

        const menuKey = KEYS.MENUS_PREFIX + school.id;
        localStorage.setItem(menuKey, JSON.stringify(INITIAL_MENUS[school.id] || []));
      });

      // Clear previous cached session if it was holding old child
      const currentSession = localStorage.getItem(KEYS.PARENT_SESSION);
      if (currentSession) {
        const parsed = JSON.parse(currentSession);
        if (parsed.phone === '9811223344') {
          localStorage.removeItem(KEYS.PARENT_SESSION);
          localStorage.removeItem(KEYS.ACTIVE_CHILD);
        }
      }

      localStorage.setItem(SCHEMA_VERSION_KEY, CURRENT_SCHEMA_VERSION);
    } else {
      if (!localStorage.getItem(KEYS.SCHOOLS)) {
        localStorage.setItem(KEYS.SCHOOLS, JSON.stringify(INITIAL_SCHOOLS));
      }
      if (!localStorage.getItem(KEYS.ACTIVE_SCHOOL)) {
        localStorage.setItem(KEYS.ACTIVE_SCHOOL, 'brainwaves');
      }

      INITIAL_SCHOOLS.forEach((school) => {
        const stuKey = KEYS.STUDENTS_PREFIX + school.id;
        if (!localStorage.getItem(stuKey)) {
          localStorage.setItem(stuKey, JSON.stringify(INITIAL_STUDENTS[school.id] || []));
        }

        const menuKey = KEYS.MENUS_PREFIX + school.id;
        if (!localStorage.getItem(menuKey)) {
          localStorage.setItem(menuKey, JSON.stringify(INITIAL_MENUS[school.id] || []));
        }

        const ordersKey = KEYS.ORDERS_PREFIX + school.id;
        if (!localStorage.getItem(ordersKey)) {
          localStorage.setItem(ordersKey, JSON.stringify(INITIAL_ORDERS[school.id] || []));
        }
      });
    }
  },

  // --- Real-time sync listener ---
  subscribe(callback) {
    if (!channel) return () => {};
    const handler = (e) => {
      if (e.data) callback(e.data);
    };
    channel.addEventListener('message', handler);
    return () => channel.removeEventListener('message', handler);
  },

  notify(action, payload) {
    if (channel) {
      channel.postMessage({ action, payload, timestamp: Date.now() });
    }
  },

  // --- Schools ---
  getSchools() {
    this.init();
    return JSON.parse(localStorage.getItem(KEYS.SCHOOLS) || '[]');
  },

  getActiveSchoolId() {
    this.init();
    return localStorage.getItem(KEYS.ACTIVE_SCHOOL) || 'brainwaves';
  },

  getActiveSchool() {
    const schools = this.getSchools();
    const activeId = this.getActiveSchoolId();
    return schools.find((s) => s.id === activeId) || schools[0];
  },

  setActiveSchoolId(id) {
    localStorage.setItem(KEYS.ACTIVE_SCHOOL, id);
    this.notify('SCHOOL_CHANGED', { schoolId: id });
  },

  updateSchoolConfig(schoolId, updatedConfig) {
    const schools = this.getSchools();
    const index = schools.findIndex((s) => s.id === schoolId);
    if (index !== -1) {
      schools[index] = { ...schools[index], ...updatedConfig };
      localStorage.setItem(KEYS.SCHOOLS, JSON.stringify(schools));
      this.notify('SCHOOL_CONFIG_UPDATED', { schoolId, updatedConfig });
    }
  },

  addMealSlot(schoolId, slotData) {
    const schools = this.getSchools();
    const index = schools.findIndex((s) => s.id === schoolId);
    if (index !== -1) {
      const periods = schools[index].mealPeriods || [];
      const newSlot = {
        id: slotData.id || `slot-${Date.now()}`,
        name: slotData.name.trim(),
        startTime: slotData.startTime || '10:00 AM',
        endTime: slotData.endTime || '10:30 AM',
        time: `${slotData.startTime || '10:00 AM'} - ${slotData.endTime || '10:30 AM'}`,
        cutoffMins: parseInt(slotData.cutoffMins, 10) || 45,
        cutoffTime: slotData.cutoffTime || '09:15 AM'
      };
      schools[index].mealPeriods = [...periods, newSlot];
      localStorage.setItem(KEYS.SCHOOLS, JSON.stringify(schools));
      this.notify('MEAL_SLOT_ADDED', { schoolId, slot: newSlot });
      return newSlot;
    }
    return null;
  },

  updateMealSlot(schoolId, slotId, updatedData) {
    const schools = this.getSchools();
    const index = schools.findIndex((s) => s.id === schoolId);
    if (index !== -1) {
      const periods = schools[index].mealPeriods || [];
      const slotIndex = periods.findIndex((p) => p.id === slotId);
      if (slotIndex !== -1) {
        periods[slotIndex] = {
          ...periods[slotIndex],
          ...updatedData,
          time: `${updatedData.startTime || periods[slotIndex].startTime} - ${updatedData.endTime || periods[slotIndex].endTime}`
        };
        schools[index].mealPeriods = [...periods];
        localStorage.setItem(KEYS.SCHOOLS, JSON.stringify(schools));
        this.notify('MEAL_SLOT_UPDATED', { schoolId, slot: periods[slotIndex] });
        return periods[slotIndex];
      }
    }
    return null;
  },

  deleteMealSlot(schoolId, slotId) {
    const schools = this.getSchools();
    const index = schools.findIndex((s) => s.id === schoolId);
    if (index !== -1) {
      const periods = (schools[index].mealPeriods || []).filter((p) => p.id !== slotId);
      schools[index].mealPeriods = periods;
      localStorage.setItem(KEYS.SCHOOLS, JSON.stringify(schools));
      this.notify('MEAL_SLOT_DELETED', { schoolId, slotId });
      return periods;
    }
    return [];
  },

  // --- Students & Sibling Discovery ---
  getStudents(schoolId) {
    this.init();
    const target = schoolId || this.getActiveSchoolId();
    return JSON.parse(localStorage.getItem(KEYS.STUDENTS_PREFIX + target) || '[]');
  },

  findStudentsByParentPhone(schoolId, phone) {
    const students = this.getStudents(schoolId);
    const cleanPhone = (phone || '').replace(/\D/g, '');
    if (!cleanPhone) return [];

    return students.filter((s) => {
      const fatherClean = (s.fatherPhone || '').replace(/\D/g, '');
      const motherClean = (s.motherPhone || '').replace(/\D/g, '');
      const genericClean = (s.parentPhone || '').replace(/\D/g, '');
      return fatherClean === cleanPhone || motherClean === cleanPhone || genericClean === cleanPhone;
    });
  },

  findStudentById(schoolId, studentId) {
    const students = this.getStudents(schoolId);
    const cleanId = (studentId || '').trim().toLowerCase();
    return students.find((s) => s.id.toLowerCase() === cleanId);
  },

  addStudent(schoolId, studentData) {
    const students = this.getStudents(schoolId);
    const newStudent = {
      id: studentData.id || `BIS-${Date.now().toString().slice(-4)}`,
      studentName: studentData.studentName.trim(),
      class: studentData.class || '4',
      section: studentData.section || 'A',
      fatherName: studentData.fatherName || 'Parent',
      fatherPhone: studentData.fatherPhone || studentData.parentPhone || '',
      motherName: studentData.motherName || '',
      motherPhone: studentData.motherPhone || '',
      allergies: studentData.allergies || [],
      dietary: studentData.dietary || 'Veg',
      healthNotes: studentData.healthNotes || '',
      gender: studentData.gender || 'boy',
      deskLocation: studentData.deskLocation || `Room ${studentData.class || '4'}${studentData.section || 'A'}`
    };

    // Prevent duplicate ID by updating or appending
    const existingIndex = students.findIndex((s) => s.id === newStudent.id);
    let updated;
    if (existingIndex !== -1) {
      students[existingIndex] = newStudent;
      updated = [...students];
    } else {
      updated = [newStudent, ...students];
    }

    localStorage.setItem(KEYS.STUDENTS_PREFIX + schoolId, JSON.stringify(updated));
    this.notify('STUDENT_ADDED', { schoolId, student: newStudent });
    return newStudent;
  },

  deleteStudent(schoolId, studentId) {
    const students = this.getStudents(schoolId);
    const updated = students.filter((s) => s.id !== studentId);
    localStorage.setItem(KEYS.STUDENTS_PREFIX + schoolId, JSON.stringify(updated));
    this.notify('STUDENT_DELETED', { schoolId, studentId });
    return updated;
  },

  importStudents(schoolId, newStudents) {
    const existing = this.getStudents(schoolId);
    const map = new Map();
    existing.forEach((s) => map.set(s.id, s));
    newStudents.forEach((s) => map.set(s.id, s));
    const merged = Array.from(map.values());
    localStorage.setItem(KEYS.STUDENTS_PREFIX + schoolId, JSON.stringify(merged));
    this.notify('STUDENTS_IMPORTED', { schoolId, count: merged.length });
    return merged;
  },

  updateStudentHealthProfile(schoolId, studentId, healthData) {
    const students = this.getStudents(schoolId);
    const index = students.findIndex((s) => s.id === studentId);
    if (index !== -1) {
      students[index] = {
        ...students[index],
        allergies: healthData.allergies || [],
        dietary: healthData.dietary || 'Veg',
        healthNotes: healthData.healthNotes || ''
      };
      localStorage.setItem(KEYS.STUDENTS_PREFIX + schoolId, JSON.stringify(students));
      this.notify('STUDENT_HEALTH_UPDATED', { studentId, healthData });
      return students[index];
    }
    return null;
  },

  // --- Parent Session & Active Child Profile ---
  getParentSession() {
    const session = localStorage.getItem(KEYS.PARENT_SESSION);
    return session ? JSON.parse(session) : null;
  },

  setParentSession(sessionData) {
    if (sessionData) {
      localStorage.setItem(KEYS.PARENT_SESSION, JSON.stringify(sessionData));
    } else {
      localStorage.removeItem(KEYS.PARENT_SESSION);
      localStorage.removeItem(KEYS.ACTIVE_CHILD);
    }
    this.notify('PARENT_SESSION_CHANGED', sessionData);
  },

  getActiveChildId() {
    return localStorage.getItem(KEYS.ACTIVE_CHILD) || null;
  },

  setActiveChildId(childId) {
    localStorage.setItem(KEYS.ACTIVE_CHILD, childId);
    this.notify('ACTIVE_CHILD_CHANGED', { childId });
  },

  // --- Menu ---
  getMenu(schoolId) {
    this.init();
    const target = schoolId || this.getActiveSchoolId();
    return JSON.parse(localStorage.getItem(KEYS.MENUS_PREFIX + target) || '[]');
  },

  addMenuItem(schoolId, itemData) {
    const target = schoolId || this.getActiveSchoolId();
    const menu = this.getMenu(target);
    const newItem = {
      id: itemData.id || `item_${Date.now()}`,
      name: itemData.name.trim(),
      description: itemData.description || '',
      category: itemData.category || 'Lunch Thali',
      price: parseFloat(itemData.price) || 50,
      isVeg: itemData.isVeg !== undefined ? itemData.isVeg : true,
      calories: parseInt(itemData.calories, 10) || 300,
      protein: parseInt(itemData.protein, 10) || 10,
      carbs: parseInt(itemData.carbs, 10) || 40,
      fats: parseInt(itemData.fats, 10) || 8,
      fiber: parseInt(itemData.fiber, 10) || 4,
      allergens: itemData.allergens || [],
      availablePeriods: itemData.availablePeriods || ['lunch_break', 'morning_snack'],
      image: itemData.image || 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80',
      isAvailable: itemData.isAvailable !== undefined ? itemData.isAvailable : true
    };

    menu.push(newItem);
    localStorage.setItem(KEYS.MENUS_PREFIX + target, JSON.stringify(menu));
    this.notify('MENU_UPDATED', { schoolId: target, item: newItem });
    return newItem;
  },

  updateMenuItem(schoolId, itemId, updatedData) {
    const target = schoolId || this.getActiveSchoolId();
    const menu = this.getMenu(target);
    const index = menu.findIndex((m) => m.id === itemId);
    if (index !== -1) {
      menu[index] = {
        ...menu[index],
        ...updatedData,
        price: parseFloat(updatedData.price !== undefined ? updatedData.price : menu[index].price),
        calories: parseInt(updatedData.calories !== undefined ? updatedData.calories : menu[index].calories, 10),
        protein: parseInt(updatedData.protein !== undefined ? updatedData.protein : menu[index].protein, 10),
        carbs: parseInt(updatedData.carbs !== undefined ? updatedData.carbs : menu[index].carbs, 10),
        fats: parseInt(updatedData.fats !== undefined ? updatedData.fats : menu[index].fats, 10),
        fiber: parseInt(updatedData.fiber !== undefined ? updatedData.fiber : menu[index].fiber, 10)
      };
      localStorage.setItem(KEYS.MENUS_PREFIX + target, JSON.stringify(menu));
      this.notify('MENU_UPDATED', { schoolId: target, item: menu[index] });
      return menu[index];
    }
    return null;
  },

  deleteMenuItem(schoolId, itemId) {
    const target = schoolId || this.getActiveSchoolId();
    const menu = this.getMenu(target);
    const filtered = menu.filter((m) => m.id !== itemId);
    localStorage.setItem(KEYS.MENUS_PREFIX + target, JSON.stringify(filtered));
    this.notify('MENU_UPDATED', { schoolId: target, deletedId: itemId });
    return filtered;
  },

  toggleMenuItemAvailability(schoolId, itemId) {
    const target = schoolId || this.getActiveSchoolId();
    const menu = this.getMenu(target);
    const index = menu.findIndex((m) => m.id === itemId);
    if (index !== -1) {
      menu[index].isAvailable = !menu[index].isAvailable;
      localStorage.setItem(KEYS.MENUS_PREFIX + target, JSON.stringify(menu));
      this.notify('MENU_UPDATED', { schoolId: target, item: menu[index] });
      return menu[index];
    }
    return null;
  },

  // --- Orders & Co-Parent Conflict Check ---
  getOrders(schoolId) {
    this.init();
    const target = schoolId || this.getActiveSchoolId();
    return JSON.parse(localStorage.getItem(KEYS.ORDERS_PREFIX + target) || '[]');
  },

  // Check if there is an active order already placed for this child, date, and slot
  findActiveOrderForSlot(schoolId, studentId, date, slotId) {
    const orders = this.getOrders(schoolId);
    return orders.find(
      (o) =>
        o.studentId === studentId &&
        o.requiredDate === date &&
        (o.mealPeriodId === slotId || !slotId) &&
        o.deliveryStatus !== 'CANCELLED'
    );
  },

  createOrder(schoolId, orderData) {
    const orders = this.getOrders(schoolId);
    const orderNumber = `ORD-${schoolId.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const tokenNumber = `${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder = {
      id: `ord_${Date.now()}`,
      orderNumber,
      tokenNumber,
      schoolId,
      deliveryStatus: 'NEW', // 'NEW' | 'ACCEPTED' | 'PREPARING' | 'PACKED' | 'DELIVERED'
      paymentStatus: 'PAID',
      createdAt: new Date().toISOString(),
      stickerPrinted: false,
      ...orderData
    };

    orders.unshift(newOrder);
    localStorage.setItem(KEYS.ORDERS_PREFIX + schoolId, JSON.stringify(orders));
    this.notify('ORDER_CREATED', { schoolId, order: newOrder });
    return newOrder;
  },

  updateOrderStatus(schoolId, orderId, newStatus) {
    const orders = this.getOrders(schoolId);
    const index = orders.findIndex((o) => o.id === orderId);
    if (index !== -1) {
      orders[index].deliveryStatus = newStatus;
      if (newStatus === 'DELIVERED') {
        orders[index].deliveredAt = new Date().toISOString();
      }
      localStorage.setItem(KEYS.ORDERS_PREFIX + schoolId, JSON.stringify(orders));
      this.notify('ORDER_STATUS_CHANGED', { schoolId, orderId, newStatus, order: orders[index] });
    }
  },

  markStickerPrinted(schoolId, orderIds) {
    const orders = this.getOrders(schoolId);
    orders.forEach((o) => {
      if (orderIds.includes(o.id)) {
        o.stickerPrinted = true;
      }
    });
    localStorage.setItem(KEYS.ORDERS_PREFIX + schoolId, JSON.stringify(orders));
    this.notify('STICKERS_PRINTED', { schoolId, orderIds });
  }
};
