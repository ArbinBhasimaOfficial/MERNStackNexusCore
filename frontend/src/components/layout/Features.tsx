"use client";

import { useRef } from "react";
import { ArrowUpRight, BarChart2, Lightbulb, TrendingUp } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface CapabilityItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
}

export default function Features() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsMapRef = useRef<Map<string, HTMLDivElement>>(new Map());

  const setCardRef = (el: HTMLDivElement | null, key: string) => {
    if (el) {
      cardsMapRef.current.set(key, el);
    } else {
      cardsMapRef.current.delete(key);
    }
  };

  useGSAP(
    () => {
      const validCards = Array.from(cardsMapRef.current.values()).filter(
        Boolean,
      );

      // 1. Reveal Cascade Animation on Entrance
      gsap.from(".animate-feature-header", {
        opacity: 0,
        y: 24,
        duration: 0.7,
        stagger: 0.12,
        ease: "power2.out",
      });

      if (validCards.length > 0) {
        gsap.from(validCards, {
          opacity: 0,
          y: 35,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          delay: 0.15,
        });
      }
    },
    { scope: containerRef },
  );

  // 2. Interactive Card Lifting & Micro-movements
  const handleMouseEnter = (key: string) => {
    const targetCard = cardsMapRef.current.get(key);
    if (!targetCard) return;

    gsap.to(targetCard, {
      y: -8,
      scale: 1.01,
      zIndex: 10,
      duration: 0.35,
      ease: "power2.out",
      overwrite: "auto",
      boxShadow: "0 20px 30px -10px rgba(0, 0, 0, 0.08)",
    });
  };

  const handleMouseLeave = (key: string) => {
    const targetCard = cardsMapRef.current.get(key);
    if (!targetCard) return;

    gsap.to(targetCard, {
      y: 0,
      scale: 1,
      zIndex: 1,
      duration: 0.35,
      ease: "power2.out",
      overwrite: "auto",
      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.01)",
    });
  };

  const capabilities: CapabilityItem[] = [
    {
      id: "consumer-demand",
      icon: <BarChart2 className="w-5 h-5" />,
      title: "Consumer Demand",
      desc: "We track consumer what they want, and why, to isolate blind spots and modernize how businesses forecast demand and disrupt alternatives.",
    },
    {
      id: "innovation-strategy",
      icon: <Lightbulb className="w-5 h-5" />,
      title: "Innovation Strategy",
      desc: "Validate innovation and futureproofing risk solutions uncovering hidden market opportunities and build a pipeline of ideas that fuel long term growth.",
    },
    {
      id: "market-expansion",
      icon: <TrendingUp className="w-5 h-5" />,
      title: "Market Expansion",
      desc: "Map market models, how they work and rules for sizing for dynamic segments, localized contexts where your brand has its greatest potential to thrive.",
    },
  ];

  return (
    <section
      ref={containerRef}
      className="py-24 bg-white overflow-hidden"
      id="solutions"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-14">
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-cyan-600 block animate-feature-header">
              How we help you grow
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 animate-feature-header">
              Intelligence built for every decision
            </h2>
          </div>
          <a
            href="#capabilities"
            className="animate-feature-header text-cyan-600 hover:text-cyan-700 text-xs font-bold tracking-wider uppercase inline-flex items-center gap-1.5 transition-colors group"
          >
            View all capabilities
            <ArrowUpRight className="w-3.5 h-3.5 transform transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        {/* Grid Setup */}
        <div className="grid md:grid-cols-3 gap-8 relative">
          {capabilities.map((item) => (
            <div
              key={item.id}
              ref={(el) => setCardRef(el, item.id)}
              onMouseEnter={() => handleMouseEnter(item.id)}
              onMouseLeave={() => handleMouseLeave(item.id)}
              style={{ position: "relative" }}
              className="group bg-white border border-zinc-100 rounded-2xl p-8 flex flex-col justify-between min-h-80 will-change-transform shadow-sm transition-colors duration-300"
            >
              <div>
                {/* Icon Container */}
                <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-6 transition-colors duration-300 group-hover:bg-cyan-600 group-hover:text-white">
                  {item.icon}
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-zinc-900 tracking-tight mb-3">
                  {item.title}
                </h3>
                <p className="text-zinc-500 text-sm leading-relaxed mb-6">
                  {item.desc}
                </p>
              </div>

              {/* Action Button/Link */}
              <div className="pt-2">
                <a
                  href="#learn"
                  className="text-cyan-600 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 hover:text-cyan-700 transition-colors group-hover:text-cyan-600"
                >
                  Learn more
                  <ArrowUpRight className="w-3.5 h-3.5 transform transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
