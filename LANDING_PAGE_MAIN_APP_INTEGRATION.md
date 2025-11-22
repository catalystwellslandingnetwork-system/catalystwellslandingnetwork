# Landing Page ↔ Main App Integration Guide

## Overview
Complete documentation of all updates and configurations between the landing page and main application for plan management, subscriptions, and payment processing.

---

## 🏗️ Architecture

```
┌─────────────────────┐
│   Landing Page      │
│  • Checkout         │
│  • Payment UI       │
│  • Logs (optional)  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Integration APIs   │
│  • School lookup    │
│  • Payment create   │
│  • Payment verify   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   Main App DB       │
│  • schools table    │
│  • plans table      │
│  • Active data      │
└─────────────────────┘
```

---

## 📊 Main App Database - Required Tables

### **schools Table** (MUST EXIST)

```sql
CREATE TABLE schools (
  -- Core Fields
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  school_code TEXT UNIQUE,
  
  -- Subscription Fields (added via main_app_payment_schema.sql)
  subscription_status TEXT DEFAULT 'inactive',
  subscription_plan TEXT,
  plan_type TEXT DEFAULT 'free',
  student_limit INTEGER DEFAULT 0,
  user_limit INTEGER DEFAULT 0,
  subscription_start_date TIMESTAMPTZ,
  subscription_end_date TIMESTAMPTZ,
  next_billing_date TIMESTAMPTZ,
  last_payment_date TIMESTAMPTZ,
  razorpay_subscription_id TEXT,
  monthly_fee NUMERIC(10,2) DEFAULT 0,
  payment_status TEXT DEFAULT 'inactive',
  trial_end_date TIMESTAMPTZ
);
```

### **plans Table** (OPTIONAL - for dynamic plans)

```sql
CREATE TABLE plans (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  display_name TEXT NOT NULL,
  price_per_student NUMERIC(10,2) NOT NULL,
  features JSONB,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0
);
```

---

## 🎯 Plan Configuration

### **Option 1: Static Plans (Current)**

Edit `app/checkout/page.tsx`:
```typescript
const pricingPlans = [
  { name: "Catalyst AI", price: 15, features: [...] },
  { name: "Catalyst AI Pro", price: 25, features: [...] },
  { name: "Catalyst AI Extreme", price: 500, features: [...] }
];
```

### **Option 2: Dynamic from Database**

**Create API endpoint:**
```typescript
// app/api/plans/route.ts
export async function GET() {
  const { data: plans } = await mainAppSupabase
    .from('plans')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');
  
  return NextResponse.json({ plans });
}
```

**Insert plans in main app:**
```sql
INSERT INTO plans (name, display_name, price_per_student, features, sort_order) VALUES
('catalyst-ai', 'Catalyst AI', 15.00, '["Luminex Pro", "70 AI Credits"]'::jsonb, 1),
('catalyst-ai-pro', 'Catalyst AI Pro', 25.00, '["150 AI Credits", "Enterprise"]'::jsonb, 2),
('catalyst-ai-extreme', 'Catalyst AI Extreme', 500.00, '["UNLIMITED", "24/7 Support"]'::jsonb, 3);
```

---

## 🔄 All Possible Updates to Main App

### **1. School Lookup (READ)**
**Endpoint:** `GET /api/school/[schoolId]`  
**Function:** `getSchoolById()`  
**Fields Read:**
- id, name, email, phone, school_code
- subscription_status, subscription_plan, student_limit

### **2. Free Trial Activation (WRITE)**
**Trigger:** Trial signup  
**Function:** `activateSchoolTrial()`  
**Updates:**
```typescript
{
  subscription_status: 'trial',
  subscription_plan: 'Free Trial',
  student_limit: 75,
  user_limit: 75,
  trial_end_date: now + 30 days,
  subscription_start_date: now,
  plan_type: 'free',
  payment_status: 'active'
}
```

### **3. Paid Subscription Activation (WRITE)**
**Trigger:** Payment verified  
**Function:** `activatePaidSubscription()`  
**Updates 13 Fields:**
```typescript
{
  subscription_status: 'active',
  subscription_plan: planName,
  student_limit: studentCount,
  user_limit: studentCount,
  subscription_start_date: now,
  subscription_end_date: now + cycle,
  next_billing_date: now + cycle,
  razorpay_subscription_id: paymentId,
  plan_type: 'basic'|'premium',
  monthly_fee: calculatedFee,
  payment_status: 'active',
  last_payment_date: now,
  trial_end_date: null
}
```

