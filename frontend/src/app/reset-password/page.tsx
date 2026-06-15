"use client";

import React, { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { gsap } from "gsap";
import { ShieldCheck, CheckCircle2, Lock } from "lucide-react";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const leftPaneRef = useRef<HTMLDivElement>(null);
  const rightPaneRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const textItemsRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
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

      if (
        logoRef.current &&
        badgeRef.current &&
        textItemsRef.current &&
        featuresRef.current
      ) {
        tl.fromTo(
          logoRef.current,
          { y: -20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          "-=0.8",
        )
          .fromTo(
            badgeRef.current,
            { y: 15, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5 },
            "-=0.6",
          )
          .fromTo(
            textItemsRef.current.children,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, stagger: 0.15 },
            "-=0.4",
          )
          .fromTo(
            featuresRef.current.children,
            { x: -30, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 0.6,
              stagger: 0.12,
              ease: "back.out(1.2)",
            },
            "-=0.5",
          );
      }

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
    });
    return () => ctx.revert();
  }, []);

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Missing active authorization token link.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:1570/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Reset transaction failed");

      setSuccess(true);
      alert(
        "Password updated successfully! Redirecting to credentials gateway...",
      );
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
        {/* Left Branding Panel */}
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
              <span>🔄</span> Credentials Cycle
            </div>
            <div ref={textItemsRef} className="space-y-5 mb-10">
              <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
                Update access keys.
              </h1>
              <h2 className="text-xl text-[#1DE4EC] font-medium tracking-tight">
                Choose a resilient, high-entropy password framework.
              </h2>
            </div>
            <div ref={featuresRef} className="space-y-4 max-w-md">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <CheckCircle2 className="w-5 h-5 text-[#1DE4EC] shrink-0" />
                <span className="text-sm text-gray-300 font-medium">
                  Instant session revocation
                </span>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <CheckCircle2 className="w-5 h-5 text-[#1DE4EC] shrink-0" />
                <span className="text-sm text-gray-300 font-medium">
                  Bcrypt-fortified protection layer
                </span>
              </div>
            </div>
          </div>
          <div className="text-xs text-gray-600 font-medium tracking-wide">
            NexusCore Security System Operations Engine.
          </div>
        </div>

        {/* Right Form Control Pane */}
        <div
          ref={rightPaneRef}
          className="lg:col-span-7 flex flex-col justify-center items-center p-6 lg:p-12 relative bg-[#040809]"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#1DE4EC]/2 blur-[160px] rounded-full pointer-events-none" />

          <div className="w-full max-w-[520px] flex justify-end mb-4 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/[0.04] bg-[#0c1113] text-[11px] text-gray-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-[#1DE4EC]" /> Token
              Verified
            </div>
          </div>

          <div
            ref={cardRef}
            className="w-full max-w-[520px] bg-[#121719] border border-white/[0.04] rounded-2xl p-8 lg:p-10 shadow-2xl relative z-10"
          >
            <h3 className="text-2xl font-bold tracking-tight text-gray-100 mb-6">
              Choose a new password
            </h3>

            {error && (
              <div className="text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-xs font-semibold mb-4">
                {error}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleResetSubmit}>
              {/* New Password Input */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 tracking-wide">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full bg-[#0a0f11] border border-white/[0.06] focus:border-[#1DE4EC]/40 focus:bg-[#0c1315] rounded-xl py-3 px-4 text-sm text-white placeholder-gray-700 outline-none transition-all"
                  />
                </div>
                {/* Strength Meter Bars */}
                <div className="flex gap-1.5 pt-1">
                  <div
                    className={`h-[4px] grow rounded-full transition-colors ${newPassword.length >= 4 ? "bg-[#1DE4EC]" : "bg-white/[0.06]"}`}
                  />
                  <div
                    className={`h-[4px] grow rounded-full transition-colors ${newPassword.length >= 6 ? "bg-[#1DE4EC]" : "bg-white/[0.06]"}`}
                  />
                  <div
                    className={`h-[4px] grow rounded-full transition-colors ${newPassword.length >= 8 ? "bg-[#1DE4EC]" : "bg-white/[0.06]"}`}
                  />
                  <div
                    className={`h-[4px] grow rounded-full transition-colors ${newPassword.length >= 10 ? "bg-[#1DE4EC]" : "bg-white/[0.06]"}`}
                  />
                  <div
                    className={`h-[4px] grow rounded-full transition-colors ${newPassword.length >= 12 ? "bg-[#1DE4EC]" : "bg-white/[0.06]"}`}
                  />
                </div>
              </div>

              {/* Confirm Password Input */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 tracking-wide">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your new password"
                    className="w-full bg-[#0a0f11] border border-white/[0.06] focus:border-[#1DE4EC]/40 focus:bg-[#0c1315] rounded-xl py-3 px-4 text-sm text-white placeholder-gray-700 outline-none transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-cyan-400 text-zinc-950 border border-transparent font-bold px-6 py-3.5 rounded-xl text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 hover:bg-zinc-950 hover:text-cyan-400 hover:border-cyan-400 active:scale-95 shadow-lg shadow-cyan-500/10 whitespace-nowrap"
              >
                {loading ? "Updating Password..." : "Update Password"}
              </button>
            </form>
          </div>

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

// Next.js requires useSearchParams to be wrapped in a Suspense boundary for static optimization safety
export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#030708] text-white flex items-center justify-center">
          Loading encryption parameters...
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
