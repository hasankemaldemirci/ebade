import React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

/**
 * 🧠 Generated via ebade
 * Component: FaqAccordion
 */
export function FaqAccordion() {
  const faqs = [
    {
      q: "What is ebade?",
      a: "ebade is an Agent-First Framework designed to help AI agents build production-ready applications with deterministic outcomes.",
    },
    {
      q: "How does it reduce tokens?",
      a: "By using YAML-based intent definitions, we provide only the essential context to the model, reducing entropy and token consumption.",
    },
    {
      q: "Is it compatible with Next.js?",
      a: "Yes, ebade scaffolds native Next.js projects using the App Router and Tailwind CSS by default.",
    },
  ];

  return (
    <section className="py-24 bg-slate-950">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((f, i) => (
            <div
              key={i}
              className="group rounded-2xl border border-slate-800 bg-slate-900/30 overflow-hidden transition-all"
            >
              <button className="flex items-center justify-between w-full p-6 text-left text-white hover:bg-white/5 transition-colors">
                <span className="font-medium">{f.q}</span>
                <ChevronDown
                  size={20}
                  className="text-slate-500 group-focus:rotate-180 transition-transform"
                />
              </button>
              <div className="p-6 pt-0 text-slate-400 text-sm leading-relaxed border-t border-slate-800/50">
                {f.a}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
