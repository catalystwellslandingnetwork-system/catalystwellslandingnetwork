"use client";

import { Facebook, Twitter, Linkedin, Instagram, Mail, Github, Zap } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-black border-t border-white/5 py-12 sm:py-16 lg:py-20 px-4 sm:px-6 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)'
        }}></div>
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10 lg:gap-12 mb-12 sm:mb-14 lg:mb-16">
          {/* Company Info */}
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="flex items-center space-x-3 mb-5 sm:mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-neon-blue to-neon-purple rounded-xl blur-lg opacity-50"></div>
                <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-neon-blue via-neon-purple to-neon-cyan rounded-lg sm:rounded-xl flex items-center justify-center">
                  <Zap size={20} className="sm:w-6 sm:h-6 text-white" strokeWidth={2.5} />
                </div>
              </div>
              <span className="text-xl sm:text-2xl font-display font-bold text-white">Catalyst Innovations<span className="text-neon-cyan text-sm ml-1">™</span></span>
            </div>
            <p className="text-sm sm:text-base text-gray-400 leading-relaxed mb-6 sm:mb-8 max-w-sm">
              Empowering enterprises with next-generation SaaS solutions.
              Built for scale, designed for performance.
            </p>
            <div className="flex space-x-3">
              {[
                { icon: Twitter, href: '#' },
                { icon: Linkedin, href: '#' },
                { icon: Github, href: '#' },
                { icon: Instagram, href: '#' }
              ].map((social, idx) => {
                const Icon = social.icon;
                return (
                  <a
                    key={idx}
                    href={social.href}
                    className="group w-9 h-9 sm:w-10 sm:h-10 rounded-lg glass border border-white/10 flex items-center justify-center hover:border-neon-cyan/50 active:scale-95 transition-all touch-manipulation"
                  >
                    <Icon size={16} className="sm:w-[18px] sm:h-[18px] text-gray-400 group-hover:text-neon-cyan transition-colors" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-white font-bold text-xs sm:text-sm uppercase tracking-wider mb-4 sm:mb-6">Product</h3>
            <ul className="space-y-2.5 sm:space-y-3">
              {[
                { name: 'Features', href: '/features' },
                { name: 'Integrations', href: '/integrations' },
                { name: 'Pricing', href: '/pricing' },
                { name: 'Changelog', href: '/changelog' },
                { name: 'Roadmap', href: '/roadmap' }
              ].map((item, idx) => (
                <li key={idx}>
                  <a href={item.href} className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-bold text-xs sm:text-sm uppercase tracking-wider mb-4 sm:mb-6">Company</h3>
            <ul className="space-y-2.5 sm:space-y-3">
              {[
                { name: 'About', href: '/about' },
                { name: 'Blog', href: '/blog' },
                { name: 'Careers', href: '/careers' },
                { name: 'Customers', href: '/customers' },
                { name: 'Partners', href: '/partners' }
              ].map((item, idx) => (
                <li key={idx}>
                  <a href={item.href} className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-bold text-xs sm:text-sm uppercase tracking-wider mb-4 sm:mb-6">Resources</h3>
            <ul className="space-y-2.5 sm:space-y-3">
              {[
                { name: 'Documentation', href: '/documentation' },
                { name: 'API Reference', href: '/api-reference' },
                { name: 'Support', href: '/support' },
                { name: 'Status', href: '/status' },
                { name: 'Security', href: '/security' }
              ].map((item, idx) => (
                <li key={idx}>
                  <a href={item.href} className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mb-12 sm:mb-14 lg:mb-16">
          <div className="glass-dark rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-white/10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6">
              <div className="text-center md:text-left">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-1.5 sm:mb-2">Stay Updated</h3>
                <p className="text-gray-400 text-xs sm:text-sm">Get the latest news and updates delivered to your inbox.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 w-full md:w-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan/50 transition-all w-full sm:w-64 text-sm sm:text-base"
                />
                <button className="px-5 sm:px-6 py-3 rounded-lg bg-gradient-to-r from-neon-blue to-neon-cyan text-white font-semibold hover:shadow-lg hover:shadow-neon-cyan/20 active:scale-95 transition-all whitespace-nowrap touch-manipulation text-sm sm:text-base">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 sm:pt-8 border-t border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-xs sm:text-sm">
              © {new Date().getFullYear()} Catalyst Innovations. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm">
              {[
                { name: 'Privacy', href: '/privacy' },
                { name: 'Terms', href: '/terms' },
                { name: 'Cookies', href: '/cookies' },
                { name: 'Legal', href: '/legal' }
              ].map((item, idx) => (
                <a key={idx} href={item.href} className="text-gray-500 hover:text-white transition-colors active:scale-95 touch-manipulation">
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
