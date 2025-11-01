import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Briefcase, MapPin, Clock, ArrowRight, Heart, Zap, Users, TrendingUp } from "lucide-react";

export const metadata: Metadata = {
  title: "Careers at Catalyst Wells | Join India's AI Education Revolution",
  description: "Build the future of education with Catalyst Wells. Explore job openings in AI, product design, marketing, and education strategy.",
  keywords: "edtech jobs India, AI careers education, catalyst wells careers",
};

export default function CareersPage() {
  const openings = [
    {
      title: "Senior AI Engineer",
      department: "Engineering",
      location: "Bangalore / Remote",
      type: "Full-time",
      description: "Build cutting-edge AI models for student analytics, predictive learning, and educational insights."
    },
    {
      title: "Product Designer",
      department: "Design",
      location: "Mumbai / Remote",
      type: "Full-time",
      description: "Create beautiful, intuitive interfaces that empower teachers, students, and parents."
    },
    {
      title: "Education Success Manager",
      department: "Customer Success",
      location: "Delhi NCR",
      type: "Full-time",
      description: "Help schools maximize value from Catalyst Wells through training, support, and strategic guidance."
    },
    {
      title: "Full Stack Developer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      description: "Build scalable features using Next.js, React, Node.js, and modern cloud infrastructure."
    },
    {
      title: "Content Marketing Lead",
      department: "Marketing",
      location: "Bangalore / Remote",
      type: "Full-time",
      description: "Create compelling content that tells the Catalyst Wells story and educates our audience."
    },
    {
      title: "DevOps Engineer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      description: "Maintain 99.9% uptime, optimize infrastructure, and scale our platform for millions of users."
    }
  ];

  const benefits = [
    { icon: Heart, title: "Health & Wellness", description: "Comprehensive health insurance for you and your family" },
    { icon: Zap, title: "Growth & Learning", description: "Annual learning budget and conference passes" },
    { icon: Users, title: "Great Culture", description: "Work with passionate people changing education" },
    { icon: TrendingUp, title: "Equity & Ownership", description: "Competitive equity packages for all employees" }
  ];

  return (
    <main className="min-h-screen bg-black">
      <Header />
      
      <section className="relative pt-32 pb-20 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-neon-cyan/20 rounded-full blur-3xl animate-float"></div>
        </div>

        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-white">Join the </span>
            <span className="gradient-text">Education Revolution</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-400 leading-relaxed max-w-3xl mx-auto mb-10">
            Help us build the future of education. We're looking for talented, passionate people who want to make a real impact on millions of students.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-white mb-4 text-center">Why Catalyst Wells?</h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Work on meaningful problems with cutting-edge technology while enjoying great benefits and culture.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {benefits.map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <div key={idx} className="glass-dark rounded-xl p-6 border border-white/10 text-center">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-neon-cyan/20 to-neon-blue/10 flex items-center justify-center mx-auto mb-4 border border-neon-cyan/20">
                    <Icon size={24} className="text-neon-cyan" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{benefit.title}</h3>
                  <p className="text-sm text-gray-400">{benefit.description}</p>
                </div>
              );
            })}
          </div>

          <h2 className="text-3xl font-bold text-white mb-8">Open Positions</h2>
          <div className="space-y-4">
            {openings.map((job, idx) => (
              <div key={idx} className="glass-dark rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all group cursor-pointer">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-neon-cyan transition-colors">
                      {job.title}
                    </h3>
                    <p className="text-gray-400 mb-4">{job.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Briefcase size={16} />
                        <span>{job.department}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={16} />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={16} />
                        <span>{job.type}</span>
                      </div>
                    </div>
                  </div>
                  <button className="px-6 py-3 rounded-xl font-semibold text-white border border-white/20 hover:border-neon-cyan/40 hover:bg-white/5 transition-all flex items-center gap-2 justify-center lg:justify-start">
                    Apply Now
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 glass-dark rounded-2xl p-8 border border-white/10 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Don't see the right role?</h3>
            <p className="text-gray-400 mb-6">We're always looking for exceptional talent. Send us your resume and let's talk!</p>
            <button className="px-8 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-neon-cyan to-neon-blue hover:opacity-90 transition-opacity">
              Get in Touch
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
