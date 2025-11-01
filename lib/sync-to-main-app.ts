/**
 * Sync subscription data to main application
 * Uses 7-layer security architecture
 */

import { makeSecureRequest } from './security';
import { supabase } from './supabase';

export interface SubscriptionSyncData {
  id: string;
  user_email: string;
  school_name: string;
  phone: string;
  plan_name: string;
  plan_price: number;
  student_count: number;
  billing_cycle: string;
  status: string;
  trial_end_date: string;
  subscription_start_date: string;
  next_billing_date: string;
  razorpay_subscription_id?: string;
  metadata?: any;
}

/**
 * Sync subscription to main app with full security
 */
export async function syncSubscriptionToMainApp(
  subscriptionData: SubscriptionSyncData
): Promise<{ success: boolean; error?: string }> {
  try {
    const mainAppUrl = process.env.MAIN_APP_URL;
    
    if (!mainAppUrl) {
      console.error('MAIN_APP_URL not configured - skipping sync');
      // Log to retry queue
      await queueForRetry(subscriptionData);
      return { success: false, error: 'Main app URL not configured' };
    }
    
    // Make secure request to main app
    const response = await makeSecureRequest({
      url: `${mainAppUrl}/api/sync/subscription`,
      method: 'POST',
      payload: subscriptionData,
      service: 'landing-page',
      permissions: ['subscription:write'],
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Sync failed:', response.status, errorText);
      
      // Queue for retry
      await queueForRetry(subscriptionData);
      
      // Alert admin
      await sendAdminAlert('Subscription sync failed', {
        status: response.status,
        error: errorText,
        subscription_id: subscriptionData.id,
      });
      
      return { success: false, error: `HTTP ${response.status}` };
    }
    
    const result = await response.json();
    
    // Log successful sync
    await logSyncEvent({
      subscription_id: subscriptionData.id,
      success: true,
      timestamp: new Date().toISOString(),
    });
    
    return { success: true };
    
  } catch (error: any) {
    console.error('Sync error:', error);
    
    // Queue for retry
    await queueForRetry(subscriptionData);
    
    // Alert admin
    await sendAdminAlert('Subscription sync error', {
      error: error.message,
      subscription_id: subscriptionData.id,
    });
    
    return { success: false, error: error.message };
  }
}

/**
 * Queue failed sync for retry
 */
async function queueForRetry(subscriptionData: SubscriptionSyncData): Promise<void> {
  try {
    await supabase.from('sync_retry_queue').insert({
      subscription_id: subscriptionData.id,
      data: subscriptionData,
      retry_count: 0,
      next_retry_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // Retry in 5 minutes
      status: 'pending',
    });
  } catch (error) {
    console.error('Failed to queue retry:', error);
  }
}

/**
 * Log sync event for audit trail
 */
async function logSyncEvent(event: {
  subscription_id: string;
  success: boolean;
  timestamp: string;
  error?: string;
}): Promise<void> {
  try {
    await supabase.from('sync_audit_logs').insert({
      subscription_id: event.subscription_id,
      success: event.success,
      error: event.error,
      synced_at: event.timestamp,
    });
  } catch (error) {
    console.error('Failed to log sync event:', error);
  }
}

/**
 * Send alert to admin
 */
async function sendAdminAlert(subject: string, details: any): Promise<void> {
  // TODO: Implement email/SMS/Slack notification
  console.error('ADMIN ALERT:', subject, JSON.stringify(details, null, 2));
  
  // Log to database
  try {
    await supabase.from('admin_alerts').insert({
      subject,
      details,
      created_at: new Date().toISOString(),
      resolved: false,
    });
  } catch (error) {
    console.error('Failed to log admin alert:', error);
  }
}

/**
 * Process retry queue (run this as a background job)
 */
export async function processRetryQueue(): Promise<void> {
  try {
    // Get pending retries that are ready
    const { data: retries, error } = await supabase
      .from('sync_retry_queue')
      .select('*')
      .eq('status', 'pending')
      .lte('next_retry_at', new Date().toISOString())
      .lt('retry_count', 5) // Max 5 retries
      .limit(10);
    
    if (error) {
      console.error('Failed to fetch retry queue:', error);
      return;
    }
    
    if (!retries || retries.length === 0) {
      return;
    }
    
    for (const retry of retries) {
      const result = await syncSubscriptionToMainApp(retry.data);
      
      if (result.success) {
        // Mark as completed
        await supabase
          .from('sync_retry_queue')
          .update({ status: 'completed', completed_at: new Date().toISOString() })
          .eq('id', retry.id);
      } else {
        // Increment retry count and schedule next retry
        const nextRetryMinutes = Math.pow(2, retry.retry_count + 1) * 5; // Exponential backoff
        await supabase
          .from('sync_retry_queue')
          .update({
            retry_count: retry.retry_count + 1,
            next_retry_at: new Date(Date.now() + nextRetryMinutes * 60 * 1000).toISOString(),
            last_error: result.error,
          })
          .eq('id', retry.id);
      }
    }
  } catch (error) {
    console.error('Retry queue processing error:', error);
  }
}
