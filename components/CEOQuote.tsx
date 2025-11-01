"use client";

import { Quote } from "lucide-react";

export default function CEOQuote() {
  return (
    <section className="relative py-12 sm:py-14 lg:py-16 px-4 sm:px-6 bg-black overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-purple/10 rounded-full blur-3xl"></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)'
        }}></div>
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="relative glass-dark rounded-xl sm:rounded-2xl p-6 sm:p-7 lg:p-8 border border-white/10 backdrop-blur-xl">
          {/* Quote Icon */}
          <div className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-blue flex items-center justify-center shadow-lg shadow-neon-cyan/20">
              <Quote size={16} className="sm:w-5 sm:h-5 text-white" strokeWidth={3} />
            </div>
          </div>


          {/* Quote Content */}
          <div className="pt-4 sm:pt-6">
            <blockquote className="mb-6">
              <p className="text-sm sm:text-base lg:text-lg text-gray-300 leading-relaxed italic border-l-2 border-neon-cyan/30 pl-4 sm:pl-5">
                "In an era of rapid AI-driven transformation, our institutional mandate is no longer just to educate, but to build resilient, adaptable learners. We founded Catalyst Wells on that principle—to leverage AI not simply for efficiency, but to provide the holistic insights and forward-thinking tools necessary to develop the whole student and future-proof our educational institutions."
              </p>
            </blockquote>

            {/* Author Info */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              {/* Professional Avatar */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan to-neon-blue blur-md opacity-40"></div>
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 border border-white/20 shadow-xl overflow-hidden">
                  {/* Executive silhouette */}
                  <div className="absolute inset-0 flex items-end justify-center pb-1">
                    <div className="w-full h-full flex flex-col items-center justify-end">
                      {/* Head */}
                      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 mb-0.5"></div>
                      {/* Shoulders/Suit */}
                      <div className="relative">
                        <div className="w-8 h-4 sm:w-10 sm:h-5 bg-gradient-to-b from-gray-500 to-gray-600 rounded-t-full"></div>
                        {/* Tie detail */}
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-3 sm:h-4 bg-gradient-to-b from-neon-cyan/60 to-neon-blue/60"></div>
                      </div>
                    </div>
                  </div>
                  {/* Verified badge */}
                  <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-neon-cyan to-neon-blue flex items-center justify-center border-2 border-gray-900">
                    <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div>
                <div className="text-base sm:text-lg font-bold text-white mb-0.5 flex items-center gap-2">
                  Rowanberg
                  <span className="px-2 py-0.5 text-[10px] sm:text-xs font-semibold rounded bg-gradient-to-r from-neon-cyan/20 to-neon-blue/20 border border-neon-cyan/30 text-neon-cyan">Verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm text-gray-400">CEO & Founder</span>
                  <span className="w-1 h-1 rounded-full bg-neon-cyan"></span>
                  <span className="text-xs sm:text-sm bg-gradient-to-r from-neon-cyan to-neon-blue bg-clip-text text-transparent font-semibold">CatalystWells.ai</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
