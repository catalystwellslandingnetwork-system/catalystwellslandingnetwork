"use client";

import { useState } from "react";
import { Zap, Shield, TrendingUp, Users, Clock, Award, Cpu, Database, Cloud, Lock, BarChart3, Rocket, Sparkles, Play, CheckCircle2, Monitor, Smartphone } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightning-Fast on Busy School Days",
    description: "Instant load times during peak periods like morning attendance, fee collection, and exam result days.",
    gradient: "from-neon-blue to-neon-cyan"
  },
  {
    icon: Shield,
    title: "Institution-Grade Security",
    description: "Protect student and staff data with encryption and role-based access for principals, teachers, parents, and admins.",
    gradient: "from-neon-purple to-neon-pink"
  },
  {
    icon: Cloud,
    title: "Reliable Across Campuses",
    description: "Built to support single schools or multi-campus groups with high uptime across India and beyond.",
    gradient: "from-neon-cyan to-premium-emerald"
  },
  {
    icon: Cpu,
    title: "AI-Powered Academic Analytics",
    description: "Track attendance, performance, and well-being with AI that flags at-risk students and classes early.",
    gradient: "from-premium-purple to-neon-blue"
  },
  {
    icon: Database,
    title: "Connected School Systems",
    description: "Bring fees, transport, exams, LMS, and communication into one unified data layer for your institution.",
    gradient: "from-premium-gold to-premium-pink"
  },
  {
    icon: Lock,
    title: "Education Compliance Ready",
    description: "Audit-ready logs, fine-grained permissions, and data controls aligned with school policies and regulations.",
    gradient: "from-neon-pink to-premium-purple"
  },
  {
    icon: Users,
    title: "Staff & Parent Collaboration",
    description: "Keep principals, coordinators, teachers, parents, and students in sync with shared updates and timelines.",
    gradient: "from-premium-emerald to-neon-cyan"
  },
  {
    icon: BarChart3,
    title: "Leadership Dashboards",
    description: "Principal and management dashboards with exportable reports for reviews, inspections, and board meetings.",
    gradient: "from-neon-blue to-premium-purple"
  },
  {
    icon: Rocket,
    title: "Fast School-Wide Rollout",
    description: "Onboard your entire institution quickly with guided setup, staff training, and smooth data migration.",
    gradient: "from-neon-cyan to-neon-blue"
  }
];

const featureDetails = [
  {
    longDescription:
      "Handle the busiest school days without slowdown. CatalystWells keeps attendance, fee collection, and exam result publishing fast and responsive for every stakeholder.",
    highlights: [
      "Optimized for peak traffic on result and admission days",
      "Smooth experience for teachers taking attendance in every class",
      "Parents can check results and pay fees without timeouts",
      "Works reliably even on low-bandwidth school networks",
    ],
  },
  {
    longDescription:
      "Keep every student and staff record safe with fine-grained roles for principals, coordinators, teachers, parents, and admins.",
    highlights: [
      "Role-based access for leadership, staff, and parents",
      "Secure storage for marksheets, reports, and documents",
      "Audit trails to track who changed what and when",
      "Best practices for school data privacy and safety",
    ],
  },
  {
    longDescription:
      "Whether you are a single school or a multi-campus group, CatalystWells keeps every branch connected on one reliable platform.",
    highlights: [
      "Single view of all branches and campuses",
      "Regional performance views across cities or states",
      "Central policies with local flexibility per campus",
      "High uptime infrastructure tuned for Indian schools",
    ],
  },
  {
    longDescription:
      "Use AI to spot patterns in attendance, marks, and behaviour so you can support at-risk students before issues escalate.",
    highlights: [
      "Early warning indicators for attendance and performance",
      "Class and section heatmaps for academic trends",
      "Well-being signals combined with academic data",
      "Simple views for teachers, deep analytics for leaders",
    ],
  },
  {
    longDescription:
      "Connect all your key school systems – fees, transport, exams, LMS, and communication – into one unified data layer.",
    highlights: [
      "One place for academic, fee, and transport data",
      "Reduce duplicate entries across different tools",
      "Better decisions with complete, connected information",
      "Ready for integrations with your existing systems",
    ],
  },
  {
    longDescription:
      "Stay ready for inspections, audits, and policy changes with detailed logs, permissions, and compliance-friendly controls.",
    highlights: [
      "Fine-grained permissions by role and department",
      "Historical logs for academic and operational actions",
      "Easier preparation for inspections and reviews",
      "Configurable to your school or group policies",
    ],
  },
  {
    longDescription:
      "Make collaboration natural between principals, coordinators, class teachers, parents, and students across the school.",
    highlights: [
      "Shared updates from school to staff and parents",
      "Class and group-level communication channels",
      "Clear task ownership across academic teams",
      "Better transparency for parents and students",
    ],
  },
  {
    longDescription:
      "Give leadership a clear view of how the institution is performing academically and operationally in real-time.",
    highlights: [
      "At-a-glance dashboards for principals and owners",
      "Drill-down into classes, subjects, and cohorts",
      "Ready-made views for review meetings and boards",
      "Exportable summaries for reports and presentations",
    ],
  },
  {
    longDescription:
      "Roll out CatalystWells across your school or group quickly with guided setup, staff training, and data migration support.",
    highlights: [
      "Structured onboarding plan for each institution",
      "Training support for teachers and admin staff",
      "Assistance with safe migration from legacy systems",
      "Clear rollout milestones from pilot to full deployment",
    ],
  },
];

