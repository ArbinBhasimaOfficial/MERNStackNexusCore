"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { Globe, ChevronDown } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useTranslation, dictionary } from "../../context/languageContext"; // Hook up context

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "ne", label: "नेपाली" },
  { code: "ja", label: "日本語" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
] as const;

export default function Navbar() {
  const navRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Grab the values dynamically from global app context!
  const { currentLang, setLanguage, t } = useTranslation();

  const handleLanguageChange = (langCode: keyof typeof dictionary) => {
    setLanguage(langCode); // This updates the entire website instantly!
    setIsDropdownOpen(false);
  };

  // Outside click logic
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, [isDropdownOpen]);

  useGSAP(
    () => {
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
      className="text-white border-b border-zinc-900 sticky top-0 z-50 backdrop-blur-md bg-zinc-950/90"
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

          {/* Nav Links translated dynamically using t() */}
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-zinc-400">
            <Link
              href="/solutions"
              className="text-cyan-400 border-b-2 border-cyan-400 h-16 flex items-center"
            >
              {t("solutions")}
            </Link>
            <Link
              href="/industries"
              className="hover:text-white transition-colors h-16 flex items-center"
            >
              {t("industries")}
            </Link>
            <Link
              href="/reports"
              className="hover:text-white transition-colors h-16 flex items-center"
            >
              {t("reports")}
            </Link>
            <Link
              href="/companies"
              className="hover:text-white transition-colors h-16 flex items-center"
            >
              {t("companies")}
            </Link>
            <Link
              href="/contact"
              className="hover:text-white transition-colors h-16 flex items-center"
            >
              {t("contact")}
            </Link>
          </div>

          {/* Right Area */}
          <div className="hidden md:flex items-center space-x-5">
            {/* Language Picker Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDropdownOpen(!isDropdownOpen);
                }}
                className={`flex items-center gap-1.5 text-zinc-400 hover:text-white transition-all p-1.5 rounded-lg hover:bg-zinc-900 font-medium text-xs uppercase tracking-wider select-none ${isDropdownOpen ? "bg-zinc-900 text-white" : ""}`}
              >
                <Globe className="w-4 h-4 text-cyan-400" />
                <span>{currentLang}</span>
                <ChevronDown
                  className={`w-3 h-3 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-zinc-950 border border-zinc-900 rounded-xl shadow-2xl p-1.5 z-50 overflow-hidden backdrop-blur-md">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-between ${currentLang === lang.code ? "bg-cyan-500/10 text-cyan-400" : "text-zinc-400 hover:bg-zinc-900 hover:text-white"}`}
                    >
                      {lang.label}
                      {currentLang === lang.code && (
                        <span className="w-1 h-1 rounded-full bg-cyan-400" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <a
              href="#login"
              className="text-sm font-medium text-zinc-400 hover:text-cyan-400 transition-colors"
            >
              {t("login")}
            </a>
            <button className="bg-cyan-400 text-zinc-950 border border-transparent font-bold px-6 py-3.5 rounded-xl text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 hover:bg-zinc-950 hover:text-cyan-400 hover:border-cyan-400 active:scale-95 shadow-lg shadow-cyan-500/10 whitespace-nowrap">
              {t("getInTouch")} <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
