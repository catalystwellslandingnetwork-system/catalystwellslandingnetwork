import { NextRequest, NextResponse } from 'next/server';
import { getSchoolById, getSchoolByCode } from '@/lib/main-app-supabase';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limit';
import { secureLog } from '@/lib/validation';

export async function GET(
  req: NextRequest,
  { params }: { params: { schoolId: string } }
) {
  try {
    // ✅ SECURITY: Rate limiting
    const rateLimit = await checkRateLimit(req, 'school-lookup');
    
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Too many lookup requests.' },
        { status: 429, headers: getRateLimitHeaders(rateLimit) }
      );
    }
    const schoolIdentifier = params.schoolId;

    if (!schoolIdentifier) {
      return NextResponse.json(
        { error: 'School ID or code is required' },
        { status: 400 }
      );
    }

    // Try to fetch by UUID first, then by school code
    let school;
    
    // Check if it looks like a UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    
    if (uuidRegex.test(schoolIdentifier)) {
      school = await getSchoolById(schoolIdentifier);
    } else {
      // Try as school code
      school = await getSchoolByCode(schoolIdentifier.toUpperCase());
    }

    if (!school) {
      return NextResponse.json(
        { 
          error: 'School not found', 
          message: 'Please create your school account at app.catalystwells.com first' 
        },
        { status: 404 }
      );
    }

    // Return sanitized school data (don't expose sensitive info)
    return NextResponse.json({
      success: true,
      school: {
        id: school.id,
        name: school.name,
        email: school.email,
        phone: school.phone,
        address: school.address,
        city: school.city,
        country: school.country,
        school_code: school.school_code,
        subscription_status: school.subscription_status,
        subscription_plan: school.subscription_plan,
        student_count: school.student_count,
        student_limit: school.student_limit,
        trial_end_date: school.trial_end_date,
        next_billing_date: school.next_billing_date,
        plan_type: school.plan_type,
      },
    });

  } catch (error: any) {
    secureLog('error', 'Error fetching school', { message: error.message });
    return NextResponse.json(
      { error: 'Failed to fetch school details' },
      { status: 500 }
    );
  }
}
