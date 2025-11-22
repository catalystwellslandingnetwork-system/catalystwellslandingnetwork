# Main App Database - Payment Updates

## Overview
This document details exactly what data is stored and updated in the **main app's `schools` table** when a payment is processed through the landing page.

---

## 📊 Main App Database Table: `schools`

### **Payment-Related Columns**

When a successful payment is verified, the following columns are updated in the `schools` table:

| Column Name | Data Type | Description | Example Value |
|------------|-----------|-------------|---------------|
| `subscription_status` | TEXT | Current subscription status | `'active'` |
| `subscription_plan` | TEXT | Name of the subscribed plan | `'Catalyst AI Pro'` |
| `student_limit` | INTEGER | Maximum number of students allowed | `100` |
| `user_limit` | INTEGER | Maximum number of users/staff allowed | `100` |
| `subscription_start_date` | TIMESTAMPTZ | When the subscription started | `'2024-11-09T10:30:00Z'` |
| `subscription_end_date` | TIMESTAMPTZ | When the current period ends | `'2024-12-09T10:30:00Z'` |
| `next_billing_date` | TIMESTAMPTZ | When next payment is due | `'2024-12-09T10:30:00Z'` |
| `razorpay_subscription_id` | TEXT | Razorpay payment ID for reference | `'pay_RdcWcvYPD2RHuz'` |
| `plan_type` | TEXT | Type of plan tier | `'basic'` or `'premium'` |
| `monthly_fee` | NUMERIC | Monthly subscription cost | `2500.00` |
| `payment_status` | TEXT | Current payment status | `'active'` |
| `last_payment_date` | TIMESTAMPTZ | Date of last successful payment | `'2024-11-09T10:30:00Z'` |
| `trial_end_date` | TIMESTAMPTZ | Trial end date (cleared on paid) | `null` |

---

## 🔄 Payment Processing Flow

### **Step 1: User Completes Payment**
User pays via Razorpay on the checkout page.

### **Step 2: Payment Verification**
Payment signature is verified using Razorpay's security mechanism.

### **Step 3: Main App Database Update**
The `activatePaidSubscription()` function updates the school record:

```typescript
// File: lib/main-app-supabase.ts
await mainAppSupabase
  .from('schools')
  .update({
    // Subscription Details
    subscription_status: 'active',
    subscription_plan: 'Catalyst AI Pro',
    student_limit: 100,
    user_limit: 100,
    
    // Dates
    subscription_start_date: '2024-11-09T10:30:00Z',
    subscription_end_date: '2024-12-09T10:30:00Z',   // +1 month (or +1 year)
    next_billing_date: '2024-12-09T10:30:00Z',       // +1 month (or +1 year)
    
    // Payment Information
    razorpay_subscription_id: 'pay_RdcWcvYPD2RHuz',
    plan_type: 'basic',  // or 'premium'
    monthly_fee: 2500.00,
    payment_status: 'active',
    last_payment_date: '2024-11-09T10:30:00Z',
    
    // Clear trial
    trial_end_date: null
  })
  .eq('id', schoolId);
```

### **Step 4: Landing Page Database Update** (Optional)
The landing page database stores audit logs and payment history (non-critical).

---

## 💰 Payment Details Stored

### **1. Subscription Status**
```typescript
subscription_status: 'active'
```
- **Values**: `'trial'`, `'active'`, `'expired'`, `'cancelled'`
- **Purpose**: Controls access to the main app
- **Critical**: Yes - App checks this to allow/deny access

### **2. Subscription Plan**
```typescript
subscription_plan: 'Catalyst AI Pro'
```
- **Values**: `'Catalyst AI'`, `'Catalyst AI Pro'`, `'Catalyst AI Extreme'`
- **Purpose**: Identifies which features are available
- **Critical**: Yes - Determines feature access

### **3. Student & User Limits**
```typescript
student_limit: 100
user_limit: 100
```
- **Purpose**: Enforces capacity limits
- **Critical**: Yes - Prevents exceeding purchased capacity
- **Note**: Both set to same value (student count from payment)

### **4. Billing Dates**
```typescript
subscription_start_date: '2024-11-09T10:30:00Z'
subscription_end_date: '2024-12-09T10:30:00Z'
next_billing_date: '2024-12-09T10:30:00Z'
```
- **Purpose**: Track subscription lifecycle
- **Calculation**: 
  - Monthly: `start_date + 1 month`
  - Yearly: `start_date + 1 year`
- **Used For**: 
  - `subscription_end_date`: When current subscription period expires
  - `next_billing_date`: When to charge for renewal
  - Both are typically the same for recurring subscriptions

