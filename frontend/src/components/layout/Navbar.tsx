"use client";

import { useRef } from "react";
import Link from "next/link";
import { Globe, Menu } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function Navbar() {
  const navRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // A quick, low-key slide down and fade in on load
      gsap.from(navRef.current, {
        y: -16,
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
      });
    },
    { scope: navRef },
  );

  return (
    <nav
      ref={navRef}
      className=" text-white border-b border-zinc-900 sticky top-0 z-50 backdrop-blur-md bg-zinc-950/90"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer group">
            <div className="w-6 h-6 bg-cyan-400 rounded-md flex items-center justify-center transition-transform duration-300 group-hover:rotate-12">
              <div className="w-2.5 h-2.5 bg-zinc-950 rounded-full" />
            </div>
            <span className="font-bold text-lg tracking-tight">
              Nexus<span className="text-cyan-400">Core</span>
            </span>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-zinc-400">
            <Link
              href="/solutions"
              className="text-cyan-400 border-b-2 border-cyan-400 h-16 flex items-center gap-1"
            >
              Solutions
            </Link>
            <Link
              href="/industries"
              className="hover:text-white transition-colors h-16 flex items-center"
            >
              Industries
            </Link>
            <Link
              href="/reports"
              className="hover:text-white transition-colors h-16 flex items-center"
            >
              Reports
            </Link>
            <Link
              href="/companies"
              className="hover:text-white transition-colors h-16 flex items-center"
            >
              Companies
            </Link>
            <Link
              href="/contact"
              className="hover:text-white transition-colors h-16 flex items-center"
            >
              Contact
            </Link>
          </div>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center space-x-5">
            <button className="text-zinc-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-zinc-900">
              <Globe className="w-4 h-4" />
            </button>
            <a
              href="#login"
              className="text-sm font-medium text-zinc-400 hover:text-cyan-400 transition-colors"
            >
              Login
            </a>
            <button className="bg-cyan-400 text-zinc-950 font-bold px-4 py-2 rounded-xl text-sm hover:bg-cyan-300 transition-all active:scale-95 shadow-sm shadow-cyan-500/10">
              Get in touch
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="text-zinc-400 hover:text-white p-1">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
