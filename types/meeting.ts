// Meeting types and interfaces
export interface ScheduleMeetingRequest {
    fullName: string;
    email: string;
    phone?: string;
    organization?: string;
    meetingType: string;
    preferredDate: string;
    preferredTime: string;
    timezone?: string;
    duration?: number;
    subject?: string;
    description?: string;
    urgencyLevel?: 'low' | 'normal' | 'high' | 'urgent';
}

export interface ScheduledMeeting {
    id: string;
    fullName: string;
    email: string;
    phone?: string;
    organization?: string;
    meetingType: string;
    preferredDate: string;
    preferredTime: string;
    timezone: string;
    duration: number;
    subject?: string;
    description?: string;
    urgencyLevel: string;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';
    googleMeetLink?: string;
    createdAt: string;
}

export interface MeetingType {
    id: number;
    type_name: string;
    display_name: string;
    description?: string;
    default_duration: number;
    is_active: boolean;
    sort_order?: number;
}
