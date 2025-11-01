import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Code, Terminal, Key, Database } from "lucide-react";

export const metadata: Metadata = {
  title: "Catalyst Wells API Reference | Integrate and Build on Our Platform",
  description: "Full API documentation for integrating Catalyst Wells with your systems.",
  keywords: "catalyst wells api, education api reference, school management api",
};

export default function APIReferencePage() {
  const endpoints = [
    {
      method: "GET",
      path: "/api/v1/students",
      description: "Retrieve list of students with filters",
      auth: "Required"
    },
    {
      method: "POST",
      path: "/api/v1/students",
      description: "Create a new student record",
      auth: "Required"
    },
    {
      method: "GET",
      path: "/api/v1/attendance",
      description: "Get attendance records by date range",
      auth: "Required"
    },
    {
      method: "POST",
      path: "/api/v1/attendance/mark",
      description: "Mark student attendance",
      auth: "Required"
    },
    {
      method: "GET",
      path: "/api/v1/analytics",
      description: "Retrieve analytics and insights data",
      auth: "Required"
    },
    {
      method: "POST",
      path: "/api/v1/notifications/send",
      description: "Send notifications to parents/students",
      auth: "Required"
    }
  ];

  return (
    <main className="min-h-screen bg-black">
      <Header />
      
      <section className="relative pt-32 pb-20 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-neon-cyan/20 rounded-full blur-3xl animate-float"></div>
        </div>

        <div className="container mx-auto max-w-5xl text-center relative z-10">
          <div className="inline-flex items-center space-x-2 glass-dark px-5 py-2.5 rounded-full border border-white/20 mb-8">
            <Code size={16} className="text-neon-cyan" />
            <span className="text-sm font-medium text-white">API Version 1.0</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="gradient-text">API Reference</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-400 leading-relaxed max-w-3xl mx-auto mb-10">
            Build powerful integrations with Catalyst Wells. RESTful API with comprehensive documentation.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {[
              { icon: Key, title: "Authentication", description: "Secure API key and OAuth 2.0 authentication" },
              { icon: Terminal, title: "Rate Limits", description: "10,000 requests/hour for standard plans" },
              { icon: Database, title: "Response Format", description: "JSON responses with consistent structure" }
            ].map((info, idx) => {
              const Icon = info.icon;
              return (
                <div key={idx} className="glass-dark rounded-xl p-6 border border-white/10 text-center">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-neon-cyan/20 to-neon-blue/10 flex items-center justify-center mx-auto mb-4 border border-neon-cyan/20">
                    <Icon size={24} className="text-neon-cyan" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{info.title}</h3>
                  <p className="text-sm text-gray-400">{info.description}</p>
                </div>
              );
            })}
          </div>

          <div className="glass-dark rounded-2xl p-8 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-8">Base URL</h2>
            <div className="glass rounded-xl p-4 border border-white/10 font-mono text-neon-cyan mb-8">
              https://api.catalystwells.ai/v1
            </div>

            <h2 className="text-2xl font-bold text-white mb-6">Core Endpoints</h2>
            <div className="space-y-4">
              {endpoints.map((endpoint, idx) => (
                <div key={idx} className="glass rounded-xl p-4 border border-white/10 hover:border-neon-cyan/30 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                        endpoint.method === 'GET' 
                          ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30'
                          : 'bg-neon-purple/20 text-neon-purple border border-neon-purple/30'
                      }`}>
                        {endpoint.method}
                      </span>
                      <code className="text-white font-mono text-sm">{endpoint.path}</code>
                    </div>
                    <div className="flex-1 text-sm text-gray-400">{endpoint.description}</div>
                    <div className="text-xs text-gray-500">{endpoint.auth}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 glass rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4">Example Request</h3>
              <pre className="bg-black/50 rounded-lg p-4 overflow-x-auto text-sm">
                <code className="text-gray-300">{`curl -X GET "https://api.catalystwells.ai/v1/students" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}</code>
              </pre>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button className="px-8 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-neon-cyan to-neon-blue hover:opacity-90 transition-opacity">
              View Full API Documentation
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
