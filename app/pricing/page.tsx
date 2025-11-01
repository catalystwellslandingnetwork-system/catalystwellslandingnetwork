import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Pricing from "@/components/Pricing";

export const metadata: Metadata = {
  title: "Catalyst Wells Pricing Plans | Smart Solutions for Every School",
  description: "Transparent and flexible pricing for every school size. Pay only for what you need — start small, scale big with Catalyst Wells.",
  keywords: "school software cost India, affordable ERP for schools, education software pricing",
};

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-black">
      <Header />
      <div className="pt-20">
        <Pricing />
      </div>
      <Footer />
    </main>
  );
}
