import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getSchoolById, activateSchoolTrial, isMainAppConfigured } from '@/lib/main-app-supabase';

// Initialize Supabase (optional - will work without it for testing)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate input data
    const { 
      schoolId,
      email, 
      schoolName, 
      phone, 
      planName, 
      planPrice, 
      studentCount,
    } = body;

    // Security: Validate all required fields
    if (!schoolId) {
      return NextResponse.json(
        { error: 'School ID is required. Please create your school account at app.catalystwells.com first.' },
        { status: 400 }
      );
    }

    // Check if main app is configured
    if (!isMainAppConfigured()) {
      return NextResponse.json(
        { error: 'Main application database not configured' },
        { status: 500 }
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

    // Check if school already has an active subscription or trial
    if (existingSchool.subscription_status === 'active' || existingSchool.subscription_status === 'trial') {
      return NextResponse.json(
        { 
          error: 'School already has an active subscription.',
          currentStatus: existingSchool.subscription_status,
          currentPlan: existingSchool.subscription_plan 
        },
        { status: 400 }
      );
    }

    // Use school data from main database
    const schoolEmail = existingSchool.email;
    const schoolNameFromDb = existingSchool.name;

    // Validate student count (max 75 for free trial)
    const trialStudentCount = Math.min(studentCount || 75, 75);

    // Activate trial in main app database
    const updatedSchool = await activateSchoolTrial(schoolId, trialStudentCount);

    // Optionally log in landing page database for tracking
    if (supabase) {
      try {
        await supabase
          .from('payment_transactions')
          .insert({
            school_id: schoolId,
            school_name: schoolNameFromDb,
            user_email: schoolEmail,
            amount: 0,
            currency: 'INR',
            status: 'trial_activated',
            metadata: {
              trial_activated: true,
              trial_start: new Date().toISOString(),
              student_count: trialStudentCount,
            },
          });
      } catch (logError) {
        console.error('Failed to log trial activation (non-blocking):', logError);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Free trial activated successfully',
      school: {
        id: updatedSchool.id,
        name: updatedSchool.name,
        email: updatedSchool.email,
        subscription_status: updatedSchool.subscription_status,
        subscription_plan: updatedSchool.subscription_plan,
        student_limit: updatedSchool.student_limit,
        trial_end_date: updatedSchool.trial_end_date,
      },
    });

  } catch (error: any) {
    console.error('Trial signup error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to activate trial' },
      { status: 500 }
    );
  }
}