### **4. Subscription Upgrade (WRITE)**
**Updates:**
```typescript
{
  subscription_plan: newPlan,
  student_limit: newCount,
  plan_type: newType,
  monthly_fee: newFee
}
```

### **5. Subscription Renewal (WRITE)**
**Updates:**
```typescript
{
  subscription_end_date: endDate + cycle,
  next_billing_date: nextBilling + cycle,
  last_payment_date: now,
  payment_status: 'active'
}
```

### **6. Subscription Cancellation (WRITE)**
```typescript
{
  subscription_status: 'cancelled',
  payment_status: 'inactive'
}
```

### **7. Subscription Expiry (WRITE)**
```typescript
{
  subscription_status: 'expired',
  payment_status: 'inactive',
  student_limit: 0,
  user_limit: 0
}
```

### **8. Payment Failure (WRITE)**
```typescript
{
  payment_status: 'failed',
  payment_due_date: now + 3 days
}
```

---

## 🔌 API Endpoints

### **1. GET /api/school/[schoolId]**
- **Purpose:** Fetch school for checkout  
- **Access:** READ from main app  
- **Response:** School details + current subscription

### **2. POST /api/payment/create-order**
- **Purpose:** Create Razorpay order  
- **Access:** WRITE to landing page (logs)  
- **Data:** Stores order in landing DB + Razorpay

### **3. POST /api/payment/verify**
- **Purpose:** Verify and activate  
- **Access:** WRITE to main app (critical) + landing page (optional)  
- **Updates:** 13 fields in schools table

### **4. GET /api/plans** (NEW - Optional)
- **Purpose:** Fetch active plans  
- **Access:** READ from main app plans table  
- **Response:** Array of plan objects

### **5. POST /api/trial/signup** (NEW - Recommended)
- **Purpose:** Activate free trial  
- **Access:** WRITE to main app schools table  
- **Updates:** Trial activation fields

---

## ⚙️ Configuration

### **Environment Variables**
```env
# Main App (REQUIRED)
MAIN_APP_SUPABASE_URL=https://your-main-app.supabase.co
MAIN_APP_SUPABASE_SERVICE_KEY=service-key

# Landing Page (OPTIONAL)
NEXT_PUBLIC_SUPABASE_URL=https://landing.supabase.co
SUPABASE_SERVICE_ROLE_KEY=service-key

# Razorpay (REQUIRED)
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxx
```

### **Database Setup Steps**

1. **Main App:** Run `main_app_payment_schema.sql`
2. **Landing Page:** Run `landing_page_payment_schema.sql`  
3. **Configure:** Set environment variables  
4. **Test:** Verify API endpoints work

---

## 🛡️ Error Handling

### **Fallback Strategies**

1. **Main App Unavailable:** Use Razorpay order notes
2. **Landing DB Unavailable:** Skip logging, continue payment
3. **Payment Timeout:** Retry with exponential backoff

---

## ✅ Testing Checklist

- [ ] School lookup works
- [ ] Payment order creation succeeds
- [ ] Payment verification updates main app
- [ ] All 13 fields updated in schools table
- [ ] Landing page logs created (optional)
- [ ] Success page displays correctly

---

## 📝 Summary

**Landing Page Can:**
1. ✅ Fetch school details from main app
2. ✅ Fetch plans from main app (if configured)
3. ✅ Create payment orders (logs in landing DB)
4. ✅ Verify payments and activate subscriptions (updates main app)
5. ✅ Update 13 fields in schools table on payment
6. ✅ Activate free trials (needs endpoint)
7. ✅ Handle subscription upgrades (needs endpoint)

**Main App Stores:**
- Active subscription data
- Student/user limits
- Billing dates
- Payment status
- All access control data

**Landing Page Stores:**
- Payment audit logs
- Transaction history
- Verification logs
- Optional backup data

For complete implementation details, see:
- `MAIN_APP_PAYMENT_UPDATES.md` - Field-by-field update guide
- `main_app_payment_schema.sql` - Database setup script
- `lib/main-app-supabase.ts` - Integration functions
