/**
 * EXAMPLE: Main App Sync Endpoint
 * 
 * Copy this file to your main application at:
 * app/api/sync/subscription/route.ts
 * 
 * This endpoint receives subscription data from the landing page
 * and creates/updates school accounts in your main database
 */

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Your main app's database client (Prisma, Supabase, etc.)
// import { prisma } from '@/lib/prisma';
// or
// import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    // 1. VERIFY REQUEST IS FROM LANDING PAGE
    const apiKey = req.headers.get('x-api-key');
    const signature = req.headers.get('x-signature');
    const timestamp = req.headers.get('x-timestamp');

    // Check API key
    if (apiKey !== process.env.LANDING_PAGE_API_KEY) {
      console.error('Invalid API key');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check timestamp (reject if > 5 minutes old)
    const now = Date.now();
    const requestTime = parseInt(timestamp || '0');
    if (Math.abs(now - requestTime) > 5 * 60 * 1000) {
      console.error('Request too old:', { now, requestTime });
      return NextResponse.json({ error: 'Request expired' }, { status: 401 });
    }

    // Get request body
    const subscriptionData = await req.json();

    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.LANDING_PAGE_SECRET!)
      .update(JSON.stringify(subscriptionData))
      .digest('hex');

    if (signature !== expectedSignature) {
      console.error('Invalid signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    console.log('Received subscription sync:', subscriptionData.id);

    // 2. CHECK IF SCHOOL ALREADY EXISTS
    const existingSchool = await findSchoolByEmail(subscriptionData.user_email);

    let school;

    if (existingSchool) {
      // 3A. UPDATE EXISTING SCHOOL
      console.log('Updating existing school:', existingSchool.id);

      school = await updateSchool(existingSchool.id, {
        planName: subscriptionData.plan_name,
        planPrice: subscriptionData.plan_price,
        studentCount: subscriptionData.student_count,
        billingCycle: subscriptionData.billing_cycle,
        status: subscriptionData.status,
        trialEndDate: subscriptionData.trial_end_date,
        subscriptionStartDate: subscriptionData.subscription_start_date,
        nextBillingDate: subscriptionData.next_billing_date,
        razorpaySubscriptionId: subscriptionData.razorpay_subscription_id,
        metadata: {
          ...existingSchool.metadata,
          ...subscriptionData.metadata,
          last_synced: new Date().toISOString(),
          landing_subscription_id: subscriptionData.id,
        },
      });

    } else {
      // 3B. CREATE NEW SCHOOL
      console.log('Creating new school for:', subscriptionData.user_email);

      school = await createSchool({
        email: subscriptionData.user_email,
        name: subscriptionData.school_name,
        phone: subscriptionData.phone,
        planName: subscriptionData.plan_name,
        planPrice: subscriptionData.plan_price,
        studentCount: subscriptionData.student_count,
        billingCycle: subscriptionData.billing_cycle,
        status: subscriptionData.status,
        trialEndDate: subscriptionData.trial_end_date,
        subscriptionStartDate: subscriptionData.subscription_start_date,
        nextBillingDate: subscriptionData.next_billing_date,
        razorpaySubscriptionId: subscriptionData.razorpay_subscription_id,
        metadata: {
          ...subscriptionData.metadata,
          synced_from_landing: true,
          landing_subscription_id: subscriptionData.id,
          created_at: new Date().toISOString(),
        },
      });

      // 4. GENERATE LOGIN CREDENTIALS FOR NEW SCHOOL
      const credentials = await generateSchoolCredentials(school.id, subscriptionData.user_email);

      // 5. SEND WELCOME EMAIL
      await sendWelcomeEmail({
        email: subscriptionData.user_email,
        schoolName: subscriptionData.school_name,
        username: credentials.username,
        password: credentials.password,
        loginUrl: process.env.NEXT_PUBLIC_APP_URL + '/login',
        isTrial: subscriptionData.status === 'trial',
        trialEndDate: subscriptionData.trial_end_date,
      });
    }

    // 6. LOG SYNC EVENT
    await logSyncEvent({
      subscriptionId: subscriptionData.id,
      schoolId: school.id,
      action: existingSchool ? 'update' : 'create',
      success: true,
      timestamp: new Date().toISOString(),
    });

    // 7. RETURN SUCCESS
    return NextResponse.json({
      success: true,
      schoolId: school.id,
      action: existingSchool ? 'updated' : 'created',
    });

  } catch (error: any) {
    console.error('Sync endpoint error:', error);

    // Log error
    await logSyncEvent({
      subscriptionId: 'unknown',
      schoolId: null,
      action: 'sync',
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    }).catch(console.error);

    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============================================================================
// DATABASE HELPER FUNCTIONS
// Implement these based on your database (Prisma, Supabase, etc.)
// ============================================================================

/**
 * Find school by email
 */
async function findSchoolByEmail(email: string): Promise<any | null> {
  // Example with Prisma:
  // return await prisma.school.findUnique({ where: { email } });

  // Example with Supabase:
  // const { data } = await supabase
  //   .from('schools')
  //   .select('*')
  //   .eq('email', email)
  //   .single();
  // return data;

  // TODO: Implement with your database
  return null;
}

/**
 * Create new school
 */
async function createSchool(data: any) {
  // Example with Prisma:
  // return await prisma.school.create({
  //   data: {
  //     email: data.email,
  //     name: data.name,
  //     phone: data.phone,
  //     planName: data.planName,
  //     planPrice: data.planPrice,
  //     studentCount: data.studentCount,
  //     billingCycle: data.billingCycle,
  //     status: data.status,
  //     trialEndDate: data.trialEndDate,
  //     subscriptionStartDate: data.subscriptionStartDate,
  //     nextBillingDate: data.nextBillingDate,
  //     razorpaySubscriptionId: data.razorpaySubscriptionId,
  //     metadata: data.metadata,
  //   }
  // });

  // Example with Supabase:
  // const { data: school, error } = await supabase
  //   .from('schools')
  //   .insert({
  //     email: data.email,
  //     name: data.name,
  //     phone: data.phone,
  //     plan_name: data.planName,
  //     plan_price: data.planPrice,
  //     student_count: data.studentCount,
  //     billing_cycle: data.billingCycle,
  //     status: data.status,
  //     trial_end_date: data.trialEndDate,
  //     subscription_start_date: data.subscriptionStartDate,
  //     next_billing_date: data.nextBillingDate,
  //     razorpay_subscription_id: data.razorpaySubscriptionId,
  //     metadata: data.metadata,
  //   })
  //   .select()
  //   .single();
  // 
  // if (error) throw error;
  // return school;

  // TODO: Implement with your database
  return {
    id: 'school_' + Date.now(),
    ...data,
  };
}

/**
 * Update existing school
 */
async function updateSchool(schoolId: string, data: any) {
  // Example with Prisma:
  // return await prisma.school.update({
  //   where: { id: schoolId },
  //   data: {
  //     planName: data.planName,
  //     planPrice: data.planPrice,
  //     studentCount: data.studentCount,
  //     billingCycle: data.billingCycle,
  //     status: data.status,
  //     trialEndDate: data.trialEndDate,
  //     subscriptionStartDate: data.subscriptionStartDate,
  //     nextBillingDate: data.nextBillingDate,
  //     razorpaySubscriptionId: data.razorpaySubscriptionId,
  //     metadata: data.metadata,
  //   }
  // });

  // TODO: Implement with your database
  return {
    id: schoolId,
    ...data,
  };
}

/**
 * Generate login credentials for school
 */
async function generateSchoolCredentials(schoolId: string, email: string) {
  // Generate username from email
  const username = email.split('@')[0];

  // Generate random password
  const password = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);

  // Hash password and store in database
  // const hashedPassword = await bcrypt.hash(password, 10);
  // await prisma.user.create({
  //   data: {
  //     schoolId,
  //     email,
  //     username,
  //     password: hashedPassword,
  //     role: 'admin',
  //   }
  // });

  return {
    username,
    password,
  };
}

/**
 * Send welcome email to new school
 */
async function sendWelcomeEmail(data: {
  email: string;
  schoolName: string;
  username: string;
  password: string;
  loginUrl: string;
  isTrial: boolean;
  trialEndDate?: string;
}) {
  // Example with Resend:
  // await resend.emails.send({
  //   from: 'Catalyst Wells <noreply@catalystwells.com>',
  //   to: data.email,
  //   subject: data.isTrial ? 'Welcome to Your Free Trial!' : 'Welcome to Catalyst Wells!',
  //   html: `
  //     <h1>Welcome to Catalyst Wells, ${data.schoolName}!</h1>
  //     <p>Your account has been created successfully.</p>
  //     <h2>Login Credentials:</h2>
  //     <p><strong>Username:</strong> ${data.username}</p>
  //     <p><strong>Password:</strong> ${data.password}</p>
  //     <p><strong>Login URL:</strong> <a href="${data.loginUrl}">${data.loginUrl}</a></p>
  //     ${data.isTrial ? `<p>Your free trial ends on ${new Date(data.trialEndDate!).toLocaleDateString()}</p>` : ''}
  //     <p>Please change your password after first login.</p>
  //   `,
  // });

  console.log('Welcome email sent to:', data.email);
}

/**
 * Log sync event for audit trail
 */
async function logSyncEvent(event: {
  subscriptionId: string;
  schoolId: string | null;
  action: string;
  success: boolean;
  error?: string;
  timestamp: string;
}) {
  // Example with Prisma:
  // await prisma.syncLog.create({
  //   data: {
  //     subscriptionId: event.subscriptionId,
  //     schoolId: event.schoolId,
  //     action: event.action,
  //     success: event.success,
  //     error: event.error,
  //     timestamp: event.timestamp,
  //   }
  // });

  console.log('Sync event logged:', event);
}
