# 🚀 Main App Integration Prompt

Copy and paste this entire prompt to integrate the landing page payment system with your main application.

---

## PROMPT START

I need to integrate a secure payment system from my landing page into my main application. The landing page handles Razorpay payments and needs to sync subscription data to the main app using a 7-layer security architecture.

### Context
- **Landing page** handles payments via Razorpay
- **Main app** manages schools, users, and daily operations
- Data must sync from landing page to main app after successful payment
- Security is critical - we're using a 7-layer defense system

### What I Need You to Build

#### 1. Setup Database Tables

Run this SQL in the main app database (Supabase/PostgreSQL):

```sql
-- File: 02_MAIN_APP_DATABASE.sql (provided separately)
-- This creates: schools, users, subscription_sync, audit_logs, security_logs tables
-- Plus all indexes, RLS policies, and views
```

#### 2. Install Required Dependencies

```bash
npm install jsonwebtoken @types/jsonwebtoken
```

#### 3. Create Security Library

**File:** `lib/security.ts`

Copy the security library from the landing page. It contains:
- IP whitelisting validation
- API key authentication
- JWT token generation/validation
- HMAC request signing
- AES-256-GCM encryption/decryption
- Secure request validation (all 7 layers)

Key functions needed:
- `validateIP(req)` - Layer 1: IP whitelist
- `validateAPIKey(req)` - Layer 2: API key auth
- `validateServiceToken(token)` - Layer 3: JWT validation
- `validateSignature(payload, timestamp, signature)` - Layer 4: HMAC
- `decrypt(encryptedData)` - Layer 5: Decryption
- `validateSecureRequest(req)` - Validates all 7 layers at once

#### 4. Create Sync API Endpoint

**File:** `app/api/sync/subscription/route.ts`

This endpoint receives encrypted subscription data from the landing page after successful payment.

**Requirements:**
1. Validate all 7 security layers using `validateSecureRequest()`
2. Decrypt the subscription data
3. Validate the data schema
4. Create or update school record in database
5. Create subscription_sync record for audit trail
6. Log to audit_logs
7. Return success response

**Expected Request Format:**
```typescript
POST /api/sync/subscription
Headers:
  Authorization: Bearer <JWT-token>
  x-api-key: <api-secret>
  x-api-key-id: landing_page_v1
  x-timestamp: <unix-timestamp>
  x-signature: <hmac-sha256-signature>
Body:
  {
    data: "<encrypted-json-string>"
  }
```

**Decrypted Data Schema:**
```typescript
{
  id: string;                      // UUID from landing page
  user_email: string;              // School email
  school_name: string;             // School name
  phone: string;                   // Contact number
  plan_name: string;               // e.g., "Catalyst AI Pro"
  plan_price: number;              // Price per student
  student_count: number;           // Number of students
  billing_cycle: string;           // "monthly" or "yearly"
  status: string;                  // "trial", "active", etc.
  trial_end_date: string;          // ISO timestamp
  subscription_start_date: string; // ISO timestamp
  next_billing_date: string;       // ISO timestamp
  razorpay_subscription_id?: string;
  metadata?: any;
}
```

**Success Response:**
```typescript
{
  success: true,
  school_id: string
}
```

**Error Responses:**
```typescript
// 401 Unauthorized
{ error: "Unauthorized IP address" }
{ error: "Invalid API key" }
{ error: "Invalid or expired token" }
{ error: "Invalid request signature" }

// 400 Bad Request
{ error: "Invalid data schema" }

// 500 Internal Server Error
{ error: "Failed to create school" }
```

#### 5. Database Operations

When syncing subscription data, perform these operations:

**Create/Update School:**
```typescript
// Upsert school record
const school = await db.schools.upsert({
  where: { email: data.user_email },
  create: {
    email: data.user_email,
    name: data.school_name,
    phone: data.phone,
    subscription_status: data.status,
    subscription_plan: data.plan_name,
    student_limit: data.student_count,
    trial_end_date: data.trial_end_date,
    subscription_start_date: data.subscription_start_date,
    next_billing_date: data.next_billing_date,
    created_from: 'landing_page',
    is_verified: false,
    is_active: true,
  },
  update: {
    subscription_status: data.status,
    subscription_plan: data.plan_name,
    student_limit: data.student_count,
    trial_end_date: data.trial_end_date,
    subscription_start_date: data.subscription_start_date,
    next_billing_date: data.next_billing_date,
  },
});
```

**Create Sync Record:**
```typescript
await db.subscription_sync.create({
  data: {
    school_id: school.id,
    landing_page_subscription_id: data.id,
    data: data, // Full JSONB data
    sync_timestamp: new Date(),
    sync_source: 'landing_page',
  },
});
```

