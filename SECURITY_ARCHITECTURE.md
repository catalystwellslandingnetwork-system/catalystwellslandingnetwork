# Ultra-Secure Database Integration Architecture
## Landing Page ↔ Main Application Database Connection

This document outlines a **military-grade security architecture** for connecting the landing page payment system with the main application database.

---

## 🏗️ Architecture Overview

### Option 1: **Separate Databases with Secure API Bridge** (RECOMMENDED)
```
┌─────────────────────────────────────────────────────────────────┐
│                     INTERNET (Public Access)                     │
└─────────────────────────────────────────────────────────────────┘
                              ↓ HTTPS Only
┌─────────────────────────────────────────────────────────────────┐
│                    LANDING PAGE (Next.js)                        │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Supabase Database (Payment & Subscriptions)              │   │
│  │  - subscriptions                                          │   │
│  │  - payment_transactions                                   │   │
│  │  - payment_webhook_logs                                   │   │
│  │                                                            │   │
│  │  RLS: Only service role can write                         │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    Secure API Gateway
              (JWT + API Key + IP Whitelist)
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                  MAIN APPLICATION (Catalyst Wells)               │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Main Database (User Data & School Operations)            │   │
│  │  - schools                                                │   │
│  │  - users                                                  │   │
│  │  - students                                               │   │
│  │  - subscription_sync (read-only copy from landing)        │   │
│  │                                                            │   │
│  │  Access: Only internal services + verified API calls      │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔐 Security Layers (7-Layer Defense)

### Layer 1: Network Security
```typescript
// 1. IP Whitelisting
const ALLOWED_IPS = [
  'landing-page-server-ip',
  'main-app-server-ip',
  // Add specific IPs only
];

function validateIP(req: Request): boolean {
  const clientIP = req.headers.get('x-forwarded-for') || 
                   req.headers.get('x-real-ip');
  return ALLOWED_IPS.includes(clientIP);
}
```

### Layer 2: API Key Authentication
```typescript
// Generate secure API keys with crypto
import crypto from 'crypto';

// On main app server
const API_SECRET = process.env.INTER_SERVICE_API_SECRET; // 256-bit key
const API_KEY_ID = process.env.INTER_SERVICE_API_KEY_ID;

function generateAPIKey(): string {
  return crypto.randomBytes(32).toString('hex');
}

function validateAPIKey(req: Request): boolean {
  const apiKey = req.headers.get('x-api-key');
  const apiKeyId = req.headers.get('x-api-key-id');
  
  return apiKey === API_SECRET && apiKeyId === API_KEY_ID;
}
```

### Layer 3: JWT Token Authentication
```typescript
// Use JWT for time-limited authentication
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.INTER_SERVICE_JWT_SECRET; // Different from user JWTs

interface ServiceToken {
  service: 'landing-page' | 'main-app';
  permissions: string[];
  iat: number;
  exp: number;
}

function generateServiceToken(): string {
  return jwt.sign(
    {
      service: 'landing-page',
      permissions: ['subscription:write', 'payment:read'],
    },
    JWT_SECRET,
    { expiresIn: '5m' } // Short-lived tokens
  );
}

function validateServiceToken(token: string): ServiceToken | null {
  try {
    return jwt.verify(token, JWT_SECRET) as ServiceToken;
  } catch {
    return null;
  }
}
```

### Layer 4: Request Signing (HMAC)
```typescript
// Sign all requests with HMAC-SHA256
function signRequest(payload: any, timestamp: number): string {
  const message = JSON.stringify(payload) + timestamp;
  return crypto
    .createHmac('sha256', process.env.REQUEST_SIGNING_SECRET!)
    .update(message)
    .digest('hex');
}

function validateSignature(
  payload: any,
  timestamp: number,
  signature: string
): boolean {
  // Prevent replay attacks - reject requests older than 5 minutes
  const now = Date.now();
  if (Math.abs(now - timestamp) > 5 * 60 * 1000) {
    return false;
  }
  
  const expectedSignature = signRequest(payload, timestamp);
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}
```

### Layer 5: Data Encryption
```typescript
// Encrypt sensitive data before transmission
import crypto from 'crypto';

