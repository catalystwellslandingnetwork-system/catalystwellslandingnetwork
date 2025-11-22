"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle, Sparkles, ArrowRight, Calendar, Users, Mail, Gift, Zap, Trophy } from "lucide-react";

function TrialSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const subscriptionId = searchParams.get("subscription");

  return (
    <main className="min-h-screen bg-black">
      <Header />

      <div className="pt-24 pb-16 px-4 sm:px-6">
        <div className="container mx-auto max-w-3xl">
          {/* Success Animation */}
          <div className="text-center mb-12">
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 -m-4">
                <div className="absolute inset-0 rounded-full bg-green-500/20 animate-ping"></div>
              </div>
              <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 shadow-2xl shadow-green-500/50">
                <CheckCircle className="text-white animate-bounce" size={56} strokeWidth={3} />
              </div>
              <Sparkles className="absolute -top-2 -right-2 text-yellow-400 animate-pulse" size={24} />
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
              <span className="text-white">Trial </span>
              <span className="gradient-text">Activated!</span>
              <span className="inline-block ml-2">🎉</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-300 mb-6">
              Welcome to <span className="font-bold gradient-text">Catalyst Wells</span>!
              Your 30-day free trial has been activated.
            </p>

            <div className="flex items-center justify-center gap-4 flex-wrap">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30">
                <Trophy className="text-green-400" size={18} />
                <span className="text-sm font-semibold text-green-400">Trial Active</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-neon-cyan/20 to-neon-blue/20 border border-neon-cyan/30">
                <Gift className="text-neon-cyan" size={18} />
                <span className="text-sm font-semibold text-neon-cyan">No Payment Required</span>
              </div>
            </div>
          </div>

          {/* Trial Information */}
          <div className="relative group mb-8">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink rounded-3xl opacity-30 blur-lg"></div>
            <div className="relative glass-dark rounded-2xl p-8 border border-neon-cyan/40 bg-gradient-to-br from-neon-cyan/10 via-neon-purple/5 to-transparent">
              <div className="flex items-start gap-6">
                <div className="relative flex-shrink-0">
                  <div className="absolute -inset-2 bg-gradient-to-br from-neon-cyan to-neon-purple rounded-2xl blur-md opacity-50"></div>
                  <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center">
                    <Calendar className="text-white" size={32} />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-3">Your 30-Day Free Trial</h3>
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    You now have <span className="font-bold text-white">unlimited access</span> to all Catalyst Wells features for 30 days.
                    Test with up to <span className="font-bold text-neon-cyan">75 students</span> at no cost!
                  </p>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30 inline-flex">
                    <Users size={18} className="text-neon-cyan" />
                    <span className="font-semibold text-neon-cyan">Up to 75 Students</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="glass-dark rounded-2xl p-8 border border-white/10 mb-8">
            <h3 className="text-xl font-bold text-white mb-6">What's Next?</h3>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-neon-cyan/20 flex items-center justify-center flex-shrink-0 text-neon-cyan font-bold">
                  1
                </div>
                <div>
                  <div className="font-semibold text-white mb-1">Check Your Email</div>
                  <div className="text-gray-400 text-sm">
                    We've sent you login credentials and setup instructions to get started.
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
                    Our team will contact you within 24 hours for a personalized onboarding session.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-neon-pink/20 flex items-center justify-center flex-shrink-0 text-neon-pink font-bold">
                  3
                </div>
                <div>
                  <div className="font-semibold text-white mb-1">Explore All Features</div>
                  <div className="text-gray-400 text-sm">
                    Access your dashboard and start testing all features with your students.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            <button
              onClick={() => router.push('/pricing')}
              className="relative overflow-hidden px-6 py-4 rounded-xl font-semibold transition-all active:scale-95 border border-white/20 hover:border-neon-cyan/50"
            >
              <span className="relative z-10 flex items-center justify-center space-x-2 text-white hover:text-neon-cyan transition-colors">
                <Zap size={18} />
                <span>View Pricing Plans</span>
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
            <div className="glass-dark rounded-2xl p-6 border border-white/10">
              <h4 className="text-lg font-bold text-white mb-4">Need Help?</h4>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href="mailto:legal@catalystwells.in" className="flex items-center gap-2 text-neon-cyan hover:underline">
                  <Mail size={18} />
                  <span>legal@catalystwells.in</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

export default function TrialSuccessPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </main>
    }>
      <TrialSuccessContent />
    </Suspense>
  );
}
