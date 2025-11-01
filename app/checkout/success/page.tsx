"use client";

import { useEffect, useState } from "react";

// Force dynamic rendering for this page (uses useSearchParams)
export const dynamic = 'force-dynamic';
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle, Sparkles, ArrowRight, Download, Calendar, Users, Mail } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface SubscriptionDetails {
  id: string;
  user_email: string;
  school_name: string;
  plan_name: string;
  plan_price: number;
  student_count: number;
  status: string;
  trial_end_date: string;
  created_at: string;
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

  if (loading) {
    return (
      <main className="min-h-screen bg-black">
        <Header />
        <div className="pt-24 pb-16 px-4 sm:px-6">
          <div className="container mx-auto max-w-3xl text-center">
            <div className="text-white">Loading...</div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black">
      <Header />
      
      <div className="pt-24 pb-16 px-4 sm:px-6">
        <div className="container mx-auto max-w-3xl">
          {/* Success Animation */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 mb-6 animate-bounce">
              <CheckCircle className="text-green-400" size={48} />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Payment Successful! 🎉
            </h1>
            <p className="text-lg text-gray-400">
              Welcome to Catalyst Wells! Your journey to educational excellence begins now.
            </p>
          </div>

          {/* Subscription Details Card */}
          {subscription && (
            <div className="glass-dark rounded-2xl p-6 sm:p-8 border border-white/10 mb-8">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="text-neon-cyan" size={24} />
                <h2 className="text-2xl font-bold text-white">Subscription Details</h2>
              </div>

              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-black/30 rounded-xl p-4">
                    <div className="text-sm text-gray-400 mb-1">School Name</div>
                    <div className="text-white font-semibold">{subscription.school_name}</div>
                  </div>
                  <div className="bg-black/30 rounded-xl p-4">
                    <div className="text-sm text-gray-400 mb-1">Email</div>
                    <div className="text-white font-semibold">{subscription.user_email}</div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-black/30 rounded-xl p-4">
                    <div className="text-sm text-gray-400 mb-1">Plan</div>
                    <div className="text-white font-semibold">{subscription.plan_name}</div>
                  </div>
                  <div className="bg-black/30 rounded-xl p-4">
                    <div className="text-sm text-gray-400 mb-1">Students</div>
                    <div className="text-white font-semibold flex items-center gap-2">
                      <Users size={18} className="text-neon-cyan" />
                      {subscription.student_count}
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-black/30 rounded-xl p-4">
                    <div className="text-sm text-gray-400 mb-1">Monthly Cost</div>
                    <div className="text-white font-semibold">
                      ₹{(subscription.plan_price * subscription.student_count).toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-black/30 rounded-xl p-4">
                    <div className="text-sm text-gray-400 mb-1">Status</div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-semibold">
                      <div className="w-2 h-2 rounded-full bg-green-400"></div>
                      {subscription.status === 'trial' ? '30-Day Trial Active' : 'Active'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Trial Information */}
          <div className="glass-dark rounded-2xl p-6 sm:p-8 border border-neon-cyan/30 mb-8 bg-gradient-to-br from-neon-cyan/5 to-neon-purple/5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center flex-shrink-0">
                <Calendar className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Your 30-Day Free Trial</h3>
                <p className="text-gray-300 mb-4">
                  Experience the full power of Catalyst Wells with unlimited access to all features for 30 days.
                  Test with up to 75 students at no cost.
                </p>
                {subscription?.trial_end_date && (
                  <div className="flex items-center gap-2 text-neon-cyan font-semibold">
                    <Calendar size={18} />
                    <span>Trial ends on {formatDate(subscription.trial_end_date)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="glass-dark rounded-2xl p-6 sm:p-8 border border-white/10 mb-8">
            <h3 className="text-xl font-bold text-white mb-6">What's Next?</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-neon-cyan/20 flex items-center justify-center flex-shrink-0 text-neon-cyan font-bold">
                  1
                </div>
                <div>
                  <div className="font-semibold text-white mb-1">Check Your Email</div>
                  <div className="text-gray-400 text-sm">
                    We've sent you a confirmation email with login credentials and setup instructions.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-neon-purple/20 flex items-center justify-center flex-shrink-0 text-neon-purple font-bold">
                  2
                </div>
                <div>
                  <div className="font-semibold text-white mb-1">Schedule Onboarding</div>
                  <div className="text-gray-400 text-sm">
                    Our team will contact you within 24 hours to schedule a personalized onboarding session.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-neon-pink/20 flex items-center justify-center flex-shrink-0 text-neon-pink font-bold">
                  3
                </div>
                <div>
                  <div className="font-semibold text-white mb-1">Start Using Catalyst Wells</div>
                  <div className="text-gray-400 text-sm">
                    Access your dashboard and start exploring all features immediately.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            <button className="relative group/btn overflow-hidden px-6 py-4 rounded-xl font-semibold transition-all active:scale-95 border border-white/20 hover:border-white/40">
              <span className="relative z-10 flex items-center justify-center space-x-2 text-white">
                <Download size={18} />
                <span>Download Receipt</span>
              </span>
            </button>

            <button 
              onClick={() => router.push('/')}
              className="relative group/btn overflow-hidden px-6 py-4 rounded-xl font-semibold transition-all active:scale-95"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink opacity-0 group-hover/btn:opacity-100 transition-opacity blur-sm"></div>
              <span className="relative z-10 flex items-center justify-center space-x-2 text-white">
                <span>Back to Home</span>
                <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
              </span>
            </button>
          </div>

          {/* Support Contact */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 text-sm text-gray-300">
              <Mail size={16} className="text-neon-cyan" />
              <span>Need help? Contact us at</span>
              <a href="mailto:support@catalystwells.com" className="text-neon-cyan hover:underline">
                support@catalystwells.com
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
