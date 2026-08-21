import React, { useState, useEffect, useCallback } from 'react';
import CompactHeader from './components/common/CompactHeader';
import DateSlotSheet from './components/parent/DateSlotSheet';
import ParentLoginScreen from './components/parent/ParentLoginScreen';
import ParentAuthModal from './components/parent/ParentAuthModal';
import ActiveSlotOrderBanner from './components/parent/ActiveSlotOrderBanner';
import ChildAvatarBar from './components/parent/ChildAvatarBar';
import ChildHealthModal from './components/parent/ChildHealthModal';
import MenuCatalog from './components/parent/MenuCatalog';
import CartDrawer from './components/parent/CartDrawer';
import FloatingActionHub from './components/parent/FloatingActionHub';
import StudentIDModal from './components/parent/StudentIDModal';
import PaymentModal from './components/parent/PaymentModal';
import OrderTracker from './components/parent/OrderTracker';
import KitchenDashboard from './components/vendor/KitchenDashboard';
import KitchenLoginScreen from './components/vendor/KitchenLoginScreen';
import SchoolSettings from './components/admin/SchoolSettings';
import AdminLoginScreen from './components/admin/AdminLoginScreen';
import { StorageService } from './services/storageService';
import { CheckCircle2 } from 'lucide-react';

// Helper to parse current portal from window.location.hash
const getInitialPortal = () => {
  if (typeof window === 'undefined') return 'parent';
  const hash = (window.location.hash || '').toLowerCase();
  if (hash.includes('kitchen')) return 'kitchen';
  if (hash.includes('admin')) return 'admin';
  return 'parent';
};

