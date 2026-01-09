import React from "react";
import { cn } from "@/lib/utils";

/**
 * 🧠 Generated via ebade
 * Intent: feature-grid
 */
export function FeatureGrid() {
  const features = [
    {
      title: "Agent-First Architecture",
      description:
        "Designed from the ground up for AI agents to understand and modify code effectively.",
      icon: "🤖",
    },
    {
      title: "Intent-Based Scaffolding",
      description:
        "Define what you want, not how to implement it. Let ebade handle the boilerplate.",
      icon: "🎯",
    },
    {
      title: "Production Ready",
      description:
        "Generates optimized, secure, and type-safe code that you can deploy immediately.",
      icon: "🚀",
    },
    {
      title: "Shadcn UI Standard",
      description:
        "Beautiful, accessible components built on Radix UI and Tailwind CSS.",
      icon: "✨",
    },
    {
      title: "Zero Token Waste",
      description:
        "Deterministic output saves 70% of tokens compared to raw LLM generation.",
      icon: "💎",
    },
    {
      title: "Framework Agnostic",
      description:
        "Supports Next.js today, with plans for Vue, Svelte, and Mobile targets.",
      icon: "🌐",
    },
  ];

  return (
    <section className="py-24 px-6 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
            Why choose <span className="text-primary">ebade</span>?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            The framework that adapts to the AI era. Build better software,
            faster.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all hover:shadow-lg hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
