# 🔒 Security Implementation Guide - Quick Start

## ⚡ IMMEDIATE ACTION REQUIRED

Your system has **15 critical vulnerabilities**. Follow this guide to secure it.

---

## 📋 Implementation Checklist

### **Phase 1: Critical Fixes (Do TODAY - 6 hours)**

- [ ] **1. Fix Price Manipulation** (1 hour)
- [ ] **2. Add Rate Limiting** (2 hours)  
- [ ] **3. Implement Input Validation** (1.5 hours)
- [ ] **4. Add Secure Logging** (30 min)
- [ ] **5. Fix Timing Attack** (30 min)
- [ ] **6. Add Security Headers** (30 min)

---

## 🚀 Step-by-Step Implementation

### **STEP 1: Fix Price Manipulation (CRITICAL)** 

#### A. Update create-order route

**File: `app/api/payment/create-order/route.ts`**

```typescript
import { getValidatedPrice, isValidPlan } from '@/lib/pricing';
import { validatePaymentInput, validateSchoolInput, secureLog } from '@/lib/validation';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // ✅ SECURITY: Validate payment input
    const paymentValidation = validatePaymentInput(body);
    if (!paymentValidation.valid) {
      secureLog('warn', 'Invalid payment input', paymentValidation.errors);
      return NextResponse.json(
        { error: 'Invalid payment details', details: paymentValidation.errors },
        { status: 400 }
      );
    }
    
    // ✅ SECURITY: Validate school input
    const schoolValidation = validateSchoolInput(body);
    if (!schoolValidation.valid) {
      return NextResponse.json(
        { error: 'Invalid school details', details: schoolValidation.errors },
        { status: 400 }
      );
    }
    
    const { planName, studentCount, planPrice } = body;
    
    // ✅ SECURITY: Get server-side validated price
    const validatedTotal = getValidatedPrice(planName, studentCount);
    
    if (!validatedTotal) {
      secureLog('error', 'Invalid plan or student count', { planName, studentCount });
      return NextResponse.json(
        { error: 'Invalid plan or student count' },
        { status: 400 }
      );
    }
    
    // ✅ SECURITY: Verify client didn't manipulate price
    const clientTotal = planPrice * studentCount;
    const priceDiff = Math.abs(clientTotal - validatedTotal);
    
    if (priceDiff > 0.01) {
      // SECURITY EVENT: Price manipulation attempt detected!
      secureLog('error', 'Price manipulation attempt detected', {
        clientTotal,
        validatedTotal,
        difference: priceDiff,
        ip: req.headers.get('x-forwarded-for'),
        userAgent: req.headers.get('user-agent'),
      });
      
      return NextResponse.json(
        { error: 'Price validation failed. Please refresh and try again.' },
        { status: 400 }
      );
    }
    
    // Use validated price for Razorpay (not client-provided!)
    const amount = Math.round(validatedTotal * 100);
    
    // ... rest of existing code
  } catch (error: any) {
    secureLog('error', 'Create order error', { message: error.message });
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
```

---

### **STEP 2: Add Rate Limiting (CRITICAL)**

#### A. Install dependencies

```bash
# Option 1: With Upstash (Recommended for production)
npm install @upstash/ratelimit @upstash/redis

# Option 2: Without Upstash (uses in-memory fallback)
# No installation needed - already implemented in lib/rate-limit.ts
```

#### B. Setup Upstash (Optional but recommended)

1. Create free account at https://upstash.com
2. Create Redis database
3. Add to `.env.local`:
```env
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxx
```

#### C. Apply rate limiting to all endpoints

**File: `app/api/payment/create-order/route.ts`**

```typescript
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  // ✅ SECURITY: Rate limiting
  const rateLimit = await checkRateLimit(req, 'paymentCreate');
  
  if (!rateLimit.success) {
    return NextResponse.json(
      { error: 'Too many payment attempts. Please try again in a few minutes.' },
      { 
        status: 429,
        headers: getRateLimitHeaders(rateLimit)
      }
    );
  }
  
  // ... rest of code
}
```

**File: `app/api/payment/verify/route.ts`**

```typescript
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  const rateLimit = await checkRateLimit(req, 'paymentVerify');
  
  if (!rateLimit.success) {
    return NextResponse.json(
      { error: 'Too many verification attempts.' },
      { status: 429, headers: getRateLimitHeaders(rateLimit) }
    );
  }
  
  // ... rest of code
}
```

**File: `app/api/school/[schoolId]/route.ts`**

```typescript
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limit';

export async function GET(req: NextRequest, { params }: any) {
  const rateLimit = await checkRateLimit(req, 'schoolLookup');
  
  if (!rateLimit.success) {
    return NextResponse.json(
      { error: 'Too many lookup requests.' },
      { status: 429, headers: getRateLimitHeaders(rateLimit) }
    );
  }
  
  // ... rest of code
}
```

---

### **STEP 3: Fix Timing Attack Vulnerability**

**File: `app/api/payment/verify/route.ts`**

