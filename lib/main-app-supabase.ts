/**
 * Main App Supabase Client
 * This connects to the main application's Supabase database
 * Used for reading and updating school subscription information
 */

import { createClient } from '@supabase/supabase-js';

const mainAppUrl = process.env.MAIN_APP_SUPABASE_URL;
const mainAppKey = process.env.MAIN_APP_SUPABASE_SERVICE_KEY;

if (!mainAppUrl || !mainAppKey) {
  console.warn('Main app Supabase credentials not configured');
}

// Create client with service role key to bypass RLS
export const mainAppSupabase = mainAppUrl && mainAppKey 
  ? createClient(mainAppUrl, mainAppKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

/**
 * Check if main app database is configured
 */
export function isMainAppConfigured(): boolean {
  return !!(mainAppUrl && mainAppKey);
}

/**
 * Get school by ID from main app database
 */
export async function getSchoolById(schoolId: string) {
  if (!mainAppSupabase) {
    throw new Error('Main app database not configured');
  }

  const { data, error } = await mainAppSupabase
    .from('schools')
    .select('*')
    .eq('id', schoolId)
    .single();

  if (error) {
    console.error('Error fetching school:', error);
    return null;
  }

  return data;
}

/**
 * Get school by school code
 */
export async function getSchoolByCode(schoolCode: string) {
  if (!mainAppSupabase) {
    throw new Error('Main app database not configured');
  }

  const { data, error } = await mainAppSupabase
    .from('schools')
    .select('*')
    .eq('school_code', schoolCode)
    .single();

  if (error) {
    console.error('Error fetching school:', error);
    return null;
  }

  return data;
}

/**
 * Update school subscription details in main app database
 */
export async function updateSchoolSubscription(
  schoolId: string,
  updates: {
    subscription_status?: string;
    subscription_plan?: string;
    student_limit?: number;
    trial_end_date?: string | null;
    subscription_start_date?: string | null;
    subscription_end_date?: string | null;
    next_billing_date?: string | null;
    razorpay_subscription_id?: string | null;
    plan_type?: string;
    user_limit?: number;
    monthly_fee?: number;
    payment_status?: string;
    last_payment_date?: string | null;
    payment_due_date?: string | null;
  }
) {
  if (!mainAppSupabase) {
    throw new Error('Main app database not configured');
  }

  const { data, error } = await mainAppSupabase
    .from('schools')
    .update(updates)
    .eq('id', schoolId)
    .select()
    .single();

  if (error) {
    console.error('Error updating school subscription:', error);
    throw error;
  }

  return data;
}

/**
 * Activate free trial for existing school
 */
export async function activateSchoolTrial(schoolId: string, studentCount: number = 75) {
  const trialEndDate = new Date();
  trialEndDate.setDate(trialEndDate.getDate() + 30);

  return updateSchoolSubscription(schoolId, {
    subscription_status: 'trial',
    subscription_plan: 'Free Trial',
    student_limit: Math.min(studentCount, 75),
    user_limit: Math.min(studentCount, 75),
    trial_end_date: trialEndDate.toISOString(),
    subscription_start_date: new Date().toISOString(),
    plan_type: 'free',
    monthly_fee: 0,
    payment_status: 'active',
  });
}

/**
 * Activate paid subscription for existing school
 */
export async function activatePaidSubscription(
  schoolId: string,
  planDetails: {
    planName: string;
    planPrice: number;
    studentCount: number;
    billingCycle: string;
    razorpaySubscriptionId: string;
  }
) {
  const subscriptionStartDate = new Date();
  const nextBillingDate = new Date();
  const subscriptionEndDate = new Date();
  
  // Calculate dates based on billing cycle
  if (planDetails.billingCycle === 'yearly') {
    nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
    subscriptionEndDate.setFullYear(subscriptionEndDate.getFullYear() + 1);
  } else {
    // Monthly
    nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
    subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1);
  }

  // Determine plan type based on price
  let planType = 'basic';
  if (planDetails.planPrice >= 500) {
    planType = 'premium';
  } else if (planDetails.planPrice >= 25) {
    planType = 'basic';
  }

  return updateSchoolSubscription(schoolId, {
    subscription_status: 'active',
    subscription_plan: planDetails.planName,
    student_limit: planDetails.studentCount,
    user_limit: planDetails.studentCount,
    subscription_start_date: subscriptionStartDate.toISOString(),
    subscription_end_date: subscriptionEndDate.toISOString(),
    next_billing_date: nextBillingDate.toISOString(),
    razorpay_subscription_id: planDetails.razorpaySubscriptionId,
    plan_type: planType,
    monthly_fee: planDetails.billingCycle === 'yearly' 
      ? planDetails.planPrice / 12 
      : planDetails.planPrice,
    payment_status: 'active',
    last_payment_date: new Date().toISOString(),
    trial_end_date: null, // Clear trial when upgrading to paid
  });
}
