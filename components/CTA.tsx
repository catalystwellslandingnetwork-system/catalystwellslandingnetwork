"use client";

import { ArrowRight, Mail, Sparkles, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CTA() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          type: 'trial',
          source: 'homepage-cta'
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: data.alreadyExists ? 'You\'re already subscribed!' : 'Success! Redirecting...' });
        setEmail('');
        
        // Redirect to appropriate thank you page after a short delay
        setTimeout(() => {
          router.push('/thank-you/trial');
        }, 1500);
      } else {
        setMessage({ type: 'error', text: data.error || 'Something went wrong. Please try again.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };
  return (
    <section id="contact" className="relative py-16 sm:py-24 lg:py-32 px-4 sm:px-6 bg-dark-900 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon-purple/10 rounded-full blur-3xl"></div>
      </div>

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neon-blue/5 via-transparent to-transparent"></div>

      <div className="container mx-auto max-w-5xl relative z-10">
        <div className="glass-dark rounded-2xl sm:rounded-3xl p-8 sm:p-10 lg:p-16 border border-white/10 text-center">
          {/* Icon */}
          <div className="flex justify-center mb-6 sm:mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-cyan blur-2xl opacity-50"></div>
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-gradient-to-br from-neon-blue via-neon-purple to-neon-cyan flex items-center justify-center animate-float">
                <Sparkles size={28} className="sm:w-9 sm:h-9 text-white" strokeWidth={2} />
              </div>
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4 sm:mb-6">
            <span className="text-white">Ready to </span>
            <span className="gradient-text">Get Started?</span>
          </h2>
          
          <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-8 sm:mb-10 lg:mb-12 max-w-2xl mx-auto leading-relaxed px-4 sm:px-0">
            Join thousands of institutions already transforming education with CatalystWells.
            Start your 14-day free trial today.
          </p>

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your work email"
                  required
                  disabled={loading}
                  className="w-full pl-11 pr-4 py-3.5 sm:py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan/50 focus:ring-2 focus:ring-neon-cyan/20 transition-all text-sm sm:text-base disabled:opacity-50"
                />
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="group relative px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl overflow-hidden font-semibold text-white whitespace-nowrap active:scale-95 transition-all touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-cyan"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center justify-center space-x-2 text-sm sm:text-base">
                  <span>{loading ? 'Subscribing...' : 'Start Free Trial'}</span>
                  {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                </span>
              </button>
            </div>
            {message && (
              <div className={`mt-3 text-sm text-center ${
                message.type === 'success' ? 'text-premium-emerald' : 'text-red-400'
              }`}>
                {message.text}
              </div>
            )}
          </form>

          {/* Trust Indicators */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <CheckCircle2 size={14} className="sm:w-4 sm:h-4 text-neon-cyan flex-shrink-0" />
              <span>No credit card required</span>
            </div>
            <div className="hidden sm:block w-1 h-1 rounded-full bg-gray-600"></div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 size={14} className="sm:w-4 sm:h-4 text-neon-cyan flex-shrink-0" />
              <span>14-day free trial</span>
            </div>
            <div className="hidden sm:block w-1 h-1 rounded-full bg-gray-600"></div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 size={14} className="sm:w-4 sm:h-4 text-neon-cyan flex-shrink-0" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
