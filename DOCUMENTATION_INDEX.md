# 📚 Documentation Index

## Complete Guide to Landing Page ↔ Main App Integration

---

## 🗂️ Document Overview

### **1. Payment System**
- **`PAYMENT_SYSTEM_OVERVIEW.md`** - High-level architecture and data flow
- **`PAYMENT_UX_ENHANCEMENTS.md`** - Enterprise UX improvements guide
- **`SCHEMA_FIX_SUMMARY.md`** - Schema alignment and fixes

### **2. Database Integration**
- **`MAIN_APP_PAYMENT_UPDATES.md`** ⭐ - Complete guide to main app updates
- **`LANDING_PAGE_MAIN_APP_INTEGRATION.md`** ⭐ - All possible updates & configurations
- **`main_app_payment_schema.sql`** - Main app database setup script
- **`landing_page_payment_schema.sql`** - Landing page database setup script

### **3. Plan Management**
- **`PLAN_FETCHING_GUIDE.md`** ⭐ - Dynamic vs static plans configuration

### **4. Setup Guides**
- **`MAIN_APP_INTEGRATION_GUIDE.md`** - Integration setup instructions
- **`LANDING_PAGE_DB_SETUP.md`** - Landing page database setup
- **`ENV_SETUP_CHECKLIST.md`** - Environment variable configuration

---

## 🎯 Quick Navigation

### **I'm Setting Up for the First Time**
1. Read: `ENV_SETUP_CHECKLIST.md`
2. Run: `main_app_payment_schema.sql` in main app
3. Run: `landing_page_payment_schema.sql` in landing page
4. Read: `MAIN_APP_INTEGRATION_GUIDE.md`

### **I Want to Understand the Payment Flow**
1. Read: `PAYMENT_SYSTEM_OVERVIEW.md`
2. Read: `MAIN_APP_PAYMENT_UPDATES.md` (Field-by-field breakdown)
3. Check: `LANDING_PAGE_MAIN_APP_INTEGRATION.md` (All update types)

### **I Want to Configure Plans**
1. Read: `PLAN_FETCHING_GUIDE.md`
2. Decide: Static vs Dynamic plans
3. If Dynamic: Follow implementation steps

### **I'm Debugging Issues**
1. Check: `SCHEMA_FIX_SUMMARY.md` (Recent fixes)
2. Review: Error handling sections in integration docs
3. Verify: Environment variables in `ENV_SETUP_CHECKLIST.md`

### **I Want to Improve UX**
1. Read: `PAYMENT_UX_ENHANCEMENTS.md`
2. Review: Checkout and success page improvements
3. Check: Enterprise design features

---

## 📋 Document Purposes

| Document | Purpose | For |
|----------|---------|-----|
| **MAIN_APP_PAYMENT_UPDATES.md** | What gets updated in main app | Developers |
| **LANDING_PAGE_MAIN_APP_INTEGRATION.md** | Complete integration guide | Tech Leads |
| **PLAN_FETCHING_GUIDE.md** | Plan configuration | Product Managers |
| **main_app_payment_schema.sql** | Database setup script | DBAs |
| **PAYMENT_UX_ENHANCEMENTS.md** | UI/UX improvements | Designers |
| **ENV_SETUP_CHECKLIST.md** | Environment setup | DevOps |

---

## 🔑 Key Concepts

### **Two Databases**
1. **Main App DB** - Active subscription data, access control
2. **Landing Page DB** - Payment logs, audit trails (optional)

### **13 Fields Updated on Payment**
When payment succeeds, these fields update in main app's `schools` table:
1. subscription_status
2. subscription_plan
3. student_limit
4. user_limit
5. subscription_start_date
6. subscription_end_date
7. next_billing_date
8. razorpay_subscription_id
9. plan_type
10. monthly_fee
11. payment_status
12. last_payment_date
13. trial_end_date (cleared)

### **Three Main API Endpoints**
1. `GET /api/school/[schoolId]` - Fetch school
2. `POST /api/payment/create-order` - Create order
3. `POST /api/payment/verify` - Verify & activate

---