export default function App() {
  // State
  const [schools, setSchools] = useState([]);
  const [activeSchool, setActiveSchool] = useState(null);
  const [activePortal, setActivePortal] = useState(getInitialPortal); // 'parent' | 'kitchen' | 'admin'
  const [kitchenSession, setKitchenSession] = useState(null);
  const [adminSession, setAdminSession] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [students, setStudents] = useState([]);
  const [orders, setOrders] = useState([]);

  // Parent & Sibling Session State
  const [parentSession, setParentSession] = useState(null);
  const [childrenList, setChildrenList] = useState([]);
  const [activeChild, setActiveChild] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isDateSlotSheetOpen, setIsDateSlotSheetOpen] = useState(false);
  const [isHealthModalOpen, setIsHealthModalOpen] = useState(false);

  // Parent Ordering Flow State
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Per-Child Cart State: { [childIdOrGuest]: Array<{ id, name, price, quantity, isVeg, ... }> }
  const [cartsByChild, setCartsByChild] = useState({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [verifiedStudent, setVerifiedStudent] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [notificationToast, setNotificationToast] = useState(null);

  // Helper key for current cart: activeChild.id or 'guest'
  const activeCartKey = activeChild ? activeChild.id : 'guest';
  const currentCart = cartsByChild[activeCartKey] || [];

  // Calculate Family Cart Totals across ALL children
  let totalFamilyItemsCount = 0;
  let totalFamilyAmount = 0;
  Object.values(cartsByChild).forEach((cartArr) => {
    (cartArr || []).forEach((item) => {
      totalFamilyItemsCount += item.quantity;
      totalFamilyAmount += item.price * item.quantity;
    });
  });

  const currentChildTotal = currentCart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const currentChildCount = currentCart.reduce((sum, i) => sum + i.quantity, 0);

  // Sync with URL Hash (#/order, #/kitchen, #/admin)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = (window.location.hash || '').toLowerCase();
      if (hash.includes('kitchen')) {
        setActivePortal('kitchen');
      } else if (hash.includes('admin')) {
        setActivePortal('admin');
      } else {
        setActivePortal('parent');
      }
      window.scrollTo(0, 0);
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Load Data & Session
  const loadData = useCallback(() => {
    const allSchools = StorageService.getSchools();
    setSchools(allSchools);

    const currentSchool = StorageService.getActiveSchool();
    setActiveSchool(currentSchool);

    if (currentSchool) {
      document.documentElement.style.setProperty('--primary', currentSchool.primaryColor || '#2563eb');
      document.documentElement.style.setProperty('--accent', currentSchool.accentColor || '#10b981');
      document.title = `${currentSchool.canteenName} - ${currentSchool.name}`;

      const loadedMenu = StorageService.getMenu(currentSchool.id);
      const loadedStudents = StorageService.getStudents(currentSchool.id);
      const loadedOrders = StorageService.getOrders(currentSchool.id);

      setMenuItems(loadedMenu);
      setStudents(loadedStudents);
      setOrders(loadedOrders);

      if (currentSchool.mealPeriods && currentSchool.mealPeriods.length > 0 && !selectedSlot) {
        setSelectedSlot(currentSchool.mealPeriods[0]);
      }

      // Check Parent Session
      const session = StorageService.getParentSession();
      setParentSession(session);

      if (session && session.phone) {
        const foundKids = StorageService.findStudentsByParentPhone(currentSchool.id, session.phone);
        setChildrenList(foundKids);

        const activeChildId = StorageService.getActiveChildId();
        const activeMatch = foundKids.find((k) => k.id === activeChildId) || foundKids[0] || null;
        setActiveChild(activeMatch);
        if (activeMatch) setVerifiedStudent(activeMatch);
      } else {
        setChildrenList([]);
        setActiveChild(null);
      }
    }
  }, [selectedSlot]);

  useEffect(() => {
    loadData();

    const unsubscribe = StorageService.subscribe((event) => {
      loadData();
      if (event.action === 'ORDER_STATUS_CHANGED' && event.payload.newStatus === 'DELIVERED') {
        setNotificationToast(`🍱 Meal delivered to classroom!`);
        setTimeout(() => setNotificationToast(null), 5000);
      } else if (event.action === 'ORDER_CREATED') {
        setNotificationToast(`🔔 Order #${event.payload.order.tokenNumber} Placed & Paid!`);
        setTimeout(() => setNotificationToast(null), 4000);
      } else if (event.action === 'STUDENT_HEALTH_UPDATED') {
        setNotificationToast(`🛡️ Health & allergy preferences saved!`);
        setTimeout(() => setNotificationToast(null), 3000);
      }
    });

    return () => unsubscribe();
  }, [loadData]);

  // School Switcher
  const handleSelectSchool = (schoolId) => {
    StorageService.setActiveSchoolId(schoolId);
    setCartsByChild({});
    setVerifiedStudent(null);
    setIsCartOpen(false);
    loadData();
  };

  // Child Switcher
  const handleSelectChild = (child) => {
    setActiveChild(child);
    setVerifiedStudent(child);
    StorageService.setActiveChildId(child.id);
    setNotificationToast(`Packing lunch for ${child.studentName.split(' ')[0]}`);
    setTimeout(() => setNotificationToast(null), 2500);
  };

  const handleLogoutParent = () => {
    StorageService.setParentSession(null);
    setParentSession(null);
    setChildrenList([]);
    setActiveChild(null);
    setVerifiedStudent(null);
    setCartsByChild({});
    setNotificationToast('Logged out successfully');
    setTimeout(() => setNotificationToast(null), 3000);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Login Success Handler
  const handleLoginSuccess = (session, kids) => {
    setParentSession(session);
    setChildrenList(kids);
    if (kids.length > 0) {
      setActiveChild(kids[0]);
      setVerifiedStudent(kids[0]);
    }
    loadData();
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Save Child Health Profile
  const handleSaveHealthProfile = (childId, healthData) => {
    StorageService.updateStudentHealthProfile(activeSchool.id, childId, healthData);
    loadData();
  };

  // Cart Operations
  const handleAddToCart = (item) => {
    setCartsByChild((prev) => {
      const childCart = prev[activeCartKey] || [];
      const existing = childCart.find((c) => c.id === item.id);
      let updated;
      if (existing) {
        updated = childCart.map((c) => (c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c));
      } else {
        updated = [...childCart, { ...item, quantity: 1 }];
      }
      return { ...prev, [activeCartKey]: updated };
    });
  };

  const handleRemoveFromCart = (itemId) => {
    setCartsByChild((prev) => {
      const childCart = prev[activeCartKey] || [];
      const existing = childCart.find((c) => c.id === itemId);
      if (!existing) return prev;
      let updated;
      if (existing.quantity === 1) {
        updated = childCart.filter((c) => c.id !== itemId);
      } else {
        updated = childCart.map((c) => (c.id === itemId ? { ...c, quantity: c.quantity - 1 } : c));
      }
      return { ...prev, [activeCartKey]: updated };
    });
  };

  const handleClearCurrentCart = () => {
    setCartsByChild((prev) => ({ ...prev, [activeCartKey]: [] }));
  };

  // 1-Tap Copy Meal to Sibling
  const handleCopyMealToSibling = (targetSibling) => {
    if (!currentCart || currentCart.length === 0) return;
    setCartsByChild((prev) => ({
      ...prev,
      [targetSibling.id]: [...currentCart.map((item) => ({ ...item }))]
    }));
    setNotificationToast(`Copied lunch to ${targetSibling.studentName.split(' ')[0]}'s box!`);
    setTimeout(() => setNotificationToast(null), 3500);
  };

  // Conflict Check
  const activeOrderForCurrentSlot = activeChild && selectedSlot
    ? StorageService.findActiveOrderForSlot(activeSchool?.id, activeChild.id, selectedDate, selectedSlot.id)
    : null;

  const [checkoutMode, setCheckoutMode] = useState('single'); // 'single' | 'all'

  // Family Checkout Data computation
  const familyCheckoutData = (childrenList || [])
    .filter((kid) => (cartsByChild[kid.id] || []).length > 0)
    .map((kid) => {
      const kidCart = cartsByChild[kid.id] || [];
      const kidTotal = kidCart.reduce((sum, i) => sum + i.price * i.quantity, 0);
      return {
        student: kid,
        cart: kidCart,
        total: kidTotal
      };
    });

  // Checkout Flow
  const handleProceedToStudent = (mode = 'single') => {
    setIsCartOpen(false);
    setCheckoutMode(mode);

    if (mode === 'all') {
      if (familyCheckoutData.length > 0) {
        setVerifiedStudent(familyCheckoutData[0].student);
        setIsPaymentModalOpen(true);
        return;
      }
    }

    if (activeChild) {
      setVerifiedStudent(activeChild);
      setIsPaymentModalOpen(true);
    } else {
      setIsStudentModalOpen(true);
    }
  };

  const handleStudentVerified = (student) => {
    setVerifiedStudent(student);
    setIsStudentModalOpen(false);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = (paymentResult, mode = 'single', familyData = []) => {
    setIsPaymentModalOpen(false);

    if (mode === 'all' && familyData.length > 0) {
      // Create separate tokenized orders for all children in 1 payment
      const updatedCarts = { ...cartsByChild };

      familyData.forEach((item) => {
        const student = item.student;
        const kidCart = item.cart;
        const kidTotal = item.total;

        StorageService.createOrder(activeSchool.id, {
          studentId: student.id,
          studentName: student.studentName,
          classSection: `${student.class} - ${student.section}`,
          orderedByParentName: parentSession ? parentSession.parentName : student.fatherName || 'Parent',
          orderedByParentPhone: parentSession ? parentSession.phone : student.fatherPhone || student.parentPhone || '',
          parentRelation: parentSession ? parentSession.relation : 'Parent',
          requiredDate: selectedDate,
          mealPeriodId: selectedSlot ? selectedSlot.id : 'standard',
          mealPeriodName: selectedSlot ? selectedSlot.name : 'Standard Break',
          allergies: student.allergies || [],
          dietary: student.dietary || 'Veg',
          healthNotes: student.healthNotes || '',
          items: kidCart.map((i) => ({
            id: i.id,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
            subtotal: i.price * i.quantity
          })),
          totalAmount: kidTotal,
          paymentId: `${paymentResult.transactionId}_${student.id}`
        });

        delete updatedCarts[student.id];
      });

      setCartsByChild(updatedCarts);
      loadData();
      setIsTrackingOpen(true);
      setNotificationToast(`🎉 Combined Payment of ${activeSchool.currency} ${paymentResult.amount} Successful! Dispatched lunch boxes for ${familyData.length} kids!`);
      setTimeout(() => setNotificationToast(null), 5000);
      return;
    }

    // Single Child Order Creation
    const newOrder = StorageService.createOrder(activeSchool.id, {
      studentId: verifiedStudent.id,
      studentName: verifiedStudent.studentName,
      classSection: `${verifiedStudent.class} - ${verifiedStudent.section}`,
      orderedByParentName: parentSession ? parentSession.parentName : verifiedStudent.fatherName || 'Parent',
      orderedByParentPhone: parentSession ? parentSession.phone : verifiedStudent.fatherPhone || verifiedStudent.parentPhone || '',
      parentRelation: parentSession ? parentSession.relation : 'Parent',
      requiredDate: selectedDate,
      mealPeriodId: selectedSlot ? selectedSlot.id : 'standard',
      mealPeriodName: selectedSlot ? selectedSlot.name : 'Standard Break',
      allergies: verifiedStudent.allergies || [],
      dietary: verifiedStudent.dietary || 'Veg',
      healthNotes: verifiedStudent.healthNotes || '',
      items: currentCart.map((i) => ({
        id: i.id,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        subtotal: i.price * i.quantity
      })),
      totalAmount: currentChildTotal,
      paymentId: paymentResult.transactionId
    });

    // Clear only this child's cart
    setCartsByChild((prev) => ({ ...prev, [activeCartKey]: [] }));
    loadData();
    setIsTrackingOpen(true);
    setNotificationToast(`🎉 Lunch Box #${newOrder.tokenNumber} Ordered & Paid for ${verifiedStudent.studentName.split(' ')[0]}!`);
    setTimeout(() => setNotificationToast(null), 4000);
  };

  // Unauthenticated Full-Screen Login Gateways (Rendered directly without 480px frame)
  if (activePortal === 'parent' && !parentSession) {
    return (
      <ParentLoginScreen
        activeSchool={activeSchool}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  if (activePortal === 'kitchen' && !kitchenSession) {
    return (
      <KitchenLoginScreen
        activeSchool={activeSchool}
        onLoginSuccess={(sess) => setKitchenSession(sess)}
      />
    );
  }

  if (activePortal === 'admin' && !adminSession) {
    return (
      <AdminLoginScreen
        activeSchool={activeSchool}
        onLoginSuccess={(sess) => setAdminSession(sess)}
      />
    );
  }

  return (
    <div className={`app-container ${activePortal !== 'parent' ? 'wide-layout' : 'parent-desktop-responsive'}`}>
      {/* Toast Notification Banner */}
      {notificationToast && (
        <div
          style={{
            position: 'fixed',
            top: '16px',
            right: '16px',
            zIndex: 9999,
            background: '#065f46',
            color: 'white',
            padding: '0.75rem 1.15rem',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-xl)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            fontWeight: 700,
            fontSize: '0.85rem',
            animation: 'slideUp 0.3s ease'
          }}
        >
          <CheckCircle2 size={18} color="#34d399" />
          <span>{notificationToast}</span>
        </div>
      )}

      {/* PORTAL 1: AUTHENTICATED PARENT FOOD ORDERING */}
      {activePortal === 'parent' && (
        <>
          {/* Ultra-Compact Sticky Header */}
          <CompactHeader
            activeSchool={activeSchool}
            schools={schools}
            onSelectSchool={handleSelectSchool}
            cartCount={totalFamilyItemsCount}
            cartTotal={totalFamilyAmount}
            onOpenCart={() => setIsCartOpen(true)}
            onViewMyOrders={() => setIsTrackingOpen(true)}
            activeOrderCount={orders.length}
            parentSession={parentSession}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            onLogoutParent={handleLogoutParent}
            selectedDate={selectedDate}
            selectedSlot={selectedSlot}
            onOpenDateSlotSheet={() => setIsDateSlotSheetOpen(true)}
          />

          <main className="main-content">
            {isTrackingOpen ? (
              <OrderTracker
                orders={orders}
                onBackToMenu={() => setIsTrackingOpen(false)}
                currency={activeSchool.currency}
                activeSchool={activeSchool}
              />
            ) : (
              <>
                {/* 👦 Visual Avatar Sibling Bar & Health Safety Strip */}
                <ChildAvatarBar
                  childrenList={childrenList}
                  activeChild={activeChild}
                  onSelectChild={handleSelectChild}
                  cartsByChild={cartsByChild}
                  currency={activeSchool.currency}
                  onOpenHealthModal={() => setIsHealthModalOpen(true)}
                />

                {/* Co-Parent Active Order Conflict Detection Banner */}
                {activeOrderForCurrentSlot && (
                  <ActiveSlotOrderBanner
                    activeOrder={activeOrderForCurrentSlot}
                    childName={activeChild?.studentName}
                    currentParentSession={parentSession}
                    onViewOrder={() => setIsTrackingOpen(true)}
                    selectedSlotName={selectedSlot?.name}
                  />
                )}

                {/* High-Density Food Catalog with Allergy Safety Filter */}
                <MenuCatalog
                  menuItems={menuItems}
                  selectedSlot={selectedSlot}
                  cart={currentCart}
                  onAddToCart={handleAddToCart}
                  onRemoveFromCart={handleRemoveFromCart}
                  currency={activeSchool.currency}
                  activeChild={activeChild}
                />

                {/* 🌟 Floatable Quick-Action Hub */}
                <FloatingActionHub
                  cartCount={totalFamilyItemsCount}
                  cartTotal={totalFamilyAmount}
                  currency={activeSchool.currency}
                  activeOrderCount={orders.length}
                  onOpenCart={() => setIsCartOpen(true)}
                  onViewOrders={() => setIsTrackingOpen(true)}
                  activeChild={activeChild}
                  childrenList={childrenList}
                  onSelectChild={handleSelectChild}
                  cartsByChild={cartsByChild}
                />
              </>
            )}
          </main>
        </>
      )}

      {/* PORTAL 2: KITCHEN DISPLAY & DISPATCH (KDS) */}
      {activePortal === 'kitchen' && (
        <main className="main-content">
          <KitchenDashboard
            orders={orders}
            activeSchool={activeSchool}
            onRefresh={loadData}
            staffSession={kitchenSession}
            onLogoutKitchen={() => setKitchenSession(null)}
          />
        </main>
      )}

      {/* PORTAL 3: SCHOOL ADMIN & ROSTER */}
      {activePortal === 'admin' && (
        <main className="main-content">
          <SchoolSettings
            activeSchool={activeSchool}
            students={students}
            orders={orders}
            onRefresh={loadData}
            adminSession={adminSession}
            onLogoutAdmin={() => setAdminSession(null)}
          />
        </main>
      )}

      {/* Child Health & Allergy Preferences Modal */}
      <ChildHealthModal
        isOpen={isHealthModalOpen}
        onClose={() => setIsHealthModalOpen(false)}
        child={activeChild}
        onSaveHealthProfile={handleSaveHealthProfile}
      />

      {/* Date & Break Slot Bottom Sheet */}
      <DateSlotSheet
        isOpen={isDateSlotSheetOpen}
        onClose={() => setIsDateSlotSheetOpen(false)}
        activeSchool={activeSchool}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedSlot={selectedSlot}
        setSelectedSlot={setSelectedSlot}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={currentCart}
        cartsByChild={cartsByChild}
        onAddToCart={handleAddToCart}
        onRemoveFromCart={handleRemoveFromCart}
        onClearCart={handleClearCurrentCart}
        onProceedToStudent={handleProceedToStudent}
        selectedDate={selectedDate}
        selectedSlot={selectedSlot}
        currency={activeSchool.currency}
        activeChild={activeChild}
        childrenList={childrenList}
        onSelectChild={handleSelectChild}
        onCopyMealToSibling={handleCopyMealToSibling}
      />

      {/* Student Lookup Modal */}
      <StudentIDModal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        schoolId={activeSchool.id}
        activeSchool={activeSchool}
        onStudentVerified={handleStudentVerified}
        cartTotal={currentChildTotal}
        currency={activeSchool.currency}
      />

      {/* Mandatory Payment Modal (Supports Combined Multi-Child & Single-Child Payments) */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        verifiedStudent={verifiedStudent}
        checkoutMode={checkoutMode}
        familyCheckoutData={familyCheckoutData}
        selectedDate={selectedDate}
        selectedSlot={selectedSlot}
        cart={currentCart}
        cartTotal={currentChildTotal}
        currency={activeSchool.currency}
        activeSchool={activeSchool}
        parentSession={parentSession}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Parent OTP Auth Modal (Fallback) */}
      <ParentAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        schoolId={activeSchool.id}
        activeSchool={activeSchool}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
