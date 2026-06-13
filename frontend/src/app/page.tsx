import CTA from "@/components/layout/CTA";
import Features from "@/components/layout/Features";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/layout/Hero";
import Navbar from "@/components/layout/Navbar";
import Reports from "@/components/layout/Reports";
import Solutions from "@/components/layout/Solutions";
import Stats from "@/components/layout/Stats";
import LogoStrips from "@/components/layout/LogoStrips";

export default function HomePage() {
  return (
    <div className="bg-black text-white">
      <Navbar />
      <Hero />
      <LogoStrips />
      <Stats />
      <Features />
      <Reports />
      <Solutions />
      <CTA />
      <Footer />
    </div>
  );
}
