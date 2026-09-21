// src/services/featureService.js

export const FEATURE_CATEGORIES = {
  ORDERING: { id: 'ordering', label: 'Ordering & Slots', icon: '🍱' },
  HEALTH: { id: 'health', label: 'Health & Nutrition', icon: '🛡️' },
  PAYMENTS: { id: 'payments', label: 'Payments & Billing', icon: '💳' },
  KITCHEN: { id: 'kitchen', label: 'Kitchen & Fulfillment', icon: '👩‍🍳' },
  ADMIN: { id: 'admin', label: 'Admin & Operations', icon: '📊' }
};

export const FEATURE_DEFINITIONS = [
  // 1. Ordering & Slots
  {
    key: 'advanceBooking',
    category: 'ordering',
    name: 'Multi-Day Advance Booking',
    description: 'Allow parents to pre-order meals up to 7 days ahead for scheduled break slots.',
    defaultEnabled: true,
    minTier: 'starter'
  },
  {
    key: 'multiSibling',
    category: 'ordering',
    name: 'Multi-Sibling Fast Switch',
    description: 'Switch between siblings in 1 tap, share meal trays, and manage multiple children.',
    defaultEnabled: true,
    minTier: 'growth'
  },
  {
    key: 'reorderTray',
    category: 'ordering',
    name: '1-Tap Quick Reorder',
    description: 'Allow parents to quickly duplicate or re-order past favorite meal trays.',
    defaultEnabled: true,
    minTier: 'starter'
  },
  {
    key: 'mealCutoffLock',
    category: 'ordering',
    name: 'Dynamic Break Cutoff Timers',
    description: 'Enforce strict ordering cutoffs (e.g. 45 min before recess) to prevent late orders.',
    defaultEnabled: true,
    minTier: 'starter'
  },

  // 2. Health & Nutrition
  {
    key: 'allergyShield',
    category: 'health',
    name: 'Active Allergen Safety Shield',
    description: 'Live warning alerts & checkout blocks if dishes contain allergens matched to child medical profile.',
    defaultEnabled: true,
    minTier: 'growth'
  },
  {
    key: 'nutritionTracker',
    category: 'health',
    name: 'Macro-Nutrient & Energy Bar',
    description: 'Live calculation of Calories (kcal), Protein (g), Carbs, and Fats for every meal item and tray.',
    defaultEnabled: true,
    minTier: 'enterprise'
  },
  {
    key: 'dietaryPrefs',
    category: 'health',
    name: 'Dietary Badging & Filters',
    description: 'Strict Veg / Non-Veg / Vegan filters and visual badges on all menu items.',
    defaultEnabled: true,
    minTier: 'starter'
  },

  // 3. Payments & Billing
  {
    key: 'campusWallet',
    category: 'payments',
    name: 'Campus Lunch Wallet',
    description: 'Prepaid 1-tap student lunch wallet with balance top-up options and instant deduction.',
    defaultEnabled: true,
    minTier: 'growth'
  },
  {
    key: 'directPayment',
    category: 'payments',
    name: 'Direct Online Payment (UPI / Card)',
    description: 'Direct instant checkout through online payment gateways without requiring a prepaid wallet.',
    defaultEnabled: true,
    minTier: 'starter'
  },

  // 4. Kitchen & Fulfillment
  {
    key: 'kitchenKDS',
    category: 'kitchen',
    name: 'Live Kitchen Display System (KDS)',
    description: 'Real-time kitchen operator dashboard with slot filters, batch cooking, and prep staging.',
    defaultEnabled: true,
    minTier: 'growth'
  },
  {
    key: 'thermalPrinting',
    category: 'kitchen',
    name: '80mm Thermal Sticker Printing',
    description: '1-Click thermal sticker automation sorted by Class, Section, Roll #, and Token ID.',
    defaultEnabled: true,
    minTier: 'enterprise'
  },
  {
    key: 'classroomDelivery',
    category: 'kitchen',
    name: 'Classroom Desk Delivery Crate Flow',
    description: 'Class-wise crate sorting and desk delivery tracking instead of crowded counter pickup.',
    defaultEnabled: true,
    minTier: 'enterprise'
  },
  {
    key: 'studentIdBadge',
    category: 'kitchen',
    name: 'Digital Student QR ID & Token Badge',
    description: 'Digital student ID card and QR token modal for instant counter pickup verification.',
    defaultEnabled: true,
    minTier: 'starter'
  },
  {
    key: 'liveOrderTracker',
    category: 'kitchen',
    name: '5-Stage Live Order Tracker',
    description: 'Real-time tracking bar from Kitchen Prep -> Quality Check -> Out for Delivery -> Handover.',
    defaultEnabled: true,
    minTier: 'starter'
  },

  // 5. Admin & Intelligence
  {
    key: 'excelRosterImport',
    category: 'admin',
    name: 'Excel Student Roster Bulk Sync',
    description: 'Bulk CSV / Excel student roster import and export with class-section mapping.',
    defaultEnabled: true,
    minTier: 'starter'
  },
  {
    key: 'advancedAnalytics',
    category: 'admin',
    name: 'Financial & Wastage Analytics Export',
    description: 'Detailed revenue reports, popular item metrics, and consumption data exports.',
    defaultEnabled: true,
    minTier: 'enterprise'
  },
  {
    key: 'customBranding',
    category: 'admin',
    name: 'Custom School Branding & Theme',
    description: 'School logo, custom theme colors, canteen naming, and localized currencies.',
    defaultEnabled: true,
    minTier: 'growth'
  }
];

