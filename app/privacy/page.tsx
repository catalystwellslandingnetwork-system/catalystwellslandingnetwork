import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Shield, Lock, Eye, FileCheck, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | Catalyst Wells",
  description: "Learn how Catalyst Wells protects your school, teacher, parent, and student data with strict security and global compliance standards.",
  keywords: "catalyst wells privacy, student data protection, AI app privacy India",
};

export default function PrivacyPage() {
  const lastUpdated = "October 31, 2024";

  const sections = [
    {
      icon: FileCheck,
      title: "Information We Collect",
      content: [
        "User account details (name, email, school information)",
        "Student performance data and academic records",
        "Attendance and behavioral tracking information",
        "Device and analytics logs (for platform improvement)",
        "Communication data between parents, teachers, and administrators"
      ]
    },
    {
      icon: Eye,
      title: "How We Use Your Information",
      content: [
        "To provide comprehensive school management and AI analysis features",
        "To communicate important updates, support information, and notifications",
        "To improve platform performance, security, and user experience",
        "To generate insights and analytics for educational improvement",
        "To comply with legal obligations and ensure safety"
      ]
    },
    {
      icon: Lock,
      title: "Data Security & Encryption",
      content: [
        "Military-grade AES-256 encryption for all data at rest and in transit",
        "HTTPS enforced on all connections and communications",
        "Regular third-party security audits and penetration testing",
        "Role-based access control through Supabase infrastructure",
        "Automated backup systems with geographic redundancy",
        "24/7 security monitoring and threat detection"
      ]
    },
    {
      icon: Shield,
      title: "Data Sharing & Third Parties",
      content: [
        "We never sell your data to advertisers or third parties",
        "Data is shared only with trusted cloud infrastructure providers (Supabase, Vercel, Cloudflare) under strict NDAs",
        "Integration partners receive only necessary data with explicit consent",
        "Law enforcement requests are evaluated and disclosed as required by law",
        "All third-party processors are GDPR and SOC 2 compliant"
      ]
    }
  ];

  return (
    <main className="min-h-screen bg-black">
      <Header />
      
      <section className="relative pt-32 pb-20 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-neon-cyan/20 rounded-full blur-3xl animate-float"></div>
        </div>

        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <div className="inline-flex items-center space-x-2 glass-dark px-5 py-2.5 rounded-full border border-white/20 mb-8">
            <Shield size={16} className="text-neon-cyan" />
            <span className="text-sm font-medium text-white">Your Privacy Matters</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="gradient-text">Privacy Policy</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-400 leading-relaxed max-w-3xl mx-auto mb-6">
            Your privacy is our top priority. Catalyst Wells ensures that every piece of data you share — from school analytics to student progress — is encrypted, protected, and never misused.
          </p>

          <p className="text-sm text-gray-500">Last updated: {lastUpdated}</p>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="space-y-8">
            {sections.map((section, idx) => {
              const Icon = section.icon;
              return (
                <div key={idx} className="glass-dark rounded-2xl p-6 sm:p-8 border border-white/10">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-neon-cyan/20 to-neon-blue/10 flex items-center justify-center flex-shrink-0 border border-neon-cyan/20">
                      <Icon size={24} className="text-neon-cyan" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-4">{section.title}</h2>
                      <ul className="space-y-3">
                        {section.content.map((item, itemIdx) => (
                          <li key={itemIdx} className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan flex-shrink-0 mt-2"></div>
                            <span className="text-gray-300 leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="glass-dark rounded-2xl p-6 sm:p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-6">Your Rights</h2>
              <div className="space-y-4 text-gray-300">
                <p className="leading-relaxed">
                  You have complete control over your data. At any time, you can:
                </p>
                <ul className="space-y-3 ml-4">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan flex-shrink-0 mt-2"></div>
                    <span><strong className="text-white">Access your data:</strong> Request a complete copy of all information we hold about you</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan flex-shrink-0 mt-2"></div>
                    <span><strong className="text-white">Modify your data:</strong> Update or correct any inaccurate information</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan flex-shrink-0 mt-2"></div>
                    <span><strong className="text-white">Delete your data:</strong> Request permanent deletion of your account and all associated data</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan flex-shrink-0 mt-2"></div>
                    <span><strong className="text-white">Export your data:</strong> Download your data in a portable format</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan flex-shrink-0 mt-2"></div>
                    <span><strong className="text-white">Withdraw consent:</strong> Opt-out of optional data collection at any time</span>
                  </li>
                </ul>
                <p className="leading-relaxed mt-6">
                  To exercise any of these rights, contact us at <a href="mailto:support@catalystwells.com" className="text-neon-cyan hover:underline">support@catalystwells.com</a>
                </p>
              </div>
            </div>

            <div className="glass-dark rounded-2xl p-6 sm:p-8 border border-white/10 text-center">
              <Mail size={48} className="text-neon-cyan mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-white mb-4">Questions About Privacy?</h2>
              <p className="text-gray-400 mb-6">
                Our privacy team is here to help. Reach out with any concerns or questions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="mailto:privacy@catalystwells.com" className="px-8 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-neon-cyan to-neon-blue hover:opacity-90 transition-opacity">
                  Contact Privacy Team
                </a>
                <a href="/security" className="px-8 py-4 rounded-xl font-semibold text-white border border-white/20 hover:border-neon-cyan/40 hover:bg-white/5 transition-all">
                  View Security Details
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