export default function Features() {
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);
  const activeFeature = features[activeFeatureIndex];
  const activeDetail = featureDetails[activeFeatureIndex];

  return (
    <section id="features" className="relative py-16 sm:py-24 lg:py-32 px-4 sm:px-6 bg-black overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-cyan/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="mb-14 sm:mb-20 lg:mb-24">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 rounded-full glass border border-white/10 text-xs sm:text-sm text-gray-300">
              Introducing Luminex Live
            </span>
          </div>
          <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 items-start lg:items-center">
            <div className="lg:col-span-2 order-1 lg:order-none">
              <div className="relative h-full">
                <div className="relative glass-dark rounded-3xl border border-white/10 overflow-hidden p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-neon-blue/20 via-neon-purple/20 to-neon-cyan/10">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-black/50 flex items-center justify-center">
                        <Monitor size={18} className="text-neon-cyan" />
                      </div>
                      <div>
                        <div className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wide">Smartboard Demo</div>
                        <div className="text-xs sm:text-sm md:text-base font-semibold text-white">Luminex Live — Class 8 Science</div>
                      </div>
                    </div>
                    <span className="hidden xs:inline-flex text-[10px] sm:text-xs text-neon-cyan bg-black/40 px-2 py-1 rounded-full border border-neon-cyan/40">
                      Live · 32 students
                    </span>
                  </div>
                  <div className="relative aspect-video rounded-2xl bg-black/50 border border-white/10 mb-4 sm:mb-5 flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.3),_transparent_60%),_radial-gradient(circle_at_bottom,_rgba(168,85,247,0.4),_transparent_60%)]" />
                    <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white text-black flex items-center justify-center shadow-xl shadow-neon-cyan/40">
                      <Play size={22} className="ml-0.5" />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="glass-dark rounded-2xl border border-white/10 p-3 sm:p-4 flex items-start gap-3">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-blue flex items-center justify-center flex-shrink-0">
                        <Smartphone size={16} className="text-white" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white">Student View</div>
                        <p className="text-[11px] sm:text-xs text-gray-400">
                          Students tap "Ask your doubt" on their phones without interrupting the class.
                        </p>
                      </div>
                    </div>
                    <div className="glass-dark rounded-2xl border border-white/10 p-3 sm:p-4 flex items-start gap-3">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center flex-shrink-0">
                        <Cpu size={16} className="text-white" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white">Teacher Dashboard</div>
                        <p className="text-[11px] sm:text-xs text-gray-400">
                          Teachers see live questions, approve answers, and switch topics with a single tap.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between sm:hidden">
                    <span className="text-[10px] text-neon-cyan bg-black/40 px-2 py-1 rounded-full border border-neon-cyan/40">
                      Live · 32 students
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-1 order-2 lg:order-none mt-8 lg:mt-0 space-y-5">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white">
                Luminex Live — The Future of Classroom Learning
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-400 leading-relaxed">
                An AI-powered teaching experience built right into CatalystWells. Smartboard-ready. Real-time. Designed for every school in India.
              </p>
              <div className="space-y-4">
                <div className="glass-dark rounded-2xl p-4 border border-white/10">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-neon-blue to-neon-cyan flex items-center justify-center flex-shrink-0">
                      <Sparkles size={18} className="text-white" />
                    </div>
                    <div>
                      <div className="text-sm sm:text-base font-semibold text-white">Teach Smarter with AI</div>
                      <p className="text-xs sm:text-sm text-gray-400">
                        Luminex Live helps teachers explain concepts instantly using AI-generated diagrams, 3D visuals, live doubt solving, and simplified explanations — all inside your existing CatalystWells platform.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="glass-dark rounded-2xl p-4 border border-white/10">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center flex-shrink-0">
                      <Smartphone size={18} className="text-white" />
                    </div>
                    <div>
                      <div className="text-sm sm:text-base font-semibold text-white">One Tap Activation</div>
                      <p className="text-xs sm:text-sm text-gray-400">
                        Teachers simply scan a QR code from their CatalystWells dashboard to start a live AI classroom session.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="glass-dark rounded-2xl p-4 border border-white/10">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-neon-cyan to-premium-emerald flex items-center justify-center flex-shrink-0">
                      <Monitor size={18} className="text-white" />
                    </div>
                    <div>
                      <div className="text-sm sm:text-base font-semibold text-white">Smartboard Optimized</div>
                      <p className="text-xs sm:text-sm text-gray-400">
                        Works on any classroom smartboard or Windows device. No extra hardware. No complex setup.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="glass-dark rounded-2xl p-4 border border-white/10">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-premium-gold to-neon-pink flex items-center justify-center flex-shrink-0">
                      <Shield size={18} className="text-white" />
                    </div>
                    <div>
                      <div className="text-sm sm:text-base font-semibold text-white">Built with Safety</div>
                      <p className="text-xs sm:text-sm text-gray-400">
                        School-safe filters, syllabus-aligned content, and AI responses designed specifically for classrooms.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-start gap-2 text-xs sm:text-sm text-gray-300">
                  <CheckCircle2 size={16} className="text-neon-cyan mt-0.5 flex-shrink-0" />
                  <span>AI explains lessons in seconds</span>
                </div>
                <div className="flex items-start gap-2 text-xs sm:text-sm text-gray-300">
                  <CheckCircle2 size={16} className="text-neon-cyan mt-0.5 flex-shrink-0" />
                  <span>Live diagrams + voice responses</span>
                </div>
                <div className="flex items-start gap-2 text-xs sm:text-sm text-gray-300">
                  <CheckCircle2 size={16} className="text-neon-cyan mt-0.5 flex-shrink-0" />
                  <span>Students send doubts quietly</span>
                </div>
                <div className="flex items-start gap-2 text-xs sm:text-sm text-gray-300">
                  <CheckCircle2 size={16} className="text-neon-cyan mt-0.5 flex-shrink-0" />
                  <span>Teacher controls topic flow</span>
                </div>
                <div className="flex items-start gap-2 text-xs sm:text-sm text-gray-300">
                  <CheckCircle2 size={16} className="text-neon-cyan mt-0.5 flex-shrink-0" />
                  <span>Works on phones, tabs, smartboards</span>
                </div>
                <div className="flex items-start gap-2 text-xs sm:text-sm text-gray-300">
                  <CheckCircle2 size={16} className="text-neon-cyan mt-0.5 flex-shrink-0" />
                  <span>Designed for low-end hardware</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <div className="glass-dark rounded-2xl border border-neon-cyan/40 p-4 sm:p-5 lg:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="text-sm sm:text-base font-semibold text-white">
                  Want Luminex Live in your school?
                </div>
                <p className="text-xs sm:text-sm text-gray-400">
                  Book a demo with CatalystWells and experience AI-powered classrooms in action.
                </p>
              </div>
              <a
                href="/enterprise"
                className="group relative inline-flex px-5 sm:px-6 py-3 rounded-xl overflow-hidden font-semibold text-white text-sm sm:text-base active:scale-95 transition-all"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-cyan" />
                <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-blue opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <span>Book a Demo with CatalystWells</span>
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 lg:mb-20">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 rounded-full glass border border-white/10 text-sm text-gray-300">
              Platform Features for Schools & Institutions
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4 sm:mb-6">
            <span className="text-white">Built for </span>
            <span className="gradient-text">Institutional Scale</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-400 leading-relaxed px-4 sm:px-0">
            Everything your school or education group needs to run, scale, and connect academics, administration, and well-being.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isActive = index === activeFeatureIndex;
            return (
              <div
                key={index}
                onClick={() => setActiveFeatureIndex(index)}
                className={`group relative glass-dark rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8 border active:scale-95 transition-all duration-500 cursor-pointer touch-manipulation ${
                  isActive
                    ? "border-neon-cyan shadow-[0_0_0_1px_rgba(34,211,238,0.4)]"
                    : "border-white/10 hover:border-white/20"
                }`}
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

        {/* Feature Detail Panel */}
        <div className="mt-10 sm:mt-12 lg:mt-14">
          <div className="glass-dark rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 border border-white/10">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] sm:text-xs text-gray-300 mb-3 sm:mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan" />
                  <span>{activeFeature.title}</span>
                </div>
                <h3 className="text-lg sm:text-2xl font-display font-bold text-white mb-2 sm:mb-3">
                  {activeFeature.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-400 leading-relaxed mb-4 sm:mb-5">
                  {activeDetail.longDescription}
                </p>
                <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                  {activeDetail.highlights.map((point, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 text-xs sm:text-sm text-gray-300"
                    >
                      <CheckCircle2
                        size={16}
                        className="text-neon-cyan mt-0.5 flex-shrink-0"
                      />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
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
