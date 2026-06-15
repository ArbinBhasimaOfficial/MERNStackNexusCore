"use client";

import React, { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import {
  LogOut,
  Activity,
  Users,
  Database,
  ShieldAlert,
  Terminal,
  RefreshCw,
  TrendingUp,
} from "lucide-react";

export default function DashboardPage() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleManualLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Fire clearing request to Express backend
      const res = await fetch("http://localhost:1570/api/auth/logout", {
        method: "POST",
        credentials: "include", // Essential to pass along and wipe cross-origin cookies
      });

      // Fail-safe: Obliterate frontend tokens even if network transport layer flinches
      document.cookie =
        "session_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      localStorage.clear();
      sessionStorage.clear();

      // Bounce user straight out to login screen
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout execution fault:", err);
      // Hard fallback if backend endpoint doesn't exist yet
      window.location.href = "/login";
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#030708] text-white selection:bg-[#1DE4EC]/30">
      {/* Structural Sidebar Layout */}
      <Sidebar />

      {/* Main Panel Area Frame */}
      <main className="flex-1 p-6 lg:p-10 relative overflow-y-auto">
        {/* Cyberpunk Radial Backdrop Accent Blur */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#1DE4EC]/2 blur-[140px] rounded-full pointer-events-none" />

        {/* Header Ribbon Row */}
        <div className="flex justify-between items-center border-b border-white/[0.04] pb-6 mb-8 relative z-10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-100">
              Nexus<span className="text-[#1DE4EC]">Core</span> Dashboard
            </h1>
            <p className="text-xs text-gray-500 mt-1 font-medium">
              System monitoring profile overview • Node Cluster Active
            </p>
          </div>

          {/* Action Module: Logout Engine Button */}
          <button
            onClick={handleManualLogout}
            disabled={isLoggingOut}
            className="group flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400 text-xs font-semibold uppercase tracking-wider transition-all duration-300 active:scale-95 disabled:opacity-50"
          >
            <LogOut className="w-4 h-4 text-red-400 group-hover:translate-x-0.5 transition-transform" />
            <span>{isLoggingOut ? "Ending Session..." : "Disconnect"}</span>
          </button>
        </div>

        {/* Dashboard Core Modules Content Grid */}
        <div className="space-y-6 relative z-10">
          {/* Row 1: Telemetry Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#121719] border border-white/[0.04] rounded-2xl p-5 shadow-xl relative overflow-hidden">
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-semibold text-gray-400 tracking-wide">
                  API Throughput
                </span>
                <div className="p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/10 text-emerald-400">
                  <Activity className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-bold tracking-tight text-gray-100">
                99.98%
              </p>
              <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium mt-1">
                <TrendingUp className="w-3 h-3" /> Operational nominal state
              </div>
            </div>

            <div className="bg-[#121719] border border-white/[0.04] rounded-2xl p-5 shadow-xl">
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-semibold text-gray-400 tracking-wide">
                  Active Sessions
                </span>
                <div className="p-2 rounded-lg bg-cyan-500/5 border border-cyan-500/10 text-[#1DE4EC]">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-bold tracking-tight text-gray-100">
                1,248
              </p>
              <p className="text-[10px] text-gray-500 font-medium mt-1">
                +14% scaled growth spike
              </p>
            </div>

            <div className="bg-[#121719] border border-white/[0.04] rounded-2xl p-5 shadow-xl">
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-semibold text-gray-400 tracking-wide">
                  Redis Cache Allocation
                </span>
                <div className="p-2 rounded-lg bg-purple-500/5 border border-purple-500/10 text-purple-400">
                  <Database className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-bold tracking-tight text-gray-100">
                42.1 MB
              </p>
              <p className="text-[10px] text-gray-500 font-medium mt-1">
                OTP instances key mapped
              </p>
            </div>

            <div className="bg-[#121719] border border-white/[0.04] rounded-2xl p-5 shadow-xl">
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-semibold text-gray-400 tracking-wide">
                  Security Incidents
                </span>
                <div className="p-2 rounded-lg bg-zinc-500/5 border border-white/[0.04] text-gray-400">
                  <ShieldAlert className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-bold tracking-tight text-gray-100">
                0
              </p>
              <p className="text-[10px] text-gray-500 font-medium mt-1">
                Threat firewall clean slate
              </p>
            </div>
          </div>

          {/* Row 2: Console Log / Live Work Frame Mock */}
          <div className="bg-[#121719] border border-white/[0.04] rounded-2xl p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/[0.02]">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#1DE4EC]" />
                <h2 className="text-sm font-bold text-gray-200 tracking-wide uppercase">
                  System Kernel Diagnostics
                </h2>
              </div>
              <RefreshCw className="w-3.5 h-3.5 text-gray-500 hover:text-[#1DE4EC] cursor-pointer transition-colors" />
            </div>

            <div className="bg-[#070b0c] rounded-xl p-4 font-mono text-xs text-gray-400 space-y-2 border border-white/[0.02]">
              <p>
                <span className="text-cyan-500">[SYSTEM]:</span> Node
                verification layer initialization binding pattern active...
              </p>
              <p>
                <span className="text-purple-500">[REDIS]:</span> Session memory
                cache cluster linked successfully over port 6379
              </p>
              <p>
                <span className="text-emerald-500">[SMTP]:</span> Dispatcher
                initialized link state to host reference smtp.gmail.com:587
              </p>
              <p>
                <span className="text-[#1DE4EC] animate-pulse">
                  _ ready for interface interaction execution
                </span>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
