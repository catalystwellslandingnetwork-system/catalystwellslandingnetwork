import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Quote, TrendingUp, Users, Award } from "lucide-react";

export const metadata: Metadata = {
  title: "Catalyst Wells Customers | Schools Transforming with AI",
  description: "Discover schools and institutions using Catalyst Wells to revolutionize education across India.",
  keywords: "catalyst wells case studies, school transformation stories, AI education success",
};

export default function CustomersPage() {
  const testimonials = [
    {
      school: "ACE Education",
      location: "Mumbai, Maharashtra",
      logo: "🎓",
      quote: "Catalyst Wells transformed our operations completely. Attendance tracking is now automated, parent communication is seamless, and we've seen a 40% improvement in student engagement.",
      name: "Dr. Priya Sharma",
      role: "Principal",
      stats: { students: "2,500+", improvement: "40%", metric: "Engagement" }
    },
    {
      school: "Astrix Fizzle Academy",
      location: "Bangalore, Karnataka",
      logo: "⭐",
      quote: "The AI-powered analytics help us identify at-risk students early. We've reduced dropout rates by 35% and our teachers save 15 hours per week on administrative tasks.",
      name: "Rajesh Kumar",
      role: "Director",
      stats: { students: "1,800+", improvement: "35%", metric: "Retention" }
    },
    {
      school: "Global Academy",
      location: "Delhi NCR",
      logo: "🌍",
      quote: "Best investment we've made. The parent app alone has increased parent participation by 60%. The data insights are game-changing for our curriculum planning.",
      name: "Meera Patel",
      role: "Academic Head",
      stats: { students: "3,200+", improvement: "60%", metric: "Parent Participation" }
    }
  ];

  const stats = [
    { value: "10,000+", label: "Schools Served" },
    { value: "500K+", label: "Students Empowered" },
    { value: "98%", label: "Satisfaction Rate" },
    { value: "45%", label: "Avg. Efficiency Gain" }
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
            <span className="text-white">Trusted by </span>
            <span className="gradient-text">Leading Schools</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-400 leading-relaxed max-w-3xl mx-auto mb-10">
            Join thousands of institutions transforming education with Catalyst Wells. Real schools. Real results.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            {stats.map((stat, idx) => (
              <div key={idx} className="glass-dark rounded-xl p-6 border border-white/10">
                <div className="text-3xl font-bold gradient-text mb-2">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            <span className="gradient-text">Success Stories</span>
          </h2>

          <div className="space-y-8">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="glass-dark rounded-2xl p-6 sm:p-8 border border-white/10 hover:border-white/20 transition-all">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="text-4xl">{testimonial.logo}</div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{testimonial.school}</h3>
                        <p className="text-sm text-gray-400">{testimonial.location}</p>
                      </div>
                    </div>
                    
                    <Quote size={24} className="text-neon-cyan mb-4" />
                    <p className="text-gray-300 leading-relaxed mb-6 italic">"{testimonial.quote}"</p>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-neon-cyan to-neon-blue flex items-center justify-center text-white font-bold">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-white font-semibold">{testimonial.name}</div>
                        <div className="text-sm text-gray-400">{testimonial.role}</div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:w-64 flex lg:flex-col gap-4">
                    <div className="glass rounded-xl p-4 border border-white/10 flex-1">
                      <Users size={20} className="text-neon-cyan mb-2" />
                      <div className="text-2xl font-bold text-white">{testimonial.stats.students}</div>
                      <div className="text-xs text-gray-400">Students</div>
                    </div>
                    <div className="glass rounded-xl p-4 border border-white/10 flex-1">
                      <TrendingUp size={20} className="text-neon-purple mb-2" />
                      <div className="text-2xl font-bold gradient-text">{testimonial.stats.improvement}</div>
                      <div className="text-xs text-gray-400">{testimonial.stats.metric}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="glass-dark rounded-2xl p-8 sm:p-12 border border-white/10 text-center">
            <Award size={48} className="text-neon-cyan mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              <span className="text-white">Ready to Join </span>
              <span className="gradient-text">10,000+ Schools?</span>
            </h2>
            <p className="text-lg text-gray-400 mb-8">
              Start transforming your institution today with a 14-day free trial.
            </p>
            <button className="group relative px-8 py-4 rounded-xl overflow-hidden font-semibold text-white">
              <div className="absolute inset-0 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-cyan"></div>
              <span className="relative z-10">Get Started Free</span>
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
