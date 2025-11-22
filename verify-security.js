#!/usr/bin/env node

/**
 * Security Verification Script
 * Verifies that all security implementations are in place
 * Usage: node verify-security.js
 */

const fs = require('fs');
const path = require('path');

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
};

function log(message, type = 'info') {
  const colorMap = {
    error: colors.red,
    success: colors.green,
    warning: colors.yellow,
    info: colors.blue,
  };
  console.log(`${colorMap[type] || ''}${message}${colors.reset}`);
}

// Check if a file exists and contains specific content
function checkFileContent(filePath, searchStrings, description) {
  try {
    const fullPath = path.join(__dirname, filePath);
    if (!fs.existsSync(fullPath)) {
      log(`❌ ${description} - File not found: ${filePath}`, 'error');
      return false;
    }
    
    const content = fs.readFileSync(fullPath, 'utf8');
    const missing = [];
    
    for (const str of searchStrings) {
      if (!content.includes(str)) {
        missing.push(str);
      }
    }
    
    if (missing.length === 0) {
      log(`✅ ${description}`, 'success');
      return true;
    } else {
      log(`❌ ${description} - Missing implementations`, 'error');
      missing.forEach(str => log(`   Missing: "${str.substring(0, 50)}..."`, 'warning'));
      return false;
    }
  } catch (error) {
    log(`❌ ${description} - Error: ${error.message}`, 'error');
    return false;
  }
}

// Security checks
const securityChecks = [
  {
    name: 'Price Validation Library',
    file: 'lib/pricing.ts',
    checks: ['getValidatedPrice', 'PRICING_PLANS', 'isValidPlan'],
  },
  {
    name: 'Rate Limiting Implementation',
    file: 'lib/rate-limit.ts',
    checks: ['checkRateLimit', 'getRateLimitHeaders', 'RATE_LIMITS'],
  },
  {
    name: 'Input Validation Library',
    file: 'lib/validation.ts',
    checks: ['validatePaymentInput', 'validateSchoolInput', 'secureLog', 'sanitizeString'],
  },
  {
    name: 'Payment Create Route Security',
    file: 'app/api/payment/create-order/route.ts',
    checks: [
      'getValidatedPrice',
      'validatePaymentInput',
      'checkRateLimit',
      'secureLog',
      'Price manipulation attempt detected'
    ],
  },
  {
    name: 'Payment Verify Route Security',
    file: 'app/api/payment/verify/route.ts',
    checks: [
      'checkRateLimit',
      'validateRazorpayResponse',
      'crypto.timingSafeEqual',
      'secureLog'
    ],
  },
  {
    name: 'School Route Security',
    file: 'app/api/school/[schoolId]/route.ts',
    checks: ['checkRateLimit', 'secureLog'],
  },
  {
    name: 'Security Headers in Next.js Config',
    file: 'next.config.js',
    checks: [
      'Strict-Transport-Security',
      'X-Frame-Options',
      'X-Content-Type-Options',
      'Content-Security-Policy',
      'Permissions-Policy'
    ],
  },
  {
    name: 'Git Security (.gitignore)',
    file: '.gitignore',
    checks: ['.env', '.env*.local', '.env.production', '*.key', '*.pem'],
  },
];

// Run all checks
function runSecurityVerification() {
  log('\n========================================', 'info');
  log('🔒 SECURITY IMPLEMENTATION VERIFICATION', 'info');
  log('========================================', 'info');
  
  let passed = 0;
  let failed = 0;
  
  for (const check of securityChecks) {
    log(`\n🔍 Checking: ${check.name}`, 'info');
    const result = checkFileContent(check.file, check.checks, check.name);
    if (result) {
      passed++;
    } else {
      failed++;
    }
  }
  
  // Check for security test file
  log('\n🔍 Checking: Security Test Suite', 'info');
  if (fs.existsSync(path.join(__dirname, 'test-security.js'))) {
    log('✅ Security Test Suite exists', 'success');
    passed++;
  } else {
    log('❌ Security Test Suite not found', 'error');
    failed++;
  }
  
  // Check for environment example
  log('\n🔍 Checking: Environment Template', 'info');
  if (fs.existsSync(path.join(__dirname, '.env.example'))) {
    log('✅ Environment template exists', 'success');
    passed++;
  } else {
    log('❌ Environment template not found', 'error');
    failed++;
  }
  
  // Summary
  log('\n========================================', 'info');
  log('📊 VERIFICATION SUMMARY', 'info');
  log('========================================', 'info');
  
  const total = passed + failed;
  const percentage = Math.round((passed / total) * 100);
  
  log(`\nTotal Checks: ${total}`, 'info');
  log(`Passed: ${passed}`, 'success');
  log(`Failed: ${failed}`, failed > 0 ? 'error' : 'success');
  
  if (percentage >= 90) {
    log(`\n🟢 Security Implementation: ${percentage}% - EXCELLENT`, 'success');
    log('Your security implementations are properly in place!', 'success');
  } else if (percentage >= 70) {
    log(`\n🟡 Security Implementation: ${percentage}% - GOOD`, 'warning');
    log('Most security implementations are in place, but some are missing.', 'warning');
  } else if (percentage >= 50) {
    log(`\n🟠 Security Implementation: ${percentage}% - NEEDS WORK`, 'warning');
    log('Several security implementations are missing.', 'warning');
  } else {
    log(`\n🔴 Security Implementation: ${percentage}% - CRITICAL`, 'error');
    log('Many security implementations are missing!', 'error');
  }
  
  if (failed > 0) {
    log('\n⚠️  Action Required:', 'warning');
    log('1. Review the failed checks above', 'info');
    log('2. Ensure all security libraries are created', 'info');
    log('3. Verify security functions are imported and used', 'info');
    log('4. Check that all files exist in the correct locations', 'info');
  }
  
  log('\n');
  process.exit(failed > 0 ? 1 : 0);
}

// Run verification
runSecurityVerification();
