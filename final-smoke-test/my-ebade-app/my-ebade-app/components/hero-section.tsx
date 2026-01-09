import React from "react";
import { cn } from "@/lib/utils";

/**
 * 🧠 Generated via ebade
 * Intent: hero-section
 */
export function HeroSection() {
  return (
    <section className="relative py-24 px-6 md:px-10 overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto text-center relative z-10">
        <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">
          NEXT ERA OF <br />
          <span className="text-primary italic">BUILDING.</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12 font-medium tracking-tight">
          Agent-First development is here. Build production-ready apps with
          intent-based architecture and Shadcn aesthetics.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="h-14 px-10 rounded-full font-bold bg-primary text-primary-foreground transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(var(--primary),0.3)] shadow-xl active:scale-95">
            Start Building
          </button>
          <button className="h-14 px-10 rounded-full font-bold bg-secondary text-secondary-foreground transition-all hover:bg-secondary/80 border border-border">
            View Manifesto
          </button>
        </div>
      </div>
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,var(--primary)_0%,transparent_50%)]" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
    </section>
  );
}