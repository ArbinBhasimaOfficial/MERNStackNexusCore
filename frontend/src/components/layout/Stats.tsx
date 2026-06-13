"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface StatItem {
  id: string;
  label: string;
  numericValue: number;
  suffix: string;
}

export default function Stats() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Explicitly map string IDs to tracking elements to protect SSR boundaries
  const targetsMapRef = useRef<Map<string, HTMLHeadingElement>>(new Map());

  const setTargetRef = (el: HTMLHeadingElement | null, key: string) => {
    if (el) {
      targetsMapRef.current.set(key, el);
    } else {
      targetsMapRef.current.delete(key);
    }
  };

  const statsData: StatItem[] = [
    {
      id: "reports",
      label: "Reports Published",
      numericValue: 12,
      suffix: "k+",
    },
    { id: "markets", label: "Markets Covered", numericValue: 86, suffix: "" },
    {
      id: "retention",
      label: "Client Retention",
      numericValue: 98,
      suffix: "%",
    },
  ];

  useGSAP(
    () => {
      // 1. Entrance Cascade for Containers
      gsap.from(".animate-stat-card", {
        opacity: 0,
        y: 20,
        duration: 0.6,
        stagger: 0.12,
        ease: "power2.out",
      });

      // 2. Numerical Rolling Counter Routine
      statsData.forEach((stat) => {
        const DOMNode = targetsMapRef.current.get(stat.id);
        if (!DOMNode) return;

        const countingProxy = { value: 0 };

        gsap.to(countingProxy, {
          value: stat.numericValue,
          duration: 2.2, // Extended for a premium, satisfying roll profile
          delay: 0.3,
          ease: "power2.out", // Smoother deceleration curve matching hero.tsx
          onUpdate: () => {
            const currentVal = countingProxy.value;
            const isFinished = currentVal === stat.numericValue;

            // Renders sub-pixel progression details during execution for fluid motion
            DOMNode.innerText = isFinished
              ? `${stat.numericValue}${stat.suffix}`
              : `${currentVal.toFixed(1)}${stat.suffix}`;
          },
          // Ensures a crisp whole integer crisp snap immediately on completion
          onComplete: () => {
            DOMNode.innerText = `${stat.numericValue}${stat.suffix}`;
          },
        });
      });
    },
    { scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <div className="grid md:grid-cols-3 gap-6">
        {statsData.map((s) => (
          <div
            key={s.id}
            className="animate-stat-card bg-zinc-950 border border-zinc-900 p-8 rounded-2xl flex flex-col justify-center min-h-35 shadow-sm tracking-tight"
          >
            {/* Dynamic Live Element Counter Target */}
            <h2
              ref={(el) => setTargetRef(el, s.id)}
              className="text-cyan-400 text-3xl sm:text-4xl font-black tabular-nums"
            >
              0{s.suffix}
            </h2>

            <p className="text-zinc-400 text-sm font-medium mt-2">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
