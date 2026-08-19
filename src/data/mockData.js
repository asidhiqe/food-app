// Multi-tenant initial mock database with Sibling relationships & dual-parent contacts

export const INITIAL_STUDENTS = {
  brainwaves: [
    // Sharma Family (2 siblings in Brainwaves)
    {
      id: 'BW-101',
      studentName: 'Aarav Sharma',
      class: 'Grade 4',
      section: 'B',
      rollNo: 14,
      fatherName: 'Rajesh Sharma',
      fatherPhone: '9876543210',
      motherName: 'Priya Sharma',
      motherPhone: '9876543211',
      parentEmail: 'sharma.family@example.com',
      avatar: '👦',
      allergies: ['Dairy', 'Nuts'],
      dietary: 'Veg',
      healthNotes: 'Nut Sensitive & Lactose Conscious'
    },
    {
      id: 'BW-102',
      studentName: 'Ananya Sharma',
      class: 'Grade 8',
      section: 'A',
      rollNo: 22,
      fatherName: 'Rajesh Sharma',
      fatherPhone: '9876543210',
      motherName: 'Priya Sharma',
      motherPhone: '9876543211',
      parentEmail: 'sharma.family@example.com',
      avatar: '👧',
      allergies: [],
      dietary: 'Veg',
      healthNotes: 'Allergen Safe'
    },
    // Verma Family (2 siblings)
    {
      id: 'BW-201',
      studentName: 'Riya Verma',
      class: 'Grade 2',
      section: 'C',
      rollNo: 8,
      fatherName: 'Vikram Verma',
      fatherPhone: '9123456780',
      motherName: 'Neha Verma',
      motherPhone: '9123456781',
      parentEmail: 'verma.vikram@example.com',
      avatar: '👧'
    },
    {
      id: 'BW-202',
      studentName: 'Aryan Verma',
      class: 'Grade 6',
      section: 'B',
      rollNo: 19,
      fatherName: 'Vikram Verma',
      fatherPhone: '9123456780',
      motherName: 'Neha Verma',
      motherPhone: '9123456781',
      parentEmail: 'verma.vikram@example.com',
      avatar: '👦'
    },
    // Single child families
    {
      id: 'BW-2026-1042',
      studentName: 'Rohan Gupta',
      class: 'Grade 5',
      section: 'A',
      rollNo: 29,
      fatherName: 'Amit Gupta',
      fatherPhone: '9988776655',
      motherName: 'Sunita Gupta',
      motherPhone: '9988776656',
      parentEmail: 'amit.gupta@example.com',
      avatar: '👦'
    },
    {
      id: 'BW-105',
      studentName: 'Meera Iyer',
      class: 'Grade 7',
      section: 'C',
      rollNo: 11,
      fatherName: 'Suresh Iyer',
      fatherPhone: '9811223344',
      motherName: 'Deepa Iyer',
      motherPhone: '9811223345',
      parentEmail: 'suresh.iyer@example.com',
      avatar: '👧'
    }
  ],
  st_xaviers: [
    {
      id: 'SX-501',
      studentName: 'David Fernandez',
      class: 'Grade 9',
      section: 'A',
      fatherName: 'Joseph Fernandez',
      fatherPhone: '9845012345',
      motherName: 'Maria Fernandez',
      motherPhone: '9845012346',
      avatar: '👦'
    },
    {
      id: 'SX-502',
      studentName: 'Sarah Fernandez',
      class: 'Grade 3',
      section: 'B',
      fatherName: 'Joseph Fernandez',
      fatherPhone: '9845012345',
      motherName: 'Maria Fernandez',
      motherPhone: '9845012346',
      avatar: '👧'
    }
  ],
  greenwood: [
    {
      id: 'GW-801',
      studentName: 'Zoya Khan',
      class: 'Grade 10',
      section: 'B',
      fatherName: 'Tariq Khan',
      fatherPhone: '9711223344',
      motherName: 'Farida Khan',
      motherPhone: '9711223345',
      avatar: '👧'
    }
  ]
};

