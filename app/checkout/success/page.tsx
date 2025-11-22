"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  CheckCircle, Sparkles, ArrowRight, Download, Calendar, Users, Mail,
  Shield, Award, ExternalLink, Phone, Clock, CreditCard, FileText,
  Building2, Globe, HeadphonesIcon, Rocket
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { generateInvoiceFromSubscription } from "@/lib/invoice-pdf";

interface SubscriptionDetails {
  id: string;
  user_email: string;
  school_name?: string;
  plan_name: string;
  plan_price: number;
  student_count?: number;
  status: string;
  trial_end_date?: string;
  created_at: string;
  school_id?: string;
  metadata?: {
    student_count?: number;
    school_name?: string;
    [key: string]: any;
  };
}

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const subscriptionId = searchParams.get("subscription");
  
  const [subscription, setSubscription] = useState<SubscriptionDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!subscriptionId) {
      router.push("/pricing");
      return;
    }

    fetchSubscriptionDetails();
  }, [subscriptionId]);

  const fetchSubscriptionDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('id', subscriptionId)
        .single();

      if (error) throw error;
      setSubscription(data);
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDownloadInvoice = () => {
    if (!subscription) return;
    
    try {
      const pdf = generateInvoiceFromSubscription(subscription);
      const filename = `CatalystWells_Invoice_${subscription.id.substring(0, 8).toUpperCase()}.pdf`;
      pdf.save(filename);
    } catch (error) {
      console.error('Error generating invoice:', error);
      alert('Failed to generate invoice. Please contact support.');
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-black">
        <Header />
        <div className="pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6">
          <div className="container mx-auto max-w-3xl text-center">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="w-12 h-12 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin"></div>
              <div className="text-white text-lg">Loading your details...</div>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black">
      <Header />
      
      <div className="pt-20 sm:pt-24 pb-12 sm:pb-16 px-3 sm:px-4 lg:px-6">
        <div className="container mx-auto max-w-5xl">
          {/* Success Animation & Header */}
          <div className="text-center mb-8 sm:mb-12">
            {/* Animated Success Icon */}
            <div className="relative inline-block mb-4 sm:mb-6">
              <div className="absolute inset-0 bg-green-500/30 rounded-full blur-2xl animate-pulse"></div>
              <div className="relative inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/50">
                <CheckCircle className="text-white w-12 h-12 sm:w-14 sm:h-14" strokeWidth={2.5} />
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 px-2">
              Payment Confirmed!
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 max-w-2xl mx-auto px-2">
              Your subscription to <span className="text-neon-cyan font-semibold">Catalyst Wells</span> has been activated. Welcome aboard!
            </p>

            {/* Quick Status Badges - Mobile Optimized */}
            <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-2 sm:gap-3 mb-6 sm:mb-8 px-2">
              <div className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-green-500/20 border border-green-500/30">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                <span className="text-sm font-medium text-green-400">Subscription Active</span>
              </div>
              <div className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-blue-500/20 border border-blue-500/30">
                <Shield size={14} className="text-blue-400" />
                <span className="text-sm font-medium text-blue-400">Payment Verified</span>
              </div>
              <div className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-purple-500/20 border border-purple-500/30">
                <Rocket size={14} className="text-purple-400" />
                <span className="text-sm font-medium text-purple-400">Account Activated</span>
              </div>
            </div>
          </div>

          {/* Order Invoice/Receipt Card */}
          {subscription && (
            <div className="glass-dark rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/10 mb-6 sm:mb-8">
              {/* Invoice Header - Mobile Optimized */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-white/10 gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2">
                    <FileText className="text-neon-cyan" size={24} />
                    <h2 className="text-xl sm:text-2xl font-bold text-white">Order Invoice</h2>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-400 break-all">ID: {subscription.id.slice(0, 13).toUpperCase()}</p>
                  <p className="text-xs sm:text-sm text-gray-400">{formatDate(subscription.created_at)}</p>
                </div>
                <button 
                  onClick={handleDownloadInvoice}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/20 transition-colors active:scale-95 w-full sm:w-auto"
                >
                  <Download size={16} />
                  <span className="text-sm font-medium">Download PDF</span>
                </button>
              </div>

              {/* Billed To */}
              <div className="mb-6 sm:mb-8">
                <h3 className="text-xs sm:text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">Billed To</h3>
                <div className="bg-black/30 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <Building2 className="text-neon-purple mt-1 flex-shrink-0" size={20} />
                    <div className="min-w-0 flex-1">
                      <div className="text-base sm:text-lg font-semibold text-white mb-1 truncate">
                        {subscription.school_name || subscription.metadata?.school_name || 'Your School'}
                      </div>
                      <div className="text-sm text-gray-400 break-all">{subscription.user_email}</div>
                      {subscription.school_id && (
                        <div className="text-xs text-gray-500 mt-1">School ID: {subscription.school_id.slice(0, 8).toUpperCase()}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Details - Mobile Optimized */}
              <div className="mb-6 sm:mb-8">
                <h3 className="text-xs sm:text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">Order Details</h3>
                
                {/* Mobile Card Layout */}
                <div className="bg-black/30 rounded-xl overflow-hidden">
                  {/* Plan Details */}
                  <div className="p-4 sm:p-5 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="font-semibold text-white text-base sm:text-lg mb-1">{subscription.plan_name}</div>
                        <div className="text-xs sm:text-sm text-gray-400">Monthly Subscription</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg sm:text-xl font-bold text-white">
                          ₹{(subscription.plan_price * (subscription.student_count || subscription.metadata?.student_count || 100)).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    
                    {/* Breakdown */}
                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10">
                      <div className="bg-black/30 rounded-lg p-3">
                        <div className="text-xs text-gray-400 mb-1">Students</div>
                        <div className="flex items-center gap-1.5 text-white font-semibold">
                          <Users size={16} className="text-neon-cyan" />
                          <span>{subscription.student_count || subscription.metadata?.student_count || '100'}</span>
                        </div>
                      </div>
                      <div className="bg-black/30 rounded-lg p-3">
                        <div className="text-xs text-gray-400 mb-1">Rate/Student</div>
                        <div className="text-white font-semibold">₹{subscription.plan_price}</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Total */}
                  <div className="bg-gradient-to-r from-neon-cyan/10 to-neon-blue/10 border-t-2 border-neon-cyan/30 p-4 sm:p-5">
                    <div className="flex items-center justify-between">
                      <div className="text-base sm:text-lg font-bold text-white">Total Amount</div>
                      <div className="text-2xl sm:text-3xl font-bold text-neon-cyan">
                        ₹{(subscription.plan_price * (subscription.student_count || subscription.metadata?.student_count || 100)).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="flex items-center gap-3 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <CreditCard className="text-green-400" size={20} />
                <div>
                  <div className="text-sm font-semibold text-white">Payment Method</div>
                  <div className="text-sm text-gray-400">Secured payment via Razorpay</div>
                </div>
              </div>
            </div>
          )}

          {/* Next Steps - Enterprise - Mobile Optimized */}
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {/* Immediate Access */}
            <div className="glass-dark rounded-xl sm:rounded-2xl p-5 sm:p-6 border border-neon-cyan/30 bg-gradient-to-br from-neon-cyan/5 to-transparent">
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-blue flex items-center justify-center flex-shrink-0">
                  <Rocket className="text-white" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Instant Dashboard Access</h3>
                  <p className="text-gray-300 mb-4 text-sm">
                    Your admin dashboard is ready. Start exploring features and setting up your school immediately.
                  </p>
                  <a 
                    href="https://catalystwells.in" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-neon-cyan text-black font-semibold hover:bg-neon-cyan/90 transition-all active:scale-95 w-full sm:w-auto"
                  >
                    <span>Open Dashboard</span>
                    <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            </div>

            {/* Onboarding Support */}
            <div className="glass-dark rounded-xl sm:rounded-2xl p-5 sm:p-6 border border-neon-purple/30 bg-gradient-to-br from-neon-purple/5 to-transparent">
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center flex-shrink-0">
                  <HeadphonesIcon className="text-white" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Dedicated Onboarding</h3>
                  <p className="text-gray-300 mb-4 text-sm">
                    Our team will contact you within 24 hours to schedule your personalized onboarding session.
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock size={14} className="text-neon-purple" />
                    <span className="text-gray-400">Expected call: Within 24 hours</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Implementation Roadmap - Mobile Optimized */}
          <div className="glass-dark rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/10 mb-6 sm:mb-8">
            <div className="flex items-center gap-2 sm:gap-3 mb-6">
              <Award className="text-neon-cyan flex-shrink-0" size={24} />
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white">Your Implementation Roadmap</h3>
            </div>
            
            <div className="space-y-4 sm:space-y-6">
              {/* Step 1 */}
              <div className="flex gap-3 sm:gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center flex-shrink-0 text-white font-bold shadow-lg shadow-green-500/50 text-lg">
                    ✓
                  </div>
                  <div className="w-0.5 h-full bg-gradient-to-b from-green-500 to-blue-500 mt-2"></div>
                </div>
                <div className="flex-1 pb-4 sm:pb-6 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <div className="font-bold text-white text-base sm:text-lg">Payment Confirmed</div>
                    <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400 border border-green-500/30 whitespace-nowrap">Completed</span>
                  </div>
                  <div className="text-gray-400 text-sm mb-2">
                    Your subscription is active and payment has been processed successfully.
                  </div>
                  <div className="text-xs text-gray-500">Just now</div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-3 sm:gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 text-white font-bold shadow-lg shadow-blue-500/30">
                    <Mail size={18} />
                  </div>
                  <div className="w-0.5 h-full bg-gradient-to-b from-blue-500 to-purple-500 mt-2"></div>
                </div>
                <div className="flex-1 pb-4 sm:pb-6 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <div className="font-bold text-white text-base sm:text-lg">Confirmation Email Sent</div>
                    <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 whitespace-nowrap">In Progress</span>
                  </div>
                  <div className="text-gray-400 text-sm mb-2">
                    Check your inbox for detailed instructions, login credentials, and getting started guide.
                  </div>
                  <div className="text-xs text-neon-cyan break-all">{subscription?.user_email}</div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-3 sm:gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0 text-white font-bold">
                    <HeadphonesIcon size={18} />
                  </div>
                  <div className="w-0.5 h-full bg-gradient-to-b from-purple-500 to-neon-pink mt-2"></div>
                </div>
                <div className="flex-1 pb-4 sm:pb-6 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <div className="font-bold text-white text-base sm:text-lg">Onboarding Session</div>
                    <span className="px-2 py-0.5 text-xs rounded-full bg-gray-500/20 text-gray-400 border border-gray-500/30 whitespace-nowrap">Scheduled</span>
                  </div>
                  <div className="text-gray-400 text-sm mb-3">
                    Our implementation team will reach out to schedule a personalized onboarding call.
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock size={14} className="text-purple-400 flex-shrink-0" />
                    <span className="text-gray-400">Expected within 24 hours</span>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-3 sm:gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-neon-pink to-premium-purple flex items-center justify-center flex-shrink-0 text-white font-bold">
                    <Rocket size={18} />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <div className="font-bold text-white text-base sm:text-lg">Go Live</div>
                    <span className="px-2 py-0.5 text-xs rounded-full bg-gray-500/20 text-gray-400 border border-gray-500/30 whitespace-nowrap">Upcoming</span>
                  </div>
                  <div className="text-gray-400 text-sm">
                    Start using all features, import your data, and onboard your staff members.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons - Mobile Optimized */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-8 sm:mb-10">
            <a 
              href="https://catalystwells.in" 
              target="_blank" 
              rel="noopener noreferrer"
              className="relative group/btn overflow-hidden px-6 py-4 rounded-xl font-semibold transition-all active:scale-95 shadow-lg"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan via-neon-blue to-neon-purple"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan via-neon-blue to-neon-purple opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
              <span className="relative z-10 flex items-center justify-center gap-2 text-white">
                <Globe size={18} />
                <span>Access Dashboard</span>
                <ExternalLink size={16} />
              </span>
            </a>

            <button 
              onClick={handleDownloadInvoice}
              className="relative group/btn overflow-hidden px-6 py-4 rounded-xl font-semibold transition-all active:scale-95 border-2 border-white/20 hover:border-neon-cyan/50 hover:bg-neon-cyan/5"
            >
              <span className="relative z-10 flex items-center justify-center gap-2 text-white">
                <Download size={18} />
                <span>Download Invoice</span>
              </span>
            </button>

            <button 
              onClick={() => router.push('/')}
              className="relative group/btn overflow-hidden px-6 py-4 rounded-xl font-semibold transition-all active:scale-95 border-2 border-white/10 hover:border-white/20"
            >
              <span className="relative z-10 flex items-center justify-center gap-2 text-white">
                <span>Return Home</span>
                <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
              </span>
            </button>
          </div>

          {/* Enterprise Support Section - Mobile Optimized */}
          <div className="glass-dark rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8 border border-white/10">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-5 sm:mb-6 text-center">24/7 Enterprise Support</h3>
            
            <div className="grid sm:grid-cols-3 gap-5 sm:gap-6">
              {/* Email Support */}
              <div className="text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-neon-cyan to-neon-blue flex items-center justify-center mx-auto mb-3 shadow-lg shadow-neon-cyan/30">
                  <Mail size={20} className="text-white" />
                </div>
                <div className="text-sm font-semibold text-gray-300 mb-1">Email Support</div>
                <a href="mailto:support@catalystwells.com" className="text-neon-cyan hover:underline text-sm break-all">
                  support@catalystwells.com
                </a>
                <div className="text-xs text-gray-500 mt-1">Response within 2 hours</div>
              </div>

              {/* Phone Support */}
              <div className="text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center mx-auto mb-3 shadow-lg shadow-neon-purple/30">
                  <Phone size={20} className="text-white" />
                </div>
                <div className="text-sm font-semibold text-gray-300 mb-1">Phone Support</div>
                <a href="tel:+918888888888" className="text-neon-purple hover:underline text-sm">
                  +91 88888 88888
                </a>
                <div className="text-xs text-gray-500 mt-1">Available 24/7</div>
              </div>

              {/* Live Chat */}
              <div className="text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-green-500/30">
                  <HeadphonesIcon size={20} className="text-white" />
                </div>
                <div className="text-sm font-semibold text-gray-300 mb-1">Live Chat</div>
                <button className="text-green-400 hover:underline text-sm active:scale-95 transition-transform">
                  Start Chat Now
                </button>
                <div className="text-xs text-gray-500 mt-1">Instant assistance</div>
              </div>
            </div>

            {/* Trust Footer - Mobile Optimized */}
            <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-white/10">
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm">
                <div className="flex items-center justify-center gap-2 text-gray-400">
                  <Shield size={16} className="text-green-400 flex-shrink-0" />
                  <span className="whitespace-nowrap">Bank-Level Security</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-gray-400">
                  <Award size={16} className="text-blue-400 flex-shrink-0" />
                  <span className="whitespace-nowrap">ISO Certified</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-gray-400">
                  <Globe size={16} className="text-purple-400 flex-shrink-0" />
                  <span className="whitespace-nowrap">500+ Schools</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-gray-400">
                  <Clock size={16} className="text-neon-cyan flex-shrink-0" />
                  <span className="whitespace-nowrap">99.9% Uptime</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
