export const INITIAL_SCHOOLS = [
  {
    id: "brainwaves",
    name: "Brainwaves International School",
    canteenName: "Brainwaves Food Court",
    emoji: "🍱",
    logoText: "BW",
    primaryColor: "#2563eb",
    accentColor: "#10b981",
    currency: "₹",
    currencyCode: "INR",
    phone: "+91 98765 43210",
    address: "Campus 1, Academic Avenue",
    mealPeriods: [
      { id: "break_morning", name: "Morning Snack / Short Break", time: "10:15 AM", cutoffMins: 45 },
      { id: "lunch_break", name: "Lunch Break", time: "12:45 PM", cutoffMins: 45 },
      { id: "break_evening", name: "Evening Refreshment / Daycare", time: "03:30 PM", cutoffMins: 60 }
    ],
    advanceBookingDays: 7
  },
  {
    id: "stxaviers",
    name: "St. Xavier's World School",
    canteenName: "Xavier's Healthy Cafe",
    emoji: "🥪",
    logoText: "SX",
    primaryColor: "#059669",
    accentColor: "#f59e0b",
    currency: "₹",
    currencyCode: "INR",
    phone: "+91 91234 56780",
    address: "St. Xavier's High Road",
    mealPeriods: [
      { id: "short_recess", name: "Short Recess", time: "10:30 AM", cutoffMins: 40 },
      { id: "lunch_hour", name: "Lunch Hour", time: "01:15 PM", cutoffMins: 45 }
    ],
    advanceBookingDays: 7
  },
  {
    id: "greenwood",
    name: "Greenwood International Academy",
    canteenName: "Greenwood Healthy Dining",
    emoji: "🥗",
    logoText: "GW",
    primaryColor: "#7c3aed",
    accentColor: "#ec4899",
    currency: "$",
    currencyCode: "USD",
    phone: "+1 (555) 382-9102",
    address: "104 Greenwood Blvd",
    mealPeriods: [
      { id: "brunch", name: "Brunch Period", time: "10:00 AM", cutoffMins: 45 },
      { id: "main_lunch", name: "Main Lunch", time: "12:30 PM", cutoffMins: 45 }
    ],
    advanceBookingDays: 5
  }
];
