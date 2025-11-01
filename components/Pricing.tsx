"use client";

import { Check, Star, Zap, Building2, Crown, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

const pricingPlans = [
  {
    name: "Catalyst AI",
    icon: Zap,
    price: "15",
    period: "student/month",
    description: "The essential plan to connect your school and introduce the power of AI.",
    features: [
      "Luminex Pro",
      "70 AI Credits per Student (Monthly)",
      "All Dashboards (Student, Parent, Teacher, Admin)",
      "Core Modules (Gamification, Holistic Growth Report, Class Community)",
      "On-Demand Branded Report Cards",
      "Metered AI Tools (Study Coach, Teacher Co-Pilot, Parent Summaries)",
      "Enterprise-Grade Security",
      "Standard Support"
    ],
    popular: false,
    gradient: "from-neon-blue to-neon-cyan",
    badge: null
  },
  {
    name: "Catalyst AI Pro",
    icon: Building2,
    price: "25",
    period: "student/month",
    description: "The best-value plan for fully empowering your students and staff with AI.",
    features: [
      "Luminex AI Pro Plus",
      "150 AI Credits per Student (Monthly)",
      "All Dashboards (Student, Parent, Teacher, Admin)",
      "Core Modules (Gamification, Holistic Growth Report, Class Community)",
      "On-Demand Branded Report Cards",
      "Expanded AI Tools (More Credits for all tools)",
      "Enterprise-Grade Security",
      "Standard Support"
    ],
    popular: true,
    gradient: "from-neon-purple via-neon-pink to-premium-purple",
    badge: "Most Popular"
  },
  {
    name: "Catalyst AI Extreme",
    icon: Crown,
    price: "500",
    period: "student/month",
    description: "The ultimate all-inclusive partnership for visionary institutions.",
    features: [
      "Luminex AI Extreme",
      "UNLIMITED AI Credits for All Users",
      "All Dashboards & Core Modules",
      "All Premium Resources Included",
      "Unlimited AI Access",
      "Real-Time Van Tracking Module",
      "Priority Access to All Future Hardware",
      "Premium API & SIS Integration",
      "24/7 Priority Support",
      "Dedicated Account Manager"
    ],
    popular: false,
    gradient: "from-premium-gold via-premium-pink to-neon-pink",
    badge: "Ultimate"
  }
];

export default function Pricing() {
  return (
    <section id="pricing" className="relative py-16 sm:py-24 lg:py-32 px-4 sm:px-6 bg-black overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 mesh-gradient"></div>
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-neon-cyan/10 rounded-full blur-3xl animate-float" style={{animationDelay: '3s'}}></div>
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 lg:mb-20">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 rounded-full glass border border-white/10 text-sm text-gray-300 flex items-center space-x-2">
              <Sparkles size={14} className="text-neon-cyan" />
              <span>Transparent Pricing</span>
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4 sm:mb-6">
            <span className="text-white">Simple, </span>
            <span className="gradient-text">Predictable Pricing</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-400 leading-relaxed px-4 sm:px-0">
            No hidden fees. No surprises. Choose the plan that fits your needs.
          </p>
        </div>

        {/* Trial Information Banner */}
        <div className="max-w-4xl mx-auto mb-12 sm:mb-16">
          <div className="relative group">
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink rounded-2xl opacity-30 group-hover:opacity-50 blur-xl transition-all duration-500"></div>
            
            {/* Card */}
            <div className="relative glass-dark rounded-2xl p-6 sm:p-8 border border-white/20">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="text-center sm:text-left flex-1">
                  <div className="flex items-center justify-center sm:justify-start gap-2 mb-3">
                    <Sparkles className="text-neon-cyan" size={20} />
                    <h3 className="text-xl sm:text-2xl font-bold text-white">Start Your Free Trial Today</h3>
                  </div>
                  <p className="text-gray-300 text-sm sm:text-base mb-2">
                    Experience the full power of Catalyst Wells with our
                  </p>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-4 text-sm sm:text-base">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-neon-cyan"></div>
                      <span className="text-white font-semibold">30-Day Free Trial</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-neon-purple"></div>
                      <span className="text-white font-semibold">Up to 75 Students</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-neon-pink"></div>
                      <span className="text-white font-semibold">All Features Included</span>
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <Link href="/checkout" className="relative group/cta overflow-hidden px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold transition-all active:scale-95 inline-block">
                    <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink opacity-0 group-hover/cta:opacity-100 transition-opacity blur-sm"></div>
                    <span className="relative z-10 flex items-center space-x-2 text-white text-sm sm:text-base">
                      <span>Get Started Free</span>
                      <ArrowRight size={18} className="group-hover/cta:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8 mb-12 sm:mb-16 lg:mb-20">
          {pricingPlans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <div
                key={index}
                className={`group relative ${
                  plan.popular ? 'sm:-mt-4 lg:-mt-8' : ''
                }`}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2 z-20">
                    <div className={`bg-gradient-to-r ${plan.gradient} px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold text-white shadow-xl flex items-center space-x-1.5 sm:space-x-2`}>
                      <Star size={12} className="sm:w-3.5 sm:h-3.5" fill="currentColor" />
                      <span>{plan.badge}</span>
                    </div>
                  </div>
                )}

                {/* Glow Effect */}
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${plan.gradient} rounded-3xl opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500`}></div>

                {/* Card */}
                <div className={`relative glass-dark rounded-2xl sm:rounded-3xl p-6 sm:p-7 lg:p-8 border active:scale-[0.98] transition-all duration-500 touch-manipulation ${
                  plan.popular 
                    ? 'border-white/20 sm:py-8 lg:py-12' 
                    : 'border-white/10 hover:border-white/20'
                }`}>
                  {/* Icon */}
                  <div className="flex items-center justify-between mb-5 sm:mb-6">
                    <div className="relative">
                      <div className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500`}></div>
                      <div className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center`}>
                        <Icon size={20} className="sm:w-6 sm:h-6 text-white" strokeWidth={2} />
                      </div>
                    </div>
                  </div>

                  {/* Plan Info */}
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-gray-400 text-xs sm:text-sm mb-6 sm:mb-8 leading-relaxed">{plan.description}</p>

                  {/* Price */}
                  <div className="mb-6 sm:mb-8">
                    <div className="flex items-baseline">
                      <span className="text-4xl sm:text-5xl font-bold text-white">₹{plan.price}</span>
                      {plan.period && <span className="text-gray-400 ml-2 text-sm sm:text-base">/{plan.period}</span>}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Link 
                    href={`/checkout?plan=${encodeURIComponent(plan.name.toLowerCase())}`}
                    className={`block w-full py-3.5 sm:py-4 rounded-xl font-semibold transition-all mb-6 sm:mb-8 relative overflow-hidden group/btn active:scale-95 touch-manipulation ${
                      plan.popular
                        ? ''
                        : 'border border-white/20 hover:border-white/40'
                    }`}
                  >
                    {plan.popular && (
                      <>
                        <div className={`absolute inset-0 bg-gradient-to-r ${plan.gradient}`}></div>
                        <div className={`absolute inset-0 bg-gradient-to-r ${plan.gradient} opacity-0 group-hover/btn:opacity-100 transition-opacity blur-sm`}></div>
                      </>
                    )}
                    <span className={`relative z-10 flex items-center justify-center space-x-2 text-sm sm:text-base ${
                      plan.popular ? 'text-white' : 'text-gray-300 group-hover/btn:text-white'
                    }`}>
                      <span>Start Your 30-Day Free Trial</span>
                      <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform flex-shrink-0" />
                    </span>
                  </Link>

                  {/* Features */}
                  <div className="space-y-3 sm:space-y-4">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      What's Included
                    </div>
                    <ul className="space-y-2.5 sm:space-y-3">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start text-gray-300 text-xs sm:text-sm">
                          <Check size={16} className="sm:w-[18px] sm:h-[18px] text-neon-cyan mr-2.5 sm:mr-3 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                          <span className="leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust Section */}
        <div className="text-center overflow-hidden">
          <p className="text-sm sm:text-base text-gray-400 mb-6 sm:mb-8">Trusted by industry leaders worldwide</p>
          <div className="relative">
            <div className="flex animate-scroll whitespace-nowrap">
              {['ACE Education', 'Astrix Fizzle', 'Supabase', 'Vercel', 'Google', 'Global Academy', 'EduTech Pro', 'ACE Education', 'Astrix Fizzle', 'Supabase', 'Vercel', 'Google', 'Global Academy', 'EduTech Pro'].map((company, idx) => (
                <div key={idx} className="inline-flex items-center justify-center px-8 sm:px-12 text-base sm:text-lg lg:text-xl font-bold text-gray-500 opacity-40">
                  {company}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
