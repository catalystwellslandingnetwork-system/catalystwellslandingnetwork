import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('Supabase credentials not configured');
      return NextResponse.json(
        { error: 'Server configuration error. Please contact support.' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { email, type, source } = body;

    console.log('Subscription request:', { email, type, source });

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Validate subscription type
    if (!type || !['newsletter', 'trial'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid subscription type' },
        { status: 400 }
      );
    }

    // Determine which table to use
    const tableName = type === 'trial' ? 'trial_subscriptions' : 'newsletter_subscriptions';

    // Check if email already exists
    const { data: existing, error: checkError } = await supabase
      .from(tableName)
      .select('email')
      .eq('email', email)
      .single();

    // Only return if email exists and no error (ignore PGRST116 - no rows found)
    if (existing && !checkError) {
      console.log('Email already exists:', email);
      return NextResponse.json(
        { message: 'Email already subscribed', alreadyExists: true },
        { status: 200 }
      );
    }

    // Log check error if it's not a "not found" error
    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Check error:', checkError);
    }

    // Prepare subscription data
    const subscriptionData: any = {
      email,
      source_page: source || 'unknown',
      metadata: {
        user_agent: request.headers.get('user-agent'),
        referrer: request.headers.get('referer'),
      },
    };

    // Add type-specific fields
    if (type === 'trial') {
      subscriptionData.trial_status = 'pending';
      // You can set trial_started_at and trial_expires_at here if needed
      // subscriptionData.trial_started_at = new Date().toISOString();
      // subscriptionData.trial_expires_at = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(); // 14 days
    } else if (type === 'newsletter') {
      subscriptionData.is_active = true;
    }

    // Insert new subscription
    const { data, error } = await supabase
      .from(tableName)
      .insert([subscriptionData])
      .select();

    if (error) {
      console.error('Supabase insert error:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      
      // Provide specific error messages
      let errorMessage = 'Failed to subscribe. Please try again.';
      
      if (error.code === '42P01') {
        errorMessage = 'Database table not found. Please run the SQL schema first.';
      } else if (error.code === '23505') {
        errorMessage = 'Email already subscribed.';
      } else if (error.code === '42501') {
        errorMessage = 'Row Level Security policy error. Please check your RLS policies in Supabase.';
      } else if (error.message.includes('JWT')) {
        errorMessage = 'Invalid API credentials. Please check your Supabase configuration.';
      }
      
      return NextResponse.json(
        { error: errorMessage, details: error.message },
        { status: 500 }
      );
    }

    console.log('Subscription successful:', data?.[0]?.email);

    return NextResponse.json(
      { 
        message: 'Successfully subscribed!',
        type,
        data: data?.[0]
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
