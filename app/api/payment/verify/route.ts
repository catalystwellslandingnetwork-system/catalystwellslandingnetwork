import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { syncSubscriptionToMainApp } from '@/lib/sync-to-main-app';

// Initialize Supabase with service role key for secure operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      subscriptionId 
    } = body;

    // Security: Validate all required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !subscriptionId) {
      return NextResponse.json(
        { error: 'Missing required payment verification fields' },
        { status: 400 }
      );
    }

    // Security: Verify Razorpay signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      // Log failed verification attempt
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

      return NextResponse.json(
        { error: 'Payment verification failed - Invalid signature' },
        { status: 400 }
      );
    }

    // Signature verified - Update payment transaction
    const { error: txnError } = await supabase
      .from('payment_transactions')
      .update({
        razorpay_payment_id: razorpay_payment_id,
        razorpay_signature: razorpay_signature,
        status: 'paid',
        paid_at: new Date().toISOString(),
      })
      .eq('razorpay_order_id', razorpay_order_id);

    if (txnError) {
      console.error('Failed to update transaction:', txnError);
      return NextResponse.json(
        { error: 'Failed to update payment status' },
        { status: 500 }
      );
    }

    // Update subscription status to active
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 30); // 30-day trial

    const subscriptionStartDate = new Date();
    const nextBillingDate = new Date();
    nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

    const { error: subError } = await supabase
      .from('subscriptions')
      .update({
        status: 'trial',
        trial_end_date: trialEndDate.toISOString(),
        subscription_start_date: subscriptionStartDate.toISOString(),
        next_billing_date: nextBillingDate.toISOString(),
        razorpay_subscription_id: razorpay_payment_id,
      })
      .eq('id', subscriptionId);

    if (subError) {
      console.error('Failed to update subscription:', subError);
      return NextResponse.json(
        { error: 'Failed to activate subscription' },
        { status: 500 }
      );
    }

    // Fetch subscription details for response
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('id', subscriptionId)
      .single();

    // Sync to main application (non-blocking)
    if (subscription) {
      syncSubscriptionToMainApp({
        id: subscription.id,
        user_email: subscription.user_email,
        school_name: subscription.school_name,
        phone: subscription.phone,
        plan_name: subscription.plan_name,
        plan_price: subscription.plan_price,
        student_count: subscription.student_count,
        billing_cycle: subscription.billing_cycle,
        status: subscription.status,
        trial_end_date: subscription.trial_end_date,
        subscription_start_date: subscription.subscription_start_date,
        next_billing_date: subscription.next_billing_date,
        razorpay_subscription_id: subscription.razorpay_subscription_id,
        metadata: subscription.metadata,
      }).catch(error => {
        // Log error but don't fail the response
        console.error('Sync to main app failed (non-blocking):', error);
      });
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
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: error.message || 'Payment verification failed' },
      { status: 500 }
    );
  }
}
