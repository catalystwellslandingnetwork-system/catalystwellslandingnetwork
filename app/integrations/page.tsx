import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle2, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Catalyst Wells Integrations | Connect Google, Microsoft, and Payment Tools",
  description: "Catalyst Wells seamlessly integrates with Google Classroom, Microsoft Teams, and your favorite tools to simplify school operations.",
  keywords: "Google classroom integration, school payment automation, Microsoft Teams education",
};

export default function IntegrationsPage() {
  const integrations = [
    {
      name: "Google Workspace",
      description: "Sync with Google Classroom, Gmail, Drive, and Calendar. Automatic roster updates and grade syncing.",
      logo: "🔷",
      category: "Classroom"
    },
    {
      name: "Microsoft 365",
      description: "Integrate Teams, Outlook, OneDrive, and OneNote. Seamless SSO and collaboration tools.",
      logo: "🔶",
      category: "Classroom"
    },
    {
      name: "Zoom",
      description: "Schedule and manage virtual classes directly from Catalyst Wells. Automated attendance tracking.",
      logo: "📹",
      category: "Communication"
    },
    {
      name: "Stripe",
      description: "Automated fee collection, payment reminders, and receipt generation. Secure online payments.",
      logo: "💳",
      category: "Payments"
    },
    {
      name: "Razorpay",
      description: "Accept payments via UPI, cards, net banking, and wallets. Instant settlement for Indian schools.",
      logo: "💰",
      category: "Payments"
    },
    {
      name: "Twilio",
      description: "SMS notifications, WhatsApp messaging, and voice alerts for parents and students.",
      logo: "📱",
      category: "Communication"
    },
    {
      name: "Canvas LMS",
      description: "Sync courses, assignments, and grades. Unified learning experience across platforms.",
      logo: "📚",
      category: "LMS"
    },
    {
      name: "Slack",
      description: "Team communication for staff, teachers, and administrators. Real-time notifications.",
      logo: "💬",
      category: "Communication"
    }
  ];

  return (
    <main className="min-h-screen bg-black">
      <Header />
      
      <section className="relative pt-32 pb-20 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-neon-cyan/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-neon-purple/20 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-white">Connect With </span>
            <span className="gradient-text">Your Favorite Tools</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-400 leading-relaxed max-w-3xl mx-auto mb-10">
            Catalyst Wells integrates seamlessly with 100+ educational tools, payment gateways, and communication platforms you already use.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {integrations.map((integration, idx) => (
              <div key={idx} className="glass-dark rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all group">
                <div className="text-4xl mb-4">{integration.logo}</div>
                <div className="text-xs text-neon-cyan mb-2">{integration.category}</div>
                <h3 className="text-lg font-bold text-white mb-2">{integration.name}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{integration.description}</p>
                <div className="mt-4 flex items-center text-neon-cyan text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Learn more</span>
                  <ArrowRight size={16} className="ml-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="glass-dark rounded-2xl p-8 sm:p-12 border border-white/10 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              <span className="gradient-text">Need a Custom Integration?</span>
            </h2>
            <p className="text-lg text-gray-400 mb-8">
              Our API makes it easy to build custom integrations. Contact our team for enterprise support.
            </p>
            <button className="group relative px-8 py-4 rounded-xl overflow-hidden font-semibold text-white">
              <div className="absolute inset-0 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-cyan"></div>
              <span className="relative z-10">Contact Sales</span>
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
