import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface TrialSubscription {
  id?: string;
  email: string;
  source_page?: string;
  metadata?: Record<string, any>;
  trial_status?: 'pending' | 'active' | 'expired' | 'converted';
  trial_started_at?: string;
  trial_expires_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface NewsletterSubscription {
  id?: string;
  email: string;
  source_page?: string;
  metadata?: Record<string, any>;
  is_active?: boolean;
  unsubscribed_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Feedback {
  id?: string;
  name: string;
  email: string;
  feedback_type: 'feature' | 'bug' | 'improvement' | 'other';
  priority: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  status?: 'pending' | 'reviewed' | 'in_progress' | 'completed' | 'rejected';
  source_page?: string;
  metadata?: Record<string, any>;
  admin_notes?: string;
  created_at?: string;
  updated_at?: string;
}
