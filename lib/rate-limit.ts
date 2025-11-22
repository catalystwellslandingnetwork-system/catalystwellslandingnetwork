/**
 * Rate Limiting Implementation
 * SECURITY: Prevents abuse and DDoS attacks
 * 
 * Uses in-memory rate limiting with automatic cleanup.
 */

import { NextRequest } from 'next/server';

// In-memory rate limiter
class InMemoryRateLimiter {
  private requests: Map<string, number[]> = new Map();
  
  async limit(identifier: string, maxRequests: number, windowMs: number): Promise<{
    success: boolean;
    limit: number;
    remaining: number;
    reset: number;
  }> {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    // Get existing requests for this identifier
    let timestamps = this.requests.get(identifier) || [];
    
    // Remove old timestamps outside the window
    timestamps = timestamps.filter(ts => ts > windowStart);
    
    // Check if under limit
    const success = timestamps.length < maxRequests;
    
    if (success) {
      timestamps.push(now);
      this.requests.set(identifier, timestamps);
    }
    
    return {
      success,
      limit: maxRequests,
      remaining: Math.max(0, maxRequests - timestamps.length),
      reset: windowStart + windowMs,
    };
  }
  
  // Clean up old entries periodically
  cleanup() {
    const now = Date.now();
    const maxAge = 3600000; // 1 hour
    
    for (const [key, timestamps] of this.requests.entries()) {
      const filtered = timestamps.filter(ts => now - ts < maxAge);
      if (filtered.length === 0) {
        this.requests.delete(key);
      } else {
        this.requests.set(key, filtered);
      }
    }
  }
}

// Global in-memory limiter instance
const memoryLimiter = new InMemoryRateLimiter();

// Clean up every 5 minutes
setInterval(() => memoryLimiter.cleanup(), 300000);

/**
 * Rate limit configuration per endpoint
 */
export const RATE_LIMITS = {
  'payment-create': {
    maxRequests: 3,
    windowMs: 60 * 1000, // 1 minute
  },
  'payment-verify': {
    maxRequests: 5,
    windowMs: 60 * 1000, // 1 minute
  },
  'school-lookup': {
    maxRequests: 10,
    windowMs: 60 * 1000, // 1 minute
  },
} as const;

export type RateLimitType = keyof typeof RATE_LIMITS;

/**
 * Get client identifier from request
 * Uses IP address as primary identifier
 * 
 * @param req - Next.js request
 * @returns Client identifier string
 */
function getClientIdentifier(req: NextRequest): string {
  // Try to get real IP from various headers
  const forwarded = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');
  const cfConnectingIp = req.headers.get('cf-connecting-ip');
  
  const ip = forwarded?.split(',')[0] || 
             realIp || 
             cfConnectingIp || 
             'unknown';
  
  return ip.trim();
}

/**
 * Check rate limit for a request
 * 
 * @param req - Next.js request object
 * @param limitType - Type of rate limit to apply
 * @returns Rate limit result
 */
export async function checkRateLimit(
  req: NextRequest,
  limitType: RateLimitType
): Promise<{
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}> {
  const identifier = getClientIdentifier(req);
  const config = RATE_LIMITS[limitType];
  
  // Use in-memory rate limiting
  const result = await memoryLimiter.limit(
    `${limitType}:${identifier}`,
    config.maxRequests,
    config.windowMs
  );
  
  if (!result.success) {
    console.warn('Rate limit exceeded:', {
      identifier,
      limitType,
      remaining: result.remaining,
    });
  }
  
  return result;
}

/**
 * Middleware helper to add rate limit headers to response
 * 
 * @param result - Rate limit result
 * @returns Headers object
 */
export function getRateLimitHeaders(result: {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}): Record<string, string> {
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': new Date(result.reset).toISOString(),
    ...(result.success ? {} : { 'Retry-After': Math.ceil((result.reset - Date.now()) / 1000).toString() }),
  };
}

/**
 * Example usage in API route:
 * 
 * export async function POST(req: NextRequest) {
 *   const rateLimit = await checkRateLimit(req, 'paymentCreate');
 *   
 *   if (!rateLimit.success) {
 *     return NextResponse.json(
 *       { error: 'Too many requests. Please try again later.' },
 *       { 
 *         status: 429,
 *         headers: getRateLimitHeaders(rateLimit)
 *       }
 *     );
 *   }
 *   
 *   // Process request...
 * }
 */
