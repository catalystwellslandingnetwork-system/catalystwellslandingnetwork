import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { createClient } from '@supabase/supabase-js';
import { activatePaidSubscription } from '@/lib/main-app-supabase';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limit';
import { validateRazorpayResponse, secureLog } from '@/lib/validation';

// Initialize Razorpay to fetch order details
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// Initialize Supabase (optional - will work without it for testing)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export async function POST(req: NextRequest) {
  try {
    // ✅ SECURITY: Rate limiting
    const rateLimit = await checkRateLimit(req, 'payment-verify');
    
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Too many verification attempts.' },
        { status: 429, headers: getRateLimitHeaders(rateLimit) }
      );
    }
    const body = await req.json();
    
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      subscriptionId 
    } = body;

    // ✅ SECURITY: Validate Razorpay response format
    const razorpayValidation = validateRazorpayResponse(body);
    if (!razorpayValidation.valid) {
      secureLog('warn', 'Invalid Razorpay response', razorpayValidation.errors);
      return NextResponse.json(
        { error: 'Invalid payment verification data', details: razorpayValidation.errors },
        { status: 400 }
      );
    }

    // ✅ SECURITY: Verify Razorpay signature with timing-safe comparison
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    // ✅ SECURITY: Use timing-safe comparison to prevent timing attacks
    const signatureValid = crypto.timingSafeEqual(
      Buffer.from(generatedSignature),
      Buffer.from(razorpay_signature)
    );

    if (!signatureValid) {
      secureLog('error', 'Invalid payment signature', {
        orderId: razorpay_order_id,
        ip: req.headers.get('x-forwarded-for'),
      });
      
      // Log failed verification attempt (if database available)
      if (supabase) {
        await supabase
          .from('payment_transactions')
          .update({
            status: 'failed',
            failed_at: new Date().toISOString(),
            metadata: { 
              error: 'Invalid signature',
              razorpay_payment_id,
            },
          })
          .eq('razorpay_order_id', razorpay_order_id);
      }

      return NextResponse.json(
        { error: 'Payment verification failed - Invalid signature' },
        { status: 400 }
      );
    }

    secureLog('info', 'Payment signature verified successfully', { orderId: razorpay_order_id });

    let subscription: any = null;
    let schoolId: string | null = null;

    // Try to fetch subscription details from landing page DB (if configured)
    if (supabase && subscriptionId) {
      try {
        // Fetch subscription details first
        const { data: subscriptionData, error: fetchError } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('id', subscriptionId)
          .single();

        if (!fetchError && subscriptionData) {
          subscription = subscriptionData;
          schoolId = subscriptionData.school_id;  // Get school_id directly from the column
          secureLog('info', 'Subscription fetched', { subscriptionId, schoolId });
        } else {
          secureLog('warn', 'Could not fetch subscription from landing DB', { error: fetchError?.message });
        }

        // Update payment transaction if we have one
        const { error: txnError } = await supabase
          .from('payment_transactions')
          .update({
            razorpay_payment_id: razorpay_payment_id,
            razorpay_signature: razorpay_signature,
            status: 'paid',
            signature_verified: true,  // Required by constraint
            verification_timestamp: new Date().toISOString(),
            paid_at: new Date().toISOString(),
          })
          .eq('razorpay_order_id', razorpay_order_id);

        if (txnError) {
          secureLog('warn', 'Could not update transaction', { error: txnError.message });
        }
      } catch (dbError: any) {
        secureLog('error', 'Landing page DB error (non-blocking)', { message: dbError.message });
      }
    }

    // FALLBACK: If we don't have school ID from DB, fetch from Razorpay order
    if (!schoolId || !subscription) {
      secureLog('warn', 'Missing data from landing DB, fetching from Razorpay', {});
      try {
        const order = await razorpay.orders.fetch(razorpay_order_id);
        secureLog('info', 'Razorpay order fetched', { orderId: order.id });
        
        if (order.notes && order.notes.schoolId) {
          schoolId = String(order.notes.schoolId);
          // Reconstruct subscription data from order notes
          subscription = {
            plan_name: String(order.notes.planName || 'Unknown Plan'),
            plan_price: parseFloat(String(order.notes.planPrice || '0')),
            student_count: parseInt(String(order.notes.studentCount || '0')),
            billing_cycle: String(order.notes.billingCycle || 'monthly'),
            user_email: String(order.notes.email || ''),
            school_name: String(order.notes.schoolName || ''),
            phone: String(order.notes.phone || ''),
          };
          secureLog('info', 'Recovered data from Razorpay', { schoolId, planName: subscription.plan_name });
        }
      } catch (razorpayError: any) {
        secureLog('error', 'Failed to fetch Razorpay order', { message: razorpayError.message });
      }
    }

    // CRITICAL: Always try to activate in main app
    if (schoolId && subscription) {
      try {
        // Extract student_count from metadata if not directly available
        const studentCount = subscription.student_count || subscription.metadata?.student_count || 100;
        
        await activatePaidSubscription(schoolId, {
          planName: subscription.plan_name,
          planPrice: subscription.plan_price,
          studentCount: studentCount,
          billingCycle: subscription.billing_cycle,
          razorpaySubscriptionId: razorpay_payment_id,
        });
        secureLog('info', 'Subscription activated in MAIN APP', { schoolId });
      } catch (mainAppError: any) {
        secureLog('error', 'CRITICAL: Failed to activate in main app', { message: mainAppError.message });
        // This is critical - return error
        return NextResponse.json(
          { error: 'Payment verified but failed to activate subscription. Contact support.' },
          { status: 500 }
        );
      }
    } else {
      secureLog('error', 'CRITICAL: No school ID or subscription data - cannot activate', {});
      secureLog('error', 'Landing DB failed AND Razorpay order has no school ID', {});
      return NextResponse.json(
        { error: 'Payment verified but missing school information. Contact support.' },
        { status: 500 }
      );
    }

    // Update subscription status in landing page database (optional)
    if (supabase && subscriptionId) {
      try {
        const subscriptionStartDate = new Date();
        const nextBillingDate = new Date();
        nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

        // Prepare update data
        const updateData: any = {
          status: 'active',
          subscription_start_date: subscriptionStartDate.toISOString(),
          next_billing_date: nextBillingDate.toISOString(),
          razorpay_subscription_id: razorpay_payment_id,
          metadata: {
            payment_completed: true,
            subscription_type: 'paid',
            school_id: schoolId,
          },
        };
        
        // Add school_name and student_count if available and not already set
        if (subscription?.plan_name && (!subscription.school_name || !subscription.student_count)) {
          if (subscription.metadata?.school_name) {
            updateData.school_name = subscription.metadata.school_name;
          }
          if (subscription.metadata?.student_count) {
            updateData.student_count = subscription.metadata.student_count;
          }
        }

        const { error: subError } = await supabase
          .from('subscriptions')
          .update(updateData)
          .eq('id', subscriptionId);

        if (subError) {
          secureLog('warn', 'Could not update landing DB subscription', { error: subError.message });
        } else {
          secureLog('info', 'Landing page DB updated successfully', {});
        }
      } catch (dbError: any) {
        secureLog('error', 'Landing DB update error (non-blocking)', { message: dbError.message });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      subscription: {
        id: subscription?.id,
        status: subscription?.status,
        trialEndDate: subscription?.trial_end_date,
      },
    });

  } catch (error: any) {
    secureLog('error', 'Payment verification error', { message: error.message });
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 500 }
    );
  }
}
