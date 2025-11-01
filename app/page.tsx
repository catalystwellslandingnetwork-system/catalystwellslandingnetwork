import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import CEOQuote from "@/components/CEOQuote";
import Services from "@/components/Services";
import Pricing from "@/components/Pricing";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Features />
      <CEOQuote />
      <Services />
      <Pricing />
      <CTA />
      <Footer />
    </main>
  );
}