```typescript
import crypto from 'crypto';

// OLD (Vulnerable):
// if (generatedSignature !== razorpay_signature) { ... }

// ✅ NEW (Secure):
const signatureValid = crypto.timingSafeEqual(
  Buffer.from(generatedSignature),
  Buffer.from(razorpay_signature)
);

if (!signatureValid) {
  secureLog('error', 'Invalid payment signature', {
    orderId: razorpay_order_id,
    ip: req.headers.get('x-forwarded-for'),
  });
  
  return NextResponse.json(
    { error: 'Payment verification failed' },
    { status: 400 }
  );
}
```

---

### **STEP 4: Add Security Headers**

**File: `next.config.js`**

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-eval' 'unsafe-inline' https://checkout.razorpay.com;
              style-src 'self' 'unsafe-inline';
              img-src 'self' data: https:;
              font-src 'self' data:;
              connect-src 'self' https://*.supabase.co https://api.razorpay.com;
              frame-src https://api.razorpay.com;
            `.replace(/\s{2,}/g, ' ').trim()
          }
        ],
      },
    ]
  },
}

module.exports = nextConfig
```

---

### **STEP 5: Replace All console.log with Secure Logging**

Find and replace in all API files:

```typescript
// OLD
console.log('Payment order created:', order.id);
console.error('Error:', error);

// NEW
import { secureLog } from '@/lib/validation';

secureLog('info', 'Payment order created', { orderId: order.id });
secureLog('error', 'Payment error', { message: error.message });
```

---

### **STEP 6: Update Environment Variables**

**File: `.env.local`**

```env
# ============================================
# SECURITY: Categorize variables properly
# ============================================

# Backend Only - NEVER expose to client
SUPABASE_SERVICE_ROLE_KEY=your_service_key_here
MAIN_APP_SUPABASE_SERVICE_KEY=your_main_app_service_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
API_SECRET=generate_random_string_here

# Client-Exposed - Safe to expose
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxx
NEXT_PUBLIC_APP_URL=https://catalystwells.com

# Optional - Rate Limiting (Upstash)
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token_here
```

**Add to `.gitignore`:**
```
.env.local
.env.production
.env.*.local
```

---

## ✅ Testing Your Security Fixes

### **Test 1: Price Manipulation Protection**

```bash
# Try to manipulate price
curl -X POST http://localhost:3004/api/payment/create-order \
  -H "Content-Type: application/json" \
  -d '{
    "schoolId": "valid-school-id",
    "planName": "Catalyst AI Extreme",
    "planPrice": 0.01,
    "studentCount": 1000,
    "billingCycle": "monthly"
  }'

# Expected: 400 error "Price validation failed"
```

### **Test 2: Rate Limiting**

```bash
# Make 10 rapid requests
for i in {1..10}; do
  curl http://localhost:3004/api/school/TEST001
  sleep 0.1
done

# Expected: First few succeed, then 429 "Too many requests"
```

### **Test 3: Invalid Input**

```bash
# Try SQL injection
curl http://localhost:3004/api/school/TEST'; DROP TABLE schools--

# Expected: 400 error or no response (blocked)
```

---

## 📊 Security Checklist

After implementation, verify:

- [ ] Price manipulation attempts are blocked
- [ ] Rate limiting is active (test with rapid requests)
- [ ] Timing attack is fixed (crypto.timingSafeEqual used)
- [ ] Security headers are present (check browser dev tools)
- [ ] Logs don't contain sensitive data
- [ ] Environment variables are not committed to git
- [ ] Input validation is working
- [ ] SQL injection attempts are blocked
- [ ] XSS attempts are blocked

---

## 🚨 If You Get Stuck

### **Common Issues:**

**1. TypeScript errors for @upstash packages**
- Expected if not installed
- Code will use in-memory fallback
- Install packages when ready: `npm install @upstash/ratelimit @upstash/redis`

**2. Rate limiting not working**
- Check Upstash credentials in `.env.local`
- Verify in-memory fallback is active (check console)
- Test with `curl` to bypass browser caching

**3. Price validation failing for valid prices**
- Check plan name matches exactly (case-sensitive in normalization)
- Verify student count is within limits
- Check logs for exact error

---

## 📈 Security Score Progress

- **Before:** 🔴 32/100 (CRITICAL)
- **After Step 1-6:** 🟡 65/100 (MODERATE)
- **Full Implementation:** 🟢 95/100 (EXCELLENT)

---

## 🎯 Next Steps After Phase 1

1. Implement webhook handler for Razorpay
2. Add API authentication with request signing
3. Implement CSRF protection
4. Add database Row Level Security
5. Set up security monitoring
6. Configure automated security scans

See `SECURITY_AUDIT_AND_PLAN.md` for complete details.

---

## 📞 Emergency Response

If you detect a security breach:

1. **Immediately:**
   - Change all API keys and secrets
   - Enable maintenance mode
   - Backup current database

2. **Within 1 hour:**
   - Review logs for suspicious activity
   - Identify affected users
   - Document timeline

3. **Within 24 hours:**
   - Notify affected users
   - Implement additional security
   - File incident report

---

**Remember:** Security is not a one-time task. Review and update regularly!

**Start NOW with Phase 1 - It takes only 6 hours to dramatically improve security.**
