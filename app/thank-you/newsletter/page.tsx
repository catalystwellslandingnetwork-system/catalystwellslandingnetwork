import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle2, Mail, ArrowRight, Sparkles, Bell, Gift } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Thank You - Newsletter Subscription | Catalyst Wells",
  description: "You're now subscribed to our newsletter. Stay updated with the latest in education technology.",
};

export default function NewsletterThankYouPage() {
  return (
    <main className="min-h-screen bg-black">
      <Header />
      
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-neon-purple/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-neon-cyan/20 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-neon-blue/10 rounded-full blur-3xl animate-float" style={{animationDelay: '4s'}}></div>
        </div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>

        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="glass-dark rounded-3xl p-8 sm:p-12 lg:p-16 border border-white/10 text-center">
            {/* Success Icon */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-neon-purple via-neon-pink to-premium-purple blur-2xl opacity-50 animate-pulse"></div>
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-neon-purple via-neon-pink to-premium-purple flex items-center justify-center animate-float">
                  <Mail size={48} className="text-white" strokeWidth={2} />
                </div>
              </div>
            </div>

            {/* Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
              <span className="gradient-text">You're All Set!</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-300 mb-4 max-w-2xl mx-auto leading-relaxed">
              Successfully subscribed to our newsletter!
            </p>
            
            <p className="text-base sm:text-lg text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              Check your inbox for a confirmation email. We'll keep you updated with the latest insights, features, and education technology trends.
            </p>

            {/* What You'll Receive */}
            <div className="grid sm:grid-cols-3 gap-6 mb-12 text-left">
              <div className="glass rounded-2xl p-6 border border-white/10">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center mb-4">
                  <Sparkles size={24} className="text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Product Updates</h3>
                <p className="text-sm text-gray-400">Be the first to know about new features and improvements.</p>
              </div>

              <div className="glass rounded-2xl p-6 border border-white/10">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-blue flex items-center justify-center mb-4">
                  <Bell size={24} className="text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Industry Insights</h3>
                <p className="text-sm text-gray-400">Expert articles on education technology and best practices.</p>
              </div>

              <div className="glass rounded-2xl p-6 border border-white/10">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-premium-gold to-premium-pink flex items-center justify-center mb-4">
                  <Gift size={24} className="text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Exclusive Offers</h3>
                <p className="text-sm text-gray-400">Special promotions and early access to new features.</p>
              </div>
            </div>

            {/* What's Included */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">What to expect:</h2>
              <div className="grid sm:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
                {[
                  'Weekly education technology insights',
                  'Product feature announcements',
                  'Success stories from schools',
                  'Upcoming webinars and events',
                  'Industry reports and whitepapers',
                  'Exclusive deals and promotions'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle2 size={20} className="text-neon-purple flex-shrink-0" />
                    <span className="text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/blog" className="group relative px-8 py-4 rounded-xl overflow-hidden font-semibold text-white">
                <div className="absolute inset-0 bg-gradient-to-r from-neon-purple via-neon-pink to-premium-purple"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-premium-purple via-neon-pink to-neon-purple opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center justify-center space-x-2">
                  <span>Read Our Blog</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <Link href="/" className="px-8 py-4 rounded-xl font-semibold text-white border border-white/20 hover:border-neon-purple/40 hover:bg-white/5 transition-all">
                Back to Home
              </Link>
            </div>

            {/* Additional Info */}
            <div className="mt-12 pt-8 border-t border-white/10">
              <p className="text-sm text-gray-400">
                You can unsubscribe at any time. We respect your privacy and will never share your email.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
