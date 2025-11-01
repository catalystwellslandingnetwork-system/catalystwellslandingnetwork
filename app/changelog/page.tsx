import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle2, Zap, Shield, TrendingUp } from "lucide-react";

export const metadata: Metadata = {
  title: "Catalyst Wells Product Updates | AI Features & Improvements",
  description: "Stay updated on Catalyst Wells releases — from AI-powered analytics to real-time communication tools.",
  keywords: "catalyst wells updates, edtech changelog, product updates",
};

export default function ChangelogPage() {
  const updates = [
    {
      version: "2.5.0",
      date: "October 2024",
      type: "Major Release",
      icon: Zap,
      color: "neon-cyan",
      changes: [
        "New AI-powered student wellbeing monitoring with predictive alerts",
        "Enhanced parent dashboard with real-time student performance insights",
        "Integration with Microsoft Teams for virtual classroom management",
        "Improved mobile app performance with 40% faster load times",
        "Added bulk SMS and WhatsApp messaging for instant communication"
      ]
    },
    {
      version: "2.4.2",
      date: "September 2024",
      type: "Security Update",
      icon: Shield,
      color: "premium-emerald",
      changes: [
        "Enhanced AES-256 encryption for all data transmission",
        "Added support for hardware security keys (YubiKey, etc.)",
        "Implemented automatic session timeout for inactive users",
        "SOC 2 Type II audit completed successfully"
      ]
    },
    {
      version: "2.4.0",
      date: "August 2024",
      type: "Feature Release",
      icon: TrendingUp,
      color: "neon-purple",
      changes: [
        "Launched advanced analytics dashboard with 50+ custom reports",
        "Added AI-driven learning gap identification",
        "New automated fee reminder system with payment gateway integration",
        "Introduced customizable report cards with multilingual support",
        "Performance improvements: 60% faster page load times"
      ]
    },
    {
      version: "2.3.5",
      date: "July 2024",
      type: "Improvement",
      icon: CheckCircle2,
      color: "neon-blue",
      changes: [
        "Improved facial recognition accuracy for attendance (98% → 99.7%)",
        "Added dark mode support across all platforms",
        "Enhanced notification system with customizable preferences",
        "Bug fixes and stability improvements"
      ]
    }
  ];

  return (
    <main className="min-h-screen bg-black">
      <Header />
      
      <section className="relative pt-32 pb-20 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-neon-blue/20 rounded-full blur-3xl animate-float"></div>
        </div>

        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-white">Product </span>
            <span className="gradient-text">Updates</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-400 leading-relaxed max-w-3xl mx-auto mb-10">
            See what's new in Catalyst Wells. We ship new features, improvements, and fixes every month.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="space-y-8">
            {updates.map((update, idx) => {
              const Icon = update.icon;
              return (
                <div key={idx} className="glass-dark rounded-2xl p-6 sm:p-8 border border-white/10">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-${update.color}/20 to-${update.color}/5 flex items-center justify-center border border-${update.color}/20`}>
                        <Icon size={24} className={`text-${update.color}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h2 className="text-2xl font-bold text-white">Version {update.version}</h2>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-${update.color}/10 text-${update.color} border border-${update.color}/20`}>
                            {update.type}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">{update.date}</p>
                      </div>
                    </div>
                  </div>

                  <ul className="space-y-3">
                    {update.changes.map((change, changeIdx) => (
                      <li key={changeIdx} className="flex items-start gap-3">
                        <CheckCircle2 size={20} className="text-neon-cyan flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300 leading-relaxed">{change}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
