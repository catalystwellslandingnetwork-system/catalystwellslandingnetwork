import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Cookie, Settings, BarChart3, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Cookies Policy | Catalyst Wells",
  description: "Learn how Catalyst Wells uses cookies to enhance performance, personalize experience, and secure your session.",
  keywords: "catalyst wells cookies, school app cookies, edtech cookies policy",
};

export default function CookiesPage() {
  const lastUpdated = "October 31, 2024";

  return (
    <main className="min-h-screen bg-black">
      <Header />
      
      <section className="relative pt-32 pb-20 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-neon-purple/20 rounded-full blur-3xl animate-float"></div>
        </div>

        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <div className="inline-flex items-center space-x-2 glass-dark px-5 py-2.5 rounded-full border border-white/20 mb-8">
            <Cookie size={16} className="text-neon-cyan" />
            <span className="text-sm font-medium text-white">Cookies Policy</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="gradient-text">Cookies Policy</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-400 leading-relaxed max-w-3xl mx-auto mb-6">
            Our cookies help you stay logged in, personalize dashboards, and improve school experiences without tracking your personal browsing behavior.
          </p>

          <p className="text-sm text-gray-500">Last updated: {lastUpdated}</p>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="space-y-8">
            <div className="glass-dark rounded-2xl p-6 sm:p-8 border border-white/10">
              <div className="flex items-start gap-4 mb-4">
                <Cookie size={24} className="text-neon-cyan flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">What Are Cookies?</h2>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and keeping you logged in.
                  </p>
                  <p className="text-gray-300 leading-relaxed">
                    Cookies contain minimal data and cannot access other files on your device. They are essential for modern web applications to function properly.
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-dark rounded-2xl p-6 sm:p-8 border border-white/10">
              <div className="flex items-start gap-4 mb-4">
                <Settings size={24} className="text-neon-blue flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">How We Use Cookies</h2>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Catalyst Wells uses cookies for the following purposes:
                  </p>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Authentication</h3>
                      <p className="text-gray-300 leading-relaxed">
                        Keep you securely logged in across sessions and remember your account credentials (encrypted).
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Session Management</h3>
                      <p className="text-gray-300 leading-relaxed">
                        Maintain your active session, remember your dashboard preferences, and restore your previous state when you return.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Analytics</h3>
                      <p className="text-gray-300 leading-relaxed">
                        Understand how users interact with our platform using Google Analytics and internal metrics. This helps us improve performance and user experience.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Personalization</h3>
                      <p className="text-gray-300 leading-relaxed">
                        Remember your language preferences, theme settings (light/dark mode), and customized dashboard layouts.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-dark rounded-2xl p-6 sm:p-8 border border-white/10">
              <div className="flex items-start gap-4 mb-4">
                <Shield size={24} className="text-neon-purple flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Types of Cookies We Use</h2>
                  
                  <div className="space-y-4">
                    <div className="glass rounded-xl p-4 border border-white/10">
                      <h3 className="text-white font-semibold mb-2">Essential Cookies (Required)</h3>
                      <p className="text-sm text-gray-400">
                        These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility. You cannot opt-out of these cookies.
                      </p>
                    </div>

                    <div className="glass rounded-xl p-4 border border-white/10">
                      <h3 className="text-white font-semibold mb-2">Performance Cookies (Optional)</h3>
                      <p className="text-sm text-gray-400">
                        These cookies help us understand how visitors interact with our website, allowing us to improve performance and user experience. All data is aggregated and anonymous.
                      </p>
                    </div>

                    <div className="glass rounded-xl p-4 border border-white/10">
                      <h3 className="text-white font-semibold mb-2">Functional Cookies (Optional)</h3>
                      <p className="text-sm text-gray-400">
                        These cookies enable enhanced functionality and personalization, such as remembering your preferences and settings.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-dark rounded-2xl p-6 sm:p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4">Your Control Over Cookies</h2>
              <div className="space-y-4 text-gray-300">
                <p className="leading-relaxed">
                  You have complete control over cookies. You can:
                </p>
                <ul className="space-y-3 ml-4">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan flex-shrink-0 mt-2"></div>
                    <span>Configure your browser to refuse all cookies or alert you when cookies are being sent</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan flex-shrink-0 mt-2"></div>
                    <span>Delete existing cookies from your browser at any time</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan flex-shrink-0 mt-2"></div>
                    <span>Opt-out of non-essential cookies through your account settings</span>
                  </li>
                </ul>
                <div className="mt-6 p-4 glass rounded-xl border border-neon-cyan/20 bg-neon-cyan/5">
                  <p className="text-sm text-gray-300">
                    <strong className="text-white">Please note:</strong> Disabling cookies may affect the functionality of Catalyst Wells. Some features may not work properly without essential cookies enabled.
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-dark rounded-2xl p-6 sm:p-8 border border-white/10">
              <div className="flex items-start gap-4 mb-4">
                <BarChart3 size={24} className="text-neon-cyan flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Third-Party Cookies</h2>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    We use carefully selected third-party services that may place cookies on your device:
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan flex-shrink-0 mt-2"></div>
                      <span className="text-gray-300"><strong className="text-white">Google Analytics:</strong> For understanding user behavior and improving our platform</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan flex-shrink-0 mt-2"></div>
                      <span className="text-gray-300"><strong className="text-white">Vercel:</strong> For content delivery and performance optimization</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan flex-shrink-0 mt-2"></div>
                      <span className="text-gray-300"><strong className="text-white">Supabase:</strong> For authentication and session management</span>
                    </li>
                  </ul>
                  <p className="text-gray-300 leading-relaxed mt-4">
                    These third-party services operate under their own privacy policies and cookie policies.
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-dark rounded-2xl p-6 sm:p-8 border border-white/10 text-center">
              <h3 className="text-xl font-bold text-white mb-4">Questions About Cookies?</h3>
              <p className="text-gray-400 mb-6">
                Contact our support team for any questions or concerns about our cookie policy.
              </p>
              <a href="mailto:support@catalystwells.com" className="inline-block px-8 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-neon-cyan to-neon-blue hover:opacity-90 transition-opacity">
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
