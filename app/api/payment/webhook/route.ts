import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase with service role key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('x-razorpay-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      );
    }

    // Security: Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest('hex');

    if (expectedSignature !== signature) {
      console.error('Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    const event = JSON.parse(body);

    // Log webhook event
    await supabase
      .from('payment_webhook_logs')
      .insert({
        event_type: event.event,
        razorpay_event_id: event.id,
        payload: event,
        processed: false,
      });

    // Handle different webhook events
    switch (event.event) {
      case 'payment.captured':
        await handlePaymentCaptured(event);
        break;
      
      case 'payment.failed':
        await handlePaymentFailed(event);
        break;
      
      case 'subscription.charged':
        await handleSubscriptionCharged(event);
        break;
      
      case 'subscription.cancelled':
        await handleSubscriptionCancelled(event);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.event}`);
    }

    // Mark webhook as processed
    await supabase
      .from('payment_webhook_logs')
      .update({ processed: true })
      .eq('razorpay_event_id', event.id);

    return NextResponse.json({ received: true });

  } catch (error: any) {
    console.error('Webhook error:', error);
    
    // Log error in webhook logs
    try {
      await supabase
        .from('payment_webhook_logs')
        .insert({
          event_type: 'error',
          payload: { error: error.message },
          processed: false,
          error_message: error.message,
        });
    } catch (logError) {
      console.error('Failed to log webhook error:', logError);
    }

    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handlePaymentCaptured(event: any) {
  const payment = event.payload.payment.entity;
  const orderId = payment.order_id;

  // Update transaction status
  await supabase
    .from('payment_transactions')
    .update({
      razorpay_payment_id: payment.id,
      status: 'paid',
      paid_at: new Date().toISOString(),
      payment_method: payment.method,
      metadata: { webhook_event: event.event, payment_data: payment },
    })
    .eq('razorpay_order_id', orderId);

  // Activate subscription
  const { data: transaction } = await supabase
    .from('payment_transactions')
    .select('subscription_id')
    .eq('razorpay_order_id', orderId)
    .single();

  if (transaction) {
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 30);

    await supabase
      .from('subscriptions')
      .update({
        status: 'trial',
        trial_end_date: trialEndDate.toISOString(),
        subscription_start_date: new Date().toISOString(),
      })
      .eq('id', transaction.subscription_id);
  }
}

async function handlePaymentFailed(event: any) {
  const payment = event.payload.payment.entity;
  const orderId = payment.order_id;

  await supabase
    .from('payment_transactions')
    .update({
      status: 'failed',
      failed_at: new Date().toISOString(),
      metadata: { 
        webhook_event: event.event, 
        error: payment.error_description 
      },
    })
    .eq('razorpay_order_id', orderId);
}

async function handleSubscriptionCharged(event: any) {
  const subscription = event.payload.subscription.entity;
  
  await supabase
    .from('subscriptions')
    .update({
      status: 'active',
      next_billing_date: new Date(subscription.charge_at * 1000).toISOString(),
    })
    .eq('razorpay_subscription_id', subscription.id);
}

async function handleSubscriptionCancelled(event: any) {
  const subscription = event.payload.subscription.entity;
  
  await supabase
    .from('subscriptions')
    .update({
      status: 'cancelled',
    })
    .eq('razorpay_subscription_id', subscription.id);
}
