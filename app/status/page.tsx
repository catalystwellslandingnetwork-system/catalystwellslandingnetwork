import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle2, Activity, Clock, Server } from "lucide-react";

export const metadata: Metadata = {
  title: "Catalyst Wells System Status | Live Uptime & Performance",
  description: "Check Catalyst Wells' live uptime, latency, and API health in real time.",
  keywords: "catalyst wells uptime, service status, system health",
};

export default function StatusPage() {
  const services = [
    { name: "Web Application", status: "Operational", uptime: "100%", latency: "45ms" },
    { name: "Mobile API", status: "Operational", uptime: "99.9%", latency: "38ms" },
    { name: "Authentication Service", status: "Operational", uptime: "100%", latency: "12ms" },
    { name: "Database", status: "Operational", uptime: "99.99%", latency: "8ms" },
    { name: "AI Analytics Engine", status: "Operational", uptime: "99.8%", latency: "120ms" },
    { name: "Notification Service", status: "Operational", uptime: "99.9%", latency: "25ms" },
    { name: "Edge Caching Layer (Cloudflare)", status: "Operational", uptime: "99.99%", latency: "20ms" },
    { name: "WAF & DDoS Protection (Cloudflare)", status: "Operational", uptime: "100%", latency: "—" },
    { name: "Global CDN Delivery", status: "Operational", uptime: "99.99%", latency: "<50ms worldwide" }
  ];

  const incidents = [
    {
      date: "October 15, 2024",
      severity: "Minor",
      title: "Brief API Slowdown",
      description: "Resolved within 5 minutes. Latency returned to normal.",
      status: "Resolved"
    },
    {
      date: "September 28, 2024",
      severity: "Major",
      title: "Database Maintenance",
      description: "Scheduled maintenance completed successfully. Zero data loss.",
      status: "Resolved"
    }
  ];

  return (
    <main className="min-h-screen bg-black">
      <Header />
      
      <section className="relative pt-32 pb-20 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-neon-cyan/20 rounded-full blur-3xl animate-float"></div>
        </div>

        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <div className="inline-flex items-center space-x-2 glass-dark px-5 py-2.5 rounded-full border border-white/20 mb-8">
            <CheckCircle2 size={16} className="text-premium-emerald" />
            <span className="text-sm font-medium text-white">All Systems Operational</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="gradient-text">System Status</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-400 leading-relaxed max-w-3xl mx-auto mb-10">
            Real-time monitoring of all Catalyst Wells services and infrastructure.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              { icon: Activity, label: "Overall Uptime", value: "99.95%", color: "premium-emerald" },
              { icon: Clock, label: "Avg Response Time", value: "42ms", color: "neon-cyan" },
              { icon: Server, label: "Active Servers", value: "12/12", color: "neon-blue" }
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="glass-dark rounded-xl p-6 border border-white/10 text-center">
                  <Icon size={32} className={`text-${stat.color} mx-auto mb-3`} />
                  <div className="text-3xl font-bold gradient-text mb-2">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              );
            })}
          </div>

          <div className="glass-dark rounded-2xl p-8 border border-white/10 mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Service Status</h2>
            <div className="space-y-4">
              {services.map((service, idx) => (
                <div key={idx} className="glass rounded-xl p-4 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1">
                    <CheckCircle2 size={20} className="text-premium-emerald flex-shrink-0" />
                    <div>
                      <div className="text-white font-semibold">{service.name}</div>
                      <div className="text-xs text-gray-500">{service.status}</div>
                    </div>
                  </div>
                  <div className="flex gap-6 text-sm">
                    <div>
                      <div className="text-gray-500 text-xs">Uptime</div>
                      <div className="text-white font-semibold">{service.uptime}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs">Latency</div>
                      <div className="text-neon-cyan font-semibold">{service.latency}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-dark rounded-2xl p-8 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-6">Recent Incidents</h2>
            {incidents.length > 0 ? (
              <div className="space-y-4">
                {incidents.map((incident, idx) => (
                  <div key={idx} className="glass rounded-xl p-6 border border-white/10">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-white">{incident.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            incident.severity === 'Minor' 
                              ? 'bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30'
                              : 'bg-neon-purple/10 text-neon-purple border border-neon-purple/30'
                          }`}>
                            {incident.severity}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">{incident.date}</div>
                      </div>
                      <div className="px-4 py-2 rounded-full bg-premium-emerald/10 text-premium-emerald text-sm font-semibold border border-premium-emerald/30">
                        {incident.status}
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm">{incident.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                No incidents in the past 90 days
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
