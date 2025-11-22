/**
 * Input Validation and Sanitization
 * SECURITY: Validates and sanitizes all user inputs
 */

/**
 * Sanitize string input by removing dangerous characters
 */
export function sanitizeString(input: string, maxLength: number = 500): string {
  if (typeof input !== 'string') return '';
  
  // Remove control characters and trim
  let sanitized = input
    .replace(/[\x00-\x1F\x7F]/g, '')  // Remove control characters
    .trim();
  
  // Limit length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }
  
  return sanitized;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  
  // RFC 5322 compliant email regex (simplified)
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  return emailRegex.test(email) && email.length <= 254;
}

/**
 * Validate Indian phone number
 */
export function isValidIndianPhone(phone: string): boolean {
  if (!phone || typeof phone !== 'string') return false;
  
  // Remove spaces and hyphens
  const cleaned = phone.replace(/[\s-]/g, '');
  
  // Indian mobile: starts with 6-9, followed by 9 digits
  const phoneRegex = /^[6-9]\d{9}$/;
  
  return phoneRegex.test(cleaned);
}

/**
 * Validate UUID format
 */
export function isValidUUID(uuid: string): boolean {
  if (!uuid || typeof uuid !== 'string') return false;
  
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  
  return uuidRegex.test(uuid);
}

/**
 * Validate Indian pincode
 */
export function isValidPincode(pincode: string): boolean {
  if (!pincode || typeof pincode !== 'string') return false;
  
  const pincodeRegex = /^\d{6}$/;
  
  return pincodeRegex.test(pincode);
}

/**
 * Validate student count
 */
export function isValidStudentCount(count: number, min: number = 1, max: number = 50000): boolean {
  return (
    typeof count === 'number' &&
    Number.isInteger(count) &&
    count >= min &&
    count <= max
  );
}

/**
 * Validate city name
 */
export function isValidCityName(city: string): boolean {
  if (!city || typeof city !== 'string') return false;
  
  const sanitized = sanitizeString(city, 100);
  
  // Only letters, spaces, and hyphens allowed
  const cityRegex = /^[a-zA-Z\s-]+$/;
  
  return cityRegex.test(sanitized) && sanitized.length >= 2;
}

/**
 * Validate school input data
 */
export interface SchoolValidationResult {
  valid: boolean;
  errors: Record<string, string>;
  sanitized: Record<string, any>;
}

export function validateSchoolInput(data: any): SchoolValidationResult {
  const errors: Record<string, string> = {};
  const sanitized: Record<string, any> = {};
  
  // Validate schoolId
  if (!data.schoolId || typeof data.schoolId !== 'string') {
    errors.schoolId = 'School ID is required';
  } else {
    const schoolId = sanitizeString(data.schoolId, 100);
    sanitized.schoolId = schoolId;
    
    // Should be UUID or alphanumeric code
    if (!isValidUUID(schoolId) && !/^[A-Z0-9]{3,20}$/.test(schoolId)) {
      errors.schoolId = 'Invalid School ID format';
    }
  }
  
  // Validate address
  if (data.address) {
    const address = sanitizeString(data.address, 500);
    sanitized.address = address;
    
    if (address.length < 5) {
      errors.address = 'Address is too short';
    }
  }
  
  // Validate city
  if (data.city) {
    const city = sanitizeString(data.city, 100);
    sanitized.city = city;
    
    if (!isValidCityName(city)) {
      errors.city = 'Invalid city name';
    }
  }
  
  // Validate state
  if (data.state) {
    const state = sanitizeString(data.state, 100);
    sanitized.state = state;
    
    if (!isValidCityName(state)) {
      errors.state = 'Invalid state name';
    }
  }
  
  // Validate pincode
  if (data.pincode) {
    const pincode = sanitizeString(data.pincode, 6);
    sanitized.pincode = pincode;
    
    if (!isValidPincode(pincode)) {
      errors.pincode = 'Invalid pincode (must be 6 digits)';
    }
  }
  
  // Validate GST (optional)
  if (data.gst) {
    const gst = sanitizeString(data.gst, 15);
    sanitized.gst = gst;
    
    // Indian GST format: 2 digits + 10 alphanumeric + 1 letter + 1 digit + 1 letter + 1 digit
    const gstRegex = /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/;
    
    if (gst && !gstRegex.test(gst)) {
      errors.gst = 'Invalid GST number format';
    }
  }
  
  return {
    valid: Object.keys(errors).length === 0,
    errors,
    sanitized,
  };
}

