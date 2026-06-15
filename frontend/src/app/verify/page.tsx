"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Mail, Clock, ShieldCheck, CheckCircle2, Lock } from "lucide-react";
import { useAuth } from "@/context/authContext";

export default function VerificationPage() {
  // 6-digit code tracking array state
  const [code, setCode] = useState<string[]>(new Array(6).fill(""));
  const [countdown, setCountdown] = useState(42); // 00:42 visual timer layout matches design
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { pendingEmail, setPendingEmail, setUserSession } = useAuth();

  const targetEmail = "alex@company.com"; // Dynamic string variable fallback hook

  // Element reference pools for structural staging
  const leftPaneRef = useRef<HTMLDivElement>(null);
  const rightPaneRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const textItemsRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const inputRefs = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    if (!pendingEmail) {
      window.location.href = "/register";
    }
  }, [pendingEmail]);

  // 1. 42-Second Realtime Countdown Loop
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  // 2. Complex GSAP Interface Entry Chaining
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.fromTo(
        leftPaneRef.current,
        { xPercent: -4, opacity: 0 },
        { xPercent: 0, opacity: 1, duration: 1 },
      ).fromTo(
        rightPaneRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1 },
        "-=0.7",
      );

      if (
        logoRef.current &&
        badgeRef.current &&
        textItemsRef.current &&
        featuresRef.current
      ) {
        tl.fromTo(
          logoRef.current,
          { y: -15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 },
          "-=0.6",
        )
          .fromTo(
            badgeRef.current,
            { y: 15, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5 },
            "-=0.4",
          )
          .fromTo(
            textItemsRef.current.children,
            { y: 25, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7, stagger: 0.15 },
            "-=0.3",
          )
          .fromTo(
            featuresRef.current.children,
            { x: -25, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 0.5,
              stagger: 0.1,
              ease: "back.out(1.1)",
            },
            "-=0.4",
          );
      }

      if (cardRef.current && footerRef.current) {
        tl.fromTo(
          cardRef.current,
          { y: 35, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          "-=0.7",
        ).fromTo(
          footerRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.5 },
          "-=0.2",
        );
      }
    });

    return () => ctx.revert();
  }, []);

  // 3. Smart Code Handler (Auto-focus moving forward and backward)
  const handleInputChange = (element: HTMLInputElement, index: number) => {
    const val = element.value.replace(/[^0-9]/g, ""); // Restrict inputs strictly to numeric entries
    if (!val) return;

    const updatedCode = [...code];
    updatedCode[index] = val.slice(-1); // Snag final char stroke index
    setCode(updatedCode);

    // Shift active cursor to neighboring right-hand terminal if present
    if (element.value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace") {
      const updatedCode = [...code];

      if (!code[index] && index > 0) {
        // If current index is empty, jump back to delete the previous index
        updatedCode[index - 1] = "";
        setCode(updatedCode);
        inputRefs.current[index - 1]?.focus();
      } else {
        // Otherwise, clear the current element
        updatedCode[index] = "";
        setCode(updatedCode);
      }
    }
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const combinedVerificationToken = code.join("");

    if (combinedVerificationToken.length < 6) {
      setError("Please complete the full 6-digit confirmation pattern.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:1570/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: pendingEmail,
          code: combinedVerificationToken,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Verification mismatch");
      setUserSession(data.user);
      localStorage.setItem("nexus_session_user", JSON.stringify(data.user));
      setPendingEmail(""); // Purges token memory cleanly

      window.location.href = "/login";
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030708] text-white flex flex-col justify-between font-sans selection:bg-[#1DE4EC]/30">
      <div className="grid grid-cols-1 lg:grid-cols-12 grow">
        {/* Left Branding Panel Showcase */}
        <div
          ref={leftPaneRef}
          className="lg:col-span-5 bg-gradient-to-b from-[#051012] to-[#030708] p-8 lg:p-20 flex flex-col justify-between border-r border-white/[0.02]"
        >
          <div ref={logoRef} className="flex items-center gap-3 mt-2">
            <div className="w-6 h-6 bg-[#1DE4EC] rounded-md flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-zinc-950 rounded-full" />
            </div>
            <span className="font-bold text-lg tracking-tight">
              Nexus<span className="text-[#1DE4EC]">Core</span>
            </span>
          </div>

          <div className="max-w-xl my-auto py-12 lg:py-0">
            <div
              ref={badgeRef}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1DE4EC]/5 border border-[#1DE4EC]/20 text-[#1DE4EC] text-xs font-semibold tracking-wide mb-8"
            >
              <span>✨</span> Free trial access
            </div>

            <div ref={textItemsRef} className="space-y-5 mb-10">
              <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
                Start your free trial.
              </h1>
              <h2 className="text-xl text-[#1DE4EC] font-medium tracking-tight">
                Join thousands of brands making smarter decisions.
              </h2>
            </div>

            <div ref={featuresRef} className="space-y-4 max-w-md">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <CheckCircle2 className="w-5 h-5 text-[#1DE4EC] shrink-0" />
                <span className="text-sm text-gray-300 font-medium">
                  Access 12,000+ market reports
                </span>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <CheckCircle2 className="w-5 h-5 text-[#1DE4EC] shrink-0" />
                <span className="text-sm text-gray-300 font-medium">
                  Real-time consumer data & trends
                </span>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <CheckCircle2 className="w-5 h-5 text-[#1DE4EC] shrink-0" />
                <span className="text-sm text-gray-300 font-medium">
                  Expert analyst support included
                </span>
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-600 font-medium tracking-wide">
            Trusted by ambitious teams across retail, finance, healthcare, and
            technology.
          </div>
        </div>

        {/* Right Verification Controller Form Block */}
        <div
          ref={rightPaneRef}
          className="lg:col-span-7 flex flex-col justify-center items-center p-6 lg:p-12 relative bg-[#040809]"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#1DE4EC]/2 blur-[160px] rounded-full pointer-events-none" />

          {/* Secure Header Accessory Badge */}
          <div className="w-full max-w-[520px] flex justify-end mb-4 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/[0.04] bg-[#0c1113] text-[11px] text-gray-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-[#1DE4EC]" /> Secure
              registration
            </div>
          </div>

          {/* Core OTP Layout Container */}
          <div
            ref={cardRef}
            className="w-full max-w-[520px] bg-[#121719] border border-white/[0.04] rounded-2xl p-8 lg:p-10 shadow-2xl relative z-10"
          >
            <h3 className="text-2xl font-bold tracking-tight text-gray-100 mb-6">
              Verify your account
            </h3>

            {/* Navigation Indicators */}
            <div className="relative flex gap-6 border-b border-white/[0.04] pb-4 mb-7 text-sm font-semibold">
              <span className="text-gray-500 pb-1">Login</span>
              <button className="text-white relative pb-1">
                Register
                <span className="absolute bottom-[-17px] left-0 right-0 h-[2px] bg-[#1DE4EC]" />
              </button>
            </div>

            {error && (
              <div className="text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-xs font-semibold mb-4">
                {error}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleVerificationSubmit}>
              {/* Digit Box Flex Arrays */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-gray-400 tracking-wide">
                  Verification Code
                </label>
                <div className="flex justify-between gap-2.5">
                  {code.map((data, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength={1}
                      ref={(el) => {
                        if (el) inputRefs.current[index] = el;
                      }}
                      value={data}
                      onChange={(e) => handleInputChange(e.target, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      className="w-full aspect-square bg-[#0a0f11] border border-white/[0.06] focus:border-[#1DE4EC]/50 focus:bg-[#0c1315] rounded-xl text-center text-xl font-bold text-white outline-none transition-all duration-150"
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-500 font-medium">
                  Enter the 6-digit code sent to{" "}
                  <span className="text-gray-300 font-semibold">
                    {targetEmail}
                  </span>
                </p>
              </div>

              {/* Box Info Callout Container */}
              <div className="flex gap-3.5 p-4 rounded-xl bg-white/[0.01] border border-white/[0.03]">
                <Mail className="w-5 h-5 text-[#1DE4EC] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-gray-200">
                    We sent a verification email
                  </h4>
                  <p className="text-xs text-gray-500 leading-relaxed font-medium">
                    Check your inbox and spam folder. The code expires in 10
                    minutes.
                  </p>
                </div>
              </div>

              {/* Countdown / Resend Action Array Line */}
              <div className="flex justify-between items-center text-xs font-semibold px-0.5">
                <div className="flex items-center gap-2 text-gray-400">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="font-medium text-gray-500">
                    Resend available in{" "}
                    <span className="text-gray-300 tabular-nums">
                      00:{countdown < 10 ? `0${countdown}` : countdown}
                    </span>
                  </span>
                </div>
                <button
                  type="button"
                  disabled={countdown > 0}
                  onClick={() => {
                    setCountdown(42);
                    setCode(new Array(6).fill(""));
                  }}
                  className="text-[#1DE4EC] hover:text-[#2ff4fc] disabled:text-gray-600 disabled:no-underline transition-colors underline"
                >
                  Resend code
                </button>
              </div>

              {/* Core Execution Control Trigger */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1DE4EC] text-[#030708] font-bold text-sm py-3.5 rounded-xl hover:bg-[#25f0f8] transition-all duration-200 shadow-[0_4px_25px_rgba(29,228,236,0.12)] active:scale-[0.99] disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify Account"}
              </button>
            </form>

            <div className="text-center text-xs text-gray-500 mt-6 font-medium">
              Didn&apos;t receive it?{" "}
              <a
                href="/register"
                className="text-[#1DE4EC] hover:text-[#2ff4fc] font-semibold transition-colors"
              >
                Change email
              </a>
            </div>
          </div>

          {/* Subordinate Mini Footer Strip */}
          <div
            ref={footerRef}
            className="w-full max-w-[520px] flex justify-between items-center text-[10px] text-gray-500 font-medium mt-6 pt-4 border-t border-white/[0.02]"
          >
            <div className="flex gap-4">
              <a href="#" className="hover:text-gray-300 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-gray-300 transition-colors">
                Terms of Use
              </a>
              <a href="#" className="hover:text-gray-300 transition-colors">
                Cookie Preferences
              </a>
            </div>
            <div className="flex items-center gap-1 text-gray-400">
              <Lock className="w-3 h-3 text-[#1DE4EC]" /> Protected by
              enterprise-grade security
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
