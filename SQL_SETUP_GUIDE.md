# 📊 SQL Setup Guide - Quick Reference

## 🎯 Overview

You have **2 SQL files** to run in **2 different databases**:

```
Landing Page Database (Supabase)  →  01_LANDING_PAGE_DATABASE.sql
Main App Database                 →  02_MAIN_APP_DATABASE.sql
```

---

## 📝 File 1: Landing Page Database

**File:** `01_LANDING_PAGE_DATABASE.sql`  
**Run in:** Your **Landing Page Supabase** SQL Editor  
**Purpose:** Payment processing & subscription tracking

### What it creates:

✅ **Payment Tables:**
- `subscriptions` - All subscription records
- `payment_transactions` - Payment history with Razorpay
- `payment_webhook_logs` - Razorpay webhook events

✅ **Sync Tables:**
- `sync_retry_queue` - Failed syncs to retry
- `sync_audit_logs` - Sync history
- `admin_alerts` - Admin notifications

✅ **Security:**
- Row Level Security (RLS) enabled
- Service role policies
- Indexes for performance

✅ **Views:**
- `active_subscriptions`
- `payment_summary`
- `failed_syncs`

### How to run:

1. Go to your **Supabase** project dashboard
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy entire contents of `01_LANDING_PAGE_DATABASE.sql`
5. Paste and click **Run**
6. Verify: `SELECT * FROM subscriptions LIMIT 1;`

---

## 📝 File 2: Main Application Database

**File:** `02_MAIN_APP_DATABASE.sql`  
**Run in:** Your **Main Application Database** SQL Editor  
**Purpose:** School & user management

### What it creates:

✅ **Core Tables:**
- `schools` - School profiles with subscription info
- `users` - User accounts (admin, teacher, parent, student)
- `subscription_sync` - Read-only copy from landing page

✅ **Security Tables:**
- `audit_logs` - Immutable audit trail
- `security_logs` - Security events

✅ **Security:**
- Row Level Security (RLS) enabled
- Multi-level access policies
- Audit logging

✅ **Views:**
- `active_schools`
- `trial_schools_ending_soon`
- `recent_security_events`

### How to run:

1. Go to your **Main App Database** dashboard
2. Open SQL Editor
3. Copy entire contents of `02_MAIN_APP_DATABASE.sql`
4. Paste and click **Run**
5. Verify: `SELECT * FROM schools LIMIT 1;`

---

## ⚡ Quick Start Checklist

- [ ] Run `01_LANDING_PAGE_DATABASE.sql` in Landing Page Supabase
- [ ] Run `02_MAIN_APP_DATABASE.sql` in Main App Database
- [ ] Generate security secrets (see QUICK_START_SECURITY.md)
- [ ] Configure `.env.local` with all variables
- [ ] Run `npm install`
- [ ] Restart dev server
- [ ] Test payment flow

---

## 🔍 Verification Commands

### Landing Page Database
```sql
-- Check tables created
SELECT tablename FROM pg_tables 
WHERE schemaname = 'public' 
AND (tablename LIKE '%subscript%' OR tablename LIKE '%payment%' OR tablename LIKE '%sync%');

-- Check RLS enabled
SELECT tablename, rowsecurity FROM pg_tables 
WHERE schemaname = 'public' AND rowsecurity = true;

-- Check views
SELECT * FROM active_subscriptions;
SELECT * FROM payment_summary;
SELECT * FROM failed_syncs;
```

### Main App Database
```sql
-- Check tables created
SELECT tablename FROM pg_tables 
WHERE schemaname = 'public';

-- Check views
SELECT * FROM active_schools;
SELECT * FROM trial_schools_ending_soon;
SELECT * FROM recent_security_events;
```

---

## 🎯 What Happens After Setup

1. **Payment Flow:**
   - User pays on landing page
   - Data saved to `subscriptions` table
   - Transaction logged to `payment_transactions`

2. **Sync to Main App:**
   - Payment verified
   - Data encrypted with 7-layer security
   - Sent to main app
   - School created/updated in `schools` table
   - Copy saved to `subscription_sync` table

3. **If Sync Fails:**
   - Added to `sync_retry_queue`
   - Automatic retry with exponential backoff
   - Admin alert created

---

## 📚 Related Files

- **SECURITY_ARCHITECTURE.md** - Complete security documentation
- **PAYMENT_SETUP.md** - Payment integration guide
- **QUICK_START_SECURITY.md** - Quick setup instructions

---

## 🆘 Troubleshooting

### Error: "relation already exists"
The table already exists. This is fine - the script uses `IF NOT EXISTS`.

### Error: "permission denied"
You need to be using the service_role key or have admin access.

### Tables not showing in dashboard
Refresh the page or check the SQL editor output for errors.

### RLS blocking queries
Use the service_role key for backend operations, not the anon key.

---

## ✅ Success Indicators

After running both SQL files, you should see:

**Landing Page Database:**
- 9 tables created
- 15+ indexes created  
- 3 views created
- RLS enabled on all tables

**Main App Database:**
- 5 tables created
- 12+ indexes created
- 3 views created
- RLS enabled on all tables

---

**Next:** Follow QUICK_START_SECURITY.md for environment setup!
