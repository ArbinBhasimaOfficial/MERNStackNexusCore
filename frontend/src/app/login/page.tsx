"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { Mail, Eye, EyeOff, ShieldCheck, Loader2 } from "lucide-react";
import { useTranslation } from "@/context/languageContext";
import { useAuth } from "@/context/authContext";

export default function LoginPage() {
  const { t } = useTranslation();
  const { setPendingEmail, setUserSession } = useAuth();

  // Input states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Refs for GSAP target elements
  const leftPaneRef = useRef<HTMLDivElement>(null);
  const rightPaneRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const textItemsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  // Counter numerical target references
  const countRepRef = useRef<HTMLDivElement>(null);
  const countMktRef = useRef<HTMLDivElement>(null);
  const countRetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // 1. Initial background slide-in split panels
      tl.fromTo(
        leftPaneRef.current,
        { xPercent: -2 },
        { xPercent: 0, duration: 1 },
      ).fromTo(
        rightPaneRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1.2 },
        "-=0.8",
      );

      // 2. Left side branding & text typography cascade
      if (
        logoRef.current &&
        badgeRef.current &&
        textItemsRef.current &&
        statsRef.current
      ) {
        tl.fromTo(
          logoRef.current,
          { y: -20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          "-=0.8",
        ).fromTo(
          badgeRef.current,
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 },
          "-=0.6",
        );

        const children = textItemsRef.current.children;
        tl.fromTo(
          children,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.15 },
          "-=0.4",
        ).fromTo(
          statsRef.current.children,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.1 },
          "-=0.5",
        );
      }

      // 3. Right Side Card Panel Elevation Reveal
      if (cardRef.current && footerRef.current) {
        tl.fromTo(
          cardRef.current,
          { y: 40, opacity: 0, scale: 0.98 },
          { y: 0, opacity: 1, scale: 1, duration: 0.8 },
          "-=0.8",
        ).fromTo(
          footerRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.6 },
          "-=0.3",
        );
      }

      // 4. GSAP Numerical Rolling Counter Engine
      const counters = [
        { ref: countRepRef, target: 12, suffix: "k+" },
        { ref: countMktRef, target: 86, suffix: "" },
        { ref: countRetRef, target: 98, suffix: "%" },
      ];

      counters.forEach((counter) => {
        if (counter.ref.current) {
          const obj = { value: 0 };
          gsap.to(obj, {
            value: counter.target,
            duration: 2,
            ease: "power3.out",
            delay: 0.6,
            onUpdate: () => {
              if (counter.ref.current) {
                counter.ref.current.innerText =
                  Math.floor(obj.value) + counter.suffix;
              }
            },
          });
        }
      });
    });

    return () => ctx.revert();
  }, []);

  // Form Submitter Interceptor Pipeline
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:1570/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      // Intercept Scenario: Account targets verified barrier mapping flag
      if (res.status === 203 || data.requiresVerification) {
        setPendingEmail(data.email);
        alert(
          "Account requires verification. Redirecting to validation page...",
        );
        window.location.href = "/verify";
        return;
      }

      if (!res.ok) {
        throw new Error(data.error || "Login transaction collapsed.");
      }

      // Success Sequence: Commit session values down to context state
      setUserSession({ id: data.user.id, email: data.user.email });
      window.location.href = "/dashboard";
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030708] text-white flex flex-col justify-between font-sans selection:bg-[#1DE4EC]/30">
      {/* Split Body Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 grow">
        {/* Left Branding Panel Showcase */}
        <div
          ref={leftPaneRef}
          className="lg:col-span-6 bg-gradient-to-b from-[#051012] to-[#030708] p-8 lg:p-20 flex flex-col justify-between border-r border-white/[0.02]"
        >
          {/* Logo */}
          <div ref={logoRef} className="flex items-center gap-3 mt-2">
            <div className="w-6 h-6 bg-cyan-400 rounded-md flex items-center justify-center transition-transform duration-300 group-hover:rotate-12">
              <div className="w-2.5 h-2.5 bg-zinc-950 rounded-full" />
            </div>
            <span className="font-bold text-lg tracking-tight">
              Nexus<span className="text-cyan-400">Core</span>
            </span>
          </div>

          {/* Typography Copy blocks */}
          <div className="max-w-xl my-auto py-16 lg:py-0">
            <div
              ref={badgeRef}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1DE4EC]/5 border border-[#1DE4EC]/20 text-[#1DE4EC] text-xs font-semibold tracking-wide mb-8"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#1DE4EC]" />
              {t("heroBadge")}
            </div>

            <div ref={textItemsRef} className="space-y-5">
              <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-white">
                {t("welcomeBack")}
              </h1>
              <h2 className="text-2xl lg:text-3xl text-[#1DE4EC] font-semibold tracking-tight leading-snug">
                {t("marketIntelligenceAwaits")}
              </h2>
              <p className="text-gray-400/80 text-base leading-relaxed max-w-md">
                {t("signInDesc")}
              </p>
            </div>
          </div>

          {/* Metric Dashboard Counters Section */}
          <div
            ref={statsRef}
            className="grid grid-cols-3 gap-8 pt-8 border-t border-white/[0.04] mb-2"
          >
            <div>
              <div
                ref={countRepRef}
                className="text-3xl lg:text-4xl font-extrabold text-[#1DE4EC] tracking-tight"
              >
                0k+
              </div>
              <div className="text-xs font-medium text-gray-500 tracking-wide mt-1.5">
                {t("statsReports")}
              </div>
            </div>
            <div>
              <div
                ref={countMktRef}
                className="text-3xl lg:text-4xl font-extrabold text-[#1DE4EC] tracking-tight"
              >
                0
              </div>
              <div className="text-xs font-medium text-gray-500 tracking-wide mt-1.5">
                {t("statsMarkets")}
              </div>
            </div>
            <div>
              <div
                ref={countRetRef}
                className="text-3xl lg:text-4xl font-extrabold text-[#1DE4EC] tracking-tight"
              >
                0%
              </div>
              <div className="text-xs font-medium text-gray-500 tracking-wide mt-1.5">
                {t("statsRetention")}
              </div>
            </div>
          </div>
        </div>

        {/* Right Authentication Form Controller Pane */}
        <div
          ref={rightPaneRef}
          className="lg:col-span-6 flex items-center justify-center p-6 lg:p-12 relative bg-[#040809]"
        >
          {/* Subtle Ambient Glow Radial Background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#1DE4EC]/3 blur-[140px] rounded-full pointer-events-none" />

          {/* Credentials Card Wrapper Component */}
          <div
            ref={cardRef}
            className="w-full max-w-[460px] bg-[#121719] border border-white/[0.04] rounded-2xl p-8 lg:p-9 shadow-2xl relative z-10"
          >
            <h3 className="text-2xl font-bold tracking-tight text-gray-100 mb-6">
              {t("loginHeading")}
            </h3>

            {/* Form Toggle Selection Tabs (Fixed Border & Alignment) */}
            <div className="relative flex gap-6 border-b border-white/[0.04] pb-4 mb-7 text-sm font-semibold">
              <button className="text-white relative pb-1">
                {t("loginTab")}
                {/* Clean absolute bar placement directly overlapping parent border base */}
                <span className="absolute bottom-[-17px] left-0 right-0 h-[2px] bg-[#1DE4EC]" />
              </button>
              <Link
                href="/register"
                className="text-gray-500 hover:text-gray-300 transition-colors pb-1"
              >
                Register
              </Link>
            </div>

            {/* Dynamic Error Visual Warning Alert */}
            {error && (
              <div className="text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-3.5 text-xs font-semibold mb-5 transition-all duration-200">
                {error}
              </div>
            )}

            {/* Authentication Control Fields */}
            <form className="space-y-5" onSubmit={handleLogin}>
              {/* Email Input Field */}
              <div className="space-y-2.5">
                <label className="text-xs font-semibold text-gray-400 tracking-wide">
                  {t("emailLabel")}
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("emailPlaceholder")}
                    className="w-full bg-[#0a0f11] border border-white/[0.06] focus:border-[#1DE4EC]/40 focus:bg-[#0c1315] rounded-xl py-3.5 px-4 text-sm text-white placeholder-gray-600 outline-none transition-all duration-200 pr-10"
                  />
                  <Mail className="w-4 h-4 text-gray-600 absolute right-3.5 top-4" />
                </div>
              </div>

              {/* Password Input Field */}
              <div className="space-y-2.5">
                <label className="text-xs font-semibold text-gray-400 tracking-wide">
                  {t("passwordLabel")}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t("passwordPlaceholder")}
                    className="w-full bg-[#0a0f11] border border-white/[0.06] focus:border-[#1DE4EC]/40 focus:bg-[#0c1315] rounded-xl py-3.5 px-4 text-sm text-white placeholder-gray-600 outline-none transition-all duration-200 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-4 text-gray-600 hover:text-gray-300 transition-colors cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Auxiliary Operation Controls Area Row */}
              <div className="flex items-center justify-between text-xs font-medium pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer text-gray-400 hover:text-gray-300 select-none">
                  <input
                    type="checkbox"
                    className="accent-[#1DE4EC] bg-black border-white/20 w-4 h-4 rounded cursor-pointer"
                  />
                  {t("rememberMe")}
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[#1DE4EC] hover:text-[#2ff4fc] transition-colors"
                >
                  {t("forgotPassword")}
                </Link>
              </div>

              {/* Submit Execution Action Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-cyan-400 text-zinc-950 border border-transparent font-bold px-6 py-3.5 rounded-xl text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 hover:bg-zinc-950 hover:text-cyan-400 hover:border-cyan-400 active:scale-95 shadow-lg shadow-cyan-500/10 whitespace-nowrap disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  t("signInBtn")
                )}
              </button>
            </form>

            {/* Divider Line Element */}
            <div className="relative flex py-5 items-center my-3">
              <div className="grow border-t border-white/[0.04]"></div>
              <span className="shrink mx-4 text-[10px] tracking-widest text-gray-500 font-bold">
                {t("orContinueWith")}
              </span>
              <div className="grow border-t border-white/[0.04]"></div>
            </div>

            {/* Identity Provider OAuth Grid Container Buttons */}
            <div className="grid grid-cols-2 gap-3.5">
              <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#0a0f11] border border-white/[0.04] text-sm font-semibold text-gray-300 hover:bg-white/[0.02] hover:text-white transition-all cursor-pointer">
                <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                Google
              </button>
              <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#0a0f11] border border-white/[0.04] text-sm font-semibold text-gray-300 hover:bg-white/[0.02] hover:text-white transition-all cursor-pointer">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                </svg>
                LinkedIn
              </button>
            </div>

            {/* Trial Offer Callout */}
            <div className="text-center text-xs text-gray-500 mt-7 select-none font-medium">
              {t("dontHaveAccount")}{" "}
              <a
                href="#"
                className="text-[#1DE4EC] hover:text-[#2ff4fc] font-semibold transition-colors"
              >
                {t("startFreeTrial")}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer System Strip */}
      <div
        ref={footerRef}
        className="w-full px-6 lg:px-20 py-6 border-t border-white/[0.02] bg-[#020506] flex flex-col sm:flex-row gap-4 justify-between items-center text-xs text-gray-500 font-medium relative z-20"
      >
        <div className="flex flex-wrap justify-center gap-6">
          <a href="#" className="hover:text-gray-300 transition-colors">
            {t("footerPrivacy")}
          </a>
          <a href="#" className="hover:text-gray-300 transition-colors">
            {t("footerTerms")}
          </a>
          <a href="#" className="hover:text-gray-300 transition-colors">
            {t("footerCookies")}
          </a>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5 text-emerald-500/80 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>{t("secureAccess")}</span>
          </div>
          <span className="text-gray-600">{t("footerRights")}</span>
        </div>
      </div>
    </div>
  );
}
