"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Check, Sparkles, Shield, ArrowRight, Zap, Users, Calendar, Gift } from "lucide-react";

export default function TrialPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    schoolId: "",
    email: "",
    schoolName: "",
    phone: "",
    address: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loadingSchool, setLoadingSchool] = useState(false);
  const [schoolFound, setSchoolFound] = useState(false);

  const fetchSchoolDetails = async (schoolIdOrCode: string) => {
    if (!schoolIdOrCode.trim()) {
      setSchoolFound(false);
      setFormData({
        schoolId: "",
        email: "",
        schoolName: "",
        phone: "",
        address: "",
      });
      return;
    }

    setLoadingSchool(true);
    setErrors({});

    try {
      const response = await fetch(`/api/school/${encodeURIComponent(schoolIdOrCode)}`);
      const data = await response.json();

      if (!response.ok) {
        setErrors({ schoolId: data.message || "School not found. Please create your account at app.catalystwells.com first." });
        setSchoolFound(false);
        setFormData(prev => ({
          ...prev,
          email: "",
          schoolName: "",
          phone: "",
          address: "",
        }));
        return;
      }

      // Auto-populate form with school data
      setFormData({
        schoolId: data.school.id,
        email: data.school.email,
        schoolName: data.school.name,
        phone: data.school.phone,
        address: data.school.address || "",
      });
      setSchoolFound(true);
      setErrors({});

    } catch (error) {
      console.error("Error fetching school:", error);
      setErrors({ schoolId: "Failed to fetch school details. Please try again." });
      setSchoolFound(false);
    } finally {
      setLoadingSchool(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.schoolId.trim()) {
      newErrors.schoolId = "School ID is required";
    }
    if (!schoolFound) {
      newErrors.schoolId = "Please enter a valid School ID";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStartTrial = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/trial/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          schoolId: formData.schoolId,
          studentCount: 75,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to activate trial");
      }

      // Redirect to success page
      router.push(`/trial/success?schoolId=${data.school.id}`);

    } catch (error: any) {
      console.error("Trial activation error:", error);
      alert(error.message || "Failed to activate trial. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black">
      <Header />
      
      <div className="pt-24 pb-16 px-4 sm:px-6">
        <div className="container mx-auto max-w-5xl">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-neon-cyan/30 text-sm text-neon-cyan mb-6">
              <Gift size={16} />
              <span>No Credit Card Required</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              <span className="text-white">Start Your </span>
              <span className="gradient-text">Free 30-Day Trial</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">
              Experience the full power of Catalyst Wells with unlimited access to all features. 
              Test with up to 75 students at absolutely no cost!
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Form */}
            <div className="space-y-6">
              <div className="glass-dark rounded-2xl p-6 sm:p-8 border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <Sparkles className="text-neon-cyan" size={24} />
                  School Information
                </h2>

                <div className="space-y-4">
                  <div className="bg-neon-cyan/10 border border-neon-cyan/30 rounded-xl p-4 mb-4">
                    <p className="text-sm text-neon-cyan">
                    <strong>Note:</strong> You must create your school account first at{" "}
                    <a
                      href="https://catalystwells.in"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline font-semibold"
                    >
                      catalystwells.in
                    </a>
                  </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      School ID or School Code *
                    </label>
                    <input
                      type="text"
                      value={formData.schoolId}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFormData({ ...formData, schoolId: value });
                        if (value.length >= 3) {
                          fetchSchoolDetails(value);
                        }
                      }}
                      onBlur={() => formData.schoolId && fetchSchoolDetails(formData.schoolId)}
                      className={`w-full px-4 py-3 rounded-xl bg-black/50 border ${
                        errors.schoolId ? "border-red-500" : schoolFound ? "border-green-500" : "border-white/20"
                      } text-white focus:border-neon-cyan focus:outline-none transition-colors`}
                      placeholder="Enter your School ID or Code"
                      disabled={loadingSchool}
                    />
                    {loadingSchool && <p className="text-neon-cyan text-sm mt-1">Looking up school...</p>}
                    {errors.schoolId && <p className="text-red-400 text-sm mt-1">{errors.schoolId}</p>}
                    {schoolFound && <p className="text-green-400 text-sm mt-1">✓ School found!</p>}
                  </div>

                  {schoolFound && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          School Name
                        </label>
                        <input
                          type="text"
                          value={formData.schoolName}
                          disabled
                          className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 text-gray-400 cursor-not-allowed"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          School Email
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          disabled
                          className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 text-gray-400 cursor-not-allowed"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Contact Number
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          disabled
                          className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 text-gray-400 cursor-not-allowed"
                        />
                      </div>
                    </>
                  )}
                </div>

                <button
                  onClick={handleStartTrial}
                  disabled={loading}
                  className="w-full mt-6 relative group/btn overflow-hidden px-6 py-4 rounded-xl font-semibold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink opacity-0 group-hover/btn:opacity-100 transition-opacity blur-sm"></div>
                  <span className="relative z-10 flex items-center justify-center space-x-2 text-white">
                    <Gift size={18} />
                    <span>{loading ? "Activating..." : "Start Free Trial"}</span>
                    <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                  </span>
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  No credit card required • Cancel anytime • Full access for 30 days
                </p>
              </div>
            </div>

            {/* Right Column - Benefits */}
            <div className="space-y-6">
              {/* Trial Benefits */}
              <div className="glass-dark rounded-2xl p-6 sm:p-8 border border-neon-cyan/30 bg-gradient-to-br from-neon-cyan/5 to-transparent">
                <h3 className="text-xl font-bold text-white mb-6">What's Included</h3>
                
                <div className="space-y-4">
                  {[
                    { icon: Calendar, text: "30 Days Full Access", color: "neon-cyan" },
                    { icon: Users, text: "Up to 75 Students", color: "neon-purple" },
                    { icon: Zap, text: "All Premium Features", color: "neon-pink" },
                    { icon: Shield, text: "Enterprise Security", color: "premium-emerald" },
                    { icon: Gift, text: "No Payment Required", color: "neon-cyan" },
                    { icon: Check, text: "Cancel Anytime", color: "neon-purple" },
                  ].map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <div key={idx} className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg bg-${item.color}/10 border border-${item.color}/30 flex items-center justify-center`}>
                          <Icon size={20} className={`text-${item.color}`} />
                        </div>
                        <span className="text-white font-medium">{item.text}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* After Trial */}
              <div className="glass-dark rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-bold text-white mb-4">After Your Trial</h3>
                <p className="text-gray-400 text-sm mb-4">
                  When your trial ends, simply choose a paid plan to continue. 
                  We'll remind you 7 days before your trial expires.
                </p>
                <button
                  onClick={() => router.push('/pricing')}
                  className="text-neon-cyan hover:text-neon-blue transition-colors text-sm font-semibold flex items-center gap-2"
                >
                  <span>View Pricing Plans</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
