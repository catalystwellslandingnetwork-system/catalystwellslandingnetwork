import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Building2, Shield, Zap, Users, Globe2, Lock, Headphones, BarChart3, Workflow, Database, Award, CheckCircle2, ArrowRight, Cpu, Cloud, GitBranch } from "lucide-react";

export const metadata: Metadata = {
  title: "Enterprise Solutions | Catalyst Wells - Scale Your Education Platform",
  description: "Built for enterprise scale. Everything you need to build, scale, and optimize your school operations with AI-powered tools, advanced security, and dedicated support.",
  keywords: "enterprise education software, school ERP enterprise, education platform scale, enterprise school management",
};

export default function EnterprisePage() {
  const enterpriseFeatures = [
    {
      icon: Shield,
      title: "Enterprise-Grade Security",
      description: "SOC 2 Type II certified with end-to-end encryption, SSO/SAML integration, and role-based access control.",
      features: ["End-to-end encryption", "SSO/SAML authentication", "Advanced audit logs", "Compliance reporting"]
    },
    {
      icon: Zap,
      title: "Lightning Performance",
      description: "Sub-millisecond response times with edge computing, intelligent caching, and global CDN delivery.",
      features: ["99.99% uptime SLA", "Global edge network", "Auto-scaling infrastructure", "Real-time data sync"]
    },
    {
      icon: Users,
      title: "Unlimited Scale",
      description: "Support for unlimited students, staff, and campuses with no performance degradation.",
      features: ["Multi-campus management", "Unlimited user accounts", "Bulk operations", "Custom permissions"]
    },
    {
      icon: Database,
      title: "Advanced Data Management",
      description: "Unified data layer with seamless integrations, automated backups, and data residency options.",
      features: ["Custom data retention", "Automated backups", "Data export tools", "API access"]
    },
    {
      icon: Workflow,
      title: "Custom Workflows",
      description: "Build and automate complex workflows tailored to your institution's unique requirements.",
      features: ["Visual workflow builder", "Conditional logic", "Custom triggers", "Integration webhooks"]
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Enterprise reporting with custom dashboards, predictive analytics, and AI-powered insights.",
      features: ["Custom report builder", "Predictive analytics", "Real-time dashboards", "Export to BI tools"]
    },
    {
      icon: Headphones,
      title: "Dedicated Support",
      description: "24/7 priority support with dedicated account manager and custom SLA agreements.",
      features: ["24/7 priority support", "Dedicated account manager", "Custom SLA", "Training sessions"]
    },
    {
      icon: Lock,
      title: "Compliance & Privacy",
      description: "GDPR, COPPA, and local data protection law compliance with automated auditing.",
      features: ["GDPR compliance", "COPPA certified", "Custom data policies", "Audit trail"]
    },
    {
      icon: Cloud,
      title: "Hybrid & On-Premise",
      description: "Flexible deployment options including cloud, hybrid, or on-premise installations.",
      features: ["Cloud deployment", "Hybrid options", "On-premise support", "Custom hosting"]
    }
  ];

  const benefits = [
    { icon: Award, title: "Proven at Scale", description: "Trusted by 500+ schools managing millions of students" },
    { icon: Globe2, title: "Global Reach", description: "200+ edge locations with <50ms latency worldwide" },
    { icon: Cpu, title: "AI-Powered", description: "Advanced machine learning for predictive insights" },
    { icon: GitBranch, title: "API-First", description: "Complete REST API and webhooks for custom integrations" }
  ];

  return (
    <main className="min-h-screen bg-black">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-neon-blue/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-neon-purple/20 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="container mx-auto max-w-6xl text-center relative z-10">
          <div className="inline-flex items-center space-x-2 glass-dark px-5 py-2.5 rounded-full border border-white/20 mb-8">
            <Building2 size={16} className="text-neon-cyan" />
            <span className="text-sm font-medium text-white">Enterprise Solutions</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6">
            <span className="text-white">Built for </span>
            <span className="gradient-text">Enterprise Scale</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-400 leading-relaxed max-w-3xl mx-auto mb-12">
            Everything you need to build, scale, and optimize your business operations with enterprise-grade security, performance, and support.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/pricing" className="group relative px-8 py-4 rounded-xl overflow-hidden font-semibold text-white">
              <div className="absolute inset-0 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-cyan"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 flex items-center justify-center space-x-2">
                <span>View Enterprise Pricing</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </a>
            <a href="/support" className="px-8 py-4 rounded-xl font-semibold text-white border border-white/20 hover:border-neon-cyan/40 hover:bg-white/5 transition-all">
              Contact Sales
            </a>
          </div>
        </div>
      </section>

      {/* Enterprise Features Grid */}
      <section className="py-20 px-4 sm:px-6 bg-dark-900">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              <span className="text-white">Enterprise-Grade </span>
              <span className="gradient-text">Capabilities</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Powerful features designed for organizations that need scale, security, and reliability.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enterpriseFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="group glass-dark rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-blue flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Icon size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                      <p className="text-sm text-gray-400">{feature.description}</p>
                    </div>
                  </div>
                  <ul className="space-y-2 mt-4">
                    {feature.features.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                        <CheckCircle2 size={16} className="text-neon-cyan flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              <span className="gradient-text">Why Choose</span>
              <span className="text-white"> Catalyst Wells Enterprise?</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center">
                    <Icon size={28} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{benefit.title}</h3>
                  <p className="text-gray-400">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 bg-dark-900">
        <div className="container mx-auto max-w-5xl">
          <div className="glass-dark rounded-3xl p-8 sm:p-12 border border-white/10">
            <div className="grid sm:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl sm:text-5xl font-bold gradient-text mb-2">99.99%</div>
                <div className="text-gray-400">Uptime SLA</div>
              </div>
              <div>
                <div className="text-4xl sm:text-5xl font-bold gradient-text mb-2">500+</div>
                <div className="text-gray-400">Enterprise Customers</div>
              </div>
              <div>
                <div className="text-4xl sm:text-5xl font-bold gradient-text mb-2">&lt;50ms</div>
                <div className="text-gray-400">Global Latency</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="glass-dark rounded-3xl p-8 sm:p-12 border border-white/10">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Scale Your Operations?
            </h2>
            <p className="text-lg text-gray-400 mb-8">
              Talk to our enterprise team about custom solutions for your organization.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/support" className="group relative px-8 py-4 rounded-xl overflow-hidden font-semibold text-white">
                <div className="absolute inset-0 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-cyan"></div>
                <span className="relative z-10 flex items-center justify-center space-x-2">
                  <span>Contact Enterprise Sales</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </a>
              <a href="/documentation" className="px-8 py-4 rounded-xl font-semibold text-white border border-white/20 hover:border-neon-cyan/40 hover:bg-white/5 transition-all">
                View Documentation
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
