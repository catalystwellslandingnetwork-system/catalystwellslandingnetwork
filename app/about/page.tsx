import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Target, Users, Heart, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "About Catalyst Wells | Empowering Smart Schools in India",
  description: "Catalyst Wells is India's first AI-driven educational ecosystem, founded by Rowanberg to empower schools with technology and compassion.",
  keywords: "about catalyst wells, AI education India, smart school India",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black">
      <Header />
      
      <section className="relative pt-32 pb-20 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-neon-blue/20 rounded-full blur-3xl animate-float"></div>
        </div>

        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-white">Building the </span>
              <span className="gradient-text">Future of Education</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-400 leading-relaxed max-w-3xl mx-auto">
              Catalyst Wells is India's first AI-driven educational ecosystem, transforming how schools operate, communicate, and nurture student potential.
            </p>
          </div>

          <div className="glass-dark rounded-2xl p-8 sm:p-12 border border-white/10 mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">Our Mission</h2>
            <p className="text-lg text-gray-400 leading-relaxed mb-6">
              In an era of rapid AI-driven transformation, our institutional mandate is no longer just to educate, but to build resilient, adaptable learners. We founded Catalyst Wells on that principle—to leverage AI not simply for efficiency, but to provide the holistic insights and forward-thinking tools necessary to develop the whole student and future-proof our educational institutions.
            </p>
            <div className="flex items-center gap-4 pt-6 border-t border-white/10">
              <div className="relative">
                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 border border-white/20 shadow-xl overflow-hidden">
                  <div className="absolute inset-0 flex items-end justify-center pb-1">
                    <div className="w-full h-full flex flex-col items-center justify-end">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 mb-0.5"></div>
                      <div className="relative">
                        <div className="w-10 h-5 bg-gradient-to-b from-gray-500 to-gray-600 rounded-t-full"></div>
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-4 bg-gradient-to-b from-neon-cyan/60 to-neon-blue/60"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="text-lg font-bold text-white">Rowanberg</div>
                <div className="text-sm text-gray-400">Founder & CEO</div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {[
              { icon: Target, title: "Our Vision", description: "To create a world where every student receives personalized, data-driven education that unlocks their full potential." },
              { icon: Heart, title: "Our Values", description: "Compassion, innovation, and excellence drive everything we do. We believe in technology that serves humanity." },
              { icon: Users, title: "Our Team", description: "A diverse team of educators, engineers, and AI specialists united by the mission to transform education." },
              { icon: Zap, title: "Our Impact", description: "10,000+ schools transformed, 500,000+ students empowered, and countless lives changed through technology." }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="glass-dark rounded-xl p-6 border border-white/10">
                  <Icon size={32} className="text-neon-cyan mb-4" />
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{item.description}</p>
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