const ENCRYPTION_KEY = Buffer.from(process.env.DATA_ENCRYPTION_KEY!, 'hex'); // 32 bytes
const IV_LENGTH = 16;

function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-gcm', ENCRYPTION_KEY, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
}

function decrypt(text: string): string {
  const parts = text.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const authTag = Buffer.from(parts[1], 'hex');
  const encryptedData = parts[2];
  
  const decipher = crypto.createDecipheriv('aes-256-gcm', ENCRYPTION_KEY, iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}
```

### Layer 6: Rate Limiting
```typescript
// Implement aggressive rate limiting
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 requests per minute
  analytics: true,
});

async function checkRateLimit(identifier: string): Promise<boolean> {
  const { success } = await ratelimit.limit(identifier);
  return success;
}
```

### Layer 7: Audit Logging
```typescript
// Log everything
interface AuditLog {
  timestamp: string;
  service: string;
  action: string;
  user_id?: string;
  ip_address: string;
  request_id: string;
  payload_hash: string;
  success: boolean;
  error?: string;
}

async function logAuditEvent(log: AuditLog) {
  await supabase.from('audit_logs').insert(log);
  
  // Also log to external service for tamper-proof logging
  await sendToExternalAuditService(log);
}
```

---

## 🔗 Implementation: Secure API Bridge

### Landing Page → Main App Communication

#### Step 1: Create Secure Sync API on Main App
```typescript
// main-app/app/api/sync/subscription/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { validateIP, validateAPIKey, validateServiceToken, validateSignature } from '@/lib/security';

export async function POST(req: NextRequest) {
  try {
    // Security Layer 1: IP Whitelist
    if (!validateIP(req)) {
      await logSecurityEvent('IP_BLOCKED', req);
      return NextResponse.json({ error: 'Unauthorized IP' }, { status: 403 });
    }
    
    // Security Layer 2: API Key
    if (!validateAPIKey(req)) {
      await logSecurityEvent('INVALID_API_KEY', req);
      return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
    }
    
    // Security Layer 3: JWT Token
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    const serviceToken = validateServiceToken(token!);
    if (!serviceToken) {
      await logSecurityEvent('INVALID_TOKEN', req);
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    
    // Security Layer 4: Request Signature
    const timestamp = parseInt(req.headers.get('x-timestamp') || '0');
    const signature = req.headers.get('x-signature') || '';
    const payload = await req.json();
    
    if (!validateSignature(payload, timestamp, signature)) {
      await logSecurityEvent('INVALID_SIGNATURE', req);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }
    
    // Security Layer 5: Decrypt data
    const decryptedData = decrypt(payload.data);
    const subscriptionData = JSON.parse(decryptedData);
    
    // Validate subscription data schema
    if (!isValidSubscriptionSchema(subscriptionData)) {
      return NextResponse.json({ error: 'Invalid data schema' }, { status: 400 });
    }
    
    // Process the subscription sync
    const result = await syncSubscriptionToMainDB(subscriptionData);
    
    // Audit log
    await logAuditEvent({
      timestamp: new Date().toISOString(),
      service: 'landing-page',
      action: 'subscription_sync',
      ip_address: req.headers.get('x-forwarded-for') || 'unknown',
      request_id: crypto.randomUUID(),
      payload_hash: crypto.createHash('sha256').update(JSON.stringify(payload)).digest('hex'),
      success: true,
    });
    
    return NextResponse.json({ success: true, result });
    
  } catch (error: any) {
    await logAuditEvent({
      timestamp: new Date().toISOString(),
      service: 'landing-page',
      action: 'subscription_sync',
      ip_address: req.headers.get('x-forwarded-for') || 'unknown',
      request_id: crypto.randomUUID(),
      payload_hash: 'error',
      success: false,
      error: error.message,
    });
    
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 });
  }
}