### **5. Payment Gateway Reference**
```typescript
razorpay_subscription_id: 'pay_RdcWcvYPD2RHuz'
```
- **Purpose**: Link to Razorpay transaction
- **Used For**: 
  - Refunds
  - Dispute resolution
  - Payment history lookup

### **6. Plan Type**
```typescript
plan_type: 'basic' | 'premium'
```
- **Calculation**:
  - Price ≥ ₹500: `'premium'`
  - Price ≥ ₹25: `'basic'`
  - Otherwise: `'basic'`
- **Purpose**: Quick tier identification

### **7. Monthly Fee**
```typescript
monthly_fee: 2500.00
```
- **Calculation**:
  - Monthly plan: `price_per_student × student_count`
  - Yearly plan: `(price_per_student × student_count × 12) / 12`
- **Purpose**: Billing calculations and reports

### **8. Payment Status**
```typescript
payment_status: 'active'
```
- **Values**: `'active'`, `'overdue'`, `'failed'`, `'suspended'`
- **Purpose**: Track payment health
- **Critical**: Yes - May restrict access if not 'active'

### **9. Last Payment Date**
```typescript
last_payment_date: '2024-11-09T10:30:00Z'
```
- **Purpose**: Track payment history
- **Used For**: Analytics and support

### **10. Trial End Date**
```typescript
trial_end_date: null
```
- **Purpose**: Cleared when converting to paid
- **Note**: If upgrading from trial, this is set to null

---

## 📋 Complete Update Example

### **Scenario**: School purchases "Catalyst AI Pro" for 100 students at ₹25/student/month

```sql
UPDATE schools
SET
  -- Core Subscription
  subscription_status = 'active',
  subscription_plan = 'Catalyst AI Pro',
  
  -- Capacity
  student_limit = 100,
  user_limit = 100,
  
  -- Dates
  subscription_start_date = '2024-11-09T10:30:00.000Z',
  subscription_end_date = '2024-12-09T10:30:00.000Z',
  next_billing_date = '2024-12-09T10:30:00.000Z',
  
  -- Payment Info
  razorpay_subscription_id = 'pay_RdcWcvYPD2RHuz',
  plan_type = 'basic',
  monthly_fee = 2500.00,
  payment_status = 'active',
  last_payment_date = '2024-11-09T10:30:00.000Z',
  
  -- Clear Trial
  trial_end_date = NULL
  
WHERE id = '142dac48-a69a-46cb-b5a1-22fca8113253';
```

---

## 🔐 Security & Validation

### **Before Update**
1. ✅ Payment signature verified with Razorpay
2. ✅ School ID validated (must exist in main app)
3. ✅ Payment amount verified
4. ✅ All required fields present

### **During Update**
1. ✅ Uses service role key (bypasses RLS)
2. ✅ Atomic transaction
3. ✅ Error handling with rollback
4. ✅ Logging for audit trail

### **After Update**
1. ✅ School gains immediate access
2. ✅ Feature gates activated based on plan
3. ✅ Capacity limits enforced
4. ✅ Billing cycle tracked

---

## 🎯 Critical vs Non-Critical Fields

### **Critical (Must Succeed)**
These fields control app access and MUST be updated:
- ✅ `subscription_status`
- ✅ `subscription_plan`
- ✅ `student_limit`
- ✅ `user_limit`
- ✅ `payment_status`

If main app update fails, the payment verification returns HTTP 500 error.

### **Important (Should Succeed)**
These fields track billing and history:
- `subscription_start_date`
- `next_billing_date`
- `razorpay_subscription_id`
- `last_payment_date`

### **Nice-to-Have**
These fields provide additional context:
- `plan_type`
- `monthly_fee`
- `trial_end_date` (cleared)

---

## 📊 Data Flow Diagram

```
┌─────────────────┐
│   User Pays     │
│   (Checkout)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Razorpay       │
│  Processes      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Verify Payment │
│  (Backend API)  │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  UPDATE Main App Database           │
│  ├─ subscription_status = 'active'  │
│  ├─ subscription_plan = 'Pro'       │
│  ├─ student_limit = 100             │
│  ├─ subscription_end_date           │
│  ├─ next_billing_date               │
│  ├─ razorpay_subscription_id        │
│  └─ ... (all payment fields)        │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────┐
│  Update Landing │
│  Page DB (Logs) │
│  (Optional)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Success Page   │
│  Shown to User  │
└─────────────────┘
```

---

## 🛠️ Schema Creation

### **Add These Columns to Your Main App's `schools` Table**

