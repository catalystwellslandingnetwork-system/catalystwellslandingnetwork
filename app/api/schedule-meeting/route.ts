import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate required fields
        const { fullName, email, meetingType, preferredDate, preferredTime } = body;

        if (!fullName || !email || !meetingType || !preferredDate || !preferredTime) {
            return NextResponse.json(
                { error: 'Missing required fields: fullName, email, meetingType, preferredDate, preferredTime' },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Invalid email format' },
                { status: 400 }
            );
        }

        // Validate future date
        const selectedDate = new Date(preferredDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            return NextResponse.json(
                { error: 'Meeting date must be in the future' },
                { status: 400 }
            );
        }

        // Get user agent and IP
        const userAgent = request.headers.get('user-agent') || '';
        const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0] ||
            request.headers.get('x-real-ip') ||
            'unknown';

        // Insert meeting into database
        const { data, error } = await supabase
            .from('scheduled_meetings')
            .insert({
                full_name: fullName,
                email: email,
                phone: body.phone || null,
                organization: body.organization || null,
                meeting_type: meetingType,
                preferred_date: preferredDate,
                preferred_time: preferredTime,
                timezone: body.timezone || 'Asia/Kolkata',
                duration_minutes: body.duration || 30,
                subject: body.subject || null,
                description: body.description || null,
                urgency_level: body.urgencyLevel || 'normal',
                status: 'pending',
                source: 'support_page',
                user_agent: userAgent,
                ip_address: ipAddress
            })
            .select()
            .single();

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json(
                { error: 'Failed to schedule meeting. Please try again.' },
                { status: 500 }
            );
        }

        // Create automatic reminders (1 day before and 1 hour before)
        const meetingDateTime = new Date(`${preferredDate}T${preferredTime}`);
        const oneDayBefore = new Date(meetingDateTime.getTime() - 24 * 60 * 60 * 1000);
        const oneHourBefore = new Date(meetingDateTime.getTime() - 60 * 60 * 1000);

        await supabase.from('meeting_reminders').insert([
            {
                meeting_id: data.id,
                reminder_time: oneDayBefore.toISOString(),
                reminder_type: 'email',
                sent: false
            },
            {
                meeting_id: data.id,
                reminder_time: oneHourBefore.toISOString(),
                reminder_type: 'email',
                sent: false
            }
        ]);

        // Return success response
        return NextResponse.json({
            success: true,
            message: 'Meeting scheduled successfully! You will receive a confirmation email shortly.',
            meeting: {
                id: data.id,
                fullName: data.full_name,
                email: data.email,
                meetingType: data.meeting_type,
                preferredDate: data.preferred_date,
                preferredTime: data.preferred_time,
                status: data.status,
                createdAt: data.created_at
            }
        }, { status: 201 });

    } catch (error) {
        console.error('Error scheduling meeting:', error);
        return NextResponse.json(
            { error: 'An unexpected error occurred. Please try again later.' },
            { status: 500 }
        );
    }
}

// GET endpoint to fetch meeting types
export async function GET() {
    try {
        const { data, error } = await supabase
            .from('meeting_types')
            .select('*')
            .eq('is_active', true)
            .order('sort_order');

        if (error) {
            console.error('Error fetching meeting types:', error);
            return NextResponse.json(
                { error: 'Failed to fetch meeting types' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            meetingTypes: data
        });

    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json(
            { error: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}
