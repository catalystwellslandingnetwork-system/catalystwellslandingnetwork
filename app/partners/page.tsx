import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Handshake, Users, Award, Target, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Catalyst Wells Partners | Together for a Smarter Education",
  description: "Partner with Catalyst Wells and join leading tech innovators transforming school education.",
  keywords: "education partnerships India, AI partners edtech, school technology partners",
};

export default function PartnersPage() {
  const partnerTypes = [
    {
      icon: Handshake,
      title: "Technology Partners",
      description: "Integrate your platform with Catalyst Wells to reach 10,000+ schools",
      benefits: ["API access & documentation", "Co-marketing opportunities", "Revenue share program", "Technical support"]
    },
    {
      icon: Users,
      title: "Reseller Partners",
      description: "Become an authorized reseller and earn competitive commissions",
      benefits: ["Up to 30% commission", "Dedicated partner portal", "Sales & marketing materials", "Priority support"]
    },
    {
      icon: Award,
      title: "Education Consultants",
      description: "Help schools implement Catalyst Wells and earn referral fees",
      benefits: ["20% referral commission", "Implementation training", "Ongoing support access", "Partner certification"]
    }
  ];

  const existingPartners = [
    { name: "Google Workspace", logo: "🔷", category: "Technology" },
    { name: "Microsoft 365", logo: "🔶", category: "Technology" },
    { name: "Stripe", logo: "💳", category: "Payments" },
    { name: "Razorpay", logo: "💰", category: "Payments" },
    { name: "Zoom", logo: "📹", category: "Communication" },
    { name: "Twilio", logo: "📱", category: "Communication" }
  ];

  return (
    <main className="min-h-screen bg-black">
      <Header />
      
      <section className="relative pt-32 pb-20 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-neon-purple/20 rounded-full blur-3xl animate-float"></div>
        </div>

        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-white">Partner with </span>
            <span className="gradient-text">Catalyst Wells</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-400 leading-relaxed max-w-3xl mx-auto mb-10">
            Join our ecosystem and help transform education across India. Together, we can empower millions of students.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Partnership Programs</h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {partnerTypes.map((type, idx) => {
              const Icon = type.icon;
              return (
                <div key={idx} className="glass-dark rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-neon-cyan/20 to-neon-blue/10 flex items-center justify-center mb-4 border border-neon-cyan/20">
                    <Icon size={24} className="text-neon-cyan" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{type.title}</h3>
                  <p className="text-gray-400 mb-6">{type.description}</p>
                  <ul className="space-y-2">
                    {type.benefits.map((benefit, benefitIdx) => (
                      <li key={benefitIdx} className="flex items-center gap-2 text-sm text-gray-300">
                        <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan"></div>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  <button className="mt-6 w-full px-6 py-3 rounded-xl font-semibold text-white border border-white/20 hover:border-neon-cyan/40 hover:bg-white/5 transition-all flex items-center justify-center gap-2">
                    Apply Now
                    <ArrowRight size={18} />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="glass-dark rounded-2xl p-8 sm:p-12 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">Our Existing Partners</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {existingPartners.map((partner, idx) => (
                <div key={idx} className="glass rounded-xl p-4 border border-white/10 text-center group hover:border-neon-cyan/30 transition-all">
                  <div className="text-3xl mb-2">{partner.logo}</div>
                  <div className="text-sm font-semibold text-white">{partner.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{partner.category}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="glass-dark rounded-2xl p-8 sm:p-12 border border-white/10 text-center">
            <Target size={48} className="text-neon-cyan mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              <span className="text-white">Ready to </span>
              <span className="gradient-text">Partner with Us?</span>
            </h2>
            <p className="text-lg text-gray-400 mb-8">
              Let's discuss how we can work together to transform education.
            </p>
            <button className="group relative px-8 py-4 rounded-xl overflow-hidden font-semibold text-white">
              <div className="absolute inset-0 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-cyan"></div>
              <span className="relative z-10">Contact Partnership Team</span>
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
