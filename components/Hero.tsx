"use client";

import { ArrowRight, Sparkles, Play, ChevronRight, Zap, Shield, TrendingUp, Award, CheckCircle2, Users } from "lucide-react";

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Animated Background */}
      <div className="absolute inset-0 mesh-gradient"></div>
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-neon-blue/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-neon-purple/20 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-neon-cyan/10 rounded-full blur-3xl animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>

      <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-6 sm:space-y-8 lg:pr-8">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 glass-dark px-4 sm:px-5 py-2.5 rounded-full border border-white/20 backdrop-blur-xl shadow-lg shadow-neon-cyan/10">
              <div className="relative">
                <div className="absolute inset-0 bg-neon-cyan blur-md opacity-50"></div>
                <div className="relative w-2 h-2 bg-neon-cyan rounded-full animate-pulse"></div>
              </div>
              <span className="text-xs sm:text-sm font-medium text-white">AI-Powered Education Platform</span>
              <ChevronRight size={14} className="text-neon-cyan hidden sm:block" />
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-tight">
              <span className="block gradient-text">The Intelligent Platform</span>
              <span className="block text-white">for the Future-Ready Institution.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg md:text-xl text-gray-400 leading-relaxed max-w-xl">
              Unify your community, automate operations, and unlock holistic student potential with the power of AI.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
              <button className="group relative px-6 sm:px-8 py-4 rounded-xl overflow-hidden font-semibold text-white active:scale-95 transition-all touch-manipulation">
                <div className="absolute inset-0 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-cyan"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center justify-center space-x-2">
                  <span>Start Free Trial</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              <button className="group px-6 sm:px-8 py-4 rounded-xl font-semibold text-white border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all flex items-center justify-center space-x-2 active:scale-95 touch-manipulation">
                <Play size={18} className="fill-white" />
                <span>Watch Demo</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-4 sm:pt-6">
              {[
                { icon: Shield, text: 'SOC 2 Certified' },
                { icon: Award, text: 'ISO 27001' },
                { icon: CheckCircle2, text: 'GDPR Compliant' }
              ].map((badge, idx) => {
                const Icon = badge.icon;
                return (
                  <div key={idx} className="flex items-center space-x-2 glass px-3 sm:px-4 py-2 rounded-lg border border-white/10 hover:border-neon-cyan/30 transition-all group">
                    <Icon size={14} className="text-neon-cyan group-hover:scale-110 transition-transform" />
                    <span className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">{badge.text}</span>
                  </div>
                );
              })}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 md:gap-8 pt-6 sm:pt-8 border-t border-white/5">
              {[
                { icon: Users, value: '10K+', label: 'Institutions' },
                { icon: TrendingUp, value: '98%', label: 'Satisfaction' },
                { icon: Zap, value: '24/7', label: 'Support' }
              ].map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div key={idx} className="group relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/10 to-neon-cyan/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative flex flex-col items-start sm:items-center p-2 sm:p-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-cyan/20 to-neon-blue/20 flex items-center justify-center border border-neon-cyan/20">
                          <Icon size={16} className="text-neon-cyan" />
                        </div>
                      </div>
                      <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{stat.value}</div>
                      <div className="text-xs sm:text-sm text-gray-400 font-medium">{stat.label}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Content - 3D Visual */}
          <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] mt-12 lg:mt-0">
            {/* Main 3D Card */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-full max-w-md">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/30 via-neon-purple/30 to-neon-cyan/30 blur-3xl"></div>
                
                {/* Main Card */}
                <div className="relative glass-dark rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-white/10 shadow-2xl shadow-neon-purple/20 card-3d">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full shadow-lg shadow-red-500/50"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full shadow-lg shadow-yellow-500/50"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full shadow-lg shadow-green-500/50"></div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="px-3 py-1 rounded-full glass border border-white/10 text-xs text-gray-400">Live</div>
                      <Sparkles size={18} className="text-neon-cyan animate-pulse" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-6">
                    {/* Chart */}
                    <div className="h-32 sm:h-40 lg:h-48 glass rounded-xl p-3 sm:p-4 border border-white/10 relative overflow-hidden">
                      <div className="absolute top-2 left-3 text-xs text-gray-500 font-medium">Student Growth Analytics</div>
                      <div className="flex items-end justify-between h-full space-x-1.5 sm:space-x-2 pt-6">
                        {[40, 70, 45, 80, 60, 95, 75, 85].map((height, idx) => (
                          <div key={idx} className="flex-1 relative group">
                            <div className="absolute inset-0 bg-gradient-to-t from-neon-blue to-neon-cyan rounded-t blur-sm opacity-50"></div>
                            <div className="relative bg-gradient-to-t from-neon-blue to-neon-purple rounded-t opacity-90 hover:opacity-100 transition-opacity" style={{height: `${height}%`}}></div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
                      {[
                        { label: 'Engagement', value: '+245%', color: 'neon-cyan', gradient: 'from-neon-cyan to-neon-blue' },
                        { label: 'Performance', value: '+189%', color: 'neon-purple', gradient: 'from-neon-purple to-neon-pink' },
                        { label: 'Efficiency', value: '+326%', color: 'neon-blue', gradient: 'from-neon-blue to-neon-cyan' },
                        { label: 'Satisfaction', value: '+98%', color: 'premium-emerald', gradient: 'from-premium-emerald to-neon-cyan' }
                      ].map((metric, idx) => (
                        <div key={idx} className="group relative glass rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/10 hover:border-white/20 transition-all overflow-hidden">
                          <div className={`absolute inset-0 bg-gradient-to-br ${metric.gradient} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                          <div className="relative">
                            <div className="text-xs sm:text-sm text-gray-400 mb-1 font-medium">{metric.label}</div>
                            <div className={`text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r ${metric.gradient} bg-clip-text text-transparent`}>{metric.value}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 glass-dark rounded-xl sm:rounded-2xl p-2 sm:p-3 lg:p-4 border border-white/20 shadow-xl shadow-neon-cyan/20 animate-float backdrop-blur-xl">
                  <div className="relative w-full h-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan to-neon-blue blur-md opacity-50"></div>
                    <div className="relative w-full h-full bg-gradient-to-br from-neon-cyan to-neon-blue rounded-lg sm:rounded-xl flex items-center justify-center">
                      <Zap size={24} className="sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" strokeWidth={2.5} />
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 glass-dark rounded-xl sm:rounded-2xl p-2 sm:p-3 lg:p-4 border border-white/20 shadow-xl shadow-neon-purple/20 animate-float backdrop-blur-xl" style={{animationDelay: '1s'}}>
                  <div className="relative w-full h-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-neon-purple to-neon-pink blur-md opacity-50"></div>
                    <div className="relative w-full h-full bg-gradient-to-br from-neon-purple to-neon-pink rounded-lg sm:rounded-xl flex items-center justify-center">
                      <Shield size={24} className="sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" strokeWidth={2.5} />
                    </div>
                  </div>
                </div>

                {/* Additional Floating Badge */}
                <div className="absolute top-1/2 -right-8 sm:-right-12 glass-dark rounded-xl px-3 sm:px-4 py-2 sm:py-3 border border-white/20 shadow-lg backdrop-blur-xl animate-float hidden lg:block" style={{animationDelay: '2s'}}>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 size={16} className="text-premium-emerald" />
                    <div>
                      <div className="text-xs text-gray-400">AI Powered</div>
                      <div className="text-sm font-bold text-white">Active</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent"></div>
    </section>
  );
}
