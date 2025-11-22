# Main App Integration Guide

## ✅ System Reconfigured for Direct Main App Database Updates

The landing page now **directly updates** the main app's Supabase database for all subscription-related operations. No sync system needed!

---

## 🔧 Setup Instructions

### 1. Configure Environment Variables

Add these to your `.env.local`:

```env
# Main App Supabase Credentials
MAIN_APP_SUPABASE_URL=https://your-main-app.supabase.co
MAIN_APP_SUPABASE_SERVICE_KEY=your_main_app_service_role_key_here

# Landing Page Supabase (optional - only for payment transaction logs)
NEXT_PUBLIC_SUPABASE_URL=https://your-landing-page.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_landing_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_landing_service_role_key
```

### 2. How It Works

```
User Flow                Landing Page                Main App Database
──────────              ──────────────              ──────────────────

1. User visits          /trial or /checkout
   landing page

2. Enter School ID   →  Lookup school via           Query schools table ✓
                        GET /api/school/{id}

3. Auto-populate     ←  Return school data:         
   school info          - Name, Email, Phone
                        - Address, City, etc.

4. Free Trial:       →  POST /api/trial/signup  →   UPDATE schools ✓
   Click "Start"        - Verify school exists       SET subscription_status = 'trial'
                        - Update directly            SET student_limit = 75
                                                     SET trial_end_date = NOW() + 30 days

5. Paid Subscription:→  POST /api/payment/          UPDATE schools ✓
   Complete Payment     create-order               (pending until payment verified)
                     →  Razorpay Payment
                     →  POST /api/payment/verify  →  UPDATE schools ✓
                        - Verify signature           SET subscription_status = 'active'
                        - Update directly            SET student_limit = {count}
                                                     SET plan_type = 'basic'/'premium'
                                                     SET monthly_fee = {amount}
                                                     SET next_billing_date = {date}
```

---

## 📊 Database Schema (Main App)

Your existing `schools` table structure is used:

### Key Fields Updated:

| Field | Trial | Paid | Notes |
|-------|-------|------|-------|
| `subscription_status` | `'trial'` | `'active'` | Main status field |
| `subscription_plan` | `'Free Trial'` | `'Catalyst AI Pro'` | Plan name |
| `student_limit` | `75` | Varies | Max students allowed |
| `user_limit` | `75` | Varies | Same as student_limit |
| `trial_end_date` | NOW() + 30 | NULL | Set for trials only |
| `subscription_start_date` | NOW() | NOW() | When activated |
| `next_billing_date` | trial_end | NOW() + 1 month | For renewals |
| `razorpay_subscription_id` | NULL | `'pay_xxx'` | Payment reference |
| `plan_type` | `'free'` | `'basic'`/`'premium'` | Based on price |
| `monthly_fee` | `0` | Price | Monthly amount |
| `payment_status` | `'active'` | `'active'` | Payment state |

---

## 🎯 API Endpoints

### 1. **GET `/api/school/[schoolId]`**

Fetches school details from main app database.

**Parameters:**
- `schoolId`: UUID or school code

**Returns:**
```json
{
  "success": true,
  "school": {
    "id": "uuid",
    "name": "ABC School",
    "email": "admin@abc.com",
    "phone": "9876543210",
    "address": "123 Main St",
    "city": "Mumbai",
    "school_code": "SCH001",
    "subscription_status": "active",
    "student_limit": 150
  }
}
```

### 2. **POST `/api/trial/signup`**

Activates free trial for existing school.

**Request:**
```json
{
  "schoolId": "uuid-or-code",
  "studentCount": 75
}
```

**Database Update:**
```sql
UPDATE schools SET
  subscription_status = 'trial',
  subscription_plan = 'Free Trial',
  student_limit = 75,
  user_limit = 75,
  trial_end_date = NOW() + INTERVAL '30 days',
  subscription_start_date = NOW(),
  plan_type = 'free',
  monthly_fee = 0,
  payment_status = 'active'
WHERE id = $1;
```

### 3. **POST `/api/payment/create-order`**

Creates Razorpay order for existing school.

**Request:**
```json
{
  "schoolId": "uuid",
  "planName": "Catalyst AI Pro",
  "planPrice": 25,
  "studentCount": 150,
  "billingCycle": "monthly",
  "address": "...",
  "city": "...",
  "state": "...",
  "pincode": "..."
}
```

**Database:** No update yet (pending payment)

### 4. **POST `/api/payment/verify`**

Verifies payment and activates subscription.

**Database Update:**
```sql
UPDATE schools SET
  subscription_status = 'active',
  subscription_plan = 'Catalyst AI Pro',
  student_limit = 150,
  user_limit = 150,
  subscription_start_date = NOW(),
  next_billing_date = NOW() + INTERVAL '1 month',
  razorpay_subscription_id = 'pay_xxx',
  plan_type = 'basic',  -- or 'premium' based on price
  monthly_fee = 25,
  payment_status = 'active',
  last_payment_date = NOW(),
  trial_end_date = NULL  -- Clear trial when upgrading
WHERE id = $1;
```

---

## 🚫 Validation & Error Handling

### School Must Exist First

