"use client";

import type { Metadata } from "next";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MeetingScheduler from "@/components/MeetingScheduler";
import { Video, Mail, Phone, FileText, HelpCircle, BookOpen } from "lucide-react";

export default function SupportPage() {
  const [showScheduler, setShowScheduler] = useState(false);

  const faqs = [
    {
      question: "How do I get started with Catalyst Wells?",
      answer: "Sign up for a free trial, and our onboarding team will guide you through setup. Most schools are fully operational within 48 hours."
    },
    {
      question: "What kind of training do you provide?",
      answer: "We offer live webinars, video tutorials, documentation, and dedicated onboarding specialists for enterprise plans."
    },
    {
      question: "Is my data safe and backed up?",
      answer: "Yes. We use AES-256 encryption, daily backups, and maintain 99.9% uptime. Your data is stored in secure, redundant data centers."
    },
    {
      question: "Can I migrate data from my existing system?",
      answer: "Absolutely. Our migration team will help you transfer all your data seamlessly with zero downtime."
    },
    {
      question: "Do you offer phone support?",
      answer: "Yes, phone support is available on our Professional and Enterprise plans. All plans include email and chat support."
    },
    {
      question: "What are your support hours?",
      answer: "Email support is 24/7. Live chat and phone support are available Monday-Saturday, 9 AM to 8 PM IST."
    }
  ];

  const contactOptions = [
    {
      icon: Video,
      title: "Schedule Google Meet",
      description: "Book a personalized session with our team",
      action: "Schedule Meeting",
      onClick: () => setShowScheduler(true)
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "support@catalystwells.in",
      action: "Send Email",
      onClick: () => window.location.href = "mailto:support@catalystwells.in"
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "+91 7010319269 (Mon-Sat, 9 AM - 8 PM IST)",
      action: "Call Now",
      onClick: () => window.location.href = "tel:+917010319269"
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
            <span className="text-white">We're Here to </span>
            <span className="gradient-text">Help You Succeed</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-400 leading-relaxed max-w-3xl mx-auto mb-10">
            Our dedicated support team is available 24/7 to assist you with any questions or technical issues.
          </p>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {contactOptions.map((option, idx) => {
              const Icon = option.icon;
              return (
                <div
                  key={idx}
                  className="glass-dark rounded-xl p-6 border border-white/10 hover:border-neon-cyan/50 transition-all text-center group cursor-pointer transform hover:scale-105"
                  onClick={option.onClick}
                >
                  <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-neon-cyan/20 to-neon-blue/10 flex items-center justify-center mx-auto mb-4 border border-neon-cyan/20 group-hover:border-neon-cyan/50 group-hover:shadow-lg group-hover:shadow-neon-cyan/20 transition-all">
                    <Icon size={28} className="text-neon-cyan" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{option.title}</h3>
                  <p className="text-gray-400 mb-4 text-sm">{option.description}</p>
                  <div className="text-neon-cyan hover:text-neon-blue transition-colors text-sm font-semibold">
                    {option.action} →
                  </div>
                </div>
              );
            })}
          </div>

          {/* Resources */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {[
              { icon: BookOpen, title: "Documentation", description: "Comprehensive guides and tutorials" },
              { icon: FileText, title: "Knowledge Base", description: "Search our extensive help articles" },
              { icon: HelpCircle, title: "Community Forum", description: "Connect with other schools" }
            ].map((resource, idx) => {
              const Icon = resource.icon;
              return (
                <div key={idx} className="glass-dark rounded-xl p-6 border border-white/10 hover:border-neon-cyan/30 transition-all group cursor-pointer">
                  <Icon size={24} className="text-neon-cyan mb-3" />
                  <h3 className="text-lg font-bold text-white mb-2">{resource.title}</h3>
                  <p className="text-sm text-gray-400">{resource.description}</p>
                </div>
              );
            })}
          </div>

          {/* FAQs */}
          <div className="glass-dark rounded-2xl p-8 sm:p-12 border border-white/10">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {faqs.map((faq, idx) => (
                <div key={idx} className="border-b border-white/10 pb-6 last:border-0">
                  <h3 className="text-lg font-semibold text-white mb-3">{faq.question}</h3>
                  <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Meeting Scheduler Modal */}
      <MeetingScheduler isOpen={showScheduler} onClose={() => setShowScheduler(false)} />
    </main>
  );
}
