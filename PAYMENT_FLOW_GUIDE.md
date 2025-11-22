# Payment & Trial Flow Guide

## 🎯 Two Separate Flows

### 1. **Free Trial (No Payment Required)** ✅

**URL:** http://localhost:3004/trial

**Process:**
1. User fills out basic info (email, school name, phone)
2. Click "Start Free Trial"
3. API creates trial subscription in database
4. Redirected to success page
5. **No payment required** - user gets 30 days free with up to 75 students

**API Endpoint:** `/api/trial/signup`

**Database Status:** `status: 'trial'`

---

### 2. **Paid Subscription (Payment Required)** 💳

**URL:** http://localhost:3004/checkout

**Process:**
1. User fills out complete school information
2. Selects plan (₹15, ₹25, or ₹500)
3. Chooses number of students
4. Selects billing cycle (monthly/yearly)
5. Click "Proceed to Secure Payment"
6. Razorpay payment modal opens
7. User completes payment
8. Payment verified
9. Subscription activated

**API Endpoints:**
- `/api/payment/create-order` - Creates Razorpay order
- `/api/payment/verify` - Verifies payment signature

**Database Status:** `status: 'active'` (after payment)

---

## 📊 Database Schema

### Subscription Table

```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY,
  user_email TEXT NOT NULL,
  school_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  plan_name TEXT NOT NULL,
  plan_price NUMERIC NOT NULL,
  student_count INTEGER NOT NULL,
  billing_cycle TEXT DEFAULT 'monthly',
  status TEXT,  -- 'trial', 'pending', 'active', 'expired'
  trial_end_date TIMESTAMP,  -- Set for trials only
  subscription_start_date TIMESTAMP,
  next_billing_date TIMESTAMP,
  razorpay_subscription_id TEXT,  -- Only for paid subscriptions
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🔄 User Journey

### Journey A: Free Trial First (Recommended)

```
Homepage → Click "Start Free Trial" → /trial page
         → Fill basic info → Trial activated
         → Use for 30 days → Decide to upgrade
         → /pricing → Select plan → /checkout
         → Complete payment → Active subscription
```

### Journey B: Direct Purchase

```
Homepage → Click pricing → /pricing page
         → Select plan → /checkout
         → Fill details → Complete payment
         → Active subscription (No trial)
```

---

## 🎨 CTA Button Destinations

### Updated Button Links:

| Location | Button | Destination | Action |
|----------|--------|-------------|--------|
| Homepage Hero | "Start Free Trial" | `/trial` | Free trial signup |
| Features Page | "Start Free Trial" | `/trial` | Free trial signup |
| Pricing - ₹15 Plan | "Start Your 30-Day Free Trial" | `/trial` | Free trial signup |
| Pricing - ₹25 Plan | "Start Your 30-Day Free Trial" | `/checkout?plan=catalyst+ai+pro` | Paid subscription |
| Pricing - ₹500 Plan | "Start Your 30-Day Free Trial" | `/checkout?plan=catalyst+ai+extreme` | Paid subscription |
| Trial Banner | "Get Started Free" | `/trial` | Free trial signup |

---

## 💡 Key Differences

### Free Trial
- ✅ No credit card required
- ✅ No payment gateway
- ✅ Up to 75 students only
- ✅ 30 days duration
- ✅ Auto-expires (no automatic billing)
- ✅ Status: `trial`
- ✅ Simple 3-field form

### Paid Subscription
- 💳 Razorpay payment required
- 💳 Full form with address
- 💳 Unlimited student count (configurable)
- 💳 Recurring billing
- 💳 Status: `active`
- 💳 Full checkout form

---

## 🧪 Testing

### Test Free Trial
1. Go to: http://localhost:3004/trial
2. Fill form:
   - Email: test@school.com
   - School: Test School
   - Phone: 9876543210
3. Click "Start Free Trial"
4. Should see success page immediately

### Test Paid Subscription
1. Go to: http://localhost:3004/checkout
2. Fill complete form
3. Select plan and students
4. Click "Proceed to Secure Payment"
5. Use Razorpay test card: `4111 1111 1111 1111`
6. Complete payment
7. Should see payment success page

---

## 📧 Email Notifications (To Implement)

### After Free Trial Signup:
- Welcome email with login credentials
- Trial activation confirmation
- Feature walkthrough
- Reminder 7 days before expiry
- Reminder 1 day before expiry

### After Paid Subscription:
- Payment receipt
- Welcome email with login credentials
- Invoice
- Monthly billing reminders

---

## 🔔 Trial Expiry Handling

When trial expires:
1. User gets notification 7 days before
2. User gets notification 1 day before
3. On expiry date:
   - Status changes from `trial` to `expired`
   - Access restricted
   - Prompt to upgrade shown
   - User can go to `/pricing` to choose plan
   - User goes to `/checkout` with selected plan
   - Complete payment → Status becomes `active`

---

## 📱 Conversion Flow

### Trial → Paid Conversion

```
Trial User → 7 days before expiry
           → Email: "Your trial ends soon"
           → CTA: "Upgrade Now" → /pricing
           → Select plan → /checkout
           → Complete payment
           → Trial converted to paid subscription
```

**Database Update:**
```sql
UPDATE subscriptions 
SET 
  status = 'active',
  plan_name = 'Catalyst AI Pro',
  plan_price = 25,
  student_count = 150,
  billing_cycle = 'monthly',
  subscription_start_date = NOW(),
  next_billing_date = NOW() + INTERVAL '1 month',
  razorpay_subscription_id = 'pay_xxxxx',
  metadata = jsonb_set(metadata, '{converted_from_trial}', 'true')
WHERE id = 'trial_subscription_id';
```

---

## 🎯 Pricing Page Logic

The first plan (₹15) button can go to either:
- **Option A:** `/trial` (for free trial - current implementation)
- **Option B:** `/checkout?plan=catalyst+ai` (for direct purchase)

**Current Setting:** First plan redirects to `/trial`

To change: Edit `components/Pricing.tsx` line 200:
```typescript
href={index === 0 ? `/trial` : `/checkout?plan=${encodeURIComponent(plan.name.toLowerCase())}`}
```

---

## ✅ Completed Updates

- [x] Created `/api/trial/signup` endpoint
- [x] Created `/trial` page (free trial signup)
- [x] Created `/trial/success` page
- [x] Updated `/api/payment/create-order` to create paid subscriptions
- [x] Updated `/api/payment/verify` to activate paid subscriptions (not trials)
- [x] Updated Hero CTA to point to `/trial`
- [x] Updated Pricing page CTAs (first plan → `/trial`, others → `/checkout`)
- [x] Updated checkout page messaging

---

## 🚀 Next Steps (Optional)

1. **Email Integration**
   - Set up SendGrid/Resend for email notifications
   - Create email templates
   - Send welcome emails

2. **Trial Expiry Handler**
   - Create cron job to check expiring trials
   - Send reminder emails
   - Update subscription status

3. **Conversion Tracking**
   - Track trial → paid conversions
   - Analytics on conversion rates
   - A/B test different trial durations

4. **User Dashboard**
   - Show trial days remaining
   - Upgrade button in dashboard
   - Billing history for paid users

---

## 📞 Support

If you have questions about the payment flow, check:
- `RAZORPAY_SETUP.md` - For Razorpay payment configuration
- `SUPABASE_CREDENTIALS_GUIDE.md` - For database setup

For testing without database, the system will work but data won't persist. This is useful for testing the Razorpay integration.
