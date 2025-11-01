"use client";

import { Zap, Shield, TrendingUp, Users, Clock, Award, Cpu, Database, Cloud, Lock, BarChart3, Rocket } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightning Performance",
    description: "Sub-millisecond response times powered by edge computing and intelligent caching.",
    gradient: "from-neon-blue to-neon-cyan"
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "SOC 2 Type II certified with end-to-end encryption and zero-trust architecture.",
    gradient: "from-neon-purple to-neon-pink"
  },
  {
    icon: Cloud,
    title: "Global Infrastructure",
    description: "99.99% uptime SLA with auto-scaling across 200+ edge locations worldwide.",
    gradient: "from-neon-cyan to-premium-emerald"
  },
  {
    icon: Cpu,
    title: "AI-Powered Analytics",
    description: "Real-time insights with machine learning models that predict and optimize.",
    gradient: "from-premium-purple to-neon-blue"
  },
  {
    icon: Database,
    title: "Unified Data Layer",
    description: "Seamlessly integrate all your data sources with our intelligent sync engine.",
    gradient: "from-premium-gold to-premium-pink"
  },
  {
    icon: Lock,
    title: "Compliance Ready",
    description: "GDPR, HIPAA, and SOC 2 compliant out of the box with automated auditing.",
    gradient: "from-neon-pink to-premium-purple"
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Real-time co-editing, comments, and workflows that scale with your team.",
    gradient: "from-premium-emerald to-neon-cyan"
  },
  {
    icon: BarChart3,
    title: "Advanced Reporting",
    description: "Custom dashboards with interactive visualizations and exportable reports.",
    gradient: "from-neon-blue to-premium-purple"
  },
  {
    icon: Rocket,
    title: "Rapid Deployment",
    description: "Go from zero to production in minutes with our automated setup wizard.",
    gradient: "from-neon-cyan to-neon-blue"
  }
];

export default function Features() {
  return (
    <section id="features" className="relative py-16 sm:py-24 lg:py-32 px-4 sm:px-6 bg-black overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-cyan/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 lg:mb-20">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 rounded-full glass border border-white/10 text-sm text-gray-300">
              Platform Features
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4 sm:mb-6">
            <span className="text-white">Built for </span>
            <span className="gradient-text">Enterprise Scale</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-400 leading-relaxed px-4 sm:px-0">
            Everything you need to build, scale, and optimize your business operations
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative glass-dark rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8 border border-white/10 hover:border-white/20 active:scale-95 transition-all duration-500 cursor-pointer touch-manipulation"
              >
                {/* Glow Effect on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`}></div>
                
                {/* Icon */}
                <div className="relative mb-4 sm:mb-5 lg:mb-6">
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500`}></div>
                  <div className={`relative w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-lg sm:rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                    <Icon size={22} className="sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" strokeWidth={2} />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-all duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed text-xs sm:text-sm">
                  {feature.description}
                </p>

                {/* Hover Arrow */}
                <div className="absolute bottom-4 sm:bottom-5 lg:bottom-6 right-4 sm:right-5 lg:right-6 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300 hidden sm:block">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full glass flex items-center justify-center">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 sm:mt-16 lg:mt-20 text-center">
          <p className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6">Ready to experience the difference?</p>
          <a href="/enterprise" className="group relative inline-flex px-6 sm:px-8 py-3 sm:py-4 rounded-xl overflow-hidden font-semibold text-white active:scale-95 transition-all touch-manipulation">
            <div className="absolute inset-0 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-cyan"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative z-10 flex items-center justify-center space-x-2">
              <span>Explore Enterprise Features</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
