# Payment System Overview

## 🎯 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    PAYMENT FLOW                              │
└─────────────────────────────────────────────────────────────┘

User → Landing Page → Razorpay → Verification → Dual Update
                                                      ↓
                                         ┌────────────┴────────────┐
                                         ↓                         ↓
                              Landing Page DB           Main App DB
                              (Payment Logs)          (Subscription)
```

---

## 📊 Three-Tier Data Storage

### 1. **Razorpay** (Payment Gateway)
- **Stores:** Order details, payment status, signature
- **Purpose:** Payment processing & verification
- **Reliability:** ⭐⭐⭐⭐⭐ (Primary payment source)

### 2. **Landing Page Database** (Supabase)
- **Stores:** Payment transactions, subscription logs, verification audit
- **Purpose:** Complete payment audit trail, analytics, compliance
- **Reliability:** ⭐⭐⭐⭐ (Can fail, system still works via Razorpay fallback)

### 3. **Main App Database** (Supabase)
- **Stores:** School subscription status, active plan, user limits
- **Purpose:** Application logic, user access control
- **Reliability:** ⭐⭐⭐⭐⭐ (CRITICAL - Must succeed)

---

## 🔄 Payment Flow (Step by Step)

### 1. User Enters School ID
```
User → /checkout
       ↓
       Enters School ID: "S8BQY3IF3JSK"
       ↓
       System queries Main App DB
       ↓
       Auto-populates: School Name, Email, Phone
```

### 2. Payment Order Creation
```
User clicks "Pay Now"
       ↓
POST /api/payment/create-order
       ↓
┌──────────────────────────────────┐
│ 1. Verify school exists (Main)  │
│ 2. Create Razorpay order         │
│ 3. Store school ID in notes      │
│ 4. Log to Landing Page DB        │
└──────────────────────────────────┘
       ↓
Returns: orderId, amount, keyId
```

### 3. Razorpay Payment UI
```
User → Razorpay Checkout Modal
       ↓
       Enters card: 4111 1111 1111 1111
       ↓
       Razorpay processes payment
       ↓
Returns: paymentId, signature
```

### 4. Payment Verification
```
POST /api/payment/verify
       ↓
┌──────────────────────────────────────────┐
│ 1. Verify Razorpay signature (HMAC)     │
│ 2. Fetch school ID from Landing Page DB │
│    └─ IF FAILS: Fetch from Razorpay     │
│ 3. Activate in Main App DB ✅ CRITICAL  │
│ 4. Update Landing Page DB (optional)    │
└──────────────────────────────────────────┘
       ↓
Success → Redirect to /checkout/success
```

---

## 🛡️ Robust Verification (7 Layers)

### Layer 1: Signature Verification
```javascript
const generatedSignature = HMAC_SHA256(
  orderId + "|" + paymentId,
  RAZORPAY_SECRET
);

if (generatedSignature !== razorpay_signature) {
  ❌ REJECT - Invalid signature
}
```

### Layer 2: School ID Validation
```javascript
// Try Landing Page DB first
schoolId = subscription.metadata.school_id;

// Fallback to Razorpay
if (!schoolId) {
  const order = await razorpay.orders.fetch(orderId);
  schoolId = order.notes.schoolId;
}

if (!schoolId) {
  ❌ REJECT - No school ID found
}
```

### Layer 3: Main App DB Verification
```javascript
const school = await mainAppDB
  .from('schools')
  .select('*')
  .eq('id', schoolId)
  .single();

if (!school) {
  ❌ REJECT - School doesn't exist
}
```

### Layer 4: Amount Verification
```javascript
const expectedAmount = planPrice * studentCount * 100; // paise
const actualAmount = razorpayOrder.amount;

if (expectedAmount !== actualAmount) {
  ⚠️ FLAG - Amount mismatch
}
```

### Layer 5: Duplicate Prevention
```javascript
const existingPayment = await landingDB
  .from('payment_transactions')
  .select('*')
  .eq('razorpay_payment_id', paymentId)
  .single();

if (existingPayment && existingPayment.status === 'paid') {
  ❌ REJECT - Payment already processed
}
```

### Layer 6: IP & Security Logging
```javascript
await landingDB.insert({
  table: 'payment_verification_log',
  data: {
    razorpay_order_id: orderId,
    razorpay_payment_id: paymentId,
    verification_status: 'success',
    signature_verified: true,
    request_ip: req.ip,
    request_user_agent: req.headers['user-agent'],
    verification_timestamp: new Date(),
  }
});
```

### Layer 7: Main App Atomic Update
```javascript
// Transaction-safe update
const result = await mainAppDB
  .from('schools')
  .update({
    subscription_status: 'active',
    student_limit: studentCount,
    razorpay_subscription_id: paymentId,
    monthly_fee: planPrice,
    payment_status: 'active',
    subscription_start_date: NOW(),
    next_billing_date: NOW() + 30 days,
  })
  .eq('id', schoolId)
  .eq('subscription_status', ['inactive', 'trial']); // Prevent overwrite