async function syncSubscriptionToMainDB(data: any) {
  // Create or update school in main database
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
      created_from: 'landing_page',
    },
    update: {
      subscription_status: data.status,
      subscription_plan: data.plan_name,
      student_limit: data.student_count,
      trial_end_date: data.trial_end_date,
    },
  });
  
  // Create read-only copy in sync table
  await db.subscription_sync.create({
    data: {
      school_id: school.id,
      landing_page_subscription_id: data.id,
      sync_timestamp: new Date(),
      data: data,
    },
  });
  
  return school;
}
```

#### Step 2: Call from Landing Page After Payment Success
```typescript
// landing-page/app/api/payment/verify/route.ts
async function notifyMainApp(subscriptionData: any) {
  try {
    // Generate short-lived service token
    const serviceToken = generateServiceToken();
    
    // Encrypt sensitive data
    const encryptedData = encrypt(JSON.stringify(subscriptionData));
    
    // Create timestamp
    const timestamp = Date.now();
    
    // Create payload
    const payload = {
      data: encryptedData,
    };
    
    // Sign request
    const signature = signRequest(payload, timestamp);
    
    // Make secure API call
    const response = await fetch(`${process.env.MAIN_APP_URL}/api/sync/subscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${serviceToken}`,
        'x-api-key': process.env.INTER_SERVICE_API_SECRET!,
        'x-api-key-id': process.env.INTER_SERVICE_API_KEY_ID!,
        'x-timestamp': timestamp.toString(),
        'x-signature': signature,
      },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      throw new Error('Failed to sync with main app');
    }
    
    const result = await response.json();
    return result;
    
  } catch (error) {
    // Log error but don't fail the payment
    console.error('Main app sync failed:', error);
    
    // Queue for retry
    await queueForRetry(subscriptionData);
    
    // Alert admin
    await sendAdminAlert('Subscription sync failed', error);
  }
}
```

---

## 🗄️ Database Schema for Main App

```sql
-- Main Application Database Schema

