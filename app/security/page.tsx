import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Shield, Lock, Eye, CheckCircle2, Server, FileCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Catalyst Wells Security | Protecting Schools with Enterprise-Level Safety",
  description: "Catalyst Wells uses AES-256 encryption, 2FA, and GDPR compliance to protect your school data.",
  keywords: "catalyst wells security, school data protection, GDPR compliance education",
};

export default function SecurityPage() {
  const securityFeatures = [
    {
      icon: Lock,
      title: "AES-256 Encryption",
      description: "Military-grade encryption for all data in transit and at rest. Your information is protected with the same technology used by banks and governments."
    },
    {
      icon: Shield,
      title: "Two-Factor Authentication",
      description: "Enhanced account security with SMS, email, or authenticator app verification. Prevent unauthorized access to sensitive student data."
    },
    {
      icon: Eye,
      title: "Role-Based Access Control",
      description: "Granular permissions system ensures staff only access data relevant to their role. Complete audit trails for compliance."
    },
    {
      icon: Server,
      title: "SOC 2 Type II Certified",
      description: "Independently verified security controls and processes. Annual audits ensure we meet the highest industry standards."
    },
    {
      icon: FileCheck,
      title: "GDPR & Data Privacy Compliant",
      description: "Full compliance with GDPR, COPPA, and Indian data protection regulations. Your students' privacy is our priority."
    },
    {
      icon: CheckCircle2,
      title: "Regular Security Audits",
      description: "Quarterly penetration testing and vulnerability assessments by third-party security experts. Proactive threat detection."
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
            <span className="text-sm font-medium text-white">Enterprise-Grade Security</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-white">Your Data is </span>
            <span className="gradient-text">100% Secure</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-400 leading-relaxed max-w-3xl mx-auto mb-10">
            Catalyst Wells employs military-grade security measures to protect your school's sensitive data. We're committed to maintaining the highest standards of data privacy and security.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {securityFeatures.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="glass-dark rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-neon-cyan/20 to-neon-blue/10 flex items-center justify-center mb-4 border border-neon-cyan/20">
                    <Icon size={24} className="text-neon-cyan" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-16 glass-dark rounded-2xl p-8 sm:p-12 border border-white/10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">Compliance & Certifications</h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                { name: "SOC 2 Type II", status: "Certified" },
                { name: "GDPR", status: "Compliant" },
                { name: "ISO 27001", status: "Certified" }
              ].map((cert, idx) => (
                <div key={idx} className="flex items-center gap-3 glass rounded-lg p-4 border border-white/10">
                  <CheckCircle2 size={20} className="text-premium-emerald flex-shrink-0" />
                  <div>
                    <div className="text-white font-semibold">{cert.name}</div>
                    <div className="text-sm text-gray-400">{cert.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
