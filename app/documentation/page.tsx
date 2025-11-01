import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Book, Code, Zap, Settings, Users, Shield, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Catalyst Wells Documentation | Technical Guides and Tutorials",
  description: "Access developer and admin documentation to integrate, configure, and master Catalyst Wells.",
  keywords: "catalyst wells docs, school management api, edtech documentation",
};

export default function DocumentationPage() {
  const sections = [
    {
      icon: Book,
      title: "Getting Started",
      description: "Quick start guides and onboarding tutorials",
      links: ["Installation", "First Steps", "Core Concepts", "Video Tutorials"]
    },
    {
      icon: Settings,
      title: "Admin Guide",
      description: "Configure and manage your Catalyst Wells instance",
      links: ["User Management", "School Setup", "Permissions", "Customization"]
    },
    {
      icon: Code,
      title: "Developer API",
      description: "Integrate Catalyst Wells with your systems",
      links: ["API Overview", "Authentication", "Endpoints", "Webhooks"]
    },
    {
      icon: Users,
      title: "User Guides",
      description: "Help for teachers, parents, and students",
      links: ["Teacher Portal", "Parent App", "Student Dashboard", "Mobile Apps"]
    },
    {
      icon: Zap,
      title: "Features",
      description: "Deep dives into platform capabilities",
      links: ["AI Analytics", "Attendance System", "Communication", "Integrations"]
    },
    {
      icon: Shield,
      title: "Security & Compliance",
      description: "Data protection and privacy guidelines",
      links: ["Security Overview", "GDPR Compliance", "Data Backup", "Access Control"]
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
            <span className="gradient-text">Documentation</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-400 leading-relaxed max-w-3xl mx-auto mb-10">
            Everything you need to know about Catalyst Wells. From quick start guides to advanced API integration.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search documentation..."
                className="w-full px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan/50"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sections.map((section, idx) => {
              const Icon = section.icon;
              return (
                <div key={idx} className="glass-dark rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-neon-cyan/20 to-neon-blue/10 flex items-center justify-center mb-4 border border-neon-cyan/20">
                    <Icon size={24} className="text-neon-cyan" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{section.title}</h3>
                  <p className="text-sm text-gray-400 mb-4">{section.description}</p>
                  <ul className="space-y-2">
                    {section.links.map((link, linkIdx) => (
                      <li key={linkIdx}>
                        <a href="#" className="text-sm text-gray-300 hover:text-neon-cyan transition-colors flex items-center gap-2 group">
                          <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                          <span>{link}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          <div className="mt-16 glass-dark rounded-2xl p-8 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Popular Resources</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: "Quick Start Guide", description: "Get up and running in 5 minutes", views: "12K views" },
                { title: "API Authentication", description: "Secure API integration tutorial", views: "8K views" },
                { title: "Mobile App Setup", description: "Configure iOS and Android apps", views: "15K views" }
              ].map((resource, idx) => (
                <div key={idx} className="glass rounded-xl p-4 border border-white/10 hover:border-neon-cyan/30 transition-all cursor-pointer group">
                  <h3 className="font-semibold text-white mb-2 group-hover:text-neon-cyan transition-colors">{resource.title}</h3>
                  <p className="text-sm text-gray-400 mb-2">{resource.description}</p>
                  <div className="text-xs text-gray-500">{resource.views}</div>
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