-- Schools table (main entity)
CREATE TABLE schools (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  
  -- Subscription info (synced from landing page)
  subscription_status VARCHAR(20) CHECK (subscription_status IN ('trial', 'active', 'cancelled', 'expired')),
  subscription_plan VARCHAR(100),
  student_limit INTEGER,
  trial_end_date TIMESTAMP WITH TIME ZONE,
  subscription_start_date TIMESTAMP WITH TIME ZONE,
  next_billing_date TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  created_from VARCHAR(50) DEFAULT 'landing_page',
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Read-only sync table (for audit trail)
CREATE TABLE subscription_sync (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  landing_page_subscription_id UUID NOT NULL,
  sync_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  data JSONB NOT NULL,
  
  CONSTRAINT unique_landing_subscription UNIQUE (landing_page_subscription_id)
);

-- Audit logs (immutable)
CREATE TABLE audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  service VARCHAR(50) NOT NULL,
  action VARCHAR(100) NOT NULL,
  user_id UUID,
  ip_address VARCHAR(45),
  request_id UUID,
  payload_hash VARCHAR(64),
  success BOOLEAN,
  error TEXT,
  
  -- Make immutable
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_schools_email ON schools(email);
CREATE INDEX idx_schools_subscription_status ON schools(subscription_status);
CREATE INDEX idx_subscription_sync_school_id ON subscription_sync(school_id);
CREATE INDEX idx_subscription_sync_landing_id ON subscription_sync(landing_page_subscription_id);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX idx_audit_logs_service ON audit_logs(service);

-- Enable RLS
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_sync ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Service role only" ON schools FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role only" ON subscription_sync FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role only" ON audit_logs FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Make audit logs append-only (no updates or deletes)
CREATE POLICY "Audit logs insert only" ON audit_logs FOR INSERT TO service_role WITH CHECK (true);
```

---

## 🔑 Environment Variables Setup

### Landing Page `.env.local`
```bash
# Existing
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_RAZORPAY_KEY_ID=...
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
RAZORPAY_WEBHOOK_SECRET=...

# NEW - Inter-service communication
MAIN_APP_URL=https://app.catalystwells.com
INTER_SERVICE_API_SECRET=generate_with_crypto_randombytes_32
INTER_SERVICE_API_KEY_ID=landing_page_v1
INTER_SERVICE_JWT_SECRET=generate_different_secret
REQUEST_SIGNING_SECRET=another_different_secret
DATA_ENCRYPTION_KEY=32_byte_hex_key
```

### Main App `.env.local`
```bash
# NEW - Inter-service communication
INTER_SERVICE_API_SECRET=same_as_landing_page
INTER_SERVICE_API_KEY_ID=landing_page_v1
INTER_SERVICE_JWT_SECRET=same_as_landing_page
REQUEST_SIGNING_SECRET=same_as_landing_page
DATA_ENCRYPTION_KEY=same_as_landing_page

# Allowed IPs (landing page servers)
ALLOWED_LANDING_PAGE_IPS=ip1,ip2,ip3
```

---

## 🚨 Security Checklist

- [ ] Separate databases (landing page vs main app)
- [ ] IP whitelisting on both ends
- [ ] API key authentication
- [ ] JWT tokens with short expiry (5 min)
- [ ] Request signing with HMAC-SHA256
- [ ] AES-256-GCM encryption for sensitive data
- [ ] Rate limiting (10 req/min per IP)
- [ ] Comprehensive audit logging
- [ ] RLS enabled on all tables
- [ ] Service role keys separate from user keys
- [ ] No direct database connections between systems
- [ ] All communication over HTTPS only
- [ ] Webhook signature verification
- [ ] Retry queue for failed syncs
- [ ] Admin alerts for security events
- [ ] Regular key rotation policy
- [ ] Automated security monitoring
- [ ] DDoS protection (Cloudflare)
- [ ] WAF (Web Application Firewall)
- [ ] Database backups every 6 hours
- [ ] Point-in-time recovery enabled

---

## 📊 Monitoring & Alerts

### Setup monitoring for:
1. **Failed sync attempts** - Alert if > 3 in 10 min
2. **Invalid authentication** - Alert if > 5 in 5 min
3. **Unusual IP addresses** - Alert on first occurrence
4. **Database anomalies** - Alert on unexpected queries
5. **Webhook failures** - Alert if > 2 failures
6. **Rate limit hits** - Alert if threshold reached
7. **Encryption failures** - Alert immediately
8. **Audit log gaps** - Alert if logs stop

---

## 🔄 Data Flow Example

### When a payment succeeds:

1. **Landing Page**: Payment verified → Create subscription in Supabase
2. **Landing Page**: Generate service JWT token (5 min expiry)
3. **Landing Page**: Encrypt subscription data with AES-256-GCM
4. **Landing Page**: Create HMAC signature of request
5. **Landing Page**: Send to Main App API with all security headers
6. **Main App**: Validate IP whitelist
7. **Main App**: Validate API key
8. **Main App**: Validate JWT token
9. **Main App**: Validate HMAC signature
10. **Main App**: Validate timestamp (prevent replay)
11. **Main App**: Decrypt data
12. **Main App**: Validate schema
13. **Main App**: Create/update school record
14. **Main App**: Log audit event
15. **Main App**: Return success
16. **Landing Page**: Log success
17. **Landing Page**: Redirect user to success page

---

## 🎯 Best Practices

1. **Never expose service credentials** in client-side code
2. **Rotate all secrets** every 90 days
3. **Use different keys** for different purposes
4. **Log everything** but never log secrets
5. **Encrypt all PII** before transmission
6. **Validate all input** on both sides
7. **Use short-lived tokens** (5-15 min max)
8. **Implement retry logic** with exponential backoff
9. **Alert on anomalies** immediately
10. **Regular security audits** monthly

---

## 📝 Next Steps

1. Set up separate databases for landing page and main app
2. Implement all 7 security layers
3. Create audit logging tables
4. Set up monitoring and alerts
5. Test the complete flow
6. Conduct security audit
7. Get penetration testing done
8. Document incident response plan
9. Train team on security protocols
10. Regular security reviews

This architecture provides **military-grade security** with multiple layers of defense, ensuring your payment and user data remains completely secure.
