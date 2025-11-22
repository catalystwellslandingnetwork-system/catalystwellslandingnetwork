/**
 * Server-Side Pricing Configuration
 * SECURITY: This is the single source of truth for pricing
 * Client cannot manipulate these prices
 */

export const PRICING_PLANS = {
  'catalyst-ai': {
    name: 'Catalyst AI',
    displayName: 'Catalyst AI',
    pricePerStudent: 15,
    minStudents: 1,
    maxStudents: 10000,
    features: [
      'Luminex Pro',
      '70 AI Credits per Student (Daily)',
      'All Dashboards',
      'Core Modules',
      'On-Demand Report Cards',
    ],
  },
  'catalyst-ai-pro': {
    name: 'Catalyst AI Pro',
    displayName: 'Catalyst AI Pro',
    pricePerStudent: 25,
    minStudents: 1,
    maxStudents: 10000,
    features: [
      'Luminex AI Pro Plus',
      '150 AI Credits per Student (Daily)',
      'All Dashboards',
      'Expanded AI Tools',
      'Enterprise Security',
    ],
  },
  'catalyst-ai-extreme': {
    name: 'Catalyst AI Extreme',
    displayName: 'Catalyst AI Extreme',
    pricePerStudent: 500,
    minStudents: 1,
    maxStudents: 50000,
    features: [
      'Luminex AI Extreme',
      'UNLIMITED AI Credits',
      'All Premium Resources',
      'Van Tracking Module',
      '24/7 Priority Support',
      'Dedicated Account Manager',
    ],
  },
} as const;

export type PlanKey = keyof typeof PRICING_PLANS;

/**
 * Get validated pricing for a plan
 * SECURITY: This function is the only way to get valid pricing
 * 
 * @param planName - Name of the plan
 * @param studentCount - Number of students
 * @returns Validated total price or null if invalid
 */
export function getValidatedPrice(
  planName: string,
  studentCount: number
): number | null {
  // Normalize plan name
  const normalizedName = planName
    .toLowerCase()
    .replace(/\s+/g, '-') as PlanKey;

  const plan = PRICING_PLANS[normalizedName];

  if (!plan) {
    console.warn('Invalid plan name:', planName);
    return null;
  }

  // Validate student count
  if (
    typeof studentCount !== 'number' ||
    !Number.isInteger(studentCount) ||
    studentCount < plan.minStudents ||
    studentCount > plan.maxStudents
  ) {
    console.warn('Invalid student count:', studentCount, 'for plan:', planName);
    return null;
  }

  return plan.pricePerStudent * studentCount;
}

/**
 * Get plan details by name
 * @param planName - Name of the plan
 * @returns Plan details or null
 */
export function getPlanDetails(planName: string) {
  const normalizedName = planName
    .toLowerCase()
    .replace(/\s+/g, '-') as PlanKey;

  return PRICING_PLANS[normalizedName] || null;
}

/**
 * Validate if a plan name is valid
 * @param planName - Name to validate
 * @returns boolean
 */
export function isValidPlan(planName: string): boolean {
  const normalizedName = planName
    .toLowerCase()
    .replace(/\s+/g, '-') as PlanKey;

  return normalizedName in PRICING_PLANS;
}

/**
 * Get all available plans
 * @returns Array of plan details
 */
export function getAllPlans() {
  return Object.values(PRICING_PLANS);
}
