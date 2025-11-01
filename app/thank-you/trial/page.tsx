import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle2, Mail, ArrowRight, Sparkles, Clock, BookOpen, Zap } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Thank You - Free Trial Started | Catalyst Wells",
  description: "Your free trial has been activated. Check your email for next steps.",
};

export default function TrialThankYouPage() {
  return (
    <main className="min-h-screen bg-black">
      <Header />
      
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-neon-blue/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-neon-purple/20 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-neon-cyan/10 rounded-full blur-3xl animate-float" style={{animationDelay: '4s'}}></div>
        </div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>

        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="glass-dark rounded-3xl p-8 sm:p-12 lg:p-16 border border-white/10 text-center">
            {/* Success Icon */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-premium-emerald via-neon-cyan to-neon-blue blur-2xl opacity-50 animate-pulse"></div>
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-premium-emerald via-neon-cyan to-neon-blue flex items-center justify-center animate-float">
                  <CheckCircle2 size={48} className="text-white" strokeWidth={2} />
                </div>
              </div>
            </div>

            {/* Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
              <span className="gradient-text">Welcome Aboard!</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-300 mb-4 max-w-2xl mx-auto leading-relaxed">
              Your 14-day free trial has been activated successfully!
            </p>
            
            <p className="text-base sm:text-lg text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              Check your email inbox for your trial activation link and getting started guide.
            </p>

            {/* What's Next Section */}
            <div className="grid sm:grid-cols-3 gap-6 mb-12 text-left">
              <div className="glass rounded-2xl p-6 border border-white/10">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-blue to-neon-cyan flex items-center justify-center mb-4">
                  <Mail size={24} className="text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Check Your Email</h3>
                <p className="text-sm text-gray-400">We've sent you a verification link and setup instructions.</p>
              </div>

              <div className="glass rounded-2xl p-6 border border-white/10">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center mb-4">
                  <BookOpen size={24} className="text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Explore Features</h3>
                <p className="text-sm text-gray-400">Browse our documentation to learn about all features.</p>
              </div>

              <div className="glass rounded-2xl p-6 border border-white/10">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-cyan to-premium-emerald flex items-center justify-center mb-4">
                  <Zap size={24} className="text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Get Started</h3>
                <p className="text-sm text-gray-400">Set up your account and start transforming education.</p>
              </div>
            </div>

            {/* Benefits List */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">What's included in your trial:</h2>
              <div className="grid sm:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
                {[
                  'Full access to all premium features',
                  'Unlimited students and staff',
                  'AI-powered analytics',
                  'Priority support',
                  'Custom integrations',
                  'Advanced reporting'
                ].map((benefit, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle2 size={20} className="text-premium-emerald flex-shrink-0" />
                    <span className="text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/documentation" className="group relative px-8 py-4 rounded-xl overflow-hidden font-semibold text-white">
                <div className="absolute inset-0 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-cyan"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center justify-center space-x-2">
                  <span>View Documentation</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <Link href="/" className="px-8 py-4 rounded-xl font-semibold text-white border border-white/20 hover:border-neon-cyan/40 hover:bg-white/5 transition-all">
                Back to Home
              </Link>
            </div>

            {/* Additional Info */}
            <div className="mt-12 pt-8 border-t border-white/10">
              <p className="text-sm text-gray-400 flex items-center justify-center gap-2">
                <Clock size={16} />
                <span>Your trial expires in 14 days. No credit card required.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
