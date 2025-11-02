"use client";

import { useState, useEffect } from "react";
import { Menu, X, Zap } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass-dark' : 'bg-transparent'}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/5 via-neon-purple/5 to-neon-cyan/5 pointer-events-none"></div>
      <nav className="container mx-auto px-6 py-4 relative z-10">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-neon-blue to-neon-purple rounded-xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative w-12 h-12 bg-gradient-to-br from-neon-blue via-neon-purple to-neon-cyan rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
                <Zap size={24} className="text-white" strokeWidth={2.5} />
              </div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent" style={{ fontFamily: "'Outfit', sans-serif", letterSpacing: "-0.01em", fontWeight: 700 }}>
              CatalystWells<span className="text-neon-cyan">.</span>ai
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {['Home', 'Features', 'Services', 'Pricing', 'Contact'].map((item) => (
              <a
                key={item}
                href={item === 'Home' ? '/' : `/#${item.toLowerCase()}`}
                className="relative px-4 py-2 text-gray-300 hover:text-white transition-colors group"
              >
                <span className="relative z-10">{item}</span>
                <div className="absolute inset-0 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </a>
            ))}
            <div className="ml-4 flex items-center space-x-3">
              <button className="px-6 py-2.5 text-gray-300 hover:text-white border border-white/10 rounded-lg hover:border-white/20 transition-all">
                Sign In
              </button>
              <button className="relative px-6 py-2.5 font-semibold text-white rounded-lg overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-cyan opacity-100 group-hover:opacity-90 transition-opacity"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-blue opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="relative z-10 flex items-center space-x-2">
                  <span>Get Started</span>
                  <Zap size={16} />
                </span>
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-white p-3 glass rounded-xl border border-white/10 active:scale-95 transition-all touch-manipulation"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden mt-6 pb-6 animate-in slide-in-from-top duration-300">
            <div className="glass-dark rounded-2xl p-4 border border-white/10">
              <div className="space-y-2">
                {['Home', 'Features', 'Services', 'Pricing', 'Contact'].map((item, idx) => (
                  <a
                    key={item}
                    href={item === 'Home' ? '/' : `/#${item.toLowerCase()}`}
                    className="block px-5 py-4 text-gray-300 hover:text-white glass rounded-xl transition-all active:scale-95 touch-manipulation group"
                    onClick={() => setIsMenuOpen(false)}
                    style={{animationDelay: `${idx * 50}ms`}}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{item}</span>
                      <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </a>
                ))}
              </div>
              <div className="pt-6 mt-4 border-t border-white/10 space-y-3">
                <button className="w-full px-6 py-4 text-gray-300 hover:text-white border border-white/20 rounded-xl hover:border-white/40 transition-all active:scale-95 touch-manipulation font-medium">
                  Sign In
                </button>
                <button className="w-full relative px-6 py-4 font-semibold text-white rounded-xl overflow-hidden active:scale-95 touch-manipulation">
                  <div className="absolute inset-0 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-cyan"></div>
                  <span className="relative z-10 flex items-center justify-center space-x-2">
                    <span>Get Started</span>
                    <Zap size={16} />
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