export const INITIAL_MENUS = {
  brainwaves: [
    {
      id: 'item_1',
      name: 'Paneer Tikka Kathi Roll',
      description: 'Grilled cottage cheese wrapped in whole wheat flatbread with fresh mint chutney.',
      category: 'Snacks & Rolls',
      price: 85,
      isVeg: true,
      allergens: ['Dairy', 'Gluten'],
      availablePeriods: ['morning_snack', 'lunch_break', 'evening_snack'],
      image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80',
      isAvailable: true
    },
    {
      id: 'item_2',
      name: 'Paneer Butter Masala Meal Box',
      description: 'Rich paneer gravy served with 3 soft rotis, jeera rice, salad & gulab jamun.',
      category: 'Lunch Thali',
      price: 120,
      isVeg: true,
      allergens: ['Dairy'],
      availablePeriods: ['lunch_break'],
      image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop&q=80',
      isAvailable: true
    },
    {
      id: 'item_3',
      name: 'Cheesy Vegetable Grilled Sandwich',
      description: 'Multigrain bread stuffed with bell peppers, corn, mozzarella & oregano seasoning.',
      category: 'Sandwiches & Burgers',
      price: 75,
      isVeg: true,
      allergens: ['Dairy', 'Gluten'],
      availablePeriods: ['morning_snack', 'evening_snack'],
      image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80',
      isAvailable: true
    },
    {
      id: 'item_4',
      name: 'Creamy Tomato & Basil Penne Pasta',
      description: 'Italian penne pasta tossed in roasted tomato basil marinara and parmesan cheese.',
      category: 'Pasta & Noodles',
      price: 110,
      isVeg: true,
      allergens: ['Gluten', 'Dairy'],
      availablePeriods: ['lunch_break'],
      image: 'https://images.unsplash.com/photo-1621996346565-e3d5d62817d2?w=600&auto=format&fit=crop&q=80',
      isAvailable: true
    },
    {
      id: 'item_5',
      name: 'Fresh Rainbow Fruit & Nut Bowl',
      description: 'Fresh seasonal watermelon, kiwi, pomegranate, apples topped with honey & chia seeds.',
      category: 'Healthy & Salads',
      price: 65,
      isVeg: true,
      allergens: ['Nuts'],
      availablePeriods: ['morning_snack', 'lunch_break', 'evening_snack'],
      image: 'https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=600&auto=format&fit=crop&q=80',
      isAvailable: true
    },
    {
      id: 'item_6',
      name: 'Cold Pressed Mango Alphonso Nectar',
      description: '100% natural mango juice with no added sugar or preservatives. 250ml chilled bottle.',
      category: 'Beverages & Juices',
      price: 45,
      isVeg: true,
      allergens: [],
      availablePeriods: ['morning_snack', 'lunch_break', 'evening_snack'],
      image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=600&auto=format&fit=crop&q=80',
      isAvailable: true
    },
    {
      id: 'item_7',
      name: 'Crispy Veg Spring Rolls (4 pcs)',
      description: 'Crunchy golden rolls packed with shredded cabbage, carrots, beans and sweet chilli dip.',
      category: 'Snacks & Rolls',
      price: 60,
      isVeg: true,
      allergens: ['Gluten'],
      availablePeriods: ['morning_snack', 'evening_snack'],
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
      isAvailable: true
    },
    {
      id: 'item_8',
      name: 'Belgian Choco-Chip Muffin',
      description: 'Moist oven-fresh dark chocolate muffin with molten choco drops.',
      category: 'Bakery & Sweets',
      price: 50,
      isVeg: true,
      allergens: ['Dairy', 'Gluten'],
      availablePeriods: ['morning_snack', 'evening_snack'],
      image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=600&auto=format&fit=crop&q=80',
      isAvailable: true
    }
  ],
  st_xaviers: [
    {
      id: 'sx_1',
      name: 'Steamed Idli Sambar (3 Pcs)',
      description: 'Fluffy warm idlis with spiced lentil sambar and fresh coconut chutney.',
      category: 'South Indian',
      price: 50,
      isVeg: true,
      allergens: [],
      availablePeriods: ['morning_break'],
      image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80',
      isAvailable: true
    },
    {
      id: 'sx_2',
      name: 'South Indian Mini Meals Box',
      description: 'Rice, Sambar, Rasam, Poriyal, Curd & Papad.',
      category: 'Lunch Meals',
      price: 90,
      isVeg: true,
      allergens: ['Dairy'],
      availablePeriods: ['lunch_break'],
      image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=600&auto=format&fit=crop&q=80',
      isAvailable: true
    }
  ],
  greenwood: [
    {
      id: 'gw_1',
      name: 'Mediterranean Falafel Wrap',
      description: 'Crispy herb falafels, hummus, pickled cucumbers and tahini.',
      category: 'Wraps',
      price: 110,
      isVeg: true,
      allergens: ['Gluten', 'Sesame'],
      availablePeriods: ['lunch_break'],
      image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=600&auto=format&fit=crop&q=80',
      isAvailable: true
    }
  ]
};

export const INITIAL_ORDERS = {
  brainwaves: [
    {
      id: 'ord_1001',
      orderNumber: 'ORD-BW-8801',
      tokenNumber: '1042',
      schoolId: 'brainwaves',
      studentId: 'BW-101',
      studentName: 'Aarav Sharma',
      classSection: 'Grade 4 - B',
      orderedByParentName: 'Rajesh Sharma',
      orderedByParentPhone: '9876543210',
      parentRelation: 'Father',
      requiredDate: new Date().toISOString().split('T')[0],
      mealPeriodId: 'lunch_break',
      mealPeriodName: 'Lunch Break (12:45 PM)',
      items: [
        { id: 'item_2', name: 'Paneer Butter Masala Meal Box', price: 120, quantity: 1, subtotal: 120 },
        { id: 'item_6', name: 'Cold Pressed Mango Alphonso Nectar', price: 45, quantity: 1, subtotal: 45 }
      ],
      totalAmount: 165,
      paymentId: 'PAY_UPI_9928124',
      paymentStatus: 'PAID',
      paymentMethod: 'UPI',
      deliveryStatus: 'ACCEPTED', // 'NEW' | 'ACCEPTED' | 'PREPARING' | 'PACKED' | 'DELIVERED'
      stickerPrinted: true,
      createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString()
    }
  ]
};
