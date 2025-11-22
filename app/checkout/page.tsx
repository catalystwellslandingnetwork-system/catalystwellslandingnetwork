"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Check, Sparkles, Shield, Lock, ArrowRight, Building2, Zap, Crown, BadgeCheck, Award, FileText, Phone } from "lucide-react";

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
  const [paymentStage, setPaymentStage] = useState<"idle" | "creating" | "redirecting" | "verifying" | "failed">("idle");
  const [paymentError, setPaymentError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    schoolId: "",
    email: "",
    schoolName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    gst: "",
  });

  const [loadingSchool, setLoadingSchool] = useState(false);
  const [schoolFound, setSchoolFound] = useState(false);

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

  const fetchSchoolDetails = async (schoolIdOrCode: string) => {
    if (!schoolIdOrCode.trim()) {
      setSchoolFound(false);
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
        return;
      }

      // Auto-populate form with school data
      setFormData(prev => ({
        ...prev,
        schoolId: data.school.id,
        email: data.school.email,
        schoolName: data.school.name,
        phone: data.school.phone,
        address: data.school.address || "",
        city: data.school.city || "",
      }));
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

    setPaymentError(null);
    setLoading(true);
    setPaymentStage("creating");

    try {
      // Create order on backend
      const response = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          schoolId: formData.schoolId,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          gst: formData.gst,
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
          setPaymentStage("verifying");
          setLoading(true);

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
            setPaymentStage("idle");
            setLoading(false);
            router.push(`/checkout/success?subscription=${data.subscriptionId}`);
          } else {
            setPaymentStage("failed");
            setPaymentError(verifyData.error || "Payment verification failed. Please contact support.");
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            // User closed Razorpay without completing payment
            setLoading(false);
            setPaymentStage("failed");
            setPaymentError("Payment was cancelled or closed in Razorpay before completion.");
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      setPaymentStage("redirecting");

    } catch (error: any) {
      console.error("Payment error:", error);
      setPaymentStage("failed");
      setPaymentError(error.message || "Payment failed. Please try again.");
      setLoading(false);
    }
  };

  const totals = calculateTotal();

  return (
    <main className="min-h-screen bg-black">
      <Header />
      
      <div className="pt-24 pb-16 px-4 sm:px-6">
        <div className="container mx-auto max-w-7xl">
          {/* Enterprise Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold tracking-tight bg-gradient-to-r from-white via-gray-100 to-gray-400 bg-clip-text text-transparent mb-3 drop-shadow-[0_0_18px_rgba(255,255,255,0.25)]">
              Secure Checkout
            </h1>
            <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto mb-6">
              Complete a secure, PCI-compliant subscription payment in just a few steps.
            </p>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-8">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg glass border border-green-500/30">
                <Shield size={18} className="text-green-400" />
                <span className="text-sm font-medium text-green-400">256-bit SSL Encryption</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg glass border border-blue-500/30">
                <BadgeCheck size={18} className="text-blue-400" />
                <span className="text-sm font-medium text-blue-400">PCI DSS Compliant</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg glass border border-purple-500/30">
                <Award size={18} className="text-purple-400" />
                <span className="text-sm font-medium text-purple-400">Trusted by 500+ Schools</span>
              </div>
            </div>

            {/* Progress Steps */}
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center justify-between mb-2">
                <div className="flex flex-col items-center flex-1">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-cyan to-neon-blue flex items-center justify-center mb-2">
                    <FileText size={20} className="text-white" />
                  </div>
                  <span className="text-xs text-neon-cyan font-medium">School Details</span>
                </div>
                <div className="h-0.5 flex-1 bg-gradient-to-r from-neon-cyan to-neon-purple"></div>
                <div className="flex flex-col items-center flex-1">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center mb-2">
                    <Building2 size={20} className="text-white" />
                  </div>
                  <span className="text-xs text-neon-purple font-medium">Plan Selection</span>
                </div>
                <div className="h-0.5 flex-1 bg-gradient-to-r from-neon-purple to-green-500"></div>
                <div className="flex flex-col items-center flex-1">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-400 flex items-center justify-center mb-2">
                    <Lock size={20} className="text-white" />
                  </div>
                  <span className="text-xs text-green-400 font-medium">Payment</span>
                </div>
              </div>
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

                  {schoolFound && (
                    <>
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
                    </>
                  )}
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

                {/* Subscription Info */}
                <div className="bg-gradient-to-r from-neon-cyan/10 to-neon-purple/10 rounded-xl p-4 mb-6 border border-neon-cyan/20">
                  <div className="flex items-start gap-3">
                    <Sparkles className="text-neon-cyan flex-shrink-0 mt-0.5" size={20} />
                    <div className="text-sm text-gray-300">
                      <p className="font-semibold text-white mb-1">Paid Subscription</p>
                      <p>This activates your paid plan. For a free trial without payment, <a href="/trial" className="text-neon-cyan hover:underline">click here</a>.</p>
                    </div>
                  </div>
                </div>

                {/* Payment Button */}
                <button
                  onClick={handlePayment}
                  disabled={loading || !schoolFound}
                  className="w-full relative group/btn overflow-hidden px-6 py-4 rounded-xl font-semibold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-neon-cyan/20"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-green-600 to-green-700"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-green-500 to-green-600 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                  <span className="relative z-10 flex items-center justify-center space-x-2 text-white">
                    <Lock size={20} />
                    <span className="text-lg">{loading ? "Processing Payment..." : "Complete Secure Payment"}</span>
                    <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                  </span>
                </button>

                {/* Security & Payment Badges */}
                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-center gap-6">
                    <div className="text-center">
                      <Shield size={24} className="text-green-400 mx-auto mb-1" />
                      <div className="text-xs text-gray-400 font-medium">Bank-Level Security</div>
                    </div>
                    <div className="text-center">
                      <Lock size={24} className="text-blue-400 mx-auto mb-1" />
                      <div className="text-xs text-gray-400 font-medium">Encrypted Payment</div>
                    </div>
                    <div className="text-center">
                      <BadgeCheck size={24} className="text-purple-400 mx-auto mb-1" />
                      <div className="text-xs text-gray-400 font-medium">Verified Merchant</div>
                    </div>
                  </div>
                  
                  {/* Payment Methods */}
                  <div className="bg-black/30 rounded-lg p-3">
                    <div className="text-xs text-gray-400 text-center mb-2">Powered by Razorpay</div>
                    <div className="flex items-center justify-center gap-4 flex-wrap">
                      <div className="text-xs font-semibold text-gray-300">UPI</div>
                      <div className="text-xs font-semibold text-gray-300">Cards</div>
                      <div className="text-xs font-semibold text-gray-300">Net Banking</div>
                      <div className="text-xs font-semibold text-gray-300">Wallets</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Payment Status Overlay */}
      {paymentStage !== "idle" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur">
          <div className="glass-dark rounded-2xl border border-white/10 p-6 sm:p-8 max-w-sm w-full mx-4 text-center">
            <div className="flex flex-col items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full border-2 border-neon-cyan/60 border-t-transparent animate-spin mb-1"></div>
              <Lock className="text-neon-cyan" size={24} />
            </div>
            {paymentStage === "creating" && (
              <>
                <h3 className="text-lg font-semibold text-white mb-1">Creating secure order…</h3>
                <p className="text-sm text-gray-400">Please wait while we prepare your Razorpay payment session.</p>
              </>
            )}
            {paymentStage === "redirecting" && (
              <>
                <h3 className="text-lg font-semibold text-white mb-1">Opening Razorpay…</h3>
                <p className="text-sm text-gray-400">You may see a new window or popup to complete your payment.</p>
              </>
            )}
            {paymentStage === "verifying" && (
              <>
                <h3 className="text-lg font-semibold text-white mb-1">Verifying payment…</h3>
                <p className="text-sm text-gray-400">We are confirming your transaction with Razorpay. Do not close this window.</p>
              </>
            )}
            {paymentStage === "failed" && (
              <>
                <h3 className="text-lg font-semibold text-red-400 mb-1">Payment failed</h3>
                <p className="text-sm text-gray-400 mb-2">We could not complete or verify your payment.</p>
                {paymentError && (
                  <p className="text-xs text-red-300 mb-3 break-words">{paymentError}</p>
                )}
                <button
                  className="mt-1 inline-flex items-center justify-center px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm font-medium text-white border border-white/20 transition-colors"
                  onClick={() => {
                    setPaymentStage("idle");
                    setPaymentError(null);
                  }}
                >
                  Try Again
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
