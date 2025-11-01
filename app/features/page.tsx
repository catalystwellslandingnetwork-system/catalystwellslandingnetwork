import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle2, Users, TrendingUp, Shield, Zap, Bell, BarChart3, Heart, MessageCircle, Calendar, Clock, Award } from "lucide-react";

export const metadata: Metadata = {
  title: "AI-Powered School Management Features | Catalyst Wells",
  description: "Discover Catalyst Wells — the complete AI-powered platform transforming how schools manage attendance, communication, performance, and wellbeing.",
  keywords: "AI school management, digital attendance system, education technology India, smart school software",
};

export default function FeaturesPage() {
  const features = [
    {
      icon: Users,
      title: "AI-Powered Attendance",
      description: "Automated attendance tracking with facial recognition and real-time alerts. Reduce manual work by 90% while ensuring accuracy.",
      color: "neon-cyan"
    },
    {
      icon: MessageCircle,
      title: "Parent Communication Hub",
      description: "Instant messaging, progress reports, and event notifications. Keep parents engaged with automated updates and two-way communication.",
      color: "neon-blue"
    },
    {
      icon: BarChart3,
      title: "Student Analytics Dashboard",
      description: "AI-driven insights into academic performance, behavior patterns, and learning gaps. Make data-driven decisions for every student.",
      color: "neon-purple"
    },
    {
      icon: Heart,
      title: "Wellbeing Monitoring",
      description: "Track student mental health, physical wellness, and engagement levels. Early intervention alerts for at-risk students.",
      color: "premium-emerald"
    },
    {
      icon: Calendar,
      title: "Smart Timetable Management",
      description: "AI-optimized scheduling that considers teacher availability, room allocation, and student preferences automatically.",
      color: "neon-cyan"
    },
    {
      icon: Bell,
      title: "Real-Time Notifications",
      description: "Instant alerts for absences, emergencies, announcements, and important updates across all stakeholders.",
      color: "neon-blue"
    },
    {
      icon: TrendingUp,
      title: "Performance Tracking",
      description: "Comprehensive academic tracking with predictive analytics. Identify trends and intervene before problems arise.",
      color: "neon-purple"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "AES-256 encryption, 2FA authentication, and GDPR compliance. Your data is protected with military-grade security.",
      color: "premium-emerald"
    },
    {
      icon: Clock,
      title: "Automated Workflows",
      description: "Streamline admissions, fee collection, exam management, and report generation. Save 20+ hours per week.",
      color: "neon-cyan"
    },
    {
      icon: Award,
      title: "Achievement Recognition",
      description: "Automated achievement tracking, certificates, and rewards system. Motivate students with gamified learning.",
      color: "neon-blue"
    },
    {
      icon: Zap,
      title: "Lightning Fast Performance",
      description: "Built on cutting-edge infrastructure. 99.9% uptime guarantee with sub-second response times.",
      color: "neon-purple"
    },
    {
      icon: CheckCircle2,
      title: "Easy Integration",
      description: "Seamlessly connects with Google Classroom, Microsoft Teams, and 100+ educational tools you already use.",
      color: "premium-emerald"
    }
  ];

  return (
    <main className="min-h-screen bg-black">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-neon-blue/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-neon-purple/20 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <div className="inline-flex items-center space-x-2 glass-dark px-5 py-2.5 rounded-full border border-white/20 backdrop-blur-xl shadow-lg shadow-neon-cyan/10 mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-neon-cyan blur-md opacity-50"></div>
              <div className="relative w-2 h-2 bg-neon-cyan rounded-full animate-pulse"></div>
            </div>
            <span className="text-sm font-medium text-white">Complete AI-Powered Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="gradient-text">Transform Your School</span>
            <br />
            <span className="text-white">With AI-Powered Features</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-400 leading-relaxed max-w-3xl mx-auto mb-10">
            Catalyst Wells combines cutting-edge AI with intuitive design to create the most comprehensive school management system. Automate operations, boost engagement, and unlock every student's potential.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="group relative px-8 py-4 rounded-xl overflow-hidden font-semibold text-white">
              <div className="absolute inset-0 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-cyan"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10">Start Free Trial</span>
            </button>
            <button className="px-8 py-4 rounded-xl font-semibold text-white border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="group relative glass-dark rounded-xl p-6 sm:p-8 border border-white/10 hover:border-white/20 transition-all">
                  <div className={`absolute inset-0 bg-gradient-to-br from-${feature.color}/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl`}></div>
                  
                  <div className="relative">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-${feature.color}/20 to-${feature.color}/5 flex items-center justify-center mb-4 border border-${feature.color}/20`}>
                      <Icon size={24} className={`text-${feature.color}`} />
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="glass-dark rounded-2xl p-8 sm:p-12 border border-white/10 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              <span className="text-white">Ready to Experience </span>
              <span className="gradient-text">The Future?</span>
            </h2>
            <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
              Join 10,000+ institutions transforming education with Catalyst Wells. Start your 14-day free trial today.
            </p>
            <button className="group relative px-8 py-4 rounded-xl overflow-hidden font-semibold text-white">
              <div className="absolute inset-0 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-cyan"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10">Get Started Now</span>
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
