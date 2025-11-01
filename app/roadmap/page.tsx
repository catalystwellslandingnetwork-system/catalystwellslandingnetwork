import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Calendar, Target, Zap, Brain, Globe, Rocket } from "lucide-react";

export const metadata: Metadata = {
  title: "Catalyst Wells Roadmap | Building the Future of Smart Education",
  description: "See where Catalyst Wells is headed — from AI automation to global smart campus networks.",
  keywords: "edtech roadmap, school software future, AI education innovation",
};

export default function RoadmapPage() {
  const roadmapItems = [
    {
      quarter: "Q4 2024",
      status: "In Progress",
      icon: Rocket,
      color: "neon-cyan",
      items: [
        "Advanced AI-powered predictive analytics for student outcomes",
        "Voice-enabled virtual assistant for teachers",
        "Enhanced mobile app with offline-first capabilities",
        "Integration with 50+ new educational tools"
      ]
    },
    {
      quarter: "Q1 2025",
      status: "Planned",
      icon: Brain,
      color: "neon-purple",
      items: [
        "AI-generated personalized learning paths for each student",
        "Automated curriculum mapping and gap analysis",
        "AR/VR integration for immersive learning experiences",
        "Advanced behavior pattern recognition and intervention system"
      ]
    },
    {
      quarter: "Q2 2025",
      status: "Planned",
      icon: Globe,
      color: "neon-blue",
      items: [
        "Multi-language support (15+ Indian languages)",
        "Global smart campus network for international schools",
        "Blockchain-based digital certificates and credentials",
        "Advanced parent engagement tools with AI chatbot"
      ]
    },
    {
      quarter: "Q3 2025",
      status: "Proposed",
      icon: Target,
      color: "premium-emerald",
      items: [
        "IoT integration for smart classrooms",
        "Comprehensive mental health monitoring with counselor dashboard",
        "AI-powered exam proctoring and plagiarism detection",
        "Advanced data analytics with machine learning insights"
      ]
    }
  ];

  return (
    <main className="min-h-screen bg-black">
      <Header />
      
      <section className="relative pt-32 pb-20 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-neon-purple/20 rounded-full blur-3xl animate-float"></div>
        </div>

        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <div className="inline-flex items-center space-x-2 glass-dark px-5 py-2.5 rounded-full border border-white/20 mb-8">
            <Calendar size={16} className="text-neon-cyan" />
            <span className="text-sm font-medium text-white">Product Roadmap 2024-2025</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-white">Building the </span>
            <span className="gradient-text">Future of Education</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-400 leading-relaxed max-w-3xl mx-auto mb-10">
            Our vision is to create the world's most intelligent education platform. Here's what we're working on next.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="space-y-8">
            {roadmapItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="glass-dark rounded-2xl p-6 sm:p-8 border border-white/10 hover:border-white/20 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-${item.color}/20 to-${item.color}/5 flex items-center justify-center border border-${item.color}/20`}>
                        <Icon size={24} className={`text-${item.color}`} />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">{item.quarter}</h2>
                        <p className="text-sm text-gray-400">{item.status}</p>
                      </div>
                    </div>
                    <div className={`px-4 py-2 rounded-full bg-${item.color}/10 text-${item.color} text-sm font-semibold border border-${item.color}/20`}>
                      {item.status}
                    </div>
                  </div>

                  <ul className="space-y-3">
                    {item.items.map((feature, featureIdx) => (
                      <li key={featureIdx} className="flex items-start gap-3">
                        <Zap size={18} className="text-neon-cyan flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300 leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          <div className="mt-12 glass-dark rounded-2xl p-8 border border-white/10 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Have a Feature Request?</h3>
            <p className="text-gray-400 mb-6">We'd love to hear your ideas. Help us shape the future of Catalyst Wells.</p>
            <button className="px-8 py-4 rounded-xl font-semibold text-white border border-white/20 hover:border-neon-cyan/40 hover:bg-white/5 transition-all">
              Submit Feedback
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
