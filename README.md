# 🍱 Brainwaves School Food Court App

> Modern, mobile-first multi-tenant school food ordering and kitchen display system (KDS).

---

## 🌟 Key Personas & Testing Guide

### 1. 👨‍👩‍👧 Parent Mobile App (`/#/order`)
- **Zero-Trust Security**: No student data is exposed until 4-digit mobile OTP authentication.
- **Parent Persona**: Warm, caring tone of voice (*"Packing lunch for Aarav"*, *"Aarav's Lunch Box"*).
- **Multi-Child Sibling Trays**: 1-tap avatar switcher (`👦 Aarav` ↔ `👧 Ananya`) with isolated food trays.
- **1-Tap Duplicate Meal Helper**: Easily copy Aarav's meal into Ananya's box.
- **Child Health & Allergy Profiles**: Automatic conflict detection for **Dairy (Lactose)**, **Gluten**, **Nuts**, **Eggs**, and **Soy** with a 1-tap `🛡️ Safe for Child` filter.
- **Floating Action Hub (FAB)**: Floating bottom-right quick-dial with bounce micro-interactions.

---

### 2. 👨‍🍳 Kitchen Display System (KDS) (`/#/kitchen`)
- **5-Stage Synchronous Lifecycle**:
  1. `NEW` ➔ Parent: **Order Confirmed & Paid** | Staff: `[🚨 Accept Order]`
  2. `ACCEPTED` ➔ Parent: **Accepted by Kitchen** | Staff: `[👨‍🍳 Start Cooking]`
  3. `PREPARING` ➔ Parent: **Freshly Preparing Meal** | Staff: `[📦 Mark Box Packed]`
  4. `PACKED` ➔ Parent: **Meal Box Packed & Labeled** | Staff: `[🚀 Deliver to Classroom]`
  5. `DELIVERED` ➔ Parent: **Delivered to Classroom** | Staff: `✅ Delivered`
- **Thermal Sticker Printing**: 2-inch format with student name, class desk, token number, QR code, and **🚨 ALLERGY ALERTS**.

---

### 3. 🏫 School Admin & Roster Portal (`/#/admin`)
- Campus configuration (cutoffs, break slots).
- Excel student roster import & sibling linkage.
- Financial settlement reports.

---

## 🔑 Demo Parent Phone Numbers for Testing
| Parent Name | Mobile Number | OTP | Linked Children | Allergies Configured |
| :--- | :--- | :--- | :--- | :--- |
| **Rajesh Sharma** | `9876543210` | `4582` or `1234` | 👦 **Aarav** (Grade 4-B)<br>👧 **Ananya** (Grade 8-A) | 🥛 Dairy, 🥜 Nuts (for Aarav) |
| **Vikram Verma** | `9123456780` | `4582` or `1234` | 👧 **Riya** (Grade 2-C)<br>👦 **Aryan** (Grade 6-B) | None (Allergen Safe) |
| **Amit Gupta** | `9988776655` | `4582` or `1234` | 👦 **Rohan** (Grade 5-A) | 🌾 Gluten / Celiac |

---

## 🚀 Running Locally

```bash
# Install dependencies
npm install

# Start Vite dev server
npm run dev

# Build for production
npm run build
```
