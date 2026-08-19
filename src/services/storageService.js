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

export const StorageService = {
  // --- Initialization ---
  init() {
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
