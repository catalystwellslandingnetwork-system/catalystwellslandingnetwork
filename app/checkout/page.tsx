"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Check, Sparkles, Shield, Lock, ArrowRight, Building2, Zap, Crown } from "lucide-react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const pricingPlans = [
  {
    name: "Catalyst AI",
    icon: Zap,
    price: 15,
    gradient: "from-neon-blue to-neon-cyan",
    features: [
      "Luminex Pro",
      "70 AI Credits per Student (Daily)",
      "All Dashboards",
      "Core Modules",
      "On-Demand Report Cards",
    ],
  },
  {
    name: "Catalyst AI Pro",
    icon: Building2,
    price: 25,
    gradient: "from-neon-purple via-neon-pink to-premium-purple",
    features: [
      "Luminex AI Pro Plus",
      "150 AI Credits per Student (Daily)",
      "All Dashboards",
      "Expanded AI Tools",
      "Enterprise Security",
    ],
  },
  {
    name: "Catalyst AI Extreme",
    icon: Crown,
    price: 500,
    gradient: "from-premium-gold via-premium-pink to-neon-pink",
    features: [
      "Luminex AI Extreme",
      "UNLIMITED AI Credits",
      "All Premium Resources",
      "Van Tracking Module",
      "24/7 Priority Support",
      "Dedicated Account Manager",
    ],
  },
];

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const planParam = searchParams.get("plan");
  
  const [selectedPlan, setSelectedPlan] = useState(
    pricingPlans.find(p => p.name.toLowerCase().includes(planParam?.toLowerCase() || "pro")) || pricingPlans[1]
  );
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [studentCount, setStudentCount] = useState(75);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    email: "",
    schoolName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.schoolName.trim()) {
      newErrors.schoolName = "School name is required";
    }
    if (!formData.phone.match(/^[6-9]\d{9}$/)) {
      newErrors.phone = "Please enter a valid 10-digit mobile number";
    }
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }
    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }
    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    }
    if (!formData.pincode.match(/^\d{6}$/)) {
      newErrors.pincode = "Please enter a valid 6-digit pincode";
    }
    if (studentCount < 1 || studentCount > 10000) {
      newErrors.studentCount = "Student count must be between 1 and 10,000";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateTotal = () => {
    const basePrice = selectedPlan.price * studentCount;
    const discount = billingCycle === "yearly" ? basePrice * 0.2 : 0;
    const subtotal = billingCycle === "yearly" ? basePrice * 12 : basePrice;
    return {
      basePrice,
      discount,
      subtotal: subtotal - discount,
      monthly: basePrice,
    };
  };

  const handlePayment = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Create order on backend
      const response = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          schoolName: formData.schoolName,
          phone: formData.phone,
          planName: selectedPlan.name,
          planPrice: selectedPlan.price,
          studentCount: studentCount,
          billingCycle: billingCycle,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create order");
      }

      // Initialize Razorpay checkout
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "Catalyst Wells",
        description: `${selectedPlan.name} - ${studentCount} Students`,
        order_id: data.orderId,
        prefill: {
          email: formData.email,
          contact: formData.phone,
          name: formData.schoolName,
        },
        notes: {
          address: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
        },
        theme: {
          color: "#00f0ff",
        },
        handler: async function (response: any) {
          // Verify payment on backend
          const verifyResponse = await fetch("/api/payment/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              subscriptionId: data.subscriptionId,
            }),
          });

          const verifyData = await verifyResponse.json();

          if (verifyResponse.ok) {
            router.push(`/checkout/success?subscription=${data.subscriptionId}`);
          } else {
            alert("Payment verification failed. Please contact support.");
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      setLoading(false);

    } catch (error: any) {
      console.error("Payment error:", error);
      alert(error.message || "Payment failed. Please try again.");
      setLoading(false);
    }
  };

  const totals = calculateTotal();

  return (
    <main className="min-h-screen bg-black">
      <Header />
      
      <div className="pt-24 pb-16 px-4 sm:px-6">
        <div className="container mx-auto max-w-7xl">
          {/* Security Badge */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-green-500/30 text-sm text-green-400">
              <Shield size={16} />
              <span>Secure Checkout - SSL Encrypted</span>
              <Lock size={16} />
            </div>
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
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      School Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl bg-black/50 border ${
                        errors.email ? "border-red-500" : "border-white/20"
                      } text-white focus:border-neon-cyan focus:outline-none transition-colors`}
                      placeholder="school@example.com"
                    />
                    {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      School Name *
                    </label>
                    <input
                      type="text"
                      value={formData.schoolName}
                      onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl bg-black/50 border ${
                        errors.schoolName ? "border-red-500" : "border-white/20"
                      } text-white focus:border-neon-cyan focus:outline-none transition-colors`}
                      placeholder="ABC International School"
                    />
                    {errors.schoolName && <p className="text-red-400 text-sm mt-1">{errors.schoolName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Contact Number *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "") })}
                      className={`w-full px-4 py-3 rounded-xl bg-black/50 border ${
                        errors.phone ? "border-red-500" : "border-white/20"
                      } text-white focus:border-neon-cyan focus:outline-none transition-colors`}
                      placeholder="9876543210"
                      maxLength={10}
                    />
                    {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Address *
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl bg-black/50 border ${
                        errors.address ? "border-red-500" : "border-white/20"
                      } text-white focus:border-neon-cyan focus:outline-none transition-colors`}
                      placeholder="Street Address"
                    />
                    {errors.address && <p className="text-red-400 text-sm mt-1">{errors.address}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl bg-black/50 border ${
                          errors.city ? "border-red-500" : "border-white/20"
                        } text-white focus:border-neon-cyan focus:outline-none transition-colors`}
                        placeholder="Mumbai"
                      />
                      {errors.city && <p className="text-red-400 text-sm mt-1">{errors.city}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl bg-black/50 border ${
                          errors.state ? "border-red-500" : "border-white/20"
                        } text-white focus:border-neon-cyan focus:outline-none transition-colors`}
                        placeholder="Maharashtra"
                      />
                      {errors.state && <p className="text-red-400 text-sm mt-1">{errors.state}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, "") })}
                      className={`w-full px-4 py-3 rounded-xl bg-black/50 border ${
                        errors.pincode ? "border-red-500" : "border-white/20"
                      } text-white focus:border-neon-cyan focus:outline-none transition-colors`}
                      placeholder="400001"
                      maxLength={6}
                    />
                    {errors.pincode && <p className="text-red-400 text-sm mt-1">{errors.pincode}</p>}
                  </div>
                </div>
              </div>

              {/* Plan Selection */}
              <div className="glass-dark rounded-2xl p-6 sm:p-8 border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-6">Select Plan</h2>
                
                <div className="space-y-3">
                  {pricingPlans.map((plan) => {
                    const Icon = plan.icon;
                    return (
                      <button
                        key={plan.name}
                        onClick={() => setSelectedPlan(plan)}
                        className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                          selectedPlan.name === plan.name
                            ? "border-neon-cyan bg-neon-cyan/10"
                            : "border-white/10 hover:border-white/20"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${plan.gradient} flex items-center justify-center`}>
                              <Icon size={20} className="text-white" />
                            </div>
                            <div>
                              <div className="font-bold text-white">{plan.name}</div>
                              <div className="text-sm text-gray-400">₹{plan.price}/student/month</div>
                            </div>
                          </div>
                          {selectedPlan.name === plan.name && (
                            <Check className="text-neon-cyan" size={24} />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column - Summary */}
            <div className="space-y-6">
              <div className="glass-dark rounded-2xl p-6 sm:p-8 border border-white/10 sticky top-24">
                <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>

                {/* Student Count */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Number of Students
                  </label>
                  <input
                    type="number"
                    value={studentCount}
                    onChange={(e) => setStudentCount(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/20 text-white focus:border-neon-cyan focus:outline-none transition-colors"
                    min="1"
                    max="10000"
                  />
                  {errors.studentCount && (
                    <p className="text-red-400 text-sm mt-1">{errors.studentCount}</p>
                  )}
                </div>

                {/* Billing Cycle */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Billing Cycle
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setBillingCycle("monthly")}
                      className={`px-4 py-3 rounded-xl border-2 transition-all ${
                        billingCycle === "monthly"
                          ? "border-neon-cyan bg-neon-cyan/10 text-white"
                          : "border-white/10 text-gray-400 hover:border-white/20"
                      }`}
                    >
                      Monthly
                    </button>
                    <button
                      onClick={() => setBillingCycle("yearly")}
                      className={`px-4 py-3 rounded-xl border-2 transition-all ${
                        billingCycle === "yearly"
                          ? "border-neon-cyan bg-neon-cyan/10 text-white"
                          : "border-white/10 text-gray-400 hover:border-white/20"
                      }`}
                    >
                      Yearly
                      <span className="block text-xs text-green-400">Save 20%</span>
                    </button>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6 pb-6 border-b border-white/10">
                  <div className="flex justify-between text-gray-300">
                    <span>{selectedPlan.name}</span>
                    <span>₹{selectedPlan.price}/student</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Students</span>
                    <span>{studentCount}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Monthly Cost</span>
                    <span>₹{totals.monthly.toLocaleString()}</span>
                  </div>
                  {billingCycle === "yearly" && (
                    <>
                      <div className="flex justify-between text-gray-300">
                        <span>Yearly (12 months)</span>
                        <span>₹{(totals.monthly * 12).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-green-400">
                        <span>Discount (20%)</span>
                        <span>-₹{totals.discount.toLocaleString()}</span>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex justify-between items-center mb-6">
                  <span className="text-xl font-bold text-white">Total</span>
                  <span className="text-2xl font-bold gradient-text">
                    ₹{totals.subtotal.toLocaleString()}
                  </span>
                </div>

                {/* Trial Info */}
                <div className="bg-gradient-to-r from-neon-cyan/10 to-neon-purple/10 rounded-xl p-4 mb-6 border border-neon-cyan/20">
                  <div className="flex items-start gap-3">
                    <Sparkles className="text-neon-cyan flex-shrink-0 mt-0.5" size={20} />
                    <div className="text-sm text-gray-300">
                      <p className="font-semibold text-white mb-1">30-Day Free Trial Included</p>
                      <p>Test all features with up to 75 students. No charges during trial period.</p>
                    </div>
                  </div>
                </div>

                {/* Payment Button */}
                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className="w-full relative group/btn overflow-hidden px-6 py-4 rounded-xl font-semibold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink opacity-0 group-hover/btn:opacity-100 transition-opacity blur-sm"></div>
                  <span className="relative z-10 flex items-center justify-center space-x-2 text-white">
                    <Lock size={18} />
                    <span>{loading ? "Processing..." : "Proceed to Secure Payment"}</span>
                    <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                  </span>
                </button>

                {/* Security Icons */}
                <div className="mt-6 flex items-center justify-center gap-4 text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <Shield size={14} className="text-green-400" />
                    <span>256-bit SSL</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Lock size={14} className="text-green-400" />
                    <span>PCI Compliant</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
