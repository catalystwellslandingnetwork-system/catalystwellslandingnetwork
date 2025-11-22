# Schema and API Fixes Summary

## Problem
The landing page database schema and API code were out of sync, causing errors:
- `school_name` column not found in `subscriptions` and `payment_transactions` tables
- `student_count` column not found in `subscriptions` table
- Invalid UUID error when subscriptionId was a temporary string

## Solution

### 1. **Database Schema Changes** (`landing_page_payment_schema.sql`)

#### Subscriptions Table
- ✅ Uses `school_id` (UUID) as reference to main app
- ✅ Stores `user_email` and `phone` for contact info
- ✅ Stores plan details: `plan_name`, `plan_price`, `billing_cycle`
- ✅ Uses `razorpay_subscription_id` for payment gateway reference
- ✅ Stores school-specific data in `metadata` JSONB field:
  - `student_count`
  - `school_name`
  - `subscription_type`

#### Payment Transactions Table
- ✅ Uses `school_id` (UUID) as reference to main app
- ✅ Uses Razorpay-specific columns: `razorpay_order_id`, `razorpay_payment_id`, `razorpay_signature`
- ✅ Stores customer info: `customer_email`, `customer_phone`
- ✅ Added `retry_count` and `last_retry_at` for failure handling
- ✅ Stores plan-specific data in `metadata` JSONB field:
  - `plan_name`
  - `student_count`
  - `billing_cycle`
  - `school_name`

#### Other Tables
- **Payment Verification Log**: Uses Razorpay-specific columns
- **Trial Activations**: Uses `school_id` reference
- **Subscription Sync Log**: Uses `school_id` reference

### 2. **API Code Changes**

#### `/api/payment/create-order` (`create-order/route.ts`)
**Before:**
```typescript
.insert({
  user_email: email,
  school_name: schoolName,  // ❌ Column doesn't exist
  student_count: studentCount,  // ❌ Column doesn't exist
  ...
})
```

**After:**
```typescript
.insert({
  school_id: schoolId,  // ✅ Reference to main app
  user_email: email,
  phone: phone,
  plan_name: planName,
  plan_price: planPrice,
  billing_cycle: billingCycle || 'monthly',
  status: 'pending',
  razorpay_subscription_id: order.id,
  metadata: {  // ✅ Store extra data in metadata
    razorpay_order_id: order.id,
    subscription_type: 'paid',
    student_count: studentCount,
    school_name: schoolName,
  },
})
```

**Payment Transaction Insert:**
```typescript
.insert({
  subscription_id: subscriptionId,
  school_id: schoolId,  // ✅ Direct reference
  razorpay_order_id: order.id,
  customer_email: email,
  customer_phone: phone,
  amount: planPrice * studentCount,
  currency: 'INR',
  status: 'created',
  ip_address: ip_address,
  user_agent: user_agent,
  metadata: {  // ✅ Store plan details in metadata
    plan_name: planName,
    student_count: studentCount,
    billing_cycle: billingCycle,
    school_name: schoolName,
  },
})
```

**Subscription ID Fix:**
```typescript
// Before
subscriptionId: subscription?.id || `temp_${order.id}`,  // ❌ Caused UUID error

// After
subscriptionId: subscription?.id || null,  // ✅ Returns null if not created
```

#### `/api/payment/verify` (`verify/route.ts`)
**Before:**
```typescript
schoolId = subscriptionData.metadata?.school_id;  // ❌ Wrong location
studentCount: subscription.student_count,  // ❌ Not always available
```

**After:**
```typescript
schoolId = subscriptionData.school_id;  // ✅ Get directly from column
const studentCount = subscription.student_count || 
                    subscription.metadata?.student_count || 
                    100;  // ✅ Fallback to metadata or default
```

**Validation Fix:**
```typescript
// Before
if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !subscriptionId) {
  // ❌ Required subscriptionId even when it might be null

// After
if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
  // ✅ Only validate payment fields, subscriptionId is optional
```

## Key Design Principles

1. **Separation of Concerns**
   - Landing page DB: Stores payment logs and subscription tracking
   - Main app DB: Stores active school data and subscription status
   - Reference: `school_id` links the two databases

2. **Data Redundancy for Safety**
   - Store critical data in multiple places:
     - Razorpay order notes
     - Landing page DB metadata
     - Main app DB columns
   - Fallback mechanism ensures payment always succeeds

3. **Flexible Schema**
   - Use `metadata` JSONB field for variable/optional data
   - Keep core columns for data that's always needed
   - Allows schema evolution without migration

## Testing Checklist

- ✅ Create payment order (with/without landing page DB)
- ✅ Verify payment (with/without landing page DB)
- ✅ Razorpay fallback when landing page DB fails
- ✅ Main app subscription activation (critical path)
- ✅ Payment transaction logging
- ✅ Subscription status updates

## What's Stored Where

### Landing Page Database
- Payment transaction history (audit log)
- Subscription creation/status changes
- Payment verification logs
- Trial activation records
- Sync logs between systems

### Main App Database
- Active school information
- Current subscription status
- User limits and permissions
- Billing information

### Razorpay
- Order details
- Payment status
- Critical subscription data in notes (fallback)

## Benefits

1. **Robust**: Multiple fallback mechanisms
2. **Auditable**: Complete payment history in landing page DB
3. **Maintainable**: Clear separation between tracking and operational data
4. **Scalable**: Metadata fields allow adding new data without schema changes
5. **Secure**: All critical operations validated and logged