export const TIER_PRESETS = {
  starter: {
    id: 'starter',
    name: 'Lean Canteen (Essential)',
    badge: 'Lean Pilot',
    price: '₹4,080 / mo (₹49,000/yr)',
    priceIntl: '$55 / mo',
    description: '100% BYOD pilot for schools up to 400 students using existing phones/tablets and 0% UPI payments.',
    color: '#0284c7',
    features: {
      advanceBooking: true,
      multiSibling: false,
      reorderTray: true,
      mealCutoffLock: true,
      allergyShield: false,
      nutritionTracker: false,
      dietaryPrefs: true,
      campusWallet: false,
      directPayment: true,
      kitchenKDS: true,
      thermalPrinting: false,
      classroomDelivery: false,
      studentIdBadge: true,
      liveOrderTracker: true,
      excelRosterImport: true,
      advancedAnalytics: false,
      customBranding: false
    }
  },
  growth: {
    id: 'growth',
    name: 'Campus Pro (Recommended)',
    badge: 'Most Popular',
    price: '₹6,580 / mo (₹79,000/yr)',
    priceIntl: '$89 / mo',
    description: 'Complete smart canteen with thermal sticker print engine (BYO printer), multi-sibling switch, allergen shield & KDS.',
    color: '#059669',
    features: {
      advanceBooking: true,
      multiSibling: true,
      reorderTray: true,
      mealCutoffLock: true,
      allergyShield: true,
      nutritionTracker: false,
      dietaryPrefs: true,
      campusWallet: true,
      directPayment: true,
      kitchenKDS: true,
      thermalPrinting: true,
      classroomDelivery: true,
      studentIdBadge: true,
      liveOrderTracker: true,
      excelRosterImport: true,
      advancedAnalytics: true,
      customBranding: true
    }
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise Logistics (Full Suite)',
    badge: 'Full Automation',
    price: '₹9,915 / mo (₹1,19,000/yr)',
    priceIntl: '$135 / mo',
    description: 'Complete institutional campus break logistics with custom domain, multi-wing routing, nutrition tracking & KPI dashboard.',
    color: '#7c3aed',
    features: {
      advanceBooking: true,
      multiSibling: true,
      reorderTray: true,
      mealCutoffLock: true,
      allergyShield: true,
      nutritionTracker: true,
      dietaryPrefs: true,
      campusWallet: true,
      directPayment: true,
      kitchenKDS: true,
      thermalPrinting: true,
      classroomDelivery: true,
      studentIdBadge: true,
      liveOrderTracker: true,
      excelRosterImport: true,
      advancedAnalytics: true,
      customBranding: true
    }
  }
};

/**
 * Check if a school has a specific feature enabled
 * @param {Object} school
 * @param {string} featureKey
 * @returns {boolean}
 */
export function hasFeature(school, featureKey) {
  if (!school) return true; // Default fallback to enabled if no school context
  if (school.features && typeof school.features[featureKey] !== 'undefined') {
    return !!school.features[featureKey];
  }
  // Fallback to tier preset default if available
  const tierKey = school.tier || 'enterprise';
  const tierPreset = TIER_PRESETS[tierKey] || TIER_PRESETS.enterprise;
  if (tierPreset && typeof tierPreset.features[featureKey] !== 'undefined') {
    return !!tierPreset.features[featureKey];
  }
  return true;
}

/**
 * Get tier details for a school
 * @param {Object} school
 * @returns {Object} Tier object
 */
export function getSchoolTier(school) {
  const tierKey = school?.tier || 'enterprise';
  return TIER_PRESETS[tierKey] || TIER_PRESETS.enterprise;
}