/**
 * Validate payment input data
 */
export interface PaymentValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

export function validatePaymentInput(data: any): PaymentValidationResult {
  const errors: Record<string, string> = {};
  
  // Validate plan name
  const validPlans = ['Catalyst AI', 'Catalyst AI Pro', 'Catalyst AI Extreme'];
  if (!data.planName || !validPlans.includes(data.planName)) {
    errors.planName = 'Invalid plan selected';
  }
  
  // Validate student count
  if (!isValidStudentCount(data.studentCount)) {
    errors.studentCount = 'Invalid student count (must be between 1 and 50000)';
  }
  
  // Validate billing cycle
  if (!data.billingCycle || !['monthly', 'yearly'].includes(data.billingCycle)) {
    errors.billingCycle = 'Invalid billing cycle';
  }
  
  // Validate price (must be a positive number)
  if (typeof data.planPrice !== 'number' || data.planPrice <= 0) {
    errors.planPrice = 'Invalid plan price';
  }
  
  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validate Razorpay payment response
 */
export function validateRazorpayResponse(data: any): PaymentValidationResult {
  const errors: Record<string, string> = {};
  
  if (!data.razorpay_order_id || typeof data.razorpay_order_id !== 'string') {
    errors.razorpay_order_id = 'Missing or invalid order ID';
  }
  
  if (!data.razorpay_payment_id || typeof data.razorpay_payment_id !== 'string') {
    errors.razorpay_payment_id = 'Missing or invalid payment ID';
  }
  
  if (!data.razorpay_signature || typeof data.razorpay_signature !== 'string') {
    errors.razorpay_signature = 'Missing or invalid signature';
  }
  
  // Validate format (Razorpay IDs start with specific prefixes)
  if (data.razorpay_order_id && !data.razorpay_order_id.startsWith('order_')) {
    errors.razorpay_order_id = 'Invalid order ID format';
  }
  
  if (data.razorpay_payment_id && !data.razorpay_payment_id.startsWith('pay_')) {
    errors.razorpay_payment_id = 'Invalid payment ID format';
  }
  
  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Secure logging - redact sensitive information
 */
export function secureLog(level: 'info' | 'warn' | 'error', message: string, data?: any) {
  const sensitiveFields = [
    'password',
    'token',
    'secret',
    'key',
    'signature',
    'razorpay_signature',
    'razorpay_key_secret',
    'api_key',
    'service_role_key',
  ];
  
  let sanitized = { ...data };
  
  if (sanitized) {
    // Redact sensitive fields
    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    }
    
    // Partially redact emails and phones
    if (sanitized.email && typeof sanitized.email === 'string') {
      const [local, domain] = sanitized.email.split('@');
      sanitized.email = `${local.substring(0, 2)}***@${domain}`;
    }
    
    if (sanitized.phone && typeof sanitized.phone === 'string') {
      sanitized.phone = `***${sanitized.phone.slice(-4)}`;
    }
    
    // Truncate long strings
    for (const key in sanitized) {
      if (typeof sanitized[key] === 'string' && sanitized[key].length > 100) {
        sanitized[key] = sanitized[key].substring(0, 100) + '...';
      }
    }
  }
  
  const timestamp = new Date().toISOString();
  console[level](`[${timestamp}] [${level.toUpperCase()}]`, message, sanitized);
}

/**
 * Check if string contains SQL injection attempts
 */
export function containsSQLInjection(input: string): boolean {
  if (!input || typeof input !== 'string') return false;
  
  // Common SQL injection patterns
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/i,
    /(--|;|\/\*|\*\/)/,
    /(\bOR\b.*=.*)/i,
    /(\bAND\b.*=.*)/i,
    /(union.*select)/i,
  ];
  
  return sqlPatterns.some(pattern => pattern.test(input));
}

/**
 * Check if string contains XSS attempts
 */
export function containsXSS(input: string): boolean {
  if (!input || typeof input !== 'string') return false;
  
  // Common XSS patterns
  const xssPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,  // Event handlers like onclick=
    /<iframe/gi,
    /<object/gi,
    /<embed/gi,
  ];
  
  return xssPatterns.some(pattern => pattern.test(input));
}

/**
 * Comprehensive input validation
 */
export function isSafeInput(input: string): boolean {
  return !containsSQLInjection(input) && !containsXSS(input);
}
