import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { createClient } from '@supabase/supabase-js';
import { getSchoolById } from '@/lib/main-app-supabase';
import { getValidatedPrice } from '@/lib/pricing';
import { validatePaymentInput, validateSchoolInput, secureLog } from '@/lib/validation';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limit';
import crypto from 'crypto';

// Initialize Razorpay with server-side credentials
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// Initialize Supabase (optional - will work without it for testing)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

secureLog('info', 'Supabase configuration status', { configured: !!supabase });

export async function POST(req: NextRequest) {
  try {
    // ✅ SECURITY: Rate limiting
    const rateLimit = await checkRateLimit(req, 'payment-create');
    
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Too many payment attempts. Please try again in a few minutes.' },
        { 
          status: 429,
          headers: getRateLimitHeaders(rateLimit)
        }
      );
    }

    // Get request body
    const body = await req.json();
    const {
      schoolId,
      address,
      city,
      state,
      pincode,
      gst,
      planName,
      planPrice,
      studentCount,
      billingCycle,
    } = body;

    // ✅ SECURITY: Validate payment input
    const paymentValidation = validatePaymentInput(body);
    if (!paymentValidation.valid) {
      secureLog('warn', 'Invalid payment input', paymentValidation.errors);
      return NextResponse.json(
        { error: 'Invalid payment details', details: paymentValidation.errors },
        { status: 400 }
      );
    }
    
    // ✅ SECURITY: Validate school input
    const schoolValidation = validateSchoolInput(body);
    if (!schoolValidation.valid) {
      secureLog('warn', 'Invalid school input', schoolValidation.errors);
      return NextResponse.json(
        { error: 'Invalid school details', details: schoolValidation.errors },
        { status: 400 }
      );
    }

    // ✅ SECURITY: Get server-side validated price
    const validatedTotal = getValidatedPrice(planName, studentCount);
    
    if (!validatedTotal) {
      secureLog('error', 'Invalid plan or student count', { planName, studentCount });
      return NextResponse.json(
        { error: 'Invalid plan or student count' },
        { status: 400 }
      );
    }
    
    // ✅ SECURITY: Verify client didn't manipulate price
    const clientTotal = planPrice * studentCount;
    const priceDiff = Math.abs(clientTotal - validatedTotal);
    
    if (priceDiff > 0.01) {
      // SECURITY EVENT: Price manipulation attempt detected!
      secureLog('error', 'Price manipulation attempt detected', {
        clientTotal,
        validatedTotal,
        difference: priceDiff,
        ip: req.headers.get('x-forwarded-for'),
        userAgent: req.headers.get('user-agent'),
      });
      
      return NextResponse.json(
        { error: 'Price validation failed. Please refresh and try again.' },
        { status: 400 }
      );
    }

    // Verify school exists in main app database
    const existingSchool = await getSchoolById(schoolId);
    if (!existingSchool) {
      return NextResponse.json(
        { error: 'School not found. Please create your school account at app.catalystwells.com first.' },
        { status: 404 }
      );
    }

    // Use school data from main database
    const email = existingSchool.email;
    const schoolName = existingSchool.name;
    const phone = existingSchool.phone;

    // ✅ SECURITY: Use validated price for Razorpay (not client-provided!)
    const amount = Math.round(validatedTotal * 100);

    // Security: Get client IP and User Agent for logging
    const ip_address = req.headers.get('x-forwarded-for') || 
                      req.headers.get('x-real-ip') || 
                      'unknown';
    const user_agent = req.headers.get('user-agent') || 'unknown';

    // Create Razorpay order
    const orderOptions = {
      amount: amount,
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
      notes: {
        schoolId: schoolId,  // CRITICAL: Pass school ID through Razorpay
        schoolName,
        email,
        phone,
        planName,
        planPrice: planPrice.toString(),
        studentCount: studentCount.toString(),
        billingCycle,
      },
    };

    const order = await razorpay.orders.create(orderOptions);
    secureLog('info', 'Razorpay order created', { orderId: order.id });

    let subscription: any = null;
    let subscriptionId: any = null;

    // Try to create subscription record in Supabase (optional)
    if (supabase) {
      try {
        // Create pending subscription record in landing page DB
        const { data, error: subError } = await supabase
          .from('subscriptions')
          .insert({
            school_id: schoolId,
            school_name: schoolName,
            user_email: email,
            phone: phone,
            plan_name: planName,
            plan_price: planPrice,
            student_count: studentCount,
            billing_cycle: billingCycle || 'monthly',
            status: 'pending',
            razorpay_subscription_id: order.id,
            metadata: {
              razorpay_order_id: order.id,
              subscription_type: 'paid',
              student_count: studentCount,
              school_name: schoolName,
            },
          })
          .select()
          .single();

        if (subError) {
          secureLog('error', 'Supabase subscription error', { error: subError.message });
          secureLog('warn', 'Continuing without landing page database', {});
        } else {
          subscription = data;
          subscriptionId = data.id;
          secureLog('info', 'Pending subscription created', { subscriptionId });
        }

        // Create payment transaction record
        const { error: txnError } = await supabase
          .from('payment_transactions')
          .insert({
            subscription_id: subscriptionId,
            school_id: schoolId,
            razorpay_order_id: order.id,
            customer_email: email,
            customer_phone: phone,
            amount: planPrice * studentCount,
            currency: 'INR',
            status: 'created',
            ip_address: ip_address,
            user_agent: user_agent,
            metadata: {
              plan_name: planName,
              student_count: studentCount,
              billing_cycle: billingCycle,
              school_name: schoolName,
            },
          });

        if (txnError) {
          secureLog('error', 'Supabase transaction error', { error: txnError.message });
        }
      } catch (dbError: any) {
        secureLog('error', 'Database error (non-blocking)', { message: dbError.message });
        secureLog('warn', 'Continuing without database - Razorpay will still work', {});
      }
    } else {
      secureLog('warn', 'Supabase not configured - payment will work but data will not be saved', {});
    }

    // Return order details to client
    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      subscriptionId: subscription?.id || null,  // Return null if subscription not created
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });

  } catch (error: any) {
    secureLog('error', 'Create order error', { message: error.message });
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
