import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Initialize Razorpay with server-side credentials
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// Initialize Supabase with service role key for secure operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate input data
    const { 
      email, 
      schoolName, 
      phone, 
      planName, 
      planPrice, 
      studentCount,
      billingCycle 
    } = body;

    // Security: Validate all required fields
    if (!email || !schoolName || !phone || !planName || !planPrice || !studentCount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Security: Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Security: Validate phone format (Indian numbers)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone.replace(/\s+/g, ''))) {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    // Security: Validate student count
    if (studentCount < 1 || studentCount > 10000) {
      return NextResponse.json(
        { error: 'Invalid student count' },
        { status: 400 }
      );
    }

    // Calculate total amount (in paise for Razorpay)
    const amount = Math.round(planPrice * studentCount * 100);

    // Security: Get client IP and User Agent for logging
    const ip_address = req.headers.get('x-forwarded-for') || 
                      req.headers.get('x-real-ip') || 
                      'unknown';
    const user_agent = req.headers.get('user-agent') || 'unknown';

    // Create Razorpay order
    const orderOptions = {
      amount: amount,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        email,
        schoolName,
        phone,
        planName,
        studentCount: studentCount.toString(),
        billingCycle,
      },
    };

    const order = await razorpay.orders.create(orderOptions);

    // Create subscription record in Supabase
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .insert({
        user_email: email,
        school_name: schoolName,
        phone: phone,
        plan_name: planName,
        plan_price: planPrice,
        student_count: studentCount,
        billing_cycle: billingCycle || 'monthly',
        status: 'pending',
        metadata: {
          razorpay_order_id: order.id,
        },
      })
      .select()
      .single();

    if (subError) {
      console.error('Supabase subscription error:', subError);
      return NextResponse.json(
        { error: 'Failed to create subscription record' },
        { status: 500 }
      );
    }

    // Create payment transaction record
    const { error: txnError } = await supabase
      .from('payment_transactions')
      .insert({
        subscription_id: subscription.id,
        razorpay_order_id: order.id,
        amount: planPrice * studentCount,
        currency: 'INR',
        status: 'created',
        customer_email: email,
        customer_phone: phone,
        ip_address: ip_address,
        user_agent: user_agent,
        metadata: {
          plan_name: planName,
          student_count: studentCount,
        },
      });

    if (txnError) {
      console.error('Supabase transaction error:', txnError);
    }

    // Return order details to client
    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      subscriptionId: subscription.id,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });

  } catch (error: any) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}
