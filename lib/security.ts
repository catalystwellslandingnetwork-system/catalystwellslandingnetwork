/**
 * Ultra-Secure Inter-Service Communication Library
 * 7-Layer Security Implementation
 */

import crypto from 'crypto';
import jwt from 'jsonwebtoken';

// ============================================
// LAYER 1: IP Whitelisting
// ============================================
export function validateIP(req: Request): boolean {
  const allowedIPs = process.env.ALLOWED_IPS?.split(',') || [];
  const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 
                   req.headers.get('x-real-ip') || 
                   'unknown';
  
  // In development, allow localhost
  if (process.env.NODE_ENV === 'development') {
    return true;
  }
  
  return allowedIPs.includes(clientIP);
}

// ============================================
// LAYER 2: API Key Authentication
// ============================================
export function validateAPIKey(req: Request): boolean {
  const apiKey = req.headers.get('x-api-key');
  const apiKeyId = req.headers.get('x-api-key-id');
  
  const expectedKey = process.env.INTER_SERVICE_API_SECRET;
  const expectedKeyId = process.env.INTER_SERVICE_API_KEY_ID;
  
  if (!apiKey || !apiKeyId || !expectedKey || !expectedKeyId) {
    return false;
  }
  
  // Use timing-safe comparison to prevent timing attacks
  const keyMatch = crypto.timingSafeEqual(
    Buffer.from(apiKey),
    Buffer.from(expectedKey)
  );
  
  const keyIdMatch = crypto.timingSafeEqual(
    Buffer.from(apiKeyId),
    Buffer.from(expectedKeyId)
  );
  
  return keyMatch && keyIdMatch;
}

export function generateSecureAPIKey(): string {
  return crypto.randomBytes(32).toString('hex');
}

// ============================================
// LAYER 3: JWT Service Token
// ============================================
export interface ServiceToken {
  service: 'landing-page' | 'main-app';
  permissions: string[];
  iat: number;
  exp: number;
}

export function generateServiceToken(
  service: 'landing-page' | 'main-app',
  permissions: string[] = ['subscription:write']
): string {
  const secret = process.env.INTER_SERVICE_JWT_SECRET;
  if (!secret) {
    throw new Error('INTER_SERVICE_JWT_SECRET not configured');
  }
  
  return jwt.sign(
    {
      service,
      permissions,
    },
    secret,
    { expiresIn: '5m' } // Short-lived tokens for security
  );
}

export function validateServiceToken(token: string): ServiceToken | null {
  try {
    const secret = process.env.INTER_SERVICE_JWT_SECRET;
    if (!secret) {
      return null;
    }
    
    return jwt.verify(token, secret) as ServiceToken;
  } catch (error) {
    return null;
  }
}

// ============================================
// LAYER 4: Request Signing (HMAC-SHA256)
// ============================================
export function signRequest(payload: any, timestamp: number): string {
  const secret = process.env.REQUEST_SIGNING_SECRET;
  if (!secret) {
    throw new Error('REQUEST_SIGNING_SECRET not configured');
  }
  
  const message = JSON.stringify(payload) + timestamp.toString();
  return crypto
    .createHmac('sha256', secret)
    .update(message)
    .digest('hex');
}

export function validateSignature(
  payload: any,
  timestamp: number,
  signature: string
): boolean {
  // Prevent replay attacks - reject requests older than 5 minutes
  const now = Date.now();
  const age = Math.abs(now - timestamp);
  const maxAge = 5 * 60 * 1000; // 5 minutes
  
  if (age > maxAge) {
    console.error('Request too old:', { age, maxAge, timestamp, now });
    return false;
  }
  
  const expectedSignature = signRequest(payload, timestamp);
  
  // Use timing-safe comparison
  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch (error) {
    return false;
  }
}

// ============================================
// LAYER 5: AES-256-GCM Encryption
// ============================================
const IV_LENGTH = 16;

function getEncryptionKey(): Buffer {
  const key = process.env.DATA_ENCRYPTION_KEY;
  if (!key) {
    throw new Error('DATA_ENCRYPTION_KEY not configured');
  }
  
  // Key must be 32 bytes (256 bits) in hex format
  return Buffer.from(key, 'hex');
}

export function encrypt(text: string): string {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  // Format: iv:authTag:encryptedData
  return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
}

