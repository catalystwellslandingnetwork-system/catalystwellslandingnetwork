import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FileText, CheckCircle2, AlertCircle, Scale } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service | Catalyst Wells",
  description: "Review the terms and conditions for using Catalyst Wells — ensuring a transparent, safe, and responsible educational experience.",
  keywords: "catalyst wells terms, edtech terms of service, AI education legal",
};

export default function TermsPage() {
  const lastUpdated = "October 31, 2024";

  return (
    <main className="min-h-screen bg-black">
      <Header />
      
      <section className="relative pt-32 pb-20 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-neon-blue/20 rounded-full blur-3xl animate-float"></div>
        </div>

        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <div className="inline-flex items-center space-x-2 glass-dark px-5 py-2.5 rounded-full border border-white/20 mb-8">
            <Scale size={16} className="text-neon-cyan" />
            <span className="text-sm font-medium text-white">Terms of Service</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="gradient-text">Terms of Service</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-400 leading-relaxed max-w-3xl mx-auto mb-6">
            Welcome to Catalyst Wells. By accessing our platform, you agree to use it responsibly and ethically in compliance with our terms.
          </p>

          <p className="text-sm text-gray-500">Last updated: {lastUpdated}</p>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="space-y-8">
            <div className="glass-dark rounded-2xl p-6 sm:p-8 border border-white/10">
              <div className="flex items-start gap-4 mb-4">
                <CheckCircle2 size={24} className="text-neon-cyan flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    By creating an account, accessing, or using Catalyst Wells' services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy.
                  </p>
                  <p className="text-gray-300 leading-relaxed">
                    If you do not agree to these terms, you must not use our platform.
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-dark rounded-2xl p-6 sm:p-8 border border-white/10">
              <div className="flex items-start gap-4 mb-4">
                <FileText size={24} className="text-neon-cyan flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">2. Use of Service</h2>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Catalyst Wells is designed exclusively for educational purposes. You agree to:
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan flex-shrink-0 mt-2"></div>
                      <span className="text-gray-300">Use the platform only for lawful educational and school management purposes</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan flex-shrink-0 mt-2"></div>
                      <span className="text-gray-300">Not attempt to reverse engineer, decompile, or extract source code</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan flex-shrink-0 mt-2"></div>
                      <span className="text-gray-300">Not resell, redistribute, or sublicense the platform without written permission</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan flex-shrink-0 mt-2"></div>
                      <span className="text-gray-300">Not use the service to transmit harmful, illegal, or inappropriate content</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan flex-shrink-0 mt-2"></div>
                      <span className="text-gray-300">Not interfere with or disrupt the platform's security or performance</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="glass-dark rounded-2xl p-6 sm:p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4">3. Account Responsibilities</h2>
              <div className="space-y-4 text-gray-300">
                <p className="leading-relaxed">
                  Schools and administrators are responsible for managing user access securely. You must:
                </p>
                <ul className="space-y-3 ml-4">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan flex-shrink-0 mt-2"></div>
                    <span>Maintain the confidentiality of login credentials</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan flex-shrink-0 mt-2"></div>
                    <span>Immediately notify us of any unauthorized access or security breaches</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan flex-shrink-0 mt-2"></div>
                    <span>Ensure all information provided is accurate and up-to-date</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan flex-shrink-0 mt-2"></div>
                    <span>Be responsible for all activities under your account</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="glass-dark rounded-2xl p-6 sm:p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4">4. Payment and Subscription</h2>
              <div className="space-y-4 text-gray-300">
                <p className="leading-relaxed">
                  Catalyst Wells offers transparent monthly and yearly pricing plans:
                </p>
                <ul className="space-y-3 ml-4">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan flex-shrink-0 mt-2"></div>
                    <span>All pricing is clearly displayed on our <a href="/pricing" className="text-neon-cyan hover:underline">pricing page</a></span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan flex-shrink-0 mt-2"></div>
                    <span>Subscriptions automatically renew unless canceled before the renewal date</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan flex-shrink-0 mt-2"></div>
                    <span>Refund requests are evaluated on a case-by-case basis within 14 days of purchase</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan flex-shrink-0 mt-2"></div>
                    <span>We reserve the right to modify pricing with 30 days advance notice</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="glass-dark rounded-2xl p-6 sm:p-8 border border-white/10">
              <div className="flex items-start gap-4 mb-4">
                <AlertCircle size={24} className="text-neon-purple flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">5. AI & Automation Disclaimer</h2>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Catalyst Wells provides AI-based suggestions, analytics, and insights to support educational decision-making. However:
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-neon-purple flex-shrink-0 mt-2"></div>
                      <span className="text-gray-300">All final decisions regarding student welfare remain human-controlled and should be made by qualified educators</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-neon-purple flex-shrink-0 mt-2"></div>
                      <span className="text-gray-300">AI insights are assistive tools, not replacements for professional judgment</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-neon-purple flex-shrink-0 mt-2"></div>
                      <span className="text-gray-300">We are not liable for decisions made based solely on AI recommendations</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="glass-dark rounded-2xl p-6 sm:p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4">6. Termination</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We reserve the right to suspend or terminate accounts that violate these terms, including but not limited to:
              </p>
              <ul className="space-y-3 ml-4">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan flex-shrink-0 mt-2"></div>
                  <span className="text-gray-300">Misuse of the platform or violation of usage policies</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan flex-shrink-0 mt-2"></div>
                  <span className="text-gray-300">Non-payment or fraudulent payment activity</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan flex-shrink-0 mt-2"></div>
                  <span className="text-gray-300">Activities that harm other users or the platform</span>
                </li>
              </ul>
            </div>

            <div className="glass-dark rounded-2xl p-6 sm:p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4">7. Governing Law</h2>
              <p className="text-gray-300 leading-relaxed">
                These Terms of Service are governed by and construed in accordance with the laws of India, specifically the Information Technology Act, 2000 and the Digital Personal Data Protection Act, 2023. Any disputes shall be subject to the exclusive jurisdiction of courts in Bangalore, Karnataka, India.
              </p>
            </div>

            <div className="glass-dark rounded-2xl p-6 sm:p-8 border border-white/10 text-center">
              <h3 className="text-xl font-bold text-white mb-4">Questions About These Terms?</h3>
              <p className="text-gray-400 mb-6">
                Contact our legal team for clarifications or concerns.
              </p>
              <a href="mailto:legal@catalystwells.com" className="inline-block px-8 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-neon-cyan to-neon-blue hover:opacity-90 transition-opacity">
                Contact Legal Team
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
