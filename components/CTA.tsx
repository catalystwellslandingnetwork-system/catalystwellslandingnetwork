"use client";

import { ArrowRight, Mail, Sparkles, CheckCircle2, Zap, Crown, Shield } from "lucide-react";
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
    <section id="contact" className="relative py-24 sm:py-32 lg:py-40 xl:py-48 px-4 sm:px-6 lg:px-8 bg-dark-900 overflow-hidden">
      {/* Enhanced Background Effects - Optimized for Desktop */}
      <div className="absolute inset-0">
        {/* Multiple overlapping gradients for depth */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] lg:w-[1400px] lg:h-[1400px] bg-neon-purple/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 left-1/4 w-[700px] h-[700px] lg:w-[800px] lg:h-[800px] bg-neon-blue/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-[800px] h-[800px] lg:w-[900px] lg:h-[900px] bg-neon-cyan/10 rounded-full blur-3xl"></div>
      </div>

      {/* Animated particles - More visible on desktop */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[20%] left-[10%] w-2 h-2 lg:w-3 lg:h-3 bg-neon-cyan rounded-full animate-float opacity-60"></div>
        <div className="absolute top-[40%] right-[15%] w-1.5 h-1.5 lg:w-2.5 lg:h-2.5 bg-neon-purple rounded-full animate-float opacity-40" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-[30%] left-[20%] w-2 h-2 lg:w-3 lg:h-3 bg-neon-blue rounded-full animate-float opacity-50" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[60%] right-[25%] w-1 h-1 lg:w-2 lg:h-2 bg-neon-cyan rounded-full animate-float opacity-70" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-[15%] right-[35%] w-1.5 h-1.5 lg:w-2.5 lg:h-2.5 bg-neon-blue rounded-full animate-float opacity-45" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute bottom-[20%] right-[10%] w-2 h-2 lg:w-3 lg:h-3 bg-neon-purple rounded-full animate-float opacity-55" style={{ animationDelay: '2.5s' }}></div>
      </div>

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neon-blue/8 via-transparent to-transparent"></div>

      <div className="container mx-auto max-w-6xl xl:max-w-7xl relative z-10">
        <div className="relative group">
          {/* Premium glow effect on hover - Enhanced for desktop */}
          <div className="absolute -inset-1 lg:-inset-2 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-cyan rounded-3xl lg:rounded-4xl opacity-0 group-hover:opacity-20 blur-xl lg:blur-2xl transition-all duration-500"></div>

          <div className="relative glass-dark rounded-2xl sm:rounded-3xl lg:rounded-4xl p-12 sm:p-16 lg:p-24 xl:p-28 border border-white/10 text-center backdrop-blur-xl bg-dark-900/50 shadow-2xl">
            {/* Premium Badge - Enhanced for desktop */}
            <div className="flex justify-center mb-8 lg:mb-10">
              <div className="inline-flex items-center space-x-2.5 lg:space-x-3 px-5 lg:px-6 py-2.5 lg:py-3 rounded-full bg-gradient-to-r from-neon-blue/20 via-neon-purple/20 to-neon-cyan/20 border border-neon-cyan/30 shadow-lg">
                <Crown className="w-4 h-4 lg:w-5 lg:h-5 text-neon-cyan" />
                <span className="text-sm lg:text-base font-semibold text-neon-cyan tracking-wider">PREMIUM TRIAL OFFER</span>
              </div>
            </div>

            {/* Animated Icon - Larger on desktop */}
            <div className="flex justify-center mb-10 lg:mb-14">
              <div className="relative">
                {/* Pulsing glow rings */}
                <div className="absolute inset-0 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-cyan rounded-3xl blur-2xl lg:blur-3xl opacity-60 animate-pulse"></div>
                <div className="absolute -inset-2 lg:-inset-3 bg-gradient-to-r from-neon-cyan via-neon-blue to-neon-purple rounded-3xl blur-xl lg:blur-2xl opacity-30 animate-ping"></div>

                {/* Main icon container */}
                <div className="relative w-24 h-24 lg:w-32 lg:h-32 xl:w-36 xl:h-36 rounded-2xl lg:rounded-3xl bg-gradient-to-br from-neon-blue via-neon-purple to-neon-cyan flex items-center justify-center animate-float shadow-2xl">
                  <Sparkles size={48} className="lg:w-16 lg:h-16 xl:w-20 xl:h-20 text-white animate-pulse" strokeWidth={2.5} />
                </div>
              </div>
            </div>

            {/* Heading with enhanced styling - Perfect desktop sizing */}
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-display font-bold mb-8 lg:mb-10 xl:mb-12 leading-tight">
              <span className="text-white">Ready to </span>
              <span className="gradient-text inline-block hover:scale-105 transition-transform duration-300">Get Started?</span>
            </h2>

            <p className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl text-gray-300 mb-12 lg:mb-16 xl:mb-20 max-w-4xl mx-auto leading-relaxed font-light">
              Join <span className="text-neon-cyan font-semibold">10,000+</span> institutions transforming education with CatalystWells.
              <br className="hidden sm:block" />
              <span className="text-white font-medium">Start your 30-day free trial today.</span>
            </p>

            {/* Enhanced Email Form - Optimized for desktop */}
            <form onSubmit={handleSubmit} className="max-w-2xl lg:max-w-3xl mx-auto mb-10 lg:mb-14">
              <div className="flex flex-col sm:flex-row gap-4 lg:gap-5">
                <div className="relative flex-1 group">
                  <Mail className="absolute left-5 lg:left-6 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-neon-cyan transition-colors z-10" size={22} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your work email"
                    required
                    disabled={loading}
                    className="w-full pl-14 lg:pl-16 pr-6 py-5 lg:py-6 xl:py-7 rounded-2xl lg:rounded-3xl bg-white/5 border-2 border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan/60 focus:ring-4 focus:ring-neon-cyan/20 transition-all text-lg lg:text-xl disabled:opacity-50 backdrop-blur-sm hover:bg-white/8"
                  />
                </div>

                {/* Super impressive CTA button - Enterprise desktop sizing */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative px-10 lg:px-14 xl:px-16 py-5 lg:py-6 xl:py-7 rounded-2xl lg:rounded-3xl overflow-hidden font-bold text-white whitespace-nowrap transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-2xl"
                >
                  {/* Animated gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-cyan"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-blue opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Shimmer effect */}
                  <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"></div>

                  {/* Glow effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 blur-xl bg-gradient-to-r from-neon-blue via-neon-purple to-neon-cyan transition-opacity duration-300"></div>

                  <span className="relative z-10 flex items-center justify-center space-x-2.5 lg:space-x-3 text-lg lg:text-xl xl:text-2xl">
                    <Zap size={22} className="lg:w-6 lg:h-6 group-hover:rotate-12 transition-transform" />
                    <span>{loading ? 'Starting Your Trial...' : 'Start 30-Day Free Trial'}</span>
                    {!loading && <ArrowRight size={22} className="lg:w-6 lg:h-6 group-hover:translate-x-2 transition-transform" />}
                  </span>
                </button>
              </div>

              {message && (
                <div className={`mt-5 lg:mt-6 text-lg lg:text-xl text-center font-medium animate-fade-in ${message.type === 'success' ? 'text-premium-emerald' : 'text-red-400'
                  }`}>
                  {message.text}
                </div>
              )}
            </form>

            {/* Enhanced Trust Indicators - Better spacing for desktop */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 lg:gap-10 xl:gap-12 text-base lg:text-lg xl:text-xl">
              <div className="flex items-center space-x-3 lg:space-x-3.5 group cursor-default">
                <div className="relative">
                  <div className="absolute inset-0 bg-neon-cyan/30 rounded-full blur-md group-hover:blur-lg transition-all"></div>
                  <CheckCircle2 size={20} className="lg:w-6 lg:h-6 relative text-neon-cyan group-hover:scale-110 transition-transform" />
                </div>
                <span className="text-gray-300 group-hover:text-white transition-colors font-medium">No credit card required</span>
              </div>

              <div className="hidden sm:block w-2 h-2 rounded-full bg-gradient-to-r from-neon-blue to-neon-cyan"></div>

              <div className="flex items-center space-x-3 lg:space-x-3.5 group cursor-default">
                <div className="relative">
                  <div className="absolute inset-0 bg-neon-purple/30 rounded-full blur-md group-hover:blur-lg transition-all"></div>
                  <Shield size={20} className="lg:w-6 lg:h-6 relative text-neon-purple group-hover:scale-110 transition-transform" />
                </div>
                <span className="text-gray-300 group-hover:text-white transition-colors font-medium">
                  <span className="text-neon-cyan font-bold">30-day</span> free trial
                </span>
              </div>

              <div className="hidden sm:block w-2 h-2 rounded-full bg-gradient-to-r from-neon-purple to-neon-cyan"></div>

              <div className="flex items-center space-x-3 lg:space-x-3.5 group cursor-default">
                <div className="relative">
                  <div className="absolute inset-0 bg-neon-blue/30 rounded-full blur-md group-hover:blur-lg transition-all"></div>
                  <CheckCircle2 size={20} className="lg:w-6 lg:h-6 relative text-neon-blue group-hover:scale-110 transition-transform" />
                </div>
                <span className="text-gray-300 group-hover:text-white transition-colors font-medium">Cancel anytime</span>
              </div>
            </div>

            {/* Additional value proposition - Enhanced for desktop */}
            <div className="mt-12 lg:mt-16 pt-10 lg:pt-12 border-t border-white/5">
              <p className="text-base lg:text-lg xl:text-xl text-gray-400 italic">
                🎁 Full access to all premium features during your trial period
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
