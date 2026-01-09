import React from "react";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

/**
 * 🧠 Generated via ebade
 * Component: Testimonials
 */
export function Testimonials() {
  const reviews = [
    {
      name: "Alex Rivera",
      role: "CTO at TechFlow",
      content:
        "ebade changed how we bridge the gap between AI intent and production-ready code. It's a game changer.",
      rating: 5,
    },
    {
      name: "Sarah Chen",
      role: "Lead Developer",
      content:
        "The most efficient way to maintain deterministic outputs with LLMs. Low entropy, high quality.",
      rating: 5,
    },
    {
      name: "Marcus Thorne",
      role: "Product Designer",
      content:
        "Finally, a framework that speaks the language of agents without sacrificing developer experience.",
      rating: 5,
    },
  ];

  return (
    <section className="py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Trusted by the Best
          </h2>
          <p className="text-slate-400">
            Join thousands of developers building the future of AI-Native
            software.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((s, i) => (
            <div
              key={i}
              className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all"
            >
              <div className="flex gap-1 mb-4 text-yellow-500">
                {[...Array(s.rating)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <p className="text-slate-300 mb-6 italic">"{s.content}"</p>
              <div>
                <p className="text-white font-semibold">{s.name}</p>
                <p className="text-slate-500 text-sm">{s.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