## 🛠️ Common Tasks

### **Add New Plan**
```sql
-- If using database plans
INSERT INTO plans (name, display_name, price_per_student, features, sort_order)
VALUES ('new-plan', 'New Plan', 35.00, '["Feature 1"]'::jsonb, 4);
```

### **Update Pricing**
```sql
-- Dynamic plans
UPDATE plans SET price_per_student = 30.00 WHERE name = 'catalyst-ai-pro';

-- OR edit static plans in app/checkout/page.tsx
```

### **Check Payment Status**
```sql
SELECT id, name, subscription_status, payment_status, next_billing_date
FROM schools
WHERE id = 'school-id';
```

### **Verify Schema Setup**
```sql
-- Check main app has payment columns
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'schools' 
AND column_name LIKE '%subscription%';
```

---

## 🔄 Data Flow Summary

```
User Checkout
     ↓
School Lookup (READ from main app)
     ↓
Create Order (WRITE to landing page + Razorpay)
     ↓
Payment Gateway
     ↓
Verify Payment
     ↓
Update Main App (WRITE 13 fields - CRITICAL)
     ↓
Update Landing Page (WRITE logs - optional)
     ↓
Show Success Page
```

---

## 💡 Best Practices

1. **Always Update Main App First** - It controls access
2. **Landing Page is Optional** - For audit logs only
3. **Use Fallbacks** - Razorpay notes have backup data
4. **Cache Plans** - They don't change often
5. **Log Everything** - Payment errors need investigation
6. **Test Thoroughly** - Use Razorpay test mode

---

## 🆘 Troubleshooting

### **Payment Not Activating**
1. Check `MAIN_APP_PAYMENT_UPDATES.md` → Verification section
2. Verify environment variables
3. Check main app database connection
4. Review API logs

### **School Not Found**
1. Ensure school exists in main app
2. Try both UUID and school_code
3. Check `getSchoolById()` function

### **Plans Not Loading**
1. Check if using static or dynamic
2. Verify `/api/plans` endpoint
3. Review `PLAN_FETCHING_GUIDE.md`

### **Database Errors**
1. Run schema scripts again
2. Check `SCHEMA_FIX_SUMMARY.md`
3. Verify RLS policies

---

## 📞 Support

For issues:
1. Check relevant documentation above
2. Review error logs
3. Verify environment setup
4. Test with Razorpay test mode

---

## 🎓 Learning Path

**Beginner:**
1. ENV_SETUP_CHECKLIST.md
2. PAYMENT_SYSTEM_OVERVIEW.md
3. MAIN_APP_INTEGRATION_GUIDE.md

**Intermediate:**
4. MAIN_APP_PAYMENT_UPDATES.md
5. LANDING_PAGE_MAIN_APP_INTEGRATION.md
6. PLAN_FETCHING_GUIDE.md

**Advanced:**
7. PAYMENT_UX_ENHANCEMENTS.md
8. Custom integrations
9. Webhooks and automation

---

## 📝 Quick Reference

**Environment Variables:**
- `MAIN_APP_SUPABASE_URL` - Main app database
- `MAIN_APP_SUPABASE_SERVICE_KEY` - Service role key
- `RAZORPAY_KEY_ID` - Payment gateway

**Important Files:**
- `lib/main-app-supabase.ts` - Database functions
- `app/api/payment/verify/route.ts` - Payment verification
- `app/checkout/page.tsx` - Checkout UI

**Database Tables:**
- Main App: `schools`, `plans` (optional)
- Landing Page: `subscriptions`, `payment_transactions`, `payment_verification_log`

---

## ✅ Implementation Checklist

- [ ] Environment variables configured
- [ ] Main app schema setup complete
- [ ] Landing page schema setup (optional)
- [ ] School lookup works
- [ ] Payment creation works
- [ ] Payment verification works
- [ ] Main app updates correctly
- [ ] Success page displays
- [ ] Plans configured (static or dynamic)
- [ ] Error handling tested
- [ ] Production deployment ready

---

**Last Updated:** November 9, 2024  
**Version:** 1.0  
**Status:** Production Ready ✅