Both trial and paid subscription require:
1. User creates account at **app.catalystwells.com**
2. School record exists in `schools` table
3. User gets School ID or School Code
4. User provides ID on landing page

**If school doesn't exist:**
```json
{
  "error": "School not found. Please create your school account at app.catalystwells.com first.",
  "status": 404
}
```

### Already Has Subscription

**If school already has active subscription:**
```json
{
  "error": "School already has an active subscription.",
  "currentStatus": "active",
  "currentPlan": "Catalyst AI Pro",
  "status": 400
}
```

---

## 🔍 School Lookup Logic

The system supports **two lookup methods**:

### 1. By UUID (Full School ID)
```
Example: a1b2c3d4-1234-5678-9abc-def012345678
Pattern: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
Query: SELECT * FROM schools WHERE id = $1
```

### 2. By School Code
```
Example: SCH001, SCHOOL123, etc.
Pattern: Any alphanumeric string
Query: SELECT * FROM schools WHERE UPPER(school_code) = UPPER($1)
```

**Auto-populate triggers:**
- After typing 3+ characters
- On blur (when field loses focus)

---

## 💰 Plan Type Mapping

Based on `planPrice`, we set `plan_type`:

| Price Range | plan_type | Example Plans |
|-------------|-----------|---------------|
| ₹0 | `'free'` | Trial |
| ₹1 - ₹24 | `'basic'` | Catalyst AI (₹15) |
| ₹25 - ₹499 | `'basic'` | Catalyst AI Pro (₹25) |
| ₹500+ | `'premium'` | Catalyst AI Extreme (₹500) |

**Update function in `lib/main-app-supabase.ts`:**
```typescript
let planType = 'basic';
if (planPrice >= 500) {
  planType = 'premium';
} else if (planPrice >= 25) {
  planType = 'basic';
}
```

---

## 🧪 Testing Checklist

### Test Free Trial:
- [ ] Go to http://localhost:3004/trial
- [ ] Create school at app.catalystwells.com first
- [ ] Get School ID from main app
- [ ] Enter School ID on trial page
- [ ] Verify school details auto-populate
- [ ] Click "Start Free Trial"
- [ ] Check main app database:
  ```sql
  SELECT 
    subscription_status,
    subscription_plan,
    student_limit,
    trial_end_date
  FROM schools 
  WHERE id = '{your-school-id}';
  ```
- [ ] Should show: `status='trial'`, `student_limit=75`, `trial_end_date=30 days from now`

### Test Paid Subscription:
- [ ] Go to http://localhost:3004/checkout
- [ ] Enter School ID
- [ ] Verify auto-populate
- [ ] Select plan and student count
- [ ] Complete Razorpay payment (test card: 4111 1111 1111 1111)
- [ ] Check main app database:
  ```sql
  SELECT 
    subscription_status,
    subscription_plan,
    student_limit,
    plan_type,
    monthly_fee,
    razorpay_subscription_id
  FROM schools 
  WHERE id = '{your-school-id}';
  ```
- [ ] Should show: `status='active'`, plan details, payment reference

---

## 🔐 Security

### Service Role Key

The landing page uses **service role key** to bypass RLS:
- Stored in `MAIN_APP_SUPABASE_SERVICE_KEY`
- **Never** exposed to client
- Only used in API routes (server-side)

### Permissions Required

Landing page needs:
- **READ** access to `schools` table (for lookup)
- **UPDATE** access to `schools` table (for subscriptions)

### RLS Policies (Main App)

Ensure these policies exist:

```sql
-- Allow service role to read schools
CREATE POLICY "Service role can read schools"
  ON schools FOR SELECT
  USING (true);

-- Allow service role to update schools
CREATE POLICY "Service role can update schools"
  ON schools FOR UPDATE
  USING (true);
```

---

## 📁 New Files Created

| File | Purpose |
|------|---------|
| `lib/main-app-supabase.ts` | Main app database client and helper functions |
| `app/api/school/[schoolId]/route.ts` | School lookup API endpoint |
| `app/trial/page.tsx` | Updated with school ID lookup |
| `app/checkout/page.tsx` | Updated with school ID lookup |
| `app/api/trial/signup/route.ts` | Updated to require school ID |
| `app/api/payment/create-order/route.ts` | Updated to require school ID |
| `app/api/payment/verify/route.ts` | Updated to activate in main app |

---

## ✅ Summary

**What Changed:**
- ❌ No more sync system
- ✅ Direct database updates
- ✅ School ID required for all operations
- ✅ Main app is source of truth
- ✅ Landing page only updates subscriptions

**User Flow:**
1. Create account on main app
2. Get School ID
3. Use School ID on landing page
4. Landing page updates main database directly

**Advantages:**
- No sync delays
- No data inconsistency
- Simpler architecture
- Real-time updates
- Single source of truth

---

## 📞 Support

For integration help:
- Check `lib/main-app-supabase.ts` for database functions
- Check `MAIN_APP_INTEGRATION_GUIDE.md` (this file)
- Review API routes in `app/api/*`

**Main app must have:**
1. `schools` table with fields listed above
2. RLS policies allowing service role access
3. Valid Supabase URL and service key

---

**System is ready for production! 🚀**
