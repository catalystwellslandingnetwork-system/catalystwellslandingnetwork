import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Calendar, User, ArrowRight, TrendingUp } from "lucide-react";

export const metadata: Metadata = {
  title: "Catalyst Wells Blog | Insights into AI and Education",
  description: "Explore expert articles on AI, student wellbeing, and modern learning strategies from the Catalyst Wells team.",
  keywords: "AI in education blog, school management articles, edtech insights",
};

export default function BlogPage() {
  const articles = [
    {
      title: "How AI is Revolutionizing Student Wellbeing Monitoring",
      excerpt: "Discover how artificial intelligence helps schools identify at-risk students early and provide timely interventions for mental health and academic support.",
      category: "AI & Innovation",
      author: "Rowanberg",
      date: "October 28, 2024",
      readTime: "8 min read",
      image: "📊"
    },
    {
      title: "The Future of Parent-Teacher Communication: Beyond Email",
      excerpt: "Explore modern communication strategies that keep parents engaged, informed, and connected to their child's educational journey in real-time.",
      category: "Communication",
      author: "Priya Sharma",
      date: "October 20, 2024",
      readTime: "6 min read",
      image: "💬"
    },
    {
      title: "Data-Driven Decision Making in Education: A Complete Guide",
      excerpt: "Learn how schools are using analytics and insights to improve student outcomes, optimize resources, and create personalized learning experiences.",
      category: "Analytics",
      author: "Rajesh Kumar",
      date: "October 15, 2024",
      readTime: "10 min read",
      image: "📈"
    },
    {
      title: "Building Resilient Learning Communities Post-Pandemic",
      excerpt: "Strategies for creating supportive, adaptive school environments that prioritize both academic excellence and student wellbeing.",
      category: "Education Strategy",
      author: "Dr. Meera Patel",
      date: "October 8, 2024",
      readTime: "7 min read",
      image: "🌟"
    },
    {
      title: "Automating Administrative Tasks: Save 20+ Hours Per Week",
      excerpt: "Practical tips and tools for reducing administrative burden on teachers and staff through smart automation and AI-powered workflows.",
      category: "Productivity",
      author: "Amit Singh",
      date: "October 1, 2024",
      readTime: "5 min read",
      image: "⚡"
    },
    {
      title: "The Role of AI in Personalized Learning Paths",
      excerpt: "How machine learning algorithms analyze student performance to create customized learning experiences that adapt to individual needs.",
      category: "AI & Innovation",
      author: "Rowanberg",
      date: "September 24, 2024",
      readTime: "9 min read",
      image: "🎓"
    }
  ];

  const categories = ["All", "AI & Innovation", "Communication", "Analytics", "Education Strategy", "Productivity"];

  return (
    <main className="min-h-screen bg-black">
      <Header />
      
      <section className="relative pt-32 pb-20 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-neon-blue/20 rounded-full blur-3xl animate-float"></div>
        </div>

        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-white">Insights from </span>
            <span className="gradient-text">Education Innovators</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-400 leading-relaxed max-w-3xl mx-auto mb-10">
            Expert articles on AI, student wellbeing, and modern learning strategies from the Catalyst Wells team.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category, idx) => (
              <button
                key={idx}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  idx === 0
                    ? 'bg-gradient-to-r from-neon-cyan to-neon-blue text-white'
                    : 'glass border border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, idx) => (
              <article key={idx} className="glass-dark rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition-all group cursor-pointer">
                <div className="text-6xl p-8 bg-gradient-to-br from-neon-blue/5 to-neon-purple/5 flex items-center justify-center h-48">
                  {article.image}
                </div>
                
                <div className="p-6">
                  <div className="text-xs text-neon-cyan mb-3 font-semibold">{article.category}</div>
                  
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-neon-cyan transition-colors">
                    {article.title}
                  </h3>
                  
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    {article.excerpt}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <User size={14} />
                      <span>{article.author}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar size={14} />
                      <span>{article.readTime}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center text-neon-cyan text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Read more</span>
                    <ArrowRight size={16} className="ml-1" />
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button className="px-8 py-4 rounded-xl font-semibold text-white border border-white/20 hover:border-neon-cyan/40 hover:bg-white/5 transition-all">
              Load More Articles
            </button>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="glass-dark rounded-2xl p-8 sm:p-12 border border-white/10 text-center">
            <TrendingUp size={48} className="text-neon-cyan mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              <span className="text-white">Stay Updated with </span>
              <span className="gradient-text">Latest Insights</span>
            </h2>
            <p className="text-lg text-gray-400 mb-8">
              Subscribe to our newsletter for weekly articles on education innovation.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan/50"
              />
              <button className="px-8 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-neon-cyan to-neon-blue hover:opacity-90 transition-opacity">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