```sql
-- Run this in your MAIN APP Supabase database

ALTER TABLE schools
  -- Subscription columns
  ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'inactive',
  ADD COLUMN IF NOT EXISTS subscription_plan TEXT,
  ADD COLUMN IF NOT EXISTS student_limit INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS user_limit INTEGER DEFAULT 0,
  
  -- Date columns
  ADD COLUMN IF NOT EXISTS trial_end_date TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS subscription_start_date TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS subscription_end_date TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS next_billing_date TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS last_payment_date TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS payment_due_date TIMESTAMPTZ,
  
  -- Payment columns
  ADD COLUMN IF NOT EXISTS razorpay_subscription_id TEXT,
  ADD COLUMN IF NOT EXISTS plan_type TEXT DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS monthly_fee NUMERIC(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'inactive';

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_schools_subscription_status 
  ON schools(subscription_status);
  
CREATE INDEX IF NOT EXISTS idx_schools_payment_status 
  ON schools(payment_status);
  
CREATE INDEX IF NOT EXISTS idx_schools_next_billing_date 
  ON schools(next_billing_date) 
  WHERE next_billing_date IS NOT NULL;

-- Add constraints
ALTER TABLE schools
  ADD CONSTRAINT valid_subscription_status 
    CHECK (subscription_status IN ('inactive', 'trial', 'active', 'expired', 'cancelled')),
  
  ADD CONSTRAINT valid_payment_status 
    CHECK (payment_status IN ('inactive', 'active', 'overdue', 'failed', 'suspended')),
    
  ADD CONSTRAINT valid_plan_type 
    CHECK (plan_type IN ('free', 'basic', 'premium'));
```

---

## 📝 Environment Variables Required

To update the main app database, these environment variables MUST be set:

```env
# Main App Supabase (REQUIRED)
MAIN_APP_SUPABASE_URL=https://your-project.supabase.co
MAIN_APP_SUPABASE_SERVICE_KEY=your-service-role-key

# Landing Page Supabase (OPTIONAL - for logs)
NEXT_PUBLIC_SUPABASE_URL=https://landing.supabase.co
SUPABASE_SERVICE_ROLE_KEY=landing-service-key

# Razorpay (REQUIRED)
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=xxxxx
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxx
```

---

## ✅ Verification Checklist

After payment, verify these were updated:

```sql
-- Check main app database
SELECT 
  id,
  name,
  email,
  subscription_status,
  subscription_plan,
  student_limit,
  payment_status,
  subscription_start_date,
  subscription_end_date,
  next_billing_date,
  razorpay_subscription_id,
  last_payment_date
FROM schools
WHERE id = 'school-id-here';
```

**Expected Results**:
- ✅ `subscription_status` = `'active'`
- ✅ `subscription_plan` = Plan name
- ✅ `student_limit` = Purchased count
- ✅ `payment_status` = `'active'`
- ✅ `subscription_start_date` = Current timestamp
- ✅ `subscription_end_date` = Today + 1 month (or year)
- ✅ `next_billing_date` = Today + 1 month (or year)
- ✅ `razorpay_subscription_id` = Payment ID
- ✅ `last_payment_date` = Current timestamp

---

## 🚨 Troubleshooting

### **Update Fails**
1. Check environment variables are set correctly
2. Verify service role key has write permissions
3. Check school exists in main app database
4. Review API logs for error details

### **Access Not Granted**
1. Verify `subscription_status` = `'active'`
2. Check `payment_status` = `'active'`
3. Confirm `student_limit` > 0
4. Review app's access control logic

### **Billing Issues**
1. Verify `next_billing_date` is set
2. Check `monthly_fee` is correct
3. Confirm `razorpay_subscription_id` exists

---

## 📚 Related Files

- `lib/main-app-supabase.ts` - Database update functions
- `app/api/payment/verify/route.ts` - Payment verification logic
- `app/api/payment/create-order/route.ts` - Order creation

---

## Summary

The main app's `schools` table receives **13 payment-related fields** during each successful payment:

1. subscription_status → 'active'
2. subscription_plan → Plan name
3. student_limit → Count purchased
4. user_limit → Same as student_limit
5. subscription_start_date → Now
6. subscription_end_date → +1 month/year from now
7. next_billing_date → +1 month/year from now
8. razorpay_subscription_id → Payment ID
9. plan_type → 'basic'/'premium'
10. monthly_fee → Calculated amount
11. payment_status → 'active'
12. last_payment_date → Now
13. trial_end_date → NULL (cleared)

These updates are **critical** and must succeed for the payment to be considered complete. The landing page database stores additional audit logs but is not required for app access.