if (result.count === 0) {
  ❌ ROLLBACK - School not eligible or already active
}
```

---

## 📋 Database Schemas

### Landing Page DB:
```sql
-- Run: landing_page_payment_schema.sql

Tables:
  ✅ subscriptions
  ✅ payment_transactions
  ✅ payment_verification_log
  ✅ trial_activations
  ✅ subscription_sync_log

Purpose: Complete audit trail, analytics, compliance
```

### Main App DB:
```sql
-- Existing schools table + these columns:

ALTER TABLE schools ADD COLUMN subscription_status TEXT;
ALTER TABLE schools ADD COLUMN subscription_plan TEXT;
ALTER TABLE schools ADD COLUMN student_limit INTEGER;
ALTER TABLE schools ADD COLUMN razorpay_subscription_id TEXT;
ALTER TABLE schools ADD COLUMN monthly_fee NUMERIC;
ALTER TABLE schools ADD COLUMN payment_status TEXT;
ALTER TABLE schools ADD COLUMN subscription_start_date TIMESTAMPTZ;
ALTER TABLE schools ADD COLUMN next_billing_date TIMESTAMPTZ;
...

Purpose: Active subscription management, access control
```

---

## 🔐 Environment Variables

```env
# Main App Database (CRITICAL)
MAIN_APP_SUPABASE_URL=https://xxxxx.supabase.co
MAIN_APP_SUPABASE_SERVICE_KEY=eyJhbGci...

# Landing Page Database (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://yyyyy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...

# Razorpay (REQUIRED)
RAZORPAY_KEY_ID=rzp_test_RdWgjPYCBceIHy
RAZORPAY_KEY_SECRET=kSWSRi4nqmub7bMSiusGGKLx
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_RdWgjPYCBceIHy
```

---

## ✅ Success Criteria

### Console Output (Successful Payment):
```
✅ Supabase configured: true
✅ Razorpay order created: order_RdXbF1htqUxizu
✅ Razorpay payment ID: pay_RdXbF1htqUxizu
✅ Payment signature verified successfully
✅ Subscription fetched: sub_xxx School ID: abc-123
✅ Subscription activated in MAIN APP: abc-123
✅ Landing page DB updated successfully
✅ Payment transaction marked as paid
```

### Database Changes:

**Landing Page DB:**
```sql
SELECT * FROM payment_transactions 
WHERE razorpay_payment_id = 'pay_xxx';

-- Result:
status: 'paid'
signature_verified: true
paid_at: 2025-11-09 11:45:00
amount: 3750.00
```

**Main App DB:**
```sql
SELECT subscription_status, student_limit, monthly_fee 
FROM schools WHERE id = 'abc-123';

-- Result:
subscription_status: 'active'
student_limit: 150
monthly_fee: 25.00
```

---

## 🚨 Error Handling

### Scenario 1: Landing Page DB Fails
```
❌ Landing Page DB: TypeError: fetch failed
⚠️  Falling back to Razorpay order notes
✅ Recovered school ID from Razorpay: abc-123
✅ Subscription activated in MAIN APP
⚠️  Landing page transaction NOT logged
```
**Impact:** Low (payment still succeeds, just no audit log)

### Scenario 2: Main App DB Fails
```
✅ Landing Page DB: Payment logged
❌ CRITICAL: Failed to activate in main app
❌ Payment verified but failed to activate subscription
```
**Impact:** CRITICAL (payment taken but subscription not activated)
**Action:** Manual intervention required, refund may be needed

### Scenario 3: Razorpay Signature Invalid
```
❌ Invalid signature for payment: pay_xxx
❌ Payment verification failed - Invalid signature
```
**Impact:** CRITICAL (fraud attempt detected)
**Action:** Payment rejected, logged for security review

---

## 📞 Support Checklist

If payment fails, check:

1. ✅ Razorpay signature valid?
2. ✅ School ID exists in main app?
3. ✅ Landing page DB reachable?
4. ✅ Main app DB reachable?
5. ✅ Environment variables correct?
6. ✅ RLS policies allow service role?
7. ✅ Tables exist in both databases?

---

## 📚 Files Reference

| File | Purpose |
|------|---------|
| `landing_page_payment_schema.sql` | Create landing page tables |
| `LANDING_PAGE_DB_SETUP.md` | Setup guide for landing DB |
| `ENV_SETUP_CHECKLIST.md` | Environment configuration guide |
| `MAIN_APP_INTEGRATION_GUIDE.md` | Main app integration docs |
| `PAYMENT_SYSTEM_OVERVIEW.md` | This file - system overview |

---

**System Status: PRODUCTION READY** 🚀

All three data tiers working together for maximum reliability and security!