**Create Audit Log:**
```typescript
await db.audit_logs.create({
  data: {
    timestamp: new Date(),
    service: 'landing-page',
    action: 'subscription_sync',
    school_id: school.id,
    ip_address: req.headers.get('x-forwarded-for'),
    request_id: crypto.randomUUID(),
    payload_hash: crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex'),
    success: true,
  },
});
```

#### 6. Configure Environment Variables

Add to `.env.local`:

```bash
# Inter-service Communication (same as landing page)
INTER_SERVICE_API_SECRET=<64-char-hex-from-landing-page>
INTER_SERVICE_API_KEY_ID=landing_page_v1
INTER_SERVICE_JWT_SECRET=<64-char-hex-from-landing-page>
REQUEST_SIGNING_SECRET=<64-char-hex-from-landing-page>
DATA_ENCRYPTION_KEY=<64-char-hex-from-landing-page>

# IP Whitelisting
ALLOWED_LANDING_PAGE_IPS=<landing-page-server-ip>

# Database (if using Supabase)
NEXT_PUBLIC_SUPABASE_URL=<your-main-app-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
```

**CRITICAL:** Use the **EXACT SAME** security secrets as the landing page!

#### 7. Error Handling & Logging

All errors must be:
1. Logged to `security_logs` if security-related
2. Logged to `audit_logs` with success=false
3. Never expose internal details in response
4. Return generic error messages to client

**Security Event Logging:**
```typescript
async function logSecurityEvent(eventType: string, req: Request) {
  await db.security_logs.create({
    data: {
      event_type: eventType,
      severity: 'high',
      ip_address: req.headers.get('x-forwarded-for'),
      user_agent: req.headers.get('user-agent'),
      service: 'landing-page',
      description: `Failed sync attempt: ${eventType}`,
      resolved: false,
    },
  });
}
```

#### 8. Testing

**Test the sync endpoint:**

1. From landing page, after successful payment, the sync should automatically trigger
2. Check main app database for new school record
3. Verify subscription_sync table has the data
4. Check audit_logs for successful sync entry

**Manual test with curl:**
```bash
# This will fail security validation, but tests endpoint availability
curl -X POST http://localhost:3000/api/sync/subscription \
  -H "Content-Type: application/json" \
  -d '{"data":"test"}'

# Expected: 401 error (security validation failed)
```

#### 9. Security Checklist

- [ ] All 7 security layers implemented
- [ ] Environment variables configured
- [ ] Same secrets as landing page
- [ ] IP whitelist configured
- [ ] RLS enabled on all tables
- [ ] Audit logging working
- [ ] Error logging to security_logs
- [ ] No sensitive data in responses
- [ ] HTTPS only in production
- [ ] Service role key separate from anon key

#### 10. Production Deployment

Before going live:
1. Test complete payment → sync flow end-to-end
2. Verify all security layers work
3. Test with production Razorpay keys
4. Setup monitoring/alerts for failed syncs
5. Configure actual server IPs in whitelist
6. Enable rate limiting
7. Setup automated backups
8. Review all RLS policies

### File Structure

```
main-app/
├── app/
│   └── api/
│       └── sync/
│           └── subscription/
│               └── route.ts          (NEW - sync endpoint)
├── lib/
│   └── security.ts                   (NEW - copy from landing page)
├── .env.local                        (UPDATE - add security vars)
└── SQL already run in database
```

### Success Criteria

✅ Sync endpoint responds to requests  
✅ All 7 security layers validate correctly  
✅ School records created/updated successfully  
✅ Subscription_sync table populated  
✅ Audit logs created for all operations  
✅ Failed security attempts logged  
✅ No errors in production logs  
✅ End-to-end payment flow works  

### Additional Notes

- The landing page will retry failed syncs automatically (up to 5 times with exponential backoff)
- Sync is non-blocking - payment succeeds even if sync fails temporarily
- All data is encrypted in transit using AES-256-GCM
- JWT tokens expire in 5 minutes for security
- Request signatures prevent replay attacks (5-min window)
- IP whitelist prevents unauthorized access
- All operations are logged for compliance and debugging

### Support Files Provided

1. `02_MAIN_APP_DATABASE.sql` - Complete database schema
2. `lib/security.ts` from landing page - All security utilities
3. This integration guide

## PROMPT END

---

## 📋 Summary for Developer

**You need to:**
1. Run `02_MAIN_APP_DATABASE.sql` in your database
2. Copy `lib/security.ts` from landing page to main app
3. Install `jsonwebtoken` package
4. Create `/api/sync/subscription` endpoint
5. Configure environment variables (same secrets as landing page)
6. Test the complete flow

**The endpoint must:**
- Validate 7 security layers
- Decrypt incoming data
- Create/update school record
- Log everything to audit trail
- Handle errors gracefully
- Never expose secrets or internal details

**Security is paramount** - all 7 layers must be implemented correctly.