export function decrypt(text: string): string {
  const key = getEncryptionKey();
  const parts = text.split(':');
  
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted data format');
  }
  
  const iv = Buffer.from(parts[0], 'hex');
  const authTag = Buffer.from(parts[1], 'hex');
  const encryptedData = parts[2];
  
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

// ============================================
// LAYER 6: Data Hashing (for audit logs)
// ============================================
export function hashData(data: any): string {
  return crypto
    .createHash('sha256')
    .update(JSON.stringify(data))
    .digest('hex');
}

// ============================================
// LAYER 7: Secure Request Builder
// ============================================
export interface SecureRequestOptions {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  payload?: any;
  service?: 'landing-page' | 'main-app';
  permissions?: string[];
}

export async function makeSecureRequest(options: SecureRequestOptions): Promise<Response> {
  const {
    url,
    method,
    payload = {},
    service = 'landing-page',
    permissions = ['subscription:write'],
  } = options;
  
  // Generate short-lived service token
  const serviceToken = generateServiceToken(service, permissions);
  
  // Encrypt payload
  const encryptedData = encrypt(JSON.stringify(payload));
  
  // Create timestamp
  const timestamp = Date.now();
  
  // Create request body
  const body = {
    data: encryptedData,
  };
  
  // Sign request
  const signature = signRequest(body, timestamp);
  
  // Make request with all security headers
  return fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${serviceToken}`,
      'x-api-key': process.env.INTER_SERVICE_API_SECRET!,
      'x-api-key-id': process.env.INTER_SERVICE_API_KEY_ID!,
      'x-timestamp': timestamp.toString(),
      'x-signature': signature,
    },
    body: JSON.stringify(body),
  });
}

// ============================================
// LAYER 7: Secure Request Validator
// ============================================
export interface ValidationResult {
  valid: boolean;
  error?: string;
  data?: any;
  serviceToken?: ServiceToken;
}

export async function validateSecureRequest(req: Request): Promise<ValidationResult> {
  // Layer 1: IP Whitelist
  if (!validateIP(req)) {
    return { valid: false, error: 'Unauthorized IP address' };
  }
  
  // Layer 2: API Key
  if (!validateAPIKey(req)) {
    return { valid: false, error: 'Invalid API key' };
  }
  
  // Layer 3: JWT Token
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) {
    return { valid: false, error: 'Missing authorization token' };
  }
  
  const serviceToken = validateServiceToken(token);
  if (!serviceToken) {
    return { valid: false, error: 'Invalid or expired token' };
  }
  
  // Layer 4: Request Signature
  const timestamp = parseInt(req.headers.get('x-timestamp') || '0');
  const signature = req.headers.get('x-signature') || '';
  
  let payload;
  try {
    payload = await req.json();
  } catch (error) {
    return { valid: false, error: 'Invalid JSON payload' };
  }
  
  if (!validateSignature(payload, timestamp, signature)) {
    return { valid: false, error: 'Invalid request signature' };
  }
  
  // Layer 5: Decrypt data
  try {
    const decryptedData = decrypt(payload.data);
    const data = JSON.parse(decryptedData);
    
    return {
      valid: true,
      data,
      serviceToken,
    };
  } catch (error: any) {
    return { valid: false, error: 'Failed to decrypt data: ' + error.message };
  }
}

// ============================================
// Utility: Generate all required secrets
// ============================================
export function generateAllSecrets() {
  console.log('=== GENERATE THESE SECRETS FOR .env.local ===\n');
  
  console.log('# Inter-service API credentials');
  console.log(`INTER_SERVICE_API_SECRET=${generateSecureAPIKey()}`);
  console.log(`INTER_SERVICE_API_KEY_ID=landing_page_v1`);
  
  console.log('\n# JWT signing secret (different from API secret)');
  console.log(`INTER_SERVICE_JWT_SECRET=${generateSecureAPIKey()}`);
  
  console.log('\n# Request signing secret (different from above)');
  console.log(`REQUEST_SIGNING_SECRET=${generateSecureAPIKey()}`);
  
  console.log('\n# AES-256 encryption key (32 bytes in hex)');
  console.log(`DATA_ENCRYPTION_KEY=${crypto.randomBytes(32).toString('hex')}`);
  
  console.log('\n=== Copy these to both landing page and main app ===');
  console.log('⚠️  Keep these secrets secure and never commit to git!\n');
}

// Uncomment to generate secrets:
// generateAllSecrets();
