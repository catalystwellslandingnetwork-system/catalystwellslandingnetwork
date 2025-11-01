"use client";

import { Code, Brain, GitBranch, Settings, Users2, LayoutDashboard, Workflow, Globe2, ArrowUpRight } from "lucide-react";

const services = [
  {
    icon: Brain,
    title: "AI & Machine Learning",
    description: "Harness the power of artificial intelligence to automate workflows and gain predictive insights.",
    features: [
      "Neural Network Models",
      "Natural Language Processing",
      "Computer Vision",
      "Predictive Analytics",
      "Auto ML Pipelines"
    ],
    gradient: "from-neon-blue via-neon-purple to-neon-cyan",
    delay: "0s"
  },
  {
    icon: LayoutDashboard,
    title: "Custom Dashboards",
    description: "Build powerful, interactive dashboards with real-time data visualization and insights.",
    features: [
      "Drag-and-Drop Builder",
      "Real-time Data Sync",
      "Custom Widget Library",
      "Multi-tenant Support",
      "Export & Scheduling"
    ],
    gradient: "from-neon-purple via-neon-pink to-premium-purple",
    delay: "0.1s"
  },
  {
    icon: Workflow,
    title: "Automation Engine",
    description: "Streamline operations with intelligent automation that adapts to your business needs.",
    features: [
      "Visual Flow Designer",
      "Conditional Logic",
      "API Integrations",
      "Scheduled Tasks",
      "Error Handling"
    ],
    gradient: "from-neon-cyan via-premium-emerald to-neon-blue",
    delay: "0.2s"
  },
  {
    icon: Globe2,
    title: "Global CDN",
    description: "Deliver content at lightning speed with our worldwide edge network infrastructure.",
    features: [
      "200+ Edge Locations",
      "Automatic Caching",
      "DDoS Protection",
      "SSL/TLS Encryption",
      "Real-time Monitoring"
    ],
    gradient: "from-premium-gold via-premium-pink to-neon-pink",
    delay: "0.3s"
  }
];

export default function Services() {
  return (
    <section id="services" className="relative py-16 sm:py-24 lg:py-32 px-4 sm:px-6 bg-dark-900 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-neon-blue/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-neon-purple/5 rounded-full blur-3xl"></div>
      </div>

      {/* Diagonal Lines Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 50px, rgba(255,255,255,0.03) 50px, rgba(255,255,255,0.03) 51px)'
        }}></div>
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 lg:mb-20">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 rounded-full glass border border-white/10 text-sm text-gray-300 flex items-center space-x-2">
              <Settings size={14} className="animate-spin-slow" />
              <span>Enterprise Solutions</span>
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4 sm:mb-6">
            <span className="text-white">Powerful Tools for </span>
            <span className="gradient-text">Modern Teams</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-400 leading-relaxed px-4 sm:px-0">
            Industry-leading solutions engineered for performance, security, and scale
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-7 lg:gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="group relative"
                style={{ animationDelay: service.delay }}
              >
                {/* Card Background Glow */}
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${service.gradient} rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500`}></div>
                
                {/* Main Card */}
                <div className="relative glass-dark rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 border border-white/10 hover:border-white/20 active:scale-[0.98] transition-all duration-500 h-full touch-manipulation">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-5 sm:mb-6">
                    <div className="flex items-start space-x-4">
                      {/* Icon Container */}
                      <div className="relative">
                        <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} blur-lg opacity-50 group-hover:opacity-100 transition-opacity duration-500`}></div>
                        <div className={`relative w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                          <Icon size={22} className="sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" strokeWidth={2} />
                        </div>
                      </div>

                      {/* Title & Description */}
                      <div className="flex-1">
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-1 sm:mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-all duration-300">
                          {service.title}
                        </h3>
                        <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                          {service.description}
                        </p>
                      </div>
                    </div>

                    {/* Arrow Icon */}
                    <div className="opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300 hidden sm:block">
                      <ArrowUpRight size={20} className="sm:w-6 sm:h-6 text-gray-400" />
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="space-y-2 sm:space-y-3 mt-5 sm:mt-6 pl-0 sm:pl-20">
                    {service.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-center space-x-2 sm:space-x-3 text-gray-300 group/item hover:text-white transition-colors"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-neon-cyan to-neon-blue group-hover/item:scale-150 transition-transform flex-shrink-0"></div>
                        <span className="text-xs sm:text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Bottom Action */}
                  <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-white/5">
                    <button className="group/btn flex items-center space-x-2 text-xs sm:text-sm text-gray-400 hover:text-white transition-colors active:scale-95 touch-manipulation">
                      <span>Learn more</span>
                      <ArrowUpRight size={14} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Section */}
        <div className="mt-12 sm:mt-16 lg:mt-20 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-6 sm:gap-8 glass-dark rounded-2xl px-6 sm:px-8 py-6 border border-white/10">
            <div className="flex items-center space-x-3">
              <Code size={20} className="text-neon-cyan" />
              <div className="text-left">
                <div className="text-2xl font-bold text-white">500+</div>
                <div className="text-sm text-gray-400">Integrations</div>
              </div>
            </div>
            <div className="w-full sm:w-px h-px sm:h-12 bg-white/10"></div>
            <div className="flex items-center space-x-3">
              <Users2 size={20} className="text-neon-purple" />
              <div className="text-left">
                <div className="text-2xl font-bold text-white">50K+</div>
                <div className="text-sm text-gray-400">Active Users</div>
              </div>
            </div>
            <div className="w-full sm:w-px h-px sm:h-12 bg-white/10"></div>
            <div className="flex items-center space-x-3">
              <GitBranch size={20} className="text-neon-blue" />
              <div className="text-left">
                <div className="text-2xl font-bold text-white">99.99%</div>
                <div className="text-sm text-gray-400">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
