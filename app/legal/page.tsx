import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Scale, Building2, Copyright, Shield, FileCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Legal Notice | Catalyst Wells",
  description: "Review Catalyst Wells' legal information, company ownership, intellectual property, and compliance certifications.",
  keywords: "catalyst wells legal, edtech compliance, gdpr education India",
};

export default function LegalPage() {
  const lastUpdated = "October 31, 2024";

  return (
    <main className="min-h-screen bg-black">
      <Header />
      
      <section className="relative pt-32 pb-20 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-neon-cyan/20 rounded-full blur-3xl animate-float"></div>
        </div>

        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <div className="inline-flex items-center space-x-2 glass-dark px-5 py-2.5 rounded-full border border-white/20 mb-8">
            <Scale size={16} className="text-neon-cyan" />
            <span className="text-sm font-medium text-white">Legal Notice</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="gradient-text">Legal Notice</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-400 leading-relaxed max-w-3xl mx-auto mb-6">
            Catalyst Wells operates under complete transparency — respecting intellectual property, compliance laws, and ethical technology practices.
          </p>

          <p className="text-sm text-gray-500">Last updated: {lastUpdated}</p>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="space-y-8">
            <div className="glass-dark rounded-2xl p-6 sm:p-8 border border-white/10">
              <div className="flex items-start gap-4 mb-4">
                <Building2 size={24} className="text-neon-cyan flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Company Identity</h2>
                  <div className="space-y-3 text-gray-300">
                    <div className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan flex-shrink-0 mt-2"></div>
                      <div>
                        <span className="font-semibold text-white">Legal Name:</span> Catalyst Wells EdTech Private Limited
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan flex-shrink-0 mt-2"></div>
                      <div>
                        <span className="font-semibold text-white">Registration:</span> Registered in India under the Companies Act, 2013
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan flex-shrink-0 mt-2"></div>
                      <div>
                        <span className="font-semibold text-white">Founder & CEO:</span> Rowanberg
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan flex-shrink-0 mt-2"></div>
                      <div>
                        <span className="font-semibold text-white">Headquarters:</span> Bangalore, Karnataka, India
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan flex-shrink-0 mt-2"></div>
                      <div>
                        <span className="font-semibold text-white">Business Type:</span> Educational Technology SaaS Platform
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-dark rounded-2xl p-6 sm:p-8 border border-white/10">
              <div className="flex items-start gap-4 mb-4">
                <Copyright size={24} className="text-neon-blue flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Intellectual Property</h2>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    All content, features, functionality, and intellectual property on the Catalyst Wells platform are owned exclusively by Catalyst Wells EdTech Private Limited, including but not limited to:
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-neon-blue flex-shrink-0 mt-2"></div>
                      <span className="text-gray-300">Catalyst Wells name, logo, and branding materials</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-neon-blue flex-shrink-0 mt-2"></div>
                      <span className="text-gray-300">User interface design, graphics, and visual elements</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-neon-blue flex-shrink-0 mt-2"></div>
                      <span className="text-gray-300">Source code, software architecture, and algorithms</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-neon-blue flex-shrink-0 mt-2"></div>
                      <span className="text-gray-300">Documentation, content, and educational materials</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-neon-blue flex-shrink-0 mt-2"></div>
                      <span className="text-gray-300">AI models, data processing methods, and analytics systems</span>
                    </li>
                  </ul>
                  <div className="mt-6 p-4 glass rounded-xl border border-neon-blue/20 bg-neon-blue/5">
                    <p className="text-sm text-gray-300">
                      <strong className="text-white">⚠️ Important:</strong> Unauthorized reproduction, distribution, modification, or commercial use of any Catalyst Wells intellectual property is strictly prohibited and may result in legal action.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-dark rounded-2xl p-6 sm:p-8 border border-white/10">
              <div className="flex items-start gap-4 mb-4">
                <Shield size={24} className="text-neon-purple flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Compliance & Certifications</h2>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Catalyst Wells is committed to maintaining the highest standards of legal compliance and data protection:
                  </p>
                  
                  <div className="space-y-4">
                    <div className="glass rounded-xl p-4 border border-white/10">
                      <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                        <FileCheck size={18} className="text-premium-emerald" />
                        GDPR Compliance
                      </h3>
                      <p className="text-sm text-gray-400">
                        Full compliance with General Data Protection Regulation for handling EU citizen data, including data subject rights and lawful processing.
                      </p>
                    </div>

                    <div className="glass rounded-xl p-4 border border-white/10">
                      <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                        <FileCheck size={18} className="text-premium-emerald" />
                        COPPA Compliance
                      </h3>
                      <p className="text-sm text-gray-400">
                        Adheres to Children's Online Privacy Protection Act requirements for collecting data from users under 13 years old, with parental consent mechanisms.
                      </p>
                    </div>

                    <div className="glass rounded-xl p-4 border border-white/10">
                      <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                        <FileCheck size={18} className="text-premium-emerald" />
                        Indian IT Act, 2000
                      </h3>
                      <p className="text-sm text-gray-400">
                        Compliance with India's Information Technology Act and Digital Personal Data Protection Act, 2023.
                      </p>
                    </div>

                    <div className="glass rounded-xl p-4 border border-white/10">
                      <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                        <FileCheck size={18} className="text-premium-emerald" />
                        SOC 2 Type II
                      </h3>
                      <p className="text-sm text-gray-400">
                        Independently audited security controls meeting strict industry standards for data protection and privacy.
                      </p>
                    </div>

                    <div className="glass rounded-xl p-4 border border-white/10">
                      <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                        <FileCheck size={18} className="text-premium-emerald" />
                        Transparent AI Use Policy
                      </h3>
                      <p className="text-sm text-gray-400">
                        Clear disclosure of AI-powered features, with human oversight and ethical AI principles guiding all automated decision-making.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-dark rounded-2xl p-6 sm:p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4">Limitation of Liability</h2>
              <div className="space-y-4 text-gray-300">
                <p className="leading-relaxed">
                  Catalyst Wells provides its platform "as is" and makes every effort to ensure accuracy, reliability, and security. However:
                </p>
                <ul className="space-y-3 ml-4">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan flex-shrink-0 mt-2"></div>
                    <span>We are not liable for data misuse that occurs outside of our authorized scope and control</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan flex-shrink-0 mt-2"></div>
                    <span>Educational decisions remain the responsibility of qualified school administrators and educators</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan flex-shrink-0 mt-2"></div>
                    <span>We are not responsible for third-party integrations or services beyond our direct control</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan flex-shrink-0 mt-2"></div>
                    <span>Users must comply with applicable local laws and regulations when using our platform</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="glass-dark rounded-2xl p-6 sm:p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4">Dispute Resolution</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Any disputes, controversies, or claims arising from the use of Catalyst Wells shall be:
              </p>
              <ul className="space-y-3 ml-4 text-gray-300">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan flex-shrink-0 mt-2"></div>
                  <span>First attempted to be resolved through good-faith negotiation</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan flex-shrink-0 mt-2"></div>
                  <span>Subject to binding arbitration in Bangalore, Karnataka if negotiation fails</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan flex-shrink-0 mt-2"></div>
                  <span>Governed by Indian law and subject to Indian jurisdiction</span>
                </li>
              </ul>
            </div>

            <div className="glass-dark rounded-2xl p-6 sm:p-8 border border-white/10 text-center">
              <Scale size={48} className="text-neon-cyan mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-white mb-4">Legal Inquiries & Representation</h2>
              <p className="text-gray-400 mb-6">
                For legal matters, compliance questions, or official correspondence, contact our legal department.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="mailto:legal@catalystwells.com" className="px-8 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-neon-cyan to-neon-blue hover:opacity-90 transition-opacity">
                  Contact Legal Team
                </a>
                <a href="/privacy" className="px-8 py-4 rounded-xl font-semibold text-white border border-white/20 hover:border-neon-cyan/40 hover:bg-white/5 transition-all">
                  View Privacy Policy
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
